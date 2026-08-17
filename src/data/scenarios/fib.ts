import type { Scenario, StackFrame, Step } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

const CODE = [
  "int Fib(int n)",
  "{",
  "    if (n <= 1) return n;",
  "    return Fib(n - 1) + Fib(n - 2);",
  "}",
  "",
  "int r = Fib(4);",
];

type Act = { seq: number; n: number };

function toFrame(act: Act): StackFrame {
  return frame(`frame-fib-${act.seq}`, "Fib", [val(`slot-fib-${act.seq}-n`, "n", String(act.n))]);
}

function nSlot(act: Act): string {
  return `slot-fib-${act.seq}-n`;
}

function frameId(act: Act): string {
  return `frame-fib-${act.seq}`;
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
      fromMethod: "Fib",
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

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const callStack: Act[] = [];
  let seq = 0;
  let stepN = 0;
  let fib2Seen = 0;

  function emit(
    highlightLines: number[],
    narration: string,
    extra: Partial<Step> = {},
    mainSlots: ReturnType<typeof val>[] = [],
  ): void {
    steps.push(
      step(`fib-${stepN++}`, highlightLines, narration, main(mainSlots, callStack.map(toFrame)), [], [], extra),
    );
  }

  function pushAct(n: number): Act {
    const act: Act = { seq: ++seq, n };
    callStack.push(act);
    return act;
  }

  function parentCall(): { expr: string; line: number } {
    if (callStack.length === 1) return { expr: "Fib(4)", line: 6 };
    const parent = callStack[callStack.length - 2]!;
    const child = callStack[callStack.length - 1]!;
    if (child.n === parent.n - 1) return { expr: "Fib(n - 1)", line: 3 };
    return { expr: "Fib(n - 2)", line: 3 };
  }

  function enterNarration(act: Act): string {
    if (act.n === 4) {
      return `Fib s’empile. n va recevoir 4 — une copie, dans cette frame seulement.`;
    }
    if (act.n === 2) {
      fib2Seen += 1;
      if (fib2Seen === 1) {
        return `Fib(2) s’empile, sous Fib(3). On va calculer 2 de toutes pièces.`;
      }
      return `On recalcule Fib(2) : nouvelle frame, même n, mais on n’a rien mémorisé. Le premier Fib(2) a déjà disparu.`;
    }
    if (act.n <= 1) {
      return `Fib(${act.n}) s’empile. n = ${act.n} : on va pouvoir s’arrêter sans nouvel appel.`;
    }
    return `Fib(${act.n}) s’empile. Autre n, autre frame ; celles du dessus attendent.`;
  }

  function runFib(act: Act): number {
    const call = parentCall();

    emit([0], enterNarration(act), { highlightExpr: "int n", focus: nSlot(act) });
    emit([2], `Test : n <= 1 → ${act.n} <= 1 est ${act.n <= 1}.`, {
      highlightExpr: "n <= 1",
      focus: nSlot(act),
    });

    if (act.n <= 1) {
      emit(
        [2],
        `Cas de base : return n, donc ${act.n}. Pas de Fib(n - 1) ni de Fib(n - 2).`,
        ret(String(act.n), "returning", call.expr, call.line, {
          highlightExpr: "return n",
          focus: nSlot(act),
        }),
      );
      callStack.pop();
      return act.n;
    }

    emit([3], `n - 1 va valoir ${act.n - 1}. Premier sous-appel, à gauche de l’addition.`, {
      highlightExpr: "n - 1",
      focus: nSlot(act),
    });
    const left = pushAct(act.n - 1);
    emit(
      [3],
      `Fib(n - 1) : nouvelle frame. Le n = ${act.n} de cette frame reste inchangé.`,
      { highlightExpr: "Fib(n - 1)", focus: nSlot(left) },
    );
    const v1 = runFib(left);

    emit(
      [3],
      `Fib(n - 1) va disparaître. Ici, Fib(n - 1) va être remplacé par ${v1}. Il reste ${v1} + Fib(n - 2).`,
      ret(String(v1), "replaces", "Fib(n - 1)", 3, { focus: frameId(act) }),
    );

    emit([3], `n - 2 va valoir ${act.n - 2}. Deuxième sous-appel, à droite.`, {
      highlightExpr: "n - 2",
      focus: nSlot(act),
    });
    const right = pushAct(act.n - 2);
    emit(
      [3],
      act.n === 4
        ? `Fib(n - 2) : on va empiler Fib(2) alors que la pile venait de redescendre. On refait un calcul déjà vu.`
        : `Fib(n - 2) : nouvelle frame n = ${act.n - 2}.`,
      { highlightExpr: "Fib(n - 2)", focus: nSlot(right) },
    );
    const v2 = runFib(right);

    emit(
      [3],
      `Fib(n - 2) va disparaître. Ici, Fib(n - 2) va être remplacé par ${v2}.`,
      ret(String(v2), "replaces", "Fib(n - 2)", 3, { focus: frameId(act) }),
    );

    const total = v1 + v2;
    emit(
      [3],
      `${v1} + ${v2} va valoir ${total}. C’est Fib(${act.n}).`,
      ret(String(v2), "replaces", "Fib(n - 2)", 3, {
        highlightExpr: "Fib(n - 1) + Fib(n - 2)",
        focus: nSlot(act),
      }),
    );
    emit(
      [3],
      `return ${total} : c’est la somme ${v1} + ${v2} qui va partir vers ${
        callStack.length === 1 ? "Main" : `Fib(${callStack[callStack.length - 2]!.n})`
      }, pas un seul sous-appel.`,
      ret(String(total), "returning", "Fib(n - 1) + Fib(n - 2)", 3, {
        highlightExpr: "Fib(n - 1) + Fib(n - 2)",
        focus: frameId(act),
      }),
    );
    callStack.pop();
    return total;
  }

  emit(
    [6],
    "Le programme va démarrer. Fib(4) va lancer deux appels, qui en lancent d’autres : on va revoir le même Fib(2) deux fois.",
  );
  const root = pushAct(4);
  emit([6], "int r = Fib(4) : l’appel va empiler une frame. n va recevoir 4.", {
    highlightExpr: "Fib(4)",
    focus: nSlot(root),
  });
  const result = runFib(root);

  emit(
    [6],
    `Plus de frame Fib. Dans Main, Fib(4) va être remplacé par ${result}.`,
    ret(String(result), "replaces", "Fib(4)", 6, { focus: "frame-main" }),
  );
  const mainR = [val("slot-r", "r", String(result))];
  emit(
    [6],
    `Ensuite seulement : ${result} va être affecté à r. Fib(2) a été calculé deux fois, pour un tout petit 3.`,
    ret(String(result), "assigned", "Fib(4)", 6, { focus: "slot-r" }),
    mainR,
  );
  steps.push(step("fib-end", [6], MAIN_DONE, main(mainR), [], [], {}));

  return steps;
}

export const fibScenario: Scenario = {
  id: "fib",
  title: "Récursion : Fibonacci naïf",
  subtitle: "Fib(4) : deux appels avec valeur de retour ; Fib(2) est recalculé, rien n’est mémorisé.",
  part: "functions",
  code: CODE,
  steps: buildSteps(),
};
