import type { Scenario, StackFrame, Step } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

const CODE = [
  "void Hanoi(int n, char de, char vers, char via)",
  "{",
  "    if (n == 1)",
  "    {",
  '        Console.WriteLine($"{de} → {vers}");',
  "        return;",
  "    }",
  "    Hanoi(n - 1, de, via, vers);",
  '    Console.WriteLine($"{de} → {vers}");',
  "    Hanoi(n - 1, via, vers, de);",
  "}",
  "",
  "Hanoi(3, 'A', 'C', 'B');",
];

type Peg = "A" | "B" | "C";

type Act = {
  seq: number;
  n: number;
  de: Peg;
  vers: Peg;
  via: Peg;
};

function toFrame(act: Act): StackFrame {
  const p = `hanoi-${act.seq}`;
  return frame(`frame-${p}`, "Hanoi", [
    val(`slot-${p}-n`, "n", String(act.n)),
    val(`slot-${p}-de`, "de", `'${act.de}'`),
    val(`slot-${p}-vers`, "vers", `'${act.vers}'`),
    val(`slot-${p}-via`, "via", `'${act.via}'`),
  ]);
}

function pegs(act: Act): string {
  return `n = ${act.n}, de = '${act.de}', vers = '${act.vers}', via = '${act.via}'`;
}

function enterNarration(act: Act, parent: Act | undefined, movesDone: number): string {
  if (!parent) {
    return `Hanoi s’empile. n va recevoir 3, de = 'A', vers = 'C', via = 'B' — des copies, dans cette frame seulement.`;
  }
  if (act.n === 2 && act.de === "A") {
    return `Deuxième frame. n va valoir 2, de = 'A', vers = 'B', via = 'C'. Ce n’est pas un alias : la frame n = 3 au-dessus garde ses propres copies.`;
  }
  if (act.n === 2 && act.de === "B") {
    return `Nouvelle frame n = 2, pas la même que tout à l’heure : de = 'B', vers = 'C', via = 'A'. Hanoi(3) attend au-dessus.`;
  }
  if (act.n === 1 && movesDone === 0) {
    return `Hanoi(1) s’empile. n = 1, de = 'A', vers = 'C'. Trois frames, trois n distincts : 3, 2, et 1.`;
  }
  if (act.n === 1 && movesDone === 2) {
    return `Autre Hanoi(1), autres copies : de = 'C', vers = 'B'. Ce n’est pas la frame du premier coup.`;
  }
  if (act.n === 1 && movesDone === 4) {
    return `Hanoi(1) : de = 'B', vers = 'A'. La pile a de nouveau trois frames Hanoi sous Main.`;
  }
  if (act.n === 1 && movesDone === 6) {
    return `Dernier Hanoi(1) : encore de = 'A', vers = 'C' — mais une nouvelle frame, pas celle du coup 1.`;
  }
  return `Hanoi s’empile. ${pegs(act)}. Ce n’est pas la même frame que n = ${parent.n} au-dessus.`;
}

function testNarration(act: Act, movesDone: number): string {
  if (act.n === 1) {
    if (movesDone === 0) {
      return `Test : 1 == 1 est vrai. Cas de base : on va afficher un déplacement, sans nouvel appel.`;
    }
    if (act.de === "C") {
      return `Encore le cas de base : 1 == 1. Un déplacement, puis return.`;
    }
    if (act.de === "B") {
      return `Cas de base. On va afficher, puis dépiler.`;
    }
    return `1 == 1 : dernier cas de base.`;
  }
  if (act.n === 3) {
    return `Test : n == 1 → 3 == 1 est faux. Pas le cas de base : on va d’abord déplacer 2 disques vers B, puis le grand de A vers C, puis 2 disques de B vers C.`;
  }
  if (act.de === "A") {
    return `Test : 2 == 1 est encore faux. Même schéma à l’échelle 2 : un appel, un coup, un appel.`;
  }
  return `2 == 1 est faux. Encore deux appels et un déplacement au milieu.`;
}

