import type { HeapObject, RefLink, Scenario, StackFrame, Step } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

const CODE = [
  "(bool ouverte, int n)[,] g =",
  "{",
  "    { (false, 0), (false, 1), (false, 1) },",
  "    { (false, 0), (false, 1), (false, 1) },",
  "};",
  "",
  "void Clarifier((bool ouverte, int n)[,] g, int l, int c)",
  "{",
  "    if (g[l, c].ouverte) return;",
  "    g[l, c] = (true, g[l, c].n);",
  "    if (g[l, c].n > 0) return;",
  "    if (l > 0) Clarifier(g, l - 1, c);",
  "    if (l < 1) Clarifier(g, l + 1, c);",
  "    if (c > 0) Clarifier(g, l, c - 1);",
  "    if (c < 2) Clarifier(g, l, c + 1);",
  "}",
  "",
  "Clarifier(g, 0, 0);",
];

type Cell = { ouverte: boolean; n: number };
type Act = { seq: number; l: number; c: number };

const DIRS = [
  {
    cond: "l > 0",
    line: 11,
    callExpr: "Clarifier(g, l - 1, c)",
    ok: (l: number, _c: number) => l > 0,
    next: (l: number, c: number) => [l - 1, c] as const,
  },
  {
    cond: "l < 1",
    line: 12,
    callExpr: "Clarifier(g, l + 1, c)",
    ok: (l: number, _c: number) => l < 1,
    next: (l: number, c: number) => [l + 1, c] as const,
  },
  {
    cond: "c > 0",
    line: 13,
    callExpr: "Clarifier(g, l, c - 1)",
    ok: (_l: number, c: number) => c > 0,
    next: (l: number, c: number) => [l, c - 1] as const,
  },
  {
    cond: "c < 2",
    line: 14,
    callExpr: "Clarifier(g, l, c + 1)",
    ok: (_l: number, c: number) => c < 2,
    next: (l: number, c: number) => [l, c + 1] as const,
  },
];

function cellText(cell: Cell): string {
  return `(${cell.ouverte}, ${cell.n})`;
}

function snapshotHeap(grid: Cell[][]): HeapObject {
  const fields = [];
  for (let l = 0; l < 2; l++) {
    for (let c = 0; c < 3; c++) {
      fields.push({
        id: `cell-${l}${c}`,
        label: `[${l},${c}]`,
        value: cellText(grid[l]![c]!),
      });
    }
  }
  return obj("obj-g", "(bool, int)[,]", "#G1", fields);
}

function toFrame(act: Act): StackFrame {
  return frame(`frame-cl-${act.seq}`, "Clarifier", [
    refSlot(`slot-g-${act.seq}`, "g", "#G1", "obj-g"),
    val(`slot-l-${act.seq}`, "l", String(act.l)),
    val(`slot-c-${act.seq}`, "c", String(act.c)),
  ]);
}

function refsFor(acts: Act[]): RefLink[] {
  return [
    link("ref-g-main", "slot-g-main", "obj-g"),
    ...acts.map((act) => link(`ref-g-${act.seq}`, `slot-g-${act.seq}`, "obj-g")),
  ];
}

