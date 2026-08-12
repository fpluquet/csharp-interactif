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
      id: "ie1",
      highlightLines: [
        2
      ],
      narration: "age = 20.",
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
      narration: "age >= 18 → true : on entre dans le if.",
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
      narration: "Branche if : affiche majeur. Le else est ignoré.",
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
      narration: "La fonction Main est terminée, le programme s'arrête.",
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