function argNarration(act: Act, which: 1 | 2): string {
  if (which === 1) {
    if (act.n === 3) {
      return `n - 1 va valoir 2. On va passer 2, de A vers B (le via actuel), en se servant de C.`;
    }
    if (act.de === "A") {
      return `n - 1 va valoir 1. On va d’abord déplacer un seul disque de A vers C.`;
    }
    return `n - 1 va valoir 1. Premier sous-appel : un disque de B vers A.`;
  }
  if (act.n === 3) {
    return `n - 1 vaut 2. Il reste à ramener les 2 disques de B vers C, en se servant de A.`;
  }
  if (act.de === "A") {
    return `n - 1 vaut encore 1. Cette fois on va déplacer ce disque de C (via) vers B (vers), en se servant de A.`;
  }
  return `Dernier n - 1 : un disque de A vers C, en se servant de B.`;
}

function callNarration(act: Act, which: 1 | 2): string {
  if (which === 1) {
    if (act.n === 3) {
      return `Hanoi(n - 1, de, via, vers) : nouvel appel. Les paramètres de cette frame (${pegs(act)}) vont rester tels quels.`;
    }
    if (act.de === "A") {
      return `Premier sous-appel de Hanoi(2) : Hanoi(1) va s’empiler. Cette frame n = 2 va attendre.`;
    }
    return `Hanoi(1) va s’empiler. Cette frame n = 2 va attendre, comme la précédente.`;
  }
  if (act.n === 3) {
    return `Deuxième Hanoi(2) : de = 'B', vers = 'C', via = 'A'. La pile va regrandir — alors qu’elle venait de redescendre.`;
  }
  if (act.de === "A") {
    return `Deuxième appel récursif de Hanoi(2), pions permutés. Après ça, cette frame pourra se terminer.`;
  }
  return `Dernier appel récursif du programme. Après son return, les frames vont se dépiler jusqu’à Main.`;
}

function moveNarration(act: Act, move: number): string {
  const coup = `${act.de} → ${act.vers}`;
  if (act.n === 1) {
    if (move === 1) {
      return `On va afficher ${coup} (disque 1, coup 1/7). C’est tout le travail de cette frame.`;
    }
    if (move === 3) {
      return `On va afficher ${coup} (coup 3/7). Les 2 petits disques sont maintenant empilés sur B.`;
    }
    if (move === 5) {
      return `On va afficher ${coup} (coup 5/7).`;
    }
    return `On va afficher ${coup} (coup 7/7). Les 3 disques sont sur C.`;
  }
  if (act.n === 3) {
    return `Hanoi(3) est toujours là, inchangée. On va maintenant déplacer le plus grand disque : ${coup} (coup 4/7).`;
  }
  if (move === 2) {
    return `Le premier sous-appel est fini : la frame n = 2 est toujours là. On va déplacer le disque 2 : ${coup} (coup 2/7).`;
  }
  return `La frame n = 2 est toujours là. On va déplacer le disque 2 : ${coup} (coup 6/7).`;
}

