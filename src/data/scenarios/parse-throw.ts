import type { Scenario } from "../../types/memory";

export const parseThrowScenario: Scenario = {
  id: "parse-throw",
  title: "Parse qui échoue",
  subtitle: "Parse lance FormatException si le texte est invalide.",
  part: "conversions",
  code: [
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        int n = int.Parse(\"abc\");",
    "    }",
    "    catch (FormatException)",
    "    {",
    "        Console.WriteLine(\"invalide\");",
    "    }",
    "}"
  ],
  steps: [
    {
      id: "pt0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main démarre avec un try/catch.",
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
      id: "pt1",
      highlightLines: [
        4
      ],
      narration: "int.Parse(\"abc\") échoue → FormatException.",
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
        message: "Input string was not in a correct format.",
        phase: "throwing"
      }
    },
    {
      id: "pt2",
      highlightLines: [
        6,
        7,
        8
      ],
      narration: "catch attrape FormatException. Affiche invalide.",
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
        "invalide"
      ],
      exceptionFlow: {
        typeName: "FormatException",
        message: "Input string was not in a correct format.",
        phase: "caught",
        catchMethod: "Main"
      }
    },
    {
      id: "parse-throw-end",
      highlightLines: [
        10
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
        "invalide"
      ]
    }
  ]
};
