import type { Scenario } from "../../types/memory";

export const multiCatchScenario: Scenario = {
  id: "multi-catch",
  title: "Multi-catch",
  subtitle: "Le catch le plus spécifique doit venir en premier.",
  part: "exceptions",
  code: [
    "try",
    "{",
    "    int.Parse(\"x\");",
    "}",
    "catch (FormatException)",
    "{",
    "    Console.WriteLine(\"format\");",
    "}",
    "catch (Exception)",
    "{",
    "    Console.WriteLine(\"autre\");",
    "}"
  ],
  steps: [
    {
      id: "mc0",
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
      id: "mc1",
      highlightLines: [0, 1],
      narration: "On va entrer dans le try. Deux catch sont prêts, du plus spécifique au plus général.",
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
      id: "mc2",
      highlightLines: [2],
      highlightExpr: "int.Parse(\"x\")",
      narration: "int.Parse(\"x\") : on va appeler Parse.",
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
      id: "mc3",
      highlightLines: [
        2
      ],
      highlightExpr: "int.Parse(\"x\")",
      narration: "Parse(\"x\") va lever une FormatException.",
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
        typeName: "FormatException",
        message: "bad format",
        phase: "throwing"
      }
    },
    {
      id: "mc4",
      highlightLines: [
        4,
        6
      ],
      narration: "Premier catch compatible : FormatException. Le catch Exception ne sera pas atteint.",
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
        "format"
      ],
      exceptionFlow: {
        typeName: "FormatException",
        message: "bad format",
        phase: "caught",
        catchMethod: "Main"
      }
    },
    {
      id: "multi-catch-end",
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
        "format"
      ]
    }
  ]
};
