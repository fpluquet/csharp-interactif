import type { StackFrame } from "../types/memory";

const TYPE_OR_MOD =
  /^(?:ref|out|in|params|this|int|uint|long|byte|bool|char|string|double|float|decimal|object|void|var|public|private|protected|static|override|virtual|new|readonly|const|scoped)$/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitParams(params: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of params) {
    if (ch === "(" || ch === "<" || ch === "[") depth++;
    else if (ch === ")" || ch === ">" || ch === "]") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

function paramNames(params: string): string[] {
  const names: string[] = [];
  for (const part of splitParams(params)) {
    const raw = part.split("=")[0]?.trim() ?? "";
    if (!raw) continue;
    const ids = raw.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
    const name = [...ids].reverse().find((id) => !TYPE_OR_MOD.test(id));
    if (name) names.push(name);
  }
  return names;
}

function paramsAfterName(line: string, name: string): string | undefined {
  const re = new RegExp(`(?:^|[\\s])${escapeRegExp(name)}\\s*\\(`);
  const match = line.match(re);
  if (!match || match.index === undefined) return undefined;
  const start = match.index + match[0].length;
  let depth = 1;
  for (let i = start; i < line.length; i++) {
    const ch = line[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) return line.slice(start, i);
    }
  }
  return undefined;
}

function findParamNames(code: string[], method: string): string[] | undefined {
  const simple = method.split(".").pop() ?? method;
  for (const line of code) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.endsWith(";")) continue;
    const inner = paramsAfterName(trimmed, simple);
    if (inner !== undefined) return paramNames(inner);
  }
  return undefined;
}

/** Libellé d’une frame : `Hanoi(3, 'A', 'C', 'B')` plutôt que `Hanoi()`. */
export function formatFrameCall(frame: StackFrame, code: string[]): string {
  if (frame.method === "static" || frame.method.startsWith("static ")) {
    return "static (global)";
  }
  const simple = frame.method.split(".").pop() ?? frame.method;
  if (frame.method === "Main") return "Main()";

  const params = findParamNames(code, frame.method);
  if (!params?.length) return `${simple}()`;

  const byName = new Map(frame.slots.map((slot) => [slot.name, slot.value]));
  const args = params.map((name) => byName.get(name) ?? "…");
  return `${simple}(${args.join(", ")})`;
}
