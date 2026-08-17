import { computed, type Ref } from "vue";
import type { StackFrame, Step } from "../types/memory";

export type FrameCursor = {
  /** Index 0-based dans `code`. */
  line: number;
  /** Ligne source, déjà trimée. */
  text: string;
  /** Sous-expression, si l’étape en avait une. */
  expr?: string;
};

function snippet(code: string[], line: number, expr?: string): FrameCursor | undefined {
  const raw = code[line];
  if (raw === undefined) return undefined;
  const text = raw.trim() || expr?.trim() || "";
  if (!text && expr === undefined) return undefined;
  return { line, text: text || expr || "", ...(expr ? { expr } : {}) };
}

const TYPE_PREFIX =
  /^(?:int|void|bool|string|char|double|object|var|public|private|protected|static|override|virtual|new)\b/;

function isPersistentFrame(frame: StackFrame): boolean {
  return frame.method === "static" || frame.method.startsWith("static ");
}

function looksLikeCall(step: Step, code: string[]): boolean {
  const expr = step.highlightExpr?.trim();
  if (expr && /\w\s*\(/.test(expr) && !TYPE_PREFIX.test(expr)) return true;
  const line = code[step.highlightLines[0] ?? -1] ?? "";
  return line.includes("(") && line.includes(";");
}

function cursorFrom(step: Step, code: string[]): FrameCursor | undefined {
  const line = step.highlightLines[0];
  if (line === undefined) return undefined;
  return snippet(code, line, step.highlightExpr);
}

/**
 * Ligne d’appel où une frame attend le retour de son callee.
 * Pas de curseur pour la frame en cours d’exécution.
 */
export function inferFrameCursors(
  steps: Step[],
  currentIndex: number,
  code: string[],
): Map<string, FrameCursor> {
  const pcs = new Map<string, FrameCursor>();
  let prevStack: StackFrame[] = [];
  let prevStep: Step | undefined;

  const last = Math.min(currentIndex, steps.length - 1);
  for (let i = 0; i <= last; i++) {
    const step = steps[i];
    if (!step) continue;

    const stack = step.stack;
    const top = stack.at(-1);
    const prevIds = new Set(prevStack.map((frame) => frame.id));
    const pushed = Boolean(top && !prevIds.has(top.id) && stack.length >= 2);

    if (pushed) {
      const parent = stack[stack.length - 2]!;
      if (!isPersistentFrame(parent)) {
        const source =
          looksLikeCall(step, code) || prevStack.at(-1)?.id !== parent.id
            ? step
            : (prevStep ?? step);
        const cursor = cursorFrom(source, code);
        if (cursor) pcs.set(parent.id, cursor);
      }
    }

    prevStack = stack;
    prevStep = step;
  }

  const current = steps[last];
  const stackNow = current?.stack ?? [];
  const waiting = new Map<string, FrameCursor>();
  for (let i = 0; i < stackNow.length - 1; i++) {
    const frame = stackNow[i]!;
    if (isPersistentFrame(frame)) continue;
    const cursor = pcs.get(frame.id);
    if (cursor) waiting.set(frame.id, cursor);
  }
  return waiting;
}

export function useFrameCursors(
  steps: Ref<Step[]>,
  currentIndex: Ref<number>,
  code: Ref<string[]>,
) {
  return computed(() => inferFrameCursors(steps.value, currentIndex.value, code.value));
}