function returnNarration(act: Act, movesDone: number): string {
  if (act.n === 1) {
    if (movesDone === 7) {
      return `return : cette frame va disparaître. Plus aucun Hanoi(1).`;
    }
    if (act.de === "C") {
      return `return : cette frame va disparaître. Hanoi(2) a fini ses deux appels.`;
    }
    if (act.de === "B") {
      return `return : Hanoi(1) va disparaître ; Hanoi(2) reprend pour son déplacement.`;
    }
    return `return : pas de valeur. Hanoi(1) va disparaître ; Hanoi(2) reprend juste après l’appel.`;
  }
  if (act.n === 3) {
    return `Plus rien à faire dans Hanoi(3) : les deux tours de 2 disques et le grand déplacement sont faits. On va revenir à Main.`;
  }
  if (act.de === "A") {
    return `Hanoi(2) n’a plus rien à faire : deux sous-appels et le disque 2 sont faits. La frame va disparaître ; Hanoi(3) reprend.`;
  }
  return `Hanoi(2) a fini. La frame va disparaître ; il ne restera plus que Hanoi(3) sous Main.`;
}

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const callStack: Act[] = [];
  const consoleLines: string[] = [];
  let seq = 0;
  let stepN = 0;

  const nSlot = (act: Act) => `slot-hanoi-${act.seq}-n`;
  const frameId = (act: Act) => `frame-hanoi-${act.seq}`;

  function emit(
    highlightLines: number[],
    narration: string,
    extra: Partial<Step> = {},
  ): void {
    steps.push(
      step(`hanoi-${stepN++}`, highlightLines, narration, main([], callStack.map(toFrame)), [], [], {
        consoleLines: [...consoleLines],
        ...extra,
      }),
    );
  }

  function pushAct(n: number, de: Peg, vers: Peg, via: Peg): Act {
    const act: Act = { seq: ++seq, n, de, vers, via };
    callStack.push(act);
    return act;
  }

  function runHanoi(act: Act): void {
    const parent = callStack[callStack.length - 2];
    const { n, de, vers, via } = act;

    emit([0], enterNarration(act, parent, consoleLines.length), {
      highlightExpr: "int n",
      focus: nSlot(act),
    });
    emit([2], testNarration(act, consoleLines.length), {
      highlightExpr: "n == 1",
      focus: nSlot(act),
    });

    if (n === 1) {
      consoleLines.push(`${de} → ${vers}`);
      emit([4], moveNarration(act, consoleLines.length), {
        highlightExpr: 'Console.WriteLine($"{de} → {vers}")',
        focus: nSlot(act),
      });
      emit([5], returnNarration(act, consoleLines.length), {
        highlightExpr: "return",
        focus: frameId(act),
      });
      callStack.pop();
      return;
    }

    emit([7], argNarration(act, 1), {
      highlightExpr: "n - 1",
      focus: nSlot(act),
    });
    const child1 = pushAct(n - 1, de, via, vers);
    emit([7], callNarration(act, 1), {
      highlightExpr: "Hanoi(n - 1, de, via, vers)",
      focus: nSlot(child1),
    });
    runHanoi(child1);

    consoleLines.push(`${de} → ${vers}`);
    emit([8], moveNarration(act, consoleLines.length), {
      highlightExpr: 'Console.WriteLine($"{de} → {vers}")',
      focus: nSlot(act),
    });

    emit([9], argNarration(act, 2), {
      highlightExpr: "n - 1",
      focus: nSlot(act),
    });
    const child2 = pushAct(n - 1, via, vers, de);
    emit([9], callNarration(act, 2), {
      highlightExpr: "Hanoi(n - 1, via, vers, de)",
      focus: nSlot(child2),
    });
    runHanoi(child2);

    emit([10], returnNarration(act, consoleLines.length), { focus: frameId(act) });
    callStack.pop();
  }

  emit(
    [12],
    "Le programme va démarrer. On va suivre Hanoi(3) : trois disques de A vers C, en se servant de B. Chaque appel empile ses propres pions.",
  );
  const root = pushAct(3, "A", "C", "B");
  emit([12], "Hanoi(3, 'A', 'C', 'B') : on va empiler une frame. n va recevoir 3, de = 'A', vers = 'C', via = 'B'.", {
    highlightExpr: "Hanoi(3, 'A', 'C', 'B')",
    focus: nSlot(root),
  });

  runHanoi(root);

  emit(
    [12],
    "Plus aucune frame Hanoi. Main n’a rien à affecter (void) : les 7 déplacements sont dans la console.",
    { highlightExpr: "Hanoi(3, 'A', 'C', 'B')", focus: "frame-main" },
  );
  steps.push(
    step("hanoi-end", [12], MAIN_DONE, main([]), [], [], {
      consoleLines: [...consoleLines],
    }),
  );

  return steps;
}

export const hanoiScenario: Scenario = {
  id: "hanoi",
  title: "Récursion : tours de Hanoï",
  subtitle:
    "Hanoi(3) : deux appels par frame, un déplacement entre les deux, 7 coups à la console.",
  part: "functions",
  code: CODE,
  steps: buildSteps(),
};
