import { scenarios } from "../src/data/index.ts";
import type { HeapObject, StackFrame, Step } from "../src/types/memory.ts";

const issues: string[] = [];

function issue(id: string, msg: string) {
  issues.push(`${id}: ${msg}`);
}

function slotIds(stack: StackFrame[]) {
  return new Set(stack.flatMap((f) => f.slots.map((s) => s.id)));
}

function fieldIds(heap: HeapObject[]) {
  const ids = new Set<string>();
  for (const obj of heap) {
    ids.add(obj.id);
    for (const f of obj.fields) if (f.id) ids.add(f.id);
  }
  return ids;
}

const ids = scenarios.map((s) => s.id);
for (const id of ids) {
  if (ids.filter((x) => x === id).length > 1) issue(id, "id de scénario dupliqué");
}

for (const s of scenarios) {
  const n = s.code.length;
  const stepIds = new Set<string>();
  if (!s.steps.length) issue(s.id, "aucun step");
  const last = s.steps.at(-1);
  if (last && !/va se terminer|MAIN_DONE/.test(last.narration) && last.id !== `${s.id}-end`) {
    if (!last.narration.includes("va s'arrêter") && !last.narration.includes("va s’arrêter")) {
      issue(s.id, `dernière narration suspecte: "${last.narration.slice(0, 80)}"`);
    }
  }

  for (const [i, step] of s.steps.entries()) {
    if (stepIds.has(step.id)) issue(s.id, `step id dupliqué ${step.id}`);
    stepIds.add(step.id);

    if (!step.highlightLines.length) issue(`${s.id}/${step.id}`, "highlightLines vide");
    for (const line of step.highlightLines) {
      if (line < 0 || line >= n) {
        issue(`${s.id}/${step.id}`, `highlightLines ${line} hors code (0..${n - 1})`);
      }
    }

    if (step.highlightExpr) {
      const found = step.highlightLines.some((li) => s.code[li]?.includes(step.highlightExpr!));
      if (!found) {
        issue(
          `${s.id}/${step.id}`,
          `highlightExpr "${step.highlightExpr}" introuvable dans ${step.highlightLines.map((li) => JSON.stringify(s.code[li])).join(" | ")}`,
        );
      }
    }

    const slots = slotIds(step.stack);
    const objs = fieldIds(step.heap);

    for (const frame of step.stack) {
      for (const slot of frame.slots) {
        if (slots.has(slot.id) === false) continue;
        if (slot.kind === "ref" && slot.targetId && !objs.has(slot.targetId) && slot.value !== "null") {
          issue(`${s.id}/${step.id}`, `slot ${slot.name} targetId ${slot.targetId} absent du heap`);
        }
      }
    }

    for (const obj of step.heap) {
      for (const f of obj.fields) {
        if (f.kind === "ref" && f.targetId && !objs.has(f.targetId) && f.value !== "null") {
          issue(`${s.id}/${step.id}`, `champ ${obj.id}.${f.label} targetId ${f.targetId} absent`);
        }
      }
    }

    for (const ref of step.refs) {
      if (ref.fromSlotId && !slots.has(ref.fromSlotId)) {
        issue(`${s.id}/${step.id}`, `ref ${ref.id} fromSlotId ${ref.fromSlotId} inconnu`);
      }
      if (ref.fromFieldId && !objs.has(ref.fromFieldId)) {
        issue(`${s.id}/${step.id}`, `ref ${ref.id} fromFieldId ${ref.fromFieldId} inconnu`);
      }
      if (!objs.has(ref.toObjectId)) {
        issue(`${s.id}/${step.id}`, `ref ${ref.id} toObjectId ${ref.toObjectId} inconnu`);
      }
    }

    if (step.focus && !slots.has(step.focus) && !objs.has(step.focus)) {
      issue(`${s.id}/${step.id}`, `focus ${step.focus} introuvable`);
    }

    if (step.returnFlow) {
      const { callLine, callExpr } = step.returnFlow;
      if (callLine < 0 || callLine >= n) {
        issue(`${s.id}/${step.id}`, `returnFlow.callLine ${callLine} hors code`);
      } else if (!s.code[callLine].includes(callExpr)) {
        issue(`${s.id}/${step.id}`, `returnFlow.callExpr "${callExpr}" absent de la ligne ${callLine}`);
      }
    }

    if (step.dispatchFlow) {
      const line = s.code[step.highlightLines[0] ?? -1] ?? "";
      if (step.dispatchFlow.callExpr && !s.steps.some((st) => st.highlightLines.some((li) => s.code[li]?.includes(step.dispatchFlow!.callExpr)))) {
        issue(`${s.id}/${step.id}`, `dispatchFlow.callExpr "${step.dispatchFlow.callExpr}" introuvable dans le code`);
      }
    }
  }

  // consecutive same-line steps without highlightExpr
  for (let i = 1; i < s.steps.length; i++) {
    const a = s.steps[i - 1];
    const b = s.steps[i];
    const same =
      a.highlightLines.length === 1 &&
      b.highlightLines.length === 1 &&
      a.highlightLines[0] === b.highlightLines[0];
    if (same && !a.highlightExpr && !b.highlightExpr) {
      const line = s.code[a.highlightLines[0]];
      if (line && /new | = |\(.*\)/.test(line) && !line.trim().startsWith("//") && line.includes(";")) {
        issue(`${s.id}/${a.id}+${b.id}`, `même ligne sans highlightExpr: ${JSON.stringify(line.trim())}`);
      }
    }
  }
}

// suggest missing highlightExpr on lines with new + assign
const suggestions: string[] = [];
for (const s of scenarios) {
  for (const step of s.steps) {
    if (step.highlightExpr) continue;
    if (step.highlightLines.length !== 1) continue;
    const line = s.code[step.highlightLines[0]] ?? "";
    const m = line.match(/\bnew [A-Za-z0-9_<>,\s\[\]]+\([^;]*\)/);
    if (m && line.includes("=") && !step.returnFlow) {
      suggestions.push(`${s.id}/${step.id}: pourrait extraire "${m[0].trim()}"`);
    }
  }
}

console.log(`SCENARIOS ${scenarios.length}`);
console.log(`ISSUES ${issues.length}`);
for (const x of issues) console.log("ERR " + x);
console.log(`SUGGEST ${suggestions.length}`);
for (const x of suggestions.slice(0, 80)) console.log("HINT " + x);
