import type { Scenario } from "../../types/memory";

export const exceptionFinallyScenario: Scenario = {
  id: "exception-finally",
  title: "finally",
  subtitle: "finally s'exécute toujours, après catch ou non.",
  part: "exceptions",
  code: [
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        throw new Exception(\"x\");",
    "    }",
    "    catch",
    "    {",
    "        Console.WriteLine(\"catch\");",
    "    }",
    "    finally",
    "    {",
    "        Console.WriteLine(\"finally\");",
    "    }",
    "}"
  ],
  steps: [
    {
      id: "ef0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main démarre.",
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
      highlightLines: [
        4
      ],
      narration: "throw : exception levée.",
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
      id: "ef2",
      highlightLines: [
        6,
        8
      ],
      narration: "catch s'exécute.",
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
      id: "ef3",
      highlightLines: [
        10,
        12
      ],
      narration: "finally s'exécute ensuite — toujours.",
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
        14
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
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
