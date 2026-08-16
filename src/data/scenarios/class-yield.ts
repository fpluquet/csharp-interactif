import type { HeapObject, LoopFlow, Scenario, StackSlot } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

function enumerateur(current: string, etat: string): HeapObject {
  return obj("obj-it", "IEnumerator<int>", "#I1", [
    { label: "Current", value: current },
    { label: "état", value: etat },
  ]);
}

const e = refSlot("slot-e", "e", "#I1", "obj-it", "IEnumerator<int>");
const refs = [link("ref-e", "slot-e", "obj-it")];

function nSlot(value: string): StackSlot {
  return {
    id: "slot-n",
    name: "n",
    value,
    kind: "value",
    scopeDepth: 1,
    scopeLabel: "foreach",
  };
}

const pairesDebut = frame("frame-paires", "Paires", [
  val("slot-reprise", "repris à", "le début"),
]);
const pairesApres2 = frame("frame-paires", "Paires", [
  val("slot-reprise", "repris à", "après 2"),
]);
const pairesApres4 = frame("frame-paires", "Paires", [
  val("slot-reprise", "repris à", "après 4"),
]);

function foreachTest(ok: boolean, detail: string, iteration?: number): LoopFlow {
  return {
    kind: "foreach",
    phase: ok ? "test" : "done",
    condition: "MoveNext() ?",
    conditionResult: ok,
    detail,
    ...(iteration ? { iteration } : {}),
  };
}

function foreachBody(iteration: number, detail: string): LoopFlow {
  return { kind: "foreach", phase: "body", iteration, detail };
}

