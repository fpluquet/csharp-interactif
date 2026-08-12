import type { Scenario } from "../../types/memory";

export const multiCatchScenario: Scenario = {
  id: "multi-catch",
  title: "Multi-catch",
  subtitle: "Le catch le plus spécifique doit venir en premier.",
  part: "exceptions",
  code: [
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        int.Parse(\"x\");",
    "    }",
    "    catch (FormatException)",
    "    {",
    "        Console.WriteLine(\"format\");",
    "    }",
    "    catch (Exception)",
    "    {",
    "        Console.WriteLine(\"autre\");",
    "    }",
    "}"
  ],
  steps: [
    {
      id: "mc0",
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
      id: "mc1",
      highlightLines: [
        4
      ],
      narration: "Parse(\"x\") → FormatException.",
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
      id: "mc2",
      highlightLines: [
        6,
        8
      ],
      narration: "Premier catch compatible : FormatException. Le catch Exception n'est pas atteint.",
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
        "format"
      ]
    }
  ]
};
