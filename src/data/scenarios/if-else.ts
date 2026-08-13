import type { Scenario } from "../../types/memory";

export const ifElseScenario: Scenario = {
  id: "if-else",
  title: "if / else",
  subtitle: "Une condition true exécute le bloc if.",
  part: "control",
  code: [
    "static void Main()",
    "{",
    "    int age = 20;",
    "    if (age >= 18)",
    "    {",
    "        Console.WriteLine(\"majeur\");",
    "    }",
    "    else",
    "    {",
    "        Console.WriteLine(\"mineur\");",
    "    }",
    "}"
  ],
  steps: [
    {
      id: "ie0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer.",
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
      id: "ie1",
      highlightLines: [
        2
      ],
      narration: "age va valoir 20.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: []
    },
    {
      id: "ie2",
      highlightLines: [
        3
      ],
      highlightExpr: "age >= 18",
      narration: "age >= 18 → true : on va entrer dans le if.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: []
    },
    {
      id: "ie3",
      highlightLines: [
        5
      ],
      narration: "Branche if : on va afficher majeur. Le else va être ignoré.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "majeur"
      ]
    },
    {
      id: "if-else-end",
      highlightLines: [
        11
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "majeur"
      ]
    }
  ]
};
