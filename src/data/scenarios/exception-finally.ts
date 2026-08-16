import type { Scenario } from "../../types/memory";

export const exceptionFinallyScenario: Scenario = {
  id: "exception-finally",
  title: "finally",
  subtitle: "finally s'exécute toujours, après catch ou non.",
  part: "exceptions",
  code: [
    "try",
    "{",
    "    throw new Exception(\"x\");",
    "}",
    "catch",
    "{",
    "    Console.WriteLine(\"catch\");",
    "}",
    "finally",
    "{",
    "    Console.WriteLine(\"finally\");",
    "}"
  ],
  steps: [
    {
      id: "ef0",
      highlightLines: [
        0
      ],
      narration: "Le programme va démarrer.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      consoleLines: []
    },
    {
      id: "ef1",
      highlightLines: [0, 1],
      narration: "On va entrer dans le try. catch et finally attendent.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      consoleLines: []
    },
    {
      id: "ef2",
      highlightLines: [
        2
      ],
      highlightExpr: "throw new Exception(\"x\")",
      narration: "throw : une exception va être levée.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [],
      exceptionFlow: {
        typeName: "Exception",
        message: "x",
        phase: "throwing"
      }
    },
    {
      id: "ef3",
      highlightLines: [
        4,
        6
      ],
      narration: "catch va s'exécuter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "catch"
      ],
      exceptionFlow: {
        typeName: "Exception",
        message: "x",
        phase: "caught",
        catchMethod: "Main"
      }
    },
    {
      id: "ef4",
      highlightLines: [
        8,
        10
      ],
      narration: "finally va s'exécuter ensuite — toujours.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "catch",
        "finally"
      ]
    },
    {
      id: "exception-finally-end",
      highlightLines: [
        11
      ],
      narration: "Le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "catch",
        "finally"
      ]
    }
  ]
};