export const classYieldScenario: Scenario = {
  id: "class-yield",
  title: "yield return",
  subtitle:
    "Paires() crée un itérateur : chaque MoveNext reprend, yield return donne une valeur et met en pause.",
  part: "oo-advanced",
  code: [
    "IEnumerable<int> Paires()",
    "{",
    "    yield return 2;",
    "    yield return 4;",
    "}",
    "",
    "foreach (int n in Paires())",
    "    Console.WriteLine(n);",
  ],
  steps: [
    step(
      "y0",
      [6],
      "Le programme va démarrer. On va voir qu’un yield ne construit pas toute la séquence d’un coup.",
      main([]),
      [],
      [],
    ),
    step(
      "y-call",
      [6],
      "foreach (in Paires()) : on va d’abord appeler Paires(). Ce n’est pas un return de 2 puis 4 tout de suite.",
      main([]),
      [],
      [],
      { highlightExpr: "Paires()", focus: "frame-main" },
    ),
    step(
      "y-create",
      [6],
      "Paires() va renvoyer un itérateur sur le heap. Le corps n’a pas tourné : pas de yield, Current vide, état = départ. foreach le garde en coulisse (e).",
      main([e]),
      [enumerateur("∅", "départ")],
      refs,
      { highlightExpr: "Paires()", focus: "obj-it" },
    ),
    step(
      "y-move1",
      [6],
      "foreach va demander le premier élément : MoveNext() sur le même itérateur.",
      main([e]),
      [enumerateur("∅", "départ")],
      refs,
      { highlightExpr: "foreach (int n in Paires())", focus: "obj-it" },
    ),
    step(
      "y-run1",
      [2],
      "MoveNext reprend Paires depuis le début. Une frame Paires va s’empiler, jusqu’au premier yield.",
      main([e], [pairesDebut]),
      [enumerateur("∅", "départ")],
      refs,
      { highlightExpr: "yield return 2", focus: "frame-paires" },
    ),
    step(
      "y-yield2",
      [2],
      "yield return 2 : ce n’est pas un return définitif. Current va valoir 2, Paires se suspend ici. La frame disparaît, l’itérateur garde le marque-page.",
      main([e]),
      [enumerateur("2", "suspendu après 2")],
      refs,
      { highlightExpr: "yield return 2", focus: "obj-it" },
    ),
    step(
      "y-n1",
      [6],
      "MoveNext a renvoyé true. foreach copie Current dans n : n va valoir 2.",
      main([e, nSlot("2")]),
      [enumerateur("2", "suspendu après 2")],
      refs,
      {
        highlightExpr: "int n",
        focus: "slot-n",
        loopFlow: foreachTest(true, "n = 2", 1),
      },
    ),
    step(
      "y-write1",
      [7],
      "Corps du foreach (tour 1) : on va afficher 2. Paires reste en pause — on n’a pas encore exécuté yield return 4.",
      main([e, nSlot("2")]),
      [enumerateur("2", "suspendu après 2")],
      refs,
      {
        consoleLines: ["2"],
        loopFlow: foreachBody(1, "WriteLine(2)"),
      },
    ),
    step(
      "y-move2",
      [6],
      "Tour suivant : foreach va rappeler MoveNext sur le même e. On ne recrée pas Paires().",
      main([e, nSlot("2")]),
      [enumerateur("2", "suspendu après 2")],
      refs,
      {
        highlightExpr: "foreach (int n in Paires())",
        focus: "obj-it",
        consoleLines: ["2"],
      },
    ),
    step(
      "y-run2",
      [3],
      "MoveNext reprend Paires juste après le yield 2 — pas au début. La frame revient, Current vaut encore 2.",
      main([e, nSlot("2")], [pairesApres2]),
      [enumerateur("2", "suspendu après 2")],
      refs,
      {
        highlightExpr: "yield return 4",
        focus: "frame-paires",
        consoleLines: ["2"],
      },
    ),
    step(
      "y-yield4",
      [3],
      "yield return 4 : Current va passer à 4, Paires se suspend à nouveau. Toujours le même objet #I1.",
      main([e, nSlot("2")]),
      [enumerateur("4", "suspendu après 4")],
      refs,
      {
        highlightExpr: "yield return 4",
        focus: "obj-it",
        consoleLines: ["2"],
      },
    ),
    step(
      "y-n2",
      [6],
      "true encore : n va être mis à jour avec Current → 4.",
      main([e, nSlot("4")]),
      [enumerateur("4", "suspendu après 4")],
      refs,
      {
        highlightExpr: "int n",
        focus: "slot-n",
        loopFlow: foreachTest(true, "n = 4", 2),
        consoleLines: ["2"],
      },
    ),
    step(
      "y-write2",
      [7],
      "Corps (tour 2) : on va afficher 4.",
      main([e, nSlot("4")]),
      [enumerateur("4", "suspendu après 4")],
      refs,
      {
        consoleLines: ["2", "4"],
        loopFlow: foreachBody(2, "WriteLine(4)"),
      },
    ),
    step(
      "y-move3",
      [6],
      "foreach va demander un troisième élément : encore MoveNext, toujours le même itérateur.",
      main([e, nSlot("4")]),
      [enumerateur("4", "suspendu après 4")],
      refs,
      {
        highlightExpr: "foreach (int n in Paires())",
        focus: "obj-it",
        consoleLines: ["2", "4"],
      },
    ),
    step(
      "y-run3",
      [4],
      "Paires reprend après le yield 4. Il n’y a plus d’instruction : la méthode va se terminer.",
      main([e, nSlot("4")], [pairesApres4]),
      [enumerateur("4", "suspendu après 4")],
      refs,
      { focus: "frame-paires", consoleLines: ["2", "4"] },
    ),
    step(
      "y-false",
      [6],
      "Plus de yield : MoveNext va renvoyer false. L’itérateur est terminé. foreach ne va pas refaire le corps.",
      main([e, nSlot("4")]),
      [enumerateur("4", "terminé")],
      refs,
      {
        highlightExpr: "foreach (int n in Paires())",
        focus: "obj-it",
        loopFlow: foreachTest(false, "épuisé"),
        consoleLines: ["2", "4"],
      },
    ),
    step(
      "y-done",
      [6],
      "On quitte le foreach. n (portée de boucle) et l’itérateur n’ont plus besoin de rester.",
      main([]),
      [],
      [],
      {
        loopFlow: { kind: "foreach", phase: "done", condition: "MoveNext() ?", conditionResult: false },
        consoleLines: ["2", "4"],
      },
    ),
    step("class-yield-end", [7], MAIN_DONE, main([]), [], [], { consoleLines: ["2", "4"] }),
  ],
};
