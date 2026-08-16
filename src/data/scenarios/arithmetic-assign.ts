import type { Scenario } from "../../types/memory";

export const arithmeticAssignScenario: Scenario = {
  id: "arithmetic-assign",
  title: "Arithmétique & affectation",
  subtitle: "+= et ++ modifient la case sur la stack.",
  part: "operators",
  code: [
    "int n = 5;",
    "n += 3;",
    "n++;",
    "Console.WriteLine(n);"
  ],
  steps: [
    {
      id: "aa0",
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
      id: "aa1",
      highlightLines: [
        0
      ],
      narration: "int n = 5 : la valeur 5 va être stockée sur la stack.",
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
        1
      ],
      narration: "n += 3 : n va valoir 8.",
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
        2
      ],
      narration: "n++ : post-incrément, n va devenir 9.",
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
        3
      ],
      narration: "Console.WriteLine(n) : on va afficher 9.",
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
        3
      ],
      narration: "Le programme va s'arrêter.",
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
