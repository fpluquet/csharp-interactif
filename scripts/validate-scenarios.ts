import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { inferFrameCursors } from "../src/composables/useFrameCursors.ts";
import { scenarios } from "../src/data/index.ts";
import type { HeapObject, StackFrame } from "../src/types/memory.ts";

const issues: string[] = [];

function issue(id: string, msg: string) {
  issues.push(`${id}: ${msg}`);
}

function slotIds(stack: StackFrame[]) {
  return new Set(stack.flatMap((f) => f.slots.map((s) => s.id)));
}

function frameIds(stack: StackFrame[]) {
  return new Set(stack.map((f) => f.id));
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

const dir = join(import.meta.dirname, "../src/data/scenarios");
const indexSrc = readFileSync(join(import.meta.dirname, "../src/data/index.ts"), "utf8");
const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "ooHelpers.ts");
for (const file of files) {
  const stem = file.replace(/\.ts$/, "");
  if (!indexSrc.includes(`./scenarios/${stem}`)) {
    issue(stem, `fichier ${file} non importé dans index.ts`);
  }
}

for (const s of scenarios) {
  const n = s.code.length;
  const stepIds = new Set<string>();
  if (!s.steps.length) issue(s.id, "aucun step");
  const last = s.steps.at(-1);
  if (last) {
    if (!last.narration?.trim()) issue(s.id, "dernière étape sans narration");
    else if (
      !/va se terminer|va s'arrêter|va s’arrêter|s'est arrêté|s’est arrêté/.test(last.narration) &&
      last.id !== `${s.id}-end`
    ) {
      issue(s.id, `dernière narration suspecte: "${last.narration.slice(0, 80)}"`);
    }
  }

  for (const [i, step] of s.steps.entries()) {
    if (stepIds.has(step.id)) issue(s.id, `step id dupliqué ${step.id}`);
    stepIds.add(step.id);

    if (!step.narration?.trim()) {
      issue(`${s.id}/${step.id}`, "narration manquante");
    }

    if (!step.highlightLines.length) {
      if (i !== s.steps.length - 1) {
        issue(`${s.id}/${step.id}`, "highlightLines vide");
      }
    }
    for (const line of step.highlightLines) {
      if (line < 0 || line >= n) {
        issue(`${s.id}/${step.id}`, `highlightLines ${line} hors code (0..${n - 1})`);
      } else if (!s.code[line]?.trim() && s.code[line] !== undefined) {
        issue(`${s.id}/${step.id}`, `highlightLines ${line} sur une ligne vide`);
      }
    }

    if (step.highlightExpr && step.highlightLines.length) {
      const found = step.highlightLines.some((li) => s.code[li]?.includes(step.highlightExpr!));
      if (!found) {
        issue(
          `${s.id}/${step.id}`,
          `highlightExpr "${step.highlightExpr}" introuvable dans ${step.highlightLines.map((li) => JSON.stringify(s.code[li])).join(" | ")}`,
        );
      }
    }

    const slots = slotIds(step.stack);
    const frames = frameIds(step.stack);
    const objs = fieldIds(step.heap);

    for (const frame of step.stack) {
      for (const slot of frame.slots) {
        if (slot.kind === "ref" && slot.targetId && slot.value !== "null") {
          const onHeap = objs.has(slot.targetId);
          const onStack = slots.has(slot.targetId);
          if (!onHeap && !onStack) {
            issue(`${s.id}/${step.id}`, `slot ${slot.name} targetId ${slot.targetId} absent du heap/stack`);
          }
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
      if (!objs.has(ref.toObjectId) && !slots.has(ref.toObjectId)) {
        issue(`${s.id}/${step.id}`, `ref ${ref.id} toObjectId ${ref.toObjectId} inconnu`);
      }
    }

    if (step.focus && !slots.has(step.focus) && !objs.has(step.focus) && !frames.has(step.focus)) {
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

    if (step.dispatchFlow?.callExpr) {
      const inCode = s.code.some((line) => line.includes(step.dispatchFlow!.callExpr));
      if (!inCode) {
        issue(`${s.id}/${step.id}`, `dispatchFlow.callExpr "${step.dispatchFlow.callExpr}" introuvable dans le code`);
      }
    }

    const prev = s.steps[i - 1];
    const next = s.steps[i + 1];
    if (prev) {
      const prevConsole = prev.consoleLines ?? [];
      const curConsole = step.consoleLines ?? [];
      const highlightedWrite = step.highlightLines.some((li) => /Console\.WriteLine/.test(s.code[li] ?? ""));
      const printFollows = (next?.consoleLines?.length ?? 0) > curConsole.length;
      const programEnding = /va s'arrêter|va s’arrêter/.test(step.narration) || step.id.endsWith("-end");
      if (highlightedWrite && !step.dispatchFlow && !printFollows && !programEnding) {
        if (curConsole.length < prevConsole.length) {
          issue(`${s.id}/${step.id}`, "WriteLine surligné mais la console recule");
        } else if (curConsole.length === prevConsole.length) {
          const onlyWrite = step.highlightLines.every((li) => {
            const t = (s.code[li] ?? "").trim();
            return !t || t === "{" || t === "}" || /Console\.WriteLine/.test(t);
          });
          if (onlyWrite) {
            issue(`${s.id}/${step.id}`, "WriteLine surligné sans nouvelle ligne console");
          }
        }
      }
    }
  }

  for (let i = 1; i < s.steps.length; i++) {
    const a = s.steps[i - 1];
    const b = s.steps[i];
    const same =
      a.highlightLines.length === 1 &&
      b.highlightLines.length === 1 &&
      a.highlightLines[0] === b.highlightLines[0];
    if (same && !a.highlightExpr && !b.highlightExpr && !a.returnFlow && !b.returnFlow && !a.exceptionFlow && !b.exceptionFlow) {
      const introOrOutro =
        /va démarrer|va s'arrêter|va s’arrêter|frame Main va apparaître/.test(
          `${a.narration} ${b.narration}`,
        );
      const line = s.code[a.highlightLines[0]];
      if (
        !introOrOutro &&
        line &&
        /new | = |\(.*\)/.test(line) &&
        !line.trim().startsWith("//") &&
        line.includes(";")
      ) {
        issue(`${s.id}/${a.id}+${b.id}`, `même ligne sans highlightExpr: ${JSON.stringify(line.trim())}`);
      }
    }
  }

  for (const [i, step] of s.steps.entries()) {
    const pcs = inferFrameCursors(s.steps, i, s.code);
    const live = new Set(step.stack.map((frame) => frame.id));
    const topId = step.stack.at(-1)?.id;
    for (const [id, cursor] of pcs) {
      if (!live.has(id)) {
        issue(`${s.id}/${step.id}`, `pause orpheline frame ${id} ligne ${cursor.line + 1}`);
      } else if (id === topId) {
        issue(`${s.id}/${step.id}`, `pause sur la frame courante ${id} ligne ${cursor.line + 1}`);
      }
    }
    const callers = step.stack
      .filter((frame) => frame.method !== "static" && !frame.method.startsWith("static "))
      .slice(0, -1);
    if (callers.length === 0 && pcs.size > 0) {
      issue(`${s.id}/${step.id}`, `pause alors qu’aucune frame n’attend un appel`);
    }
  }
}

const suggestions: string[] = [];
for (const s of scenarios) {
  for (const [i, step] of s.steps.entries()) {
    if (i === s.steps.length - 1) continue;
    if (step.highlightExpr) continue;
    if (step.highlightLines.length !== 1) continue;
    if (step.returnFlow || step.exceptionFlow) continue;
    const line = s.code[step.highlightLines[0]] ?? "";
    const m = line.match(/\b(?:new [A-Za-z0-9_<>,\s\[\]]+\([^;]*\)|[A-Za-z_][\w.]*\([^;]*\))/);
    if (m && line.includes("=") && line.includes("(")) {
      suggestions.push(`${s.id}/${step.id}: pourrait extraire "${m[0].trim()}"`);
    }
  }
}

console.log(`SCENARIOS ${scenarios.length}`);
console.log(`ISSUES ${issues.length}`);
for (const x of issues) console.log("ERR " + x);
console.log(`SUGGEST ${suggestions.length}`);
for (const x of suggestions.slice(0, 40)) console.log("HINT " + x);
