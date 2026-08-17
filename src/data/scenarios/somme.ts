import type { HeapObject, RefLink, Scenario, StackFrame, Step } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

const CODE = [
  "int[] t = { 4, 1, 2 };",
  "",
  "int Somme(int[] t, int i)",
  "{",
  "    if (i == t.Length) return 0;",
  "    return t[i] + Somme(t, i + 1);",
  "}",
  "",
  "int r = Somme(t, 0);",
];

const VALUES = [4, 1, 2] as const;
const LEN = VALUES.length;

type Act = { seq: number; i: number };

function snapshotHeap(): HeapObject {
  return obj(
    "obj-t",
    "int[]",
    "#T1",
    VALUES.map((v, i) => ({ id: `cell-${i}`, label: `[${i}]`, value: String(v) })),
  );
}

function toFrame(act: Act): StackFrame {
  return frame(`frame-somme-${act.seq}`, "Somme", [
    refSlot(`slot-t-${act.seq}`, "t", "#T1", "obj-t"),
    val(`slot-i-${act.seq}`, "i", String(act.i)),
  ]);
}

function refsFor(acts: Act[], withMain: boolean): RefLink[] {
  const refs: RefLink[] = [];
  if (withMain) refs.push(link("ref-t-main", "slot-t-main", "obj-t"));
  for (const act of acts) refs.push(link(`ref-t-${act.seq}`, `slot-t-${act.seq}`, "obj-t"));
  return refs;
}

function ret(
  value: string,
  phase: "returning" | "replaces" | "assigned",
  callExpr: string,
  callLine: number,
  extra: Partial<Step> = {},
): Partial<Step> {
  return {
    returnFlow: {
      fromMethod: "Somme",
      callExpr,
      value,
      phase,
      callLine,
      ...(phase === "assigned" ? { targetVar: "r" } : {}),
      ...(phase === "returning" && callLine === 8 ? { targetVar: "r" } : {}),
    },
    ...extra,
  };
}

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const callStack: Act[] = [];
  let seq = 0;
  let stepN = 0;
  const mainT = [refSlot("slot-t-main", "t", "#T1", "obj-t")];

  function emit(
    highlightLines: number[],
    narration: string,
    extra: Partial<Step> = {},
    withArray = true,
    mainSlots = withArray ? mainT : [],
  ): void {
    const heap = withArray ? [snapshotHeap()] : [];
    const refs = withArray ? refsFor(callStack, true) : [];
    const stack = main(mainSlots, callStack.map(toFrame));
    steps.push(step(`somme-${stepN++}`, highlightLines, narration, stack, heap, refs, extra));
  }

  function pushAct(i: number): Act {
    const act: Act = { seq: ++seq, i };
    callStack.push(act);
    return act;
  }

  function runSomme(act: Act): number {
    const { i } = act;
    const parentCall = callStack.length === 1 ? "Somme(t, 0)" : "Somme(t, i + 1)";
    const parentLine = callStack.length === 1 ? 8 : 5;

    emit(
      [2],
      i === 0
        ? `Somme s’empile. i = 0, t pointe vers le même tableau que Main — pas une copie des cases.`
        : `Somme(t, ${i}) s’empile. Autre i ; t vise toujours #T1.`,
      { highlightExpr: "int i", focus: `slot-i-${act.seq}` },
    );

    emit([4], `Test : i == t.Length → ${i} == ${LEN} est ${i === LEN}.`, {
      highlightExpr: "i == t.Length",
      focus: `slot-i-${act.seq}`,
    });

    if (i === LEN) {
      emit(
        [4],
        `i vaut ${LEN} : plus de case à lire. return 0 — la somme du « reste vide ».`,
        ret("0", "returning", parentCall, parentLine, {
          highlightExpr: "return 0",
          focus: `slot-i-${act.seq}`,
        }),
      );
      callStack.pop();
      return 0;
    }

    const cell = VALUES[i]!;
    emit(
      [5],
      `t[${i}] vaut ${cell} dans le tableau partagé. On va l’ajouter à la somme du reste.`,
      { highlightExpr: "t[i]", focus: `cell-${i}` },
    );
    emit([5], `i + 1 va valoir ${i + 1}. On va passer cet indice, pas i lui-même.`, {
      highlightExpr: "i + 1",
      focus: `slot-i-${act.seq}`,
    });

    const child = pushAct(i + 1);
    emit(
      [5],
      `Somme(t, i + 1) : nouvelle frame. t reste #T1, i va valoir ${i + 1}.`,
      { highlightExpr: "Somme(t, i + 1)", focus: `slot-i-${child.seq}` },
    );
    const rest = runSomme(child);

    emit(
      [5],
      `Somme(t, ${i + 1}) va disparaître. Ici, Somme(t, i + 1) va être remplacé par ${rest}.`,
      ret(String(rest), "replaces", "Somme(t, i + 1)", 5, { focus: `frame-somme-${act.seq}` }),
    );

    const total = cell + rest;
    emit(
      [5],
      `t[${i}] vaut ${cell} : ${cell} + ${rest} va valoir ${total}. Somme(i = ${i}) va pouvoir retourner.`,
      ret(String(rest), "replaces", "Somme(t, i + 1)", 5, {
        highlightExpr: "t[i] +",
        focus: `cell-${i}`,
      }),
    );
    emit(
      [5],
      `return ${total} : vers ${callStack.length === 1 ? "Main" : `Somme(i = ${i - 1})`}.`,
      ret(String(total), "returning", parentCall, parentLine, { focus: `frame-somme-${act.seq}` }),
    );
    callStack.pop();
    return total;
  }

  emit(
    [0],
    "Le programme va démarrer. On va additionner les cases d’un tableau, de gauche à droite, sans boucle.",
    {},
    false,
  );
  emit(
    [0],
    "Le tableau { 4, 1, 2 } va être créé sur le heap. t dans Main n’est qu’une référence.",
    { highlightExpr: "int[] t", focus: "obj-t" },
  );

  const root = pushAct(0);
  emit([8], "Somme(t, 0) : on va empiler. t (la référence) va être copiée, pas les cases.", {
    highlightExpr: "Somme(t, 0)",
    focus: "slot-t-main",
  });
  const result = runSomme(root);

  emit(
    [8],
    `Plus de frame Somme. Dans Main, Somme(t, 0) va être remplacé par ${result}.`,
    ret(String(result), "replaces", "Somme(t, 0)", 8, { focus: "frame-main" }),
  );
  const mainDone = [...mainT, val("slot-r", "r", String(result))];
  emit(
    [8],
    `Ensuite seulement : ${result} va être affecté à r sur la stack de Main.`,
    ret(String(result), "assigned", "Somme(t, 0)", 8, { focus: "slot-r" }),
    true,
    mainDone,
  );
  steps.push(
    step(
      "somme-end",
      [8],
      MAIN_DONE,
      main(mainDone),
      [snapshotHeap()],
      [link("ref-t-main", "slot-t-main", "obj-t")],
      {},
    ),
  );

  return steps;
}

export const sommeScenario: Scenario = {
  id: "somme",
  title: "Récursion : somme d’un tableau",
  subtitle: "Somme(t, i) : même tableau sur le heap, i qui avance, les retours s’additionnent.",
  part: "functions",
  code: CODE,
  steps: buildSteps(),
};
