import type { Scenario } from "../../types/memory";

export const arithmeticAssignScenario: Scenario = {
  id: "arithmetic-assign",
  title: "Arithmétique & affectation",
  subtitle: "+= et ++ modifient la case sur la stack.",
  part: "operators",
  code: [
    "static void Main()",
    "{",
    "    int n = 5;",
    "    n += 3;",
    "    n++;",
    "    Console.WriteLine(n);",
    "}"
  ],
  steps: [
    {
      id: "aa0",
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
      id: "aa1",
      highlightLines: [
        2
      ],
      narration: "int n = 5.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n",
      consoleLines: []
    },
    {
      id: "aa2",
      highlightLines: [
        3
      ],
      narration: "n += 3 → n vaut 8.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "8",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n",
      consoleLines: []
    },
    {
      id: "aa3",
      highlightLines: [
        4
      ],
      narration: "n++ : post-incrément, n devient 9.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "9",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n",
      consoleLines: []
    },
    {
      id: "aa4",
      highlightLines: [
        5
      ],
      narration: "Console.WriteLine(n) affiche 9.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "9",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "9"
      ]
    },
    {
      id: "arithmetic-assign-end",
      highlightLines: [
        6
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "9",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "9"
      ]
    }
  ]
};
