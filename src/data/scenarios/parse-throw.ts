import type { Scenario } from "../../types/memory";

export const parseThrowScenario: Scenario = {
  id: "parse-throw",
  title: "Parse qui échoue",
  subtitle: "Parse lance FormatException si le texte est invalide.",
  part: "conversions",
  code: [
    "try",
    "{",
    "    int n = int.Parse(\"abc\");",
    "}",
    "catch (FormatException)",
    "{",
    "    Console.WriteLine(\"invalide\");",
    "}"
  ],
  steps: [
    {
      id: "pt0",
      highlightLines: [
        0
      ],
      narration: "Le programme va démarrer avec un try/catch.",
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
        0,
        1
      ],
      narration: "On va entrer dans le try. Le catch attend, au cas où.",
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
      id: "pt2",
      highlightLines: [
        2
      ],
      narration: "int n = int.Parse(\"abc\") : on va appeler Parse. n n’existe pas encore.",
      highlightExpr: "int.Parse(\"abc\")",
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
      id: "pt3",
      highlightLines: [
        2
      ],
      highlightExpr: "int.Parse(\"abc\")",
      narration: "\"abc\" n’est pas un entier : Parse va lever une FormatException. n ne sera pas créée.",
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
      id: "pt4",
      highlightLines: [
        4,
        5,
        6
      ],
      narration: "catch va attraper FormatException. Console va afficher invalide.",
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
        7
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
        "invalide"
      ]
    }
  ]
};
