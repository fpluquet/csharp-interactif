import type { HeapObject, Scenario, StackFrame, StackSlot, Step } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step } from "./ooHelpers";

const CODE = [
  "void Lancer()",
  "{",
  '    throw new InvalidOperationException("boom");',
  "}",
  "",
  "void Transmettre()",
  "{",
  "    Lancer();",
  "}",
  "",
  "void Relayer()",
  "{",
  "    try",
  "    {",
  "        Transmettre();",
  "    }",
  "    catch (InvalidOperationException ex)",
  "    {",
  '        Console.WriteLine("relais");',
  "        throw;",
  "    }",
  "}",
  "",
  "try",
  "{",
  "    Relayer();",
  "}",
  "catch (InvalidOperationException ex)",
  "{",
  "    Console.WriteLine(ex.Message);",
  "}",
];

const lancer = frame("frame-lancer", "Lancer", []);
const transmettre = frame("frame-transmettre", "Transmettre", []);
const relayer = frame("frame-relayer", "Relayer", []);
const exSlotRelayer = refSlot("slot-ex-relayer", "ex", "#EX1", "obj-ex");
const exSlotMain = refSlot("slot-ex-main", "ex", "#EX1", "obj-ex");
const relayerCatch = frame("frame-relayer", "Relayer", [exSlotRelayer]);

const exObj: HeapObject = obj("obj-ex", "InvalidOperationException", "#EX1", [
  { label: "Message", value: '"boom"' },
]);
const exOrphan: HeapObject = { ...exObj, orphan: true };
const refRelayer = link("ref-ex-relayer", "slot-ex-relayer", "obj-ex");
const refMain = link("ref-ex-main", "slot-ex-main", "obj-ex");

function stk(...extra: StackFrame[]) {
  return main([], extra);
}

function stkMain(slots: StackSlot[], extra: StackFrame[] = []) {
  return main(slots, extra);
}

function flow(
  phase: "throwing" | "unwinding" | "caught",
  catchMethod?: string,
): Partial<Step> {
  return {
    exceptionFlow: {
      typeName: "InvalidOperationException",
      message: "boom",
      phase,
      ...(catchMethod ? { catchMethod } : {}),
    },
  };
}

export const exceptionRethrowScenario: Scenario = {
  id: "exception-rethrow",
  title: "try / catch empilés",
  subtitle:
    "Lancer throw, Transmettre laisse courir, Relayer catch + throw;, Main rattrape.",
  part: "exceptions",
  code: CODE,
  steps: [
    step("er0", [23], "Le programme va démarrer. Trois frames vont s’empiler ; l’exception va remonter en plusieurs étapes.", stk(), [], []),
    step("er1", [23, 24, 25], "On va entrer dans le try de Main. Relayer() va être appelé.", stk(), [], [], {
      focus: "frame-main",
    }),
    step("er2", [25], "Relayer() : une frame va s’empiler. Main va attendre dans son try.", stk(relayer), [], [], {
      highlightExpr: "Relayer()",
      focus: "frame-relayer",
    }),
    step("er3", [12, 13, 14], "Relayer a aussi un try. Transmettre() va être appelé.", stk(relayer), [], [], {
      focus: "frame-relayer",
    }),
    step(
      "er4",
      [14],
      "Transmettre() : nouvelle frame. Relayer reste en attente dans son try.",
      stk(relayer, transmettre),
      [],
      [],
      { highlightExpr: "Transmettre()", focus: "frame-transmettre" },
    ),
    step(
      "er5",
      [7],
      "Lancer() : troisième frame. Transmettre n’a pas de try : si ça plante, ça va juste remonter.",
      stk(relayer, transmettre, lancer),
      [],
      [],
      { highlightExpr: "Lancer()", focus: "frame-lancer" },
    ),
    step(
      "er6",
      [2],
      'throw new InvalidOperationException("boom") : l’exception va être levée dans Lancer.',
      stk(relayer, transmettre, lancer),
      [],
      [],
      { highlightExpr: 'throw new InvalidOperationException("boom")', focus: "frame-lancer", ...flow("throwing") },
    ),
    step(
      "er7",
      [2],
      "Aucun catch dans Lancer : sa frame va être dépilée. L’exception continue.",
      stk(relayer, transmettre),
      [],
      [],
      { focus: "frame-transmettre", ...flow("unwinding") },
    ),
    step(
      "er8",
      [7],
      "Transmettre n’a pas de catch non plus : on laisse courir. Sa frame va disparaître.",
      stk(relayer),
      [],
      [],
      { focus: "frame-relayer", ...flow("unwinding") },
    ),
    step(
      "er9",
      [16, 17],
      "Relayer a un catch compatible : l’exception va être attrapée. ex pointe vers #EX1. La stack se stabilise.",
      stk(relayerCatch),
      [exObj],
      [refRelayer],
      { focus: "obj-ex", ...flow("caught", "Relayer") },
    ),
    step(
      "er10",
      [18],
      "On va afficher relais — un log, puis on va relancer la même exception.",
      stk(relayerCatch),
      [exObj],
      [refRelayer],
      { highlightExpr: 'Console.WriteLine("relais")', consoleLines: ["relais"], focus: "slot-ex-relayer" },
    ),
    step(
      "er11",
      [19],
      "throw; (sans new) : on va relancer le même objet #EX1, pas une copie. Relayer ne l’a pas « réglée ».",
      stk(relayerCatch),
      [exObj],
      [refRelayer],
      { highlightExpr: "throw;", focus: "obj-ex", consoleLines: ["relais"], ...flow("throwing") },
    ),
    step(
      "er12",
      [19],
      "Relayer a fini son catch : sa frame va être dépilée. #EX1 n’a plus de variable, l’exception remonte vers Main.",
      stk(),
      [exOrphan],
      [],
      { focus: "frame-main", consoleLines: ["relais"], ...flow("unwinding") },
    ),
    step(
      "er13",
      [27, 28],
      "Main rattrape : catch compatible. ex va pointer vers le même #EX1. Le programme ne va pas s’arrêter.",
      stkMain([exSlotMain]),
      [exObj],
      [refMain],
      { focus: "obj-ex", consoleLines: ["relais"], ...flow("caught", "Main") },
    ),
    step(
      "er14",
      [29],
      "On va afficher ex.Message : boom. Le relais a déjà écrit dans la console au-dessus.",
      stkMain([exSlotMain]),
      [exObj],
      [refMain],
      { highlightExpr: "ex.Message", consoleLines: ["relais", "boom"], focus: "slot-ex-main" },
    ),
    step(
      "er15",
      [30],
      "Après le catch de Main, l’exécution reprend. Les frames Relayer / Transmettre / Lancer sont parties depuis longtemps.",
      stk(),
      [],
      [],
      { consoleLines: ["relais", "boom"], focus: "frame-main" },
    ),
    step("exception-rethrow-end", [30], MAIN_DONE, stk(), [], [], {
      consoleLines: ["relais", "boom"],
    }),
  ],
};
