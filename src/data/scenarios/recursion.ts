import type { Scenario, StackFrame, Step } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

const n3 = val("slot-n3", "n", "3");
const n2 = val("slot-n2", "n", "2");
const n1 = val("slot-n1", "n", "1");

const f3 = (): StackFrame => frame("frame-fact-3", "Fact", [n3]);
const f2 = (): StackFrame => frame("frame-fact-2", "Fact", [n2]);
const f1 = (): StackFrame => frame("frame-fact-1", "Fact", [n1]);

function stk(...frames: StackFrame[]) {
  return main([], frames);
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
      fromMethod: "Fact",
      callExpr,
      value,
      phase,
      callLine,
      ...(phase === "assigned" ? { targetVar: "r" } : {}),
      ...(phase === "returning" && callLine === 6 ? { targetVar: "r" } : {}),
    },
    ...extra,
  };
}

export const recursionScenario: Scenario = {
  id: "recursion",
  title: "Récursion courte",
  subtitle: "Fact(3) : empiler un n par appel, sauter le if, cas de base, puis dépiler en multipliant.",
  part: "functions",
  code: [
    "int Fact(int n)",
    "{",
    "    if (n <= 1) return 1;",
    "    return n * Fact(n - 1);",
    "}",
    "",
    "int r = Fact(3);",
  ],
  steps: [
    step(
      "rc0",
      [6],
      "Le programme va démarrer. On va suivre Fact(3) appel par appel : chaque frame aura son propre n.",
      main([]),
      [],
      [],
    ),
    step(
      "rc-call-3",
      [6],
      "int r = Fact(3) : on va d’abord évaluer l’appel. r n’existe pas encore.",
      main([]),
      [],
      [],
      { highlightExpr: "Fact(3)", focus: "frame-main" },
    ),
    step(
      "rc-enter-3",
      [0],
      "Fact s’empile. Le paramètre n va recevoir 3 — une copie de l’argument, dans cette frame seulement.",
      stk(f3()),
      [],
      [],
      { highlightExpr: "int n", focus: "slot-n3" },
    ),
    step(
      "rc-if-3",
      [2],
      "Test : n <= 1 → 3 <= 1 est faux. On ne va pas entrer dans le if, donc pas de return 1. On continue.",
      stk(f3()),
      [],
      [],
      { highlightExpr: "n <= 1", focus: "slot-n3" },
    ),
    step(
      "rc-arg-3",
      [3],
      "Argument d’abord : n - 1 va valoir 2. C’est cette valeur (pas n lui-même) qu’on va passer.",
      stk(f3()),
      [],
      [],
      { highlightExpr: "n - 1", focus: "slot-n3" },
    ),
    step(
      "rc-call-2",
      [3],
      "Fact(2) : nouvel appel, nouvelle frame. Le n de Fact(3) va rester 3, inchangé.",
      stk(f3()),
      [],
      [],
      { highlightExpr: "Fact(n - 1)", focus: "frame-fact-3" },
    ),
    step(
      "rc-enter-2",
      [0],
      "Deuxième Fact. Un autre n va être créé ici, copie de 2 — ce n’est pas le même slot que n = 3 au-dessus.",
      stk(f3(), f2()),
      [],
      [],
      { highlightExpr: "int n", focus: "slot-n2" },
    ),
    step(
      "rc-if-2",
      [2],
      "Test dans Fact(2) : 2 <= 1 est encore faux. On saute encore return 1.",
      stk(f3(), f2()),
      [],
      [],
      { highlightExpr: "n <= 1", focus: "slot-n2" },
    ),
    step(
      "rc-arg-2",
      [3],
      "n - 1 va valoir 1. On va passer 1 au prochain appel.",
      stk(f3(), f2()),
      [],
      [],
      { highlightExpr: "n - 1", focus: "slot-n2" },
    ),
    step(
      "rc-call-1",
      [3],
      "Fact(1) : troisième frame. Trois n distincts vont coexister : 3, 2, et bientôt 1.",
      stk(f3(), f2()),
      [],
      [],
      { highlightExpr: "Fact(n - 1)", focus: "frame-fact-2" },
    ),
    step(
      "rc-enter-1",
      [0],
      "Fact(1) s’empile. n va valoir 1 dans cette frame — copie, toujours pas une alias vers les autres n.",
      stk(f3(), f2(), f1()),
      [],
      [],
      { highlightExpr: "int n", focus: "slot-n1" },
    ),
    step(
      "rc-if-1",
      [2],
      "Test : 1 <= 1 est vrai. Cette fois on va entrer dans le if — c’est le cas de base, plus d’appel récursif.",
      stk(f3(), f2(), f1()),
      [],
      [],
      { highlightExpr: "n <= 1", focus: "slot-n1" },
    ),
    step(
      "rc-ret-1",
      [2],
      "return 1 : Fact(1) va renvoyer 1 vers l’appelant (Fact(2)).",
      stk(f3(), f2(), f1()),
      [],
      [],
      ret("1", "returning", "Fact(n - 1)", 3, {
        highlightExpr: "return 1",
        focus: "slot-n1",
      }),
    ),
    step(
      "rc-repl-1",
      [3],
      "Fact(1) va disparaître. Dans Fact(2), Fact(n - 1) va être remplacé par 1. Il reste n * 1.",
      stk(f3(), f2()),
      [],
      [],
      ret("1", "replaces", "Fact(n - 1)", 3, { focus: "frame-fact-2" }),
    ),
    step(
      "rc-mul-2",
      [3],
      "n vaut 2 dans cette frame : 2 * 1 va valoir 2. Fact(2) va pouvoir retourner.",
      stk(f3(), f2()),
      [],
      [],
      ret("1", "replaces", "Fact(n - 1)", 3, {
        highlightExpr: "n *",
        focus: "slot-n2",
      }),
    ),
    step(
      "rc-ret-2",
      [3],
      "return 2 : Fact(2) va renvoyer 2 vers Fact(3).",
      stk(f3(), f2()),
      [],
      [],
      ret("2", "returning", "Fact(n - 1)", 3, { focus: "frame-fact-2" }),
    ),
    step(
      "rc-repl-2",
      [3],
      "Fact(2) va disparaître. Dans Fact(3), Fact(n - 1) va être remplacé par 2. Il reste n * 2.",
      stk(f3()),
      [],
      [],
      ret("2", "replaces", "Fact(n - 1)", 3, { focus: "frame-fact-3" }),
    ),
    step(
      "rc-mul-3",
      [3],
      "n vaut 3 ici : 3 * 2 va valoir 6. Dernier return, vers Main.",
      stk(f3()),
      [],
      [],
      ret("2", "replaces", "Fact(n - 1)", 3, {
        highlightExpr: "n *",
        focus: "slot-n3",
      }),
    ),
    step(
      "rc-ret-3",
      [3],
      "return 6 : Fact(3) va renvoyer 6 vers Main. Les trois n de la récursion ont fait leur travail.",
      stk(f3()),
      [],
      [],
      ret("6", "returning", "Fact(3)", 6, { focus: "frame-fact-3" }),
    ),
    step(
      "rc-repl-3",
      [6],
      "Plus aucune frame Fact. Dans Main, Fact(3) va être remplacé par 6.",
      main([]),
      [],
      [],
      ret("6", "replaces", "Fact(3)", 6, { focus: "frame-main" }),
    ),
    step(
      "rc-assign",
      [6],
      "Ensuite seulement : 6 va être affecté à r sur la stack de Main.",
      main([val("slot-r", "r", "6")]),
      [],
      [],
      ret("6", "assigned", "Fact(3)", 6, { focus: "slot-r" }),
    ),
    step(
      "recursion-end",
      [6],
      MAIN_DONE,
      main([val("slot-r", "r", "6")]),
      [],
      [],
    ),
  ],
};
