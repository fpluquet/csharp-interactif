import type { Scenario, StackFrame, Step } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

const CODE = [
  "void Descendre(int n)",
  "{",
  "    Console.WriteLine(n);",
  "    if (n > 0) Descendre(n - 1);",
  "}",
  "",
  "void Monter(int n)",
  "{",
  "    if (n > 0) Monter(n - 1);",
  "    Console.WriteLine(n);",
  "}",
  "",
  "Descendre(2);",
  "Monter(2);",
];

type Kind = "Descendre" | "Monter";
type Act = { seq: number; kind: Kind; n: number };

function toFrame(act: Act): StackFrame {
  const p = `${act.kind.toLowerCase()}-${act.seq}`;
  return frame(`frame-${p}`, act.kind, [val(`slot-${p}-n`, "n", String(act.n))]);
}

function nSlot(act: Act): string {
  return `slot-${act.kind.toLowerCase()}-${act.seq}-n`;
}

function frameId(act: Act): string {
  return `frame-${act.kind.toLowerCase()}-${act.seq}`;
}

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const callStack: Act[] = [];
  const consoleLines: string[] = [];
  let seq = 0;
  let stepN = 0;

  function emit(
    highlightLines: number[],
    narration: string,
    extra: Partial<Step> = {},
  ): void {
    steps.push(
      step(`print-rec-${stepN++}`, highlightLines, narration, main([], callStack.map(toFrame)), [], [], {
        consoleLines: [...consoleLines],
        ...extra,
      }),
    );
  }

  function pushAct(kind: Kind, n: number): Act {
    const act: Act = { seq: ++seq, kind, n };
    callStack.push(act);
    return act;
  }

  function runDescendre(act: Act): void {
    emit(
      [0],
      act.n === 2
        ? `Descendre s’empile. n va recevoir 2 — une copie, dans cette frame seulement.`
        : `Descendre(${act.n}) s’empile. Autre n, autre frame ; celle du dessus attend.`,
      { highlightExpr: "int n", focus: nSlot(act) },
    );

    consoleLines.push(String(act.n));
    emit(
      [2],
      `On va afficher ${act.n} tout de suite, avant l’appel récursif. La console va montrer ${act.n} maintenant.`,
      { highlightExpr: "Console.WriteLine(n)", focus: nSlot(act) },
    );

    emit([3], `Test : n > 0 → ${act.n} > 0 est ${act.n > 0}.`, {
      highlightExpr: "n > 0",
      focus: nSlot(act),
    });

    if (act.n > 0) {
      const child = pushAct("Descendre", act.n - 1);
      emit(
        [3],
        `Descendre(n - 1) : on va empiler Descendre(${act.n - 1}). Cette frame n = ${act.n} va attendre — son WriteLine est déjà fait.`,
        { highlightExpr: "Descendre(n - 1)", focus: nSlot(child) },
      );
      runDescendre(child);
    }

    emit(
      [4],
      act.n === 0
        ? `n vaut 0 : pas d’appel. Descendre(0) a fini ; la frame va disparaître.`
        : `L’appel est revenu. Descendre(${act.n}) n’a plus rien à faire : le WriteLine était avant. La frame va disparaître.`,
      { focus: frameId(act) },
    );
    callStack.pop();
  }

  function runMonter(act: Act): void {
    emit(
      [6],
      act.n === 2
        ? `Monter s’empile. Même n = 2, mais le WriteLine est après l’appel : rien à la console tant que la pile n’est pas redescendue.`
        : `Monter(${act.n}) s’empile. Toujours pas d’affichage : on descend d’abord.`,
      { highlightExpr: "int n", focus: nSlot(act) },
    );

    emit([8], `Test : n > 0 → ${act.n} > 0 est ${act.n > 0}.`, {
      highlightExpr: "n > 0",
      focus: nSlot(act),
    });

    if (act.n > 0) {
      const child = pushAct("Monter", act.n - 1);
      emit(
        [8],
        `Monter(n - 1) d’abord. Cette frame n = ${act.n} va attendre sans avoir encore affiché.`,
        { highlightExpr: "Monter(n - 1)", focus: nSlot(child) },
      );
      runMonter(child);
    }

    consoleLines.push(String(act.n));
    emit(
      [9],
      act.n === 0
        ? `Cas de base : on va afficher 0. Premier chiffre de Monter — l’inverse de Descendre.`
        : `L’appel est revenu. Maintenant seulement, on va afficher ${act.n}.`,
      { highlightExpr: "Console.WriteLine(n)", focus: nSlot(act) },
    );

    emit(
      [10],
      `Monter(${act.n}) a fini. La frame va disparaître.`,
      { focus: frameId(act) },
    );
    callStack.pop();
  }

  emit(
    [12],
    "Le programme va démarrer. Deux fonctions, même pile : WriteLine avant l’appel, puis WriteLine après.",
  );

  const d = pushAct("Descendre", 2);
  emit([12], "Descendre(2) : on va empiler. Le WriteLine est avant l’appel récursif.", {
    highlightExpr: "Descendre(2)",
    focus: nSlot(d),
  });
  runDescendre(d);

  emit(
    [12],
    "Plus de Descendre. Console : 2, 1, 0 — du plus grand au plus petit, parce que l’affichage était avant l’appel.",
    { highlightExpr: "Descendre(2)", focus: "frame-main" },
  );

  const m = pushAct("Monter", 2);
  emit(
    [13],
    "Monter(2) : même n, mais le WriteLine est après l’appel. La console ne va pas bouger tant que la pile n’est pas au fond.",
    { highlightExpr: "Monter(2)", focus: nSlot(m) },
  );
  runMonter(m);

  emit(
    [13],
    "Plus de Monter. La console finit par 0, 1, 2 : l’ordre s’est inversé, uniquement parce que le WriteLine est après l’appel.",
    { highlightExpr: "Monter(2)", focus: "frame-main" },
  );
  steps.push(
    step("print-rec-end", [13], MAIN_DONE, main([]), [], [], {
      consoleLines: [...consoleLines],
    }),
  );

  return steps;
}

export const recursionPrintScenario: Scenario = {
  id: "print-rec",
  title: "Récursion : avant ou après",
  subtitle:
    "Descendre(2) affiche puis appelle ; Monter(2) appelle puis affiche. Même pile, console inversée.",
  part: "functions",
  code: CODE,
  steps: buildSteps(),
};