function enterNarration(act: Act, already: boolean): string {
  if (already) {
    return `Clarifier(${act.l}, ${act.c}) s’empile. [ ${act.l}, ${act.c} ] est déjà ouverte : on va s’arrêter tout de suite, sans retoucher le tableau.`;
  }
  if (act.l === 0 && act.c === 0) {
    return `Clarifier s’empile. l = 0, c = 0. g pointe vers le même tableau que Main — pas une copie de la grille.`;
  }
  return `Nouvel appel Clarifier(${act.l}, ${act.c}). Autre frame, autres l et c ; g vise toujours #G1.`;
}

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const callStack: Act[] = [];
  const grid: Cell[][] = [
    [
      { ouverte: false, n: 0 },
      { ouverte: false, n: 1 },
      { ouverte: false, n: 1 },
    ],
    [
      { ouverte: false, n: 0 },
      { ouverte: false, n: 1 },
      { ouverte: false, n: 1 },
    ],
  ];
  let seq = 0;
  let stepN = 0;

  const mainG = [refSlot("slot-g-main", "g", "#G1", "obj-g")];

  function emit(
    highlightLines: number[],
    narration: string,
    extra: Partial<Step> = {},
    withGrid = true,
  ): void {
    const heap = withGrid ? [snapshotHeap(grid)] : [];
    const refs = withGrid ? refsFor(callStack) : [];
    const stack = withGrid ? main(mainG, callStack.map(toFrame)) : main([], callStack.map(toFrame));
    steps.push(
      step(`clarifier-${stepN++}`, highlightLines, narration, stack, heap, refs, extra),
    );
  }

  function pushAct(l: number, c: number): Act {
    const act: Act = { seq: ++seq, l, c };
    callStack.push(act);
    return act;
  }

  function runClarifier(act: Act): void {
    const { l, c } = act;
    const cell = grid[l]![c]!;

    emit([6], enterNarration(act, cell.ouverte), {
      highlightExpr: "int l",
      focus: `slot-l-${act.seq}`,
    });
    emit([8], `Test : g[${l}, ${c}].ouverte → ${cell.ouverte}.`, {
      highlightExpr: "g[l, c].ouverte",
      focus: `cell-${l}${c}`,
    });

    if (cell.ouverte) {
      emit([8], `Déjà ouverte : return. Cette frame va disparaître, sans nouvel appel.`, {
        highlightExpr: "return",
        focus: `frame-cl-${act.seq}`,
      });
      callStack.pop();
      return;
    }

    emit(
      [9],
      `[${l}, ${c}] va passer à (true, ${cell.n}) dans le tableau partagé. Toutes les frames voient ce changement.`,
      { highlightExpr: "g[l, c] = (true, g[l, c].n)", focus: `cell-${l}${c}` },
    );
    cell.ouverte = true;

    emit([10], `Test : n > 0 → ${cell.n} > 0 est ${cell.n > 0}.`, {
      highlightExpr: "g[l, c].n > 0",
      focus: `cell-${l}${c}`,
    });

    if (cell.n > 0) {
      emit(
        [10],
        `n vaut ${cell.n} : case chiffrée, on s’arrête. Pas de voisines à clarifier depuis ici.`,
        { highlightExpr: "return", focus: `slot-l-${act.seq}` },
      );
      callStack.pop();
      return;
    }

    for (const dir of DIRS) {
      const ok = dir.ok(l, c);
      emit(
        [dir.line],
        ok
          ? `Test ${dir.cond} → vrai. On va clarifier la voisine.`
          : `Test ${dir.cond} → faux. Pas d’appel : on sortirait de la grille.`,
        {
          highlightExpr: dir.cond,
          focus: dir.cond.startsWith("l") ? `slot-l-${act.seq}` : `slot-c-${act.seq}`,
        },
      );
      if (!ok) continue;
      const [nl, nc] = dir.next(l, c);
      const child = pushAct(nl, nc);
      emit([dir.line], `${dir.callExpr} : nouvelle frame. g reste #G1, avec l = ${nl}, c = ${nc}.`, {
        highlightExpr: dir.callExpr,
        focus: `slot-l-${child.seq}`,
      });
      runClarifier(child);
    }

    emit(
      [15],
      `Clarifier(${l}, ${c}) a fini ses voisines. La frame va disparaître.`,
      { focus: `frame-cl-${act.seq}` },
    );
    callStack.pop();
  }

  emit(
    [0],
    "Le programme va démarrer. Une petite grille 2×3 : 0 = aucune mine autour, 1 = une voisine.",
    {},
    false,
  );
  emit(
    [0],
    "Le tableau de tuples va être créé sur le heap. Toutes les cases commencent fermées (false).",
    { highlightExpr: "(bool ouverte, int n)[,]", focus: "obj-g" },
  );

  const root = pushAct(0, 0);
  emit([17], "Clarifier(g, 0, 0) : on va empiler une frame. g (la référence) va être copiée, pas la grille.", {
    highlightExpr: "Clarifier(g, 0, 0)",
    focus: "slot-g-main",
  });
  runClarifier(root);

  emit(
    [17],
    "Plus de frame Clarifier. Les cinq cases accessibles depuis [0,0] sont ouvertes ; [0,2] et [1,2] restent fermées.",
    { highlightExpr: "Clarifier(g, 0, 0)", focus: "obj-g" },
  );
  steps.push(
    step("clarifier-end", [17], MAIN_DONE, main(mainG), [snapshotHeap(grid)], refsFor([]), {}),
  );

  return steps;
}

export const clarifierScenario: Scenario = {
  id: "clarifier",
  title: "Récursion : clarifier le terrain",
  subtitle:
    "Démineur : une case 0 ouvre ses voisines, récursivement, sur le même tableau de tuples.",
  part: "functions",
  code: CODE,
  steps: buildSteps(),
};
