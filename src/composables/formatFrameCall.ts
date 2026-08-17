import type { StackFrame } from "../types/memory";

const TYPE_OR_MOD =
  /^(?:ref|out|in|params|this|int|uint|long|byte|bool|char|string|double|float|decimal|object|void|var|public|private|protected|static|override|virtual|new|readonly|const|scoped)$/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function paramNames(params: string): string[] {
  const parts = params.split(",").map((part) => part.split("=")[0]?.trim() ?? "");
  const names: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    const ids = part.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
    const name = [...ids].reverse().find((id) => !TYPE_OR_MOD.test(id));
    if (name) names.push(name);
  }
  return names;
}

function findParamNames(code: string[], method: string): string[] | undefined {
  const simple = method.split(".").pop() ?? method;
  const re = new RegExp(`(?:^|[\\s])${escapeRegExp(simple)}\\s*\\(([^)]*)\\)\\s*$`);
  for (const line of code) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.endsWith(";")) continue;
    const match = trimmed.match(re);
    if (match) return paramNames(match[1] ?? "");
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
