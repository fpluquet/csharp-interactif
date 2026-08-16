import type { Scenario } from "../../types/memory";

export const ifElseScenario: Scenario = {
  id: "if-else",
  title: "if / else",
  subtitle: "Une condition true exécute le bloc if.",
  part: "control",
  code: [
    "int age = 20;",
    "if (age >= 18)",
    "{",
    "    Console.WriteLine(\"majeur\");",
    "}",
    "else",
    "{",
    "    Console.WriteLine(\"mineur\");",
    "}"
  ],
  steps: [
    {
      id: "ie0",
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
      id: "ie1",
      highlightLines: [
        0
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
        1
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
        3
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
        8
      ],
      narration: "Le programme va s'arrêter.",
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
