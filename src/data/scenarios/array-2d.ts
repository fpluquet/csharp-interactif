import type { Scenario } from "../../types/memory";

export const array2dScenario: Scenario = {
  id: "array-2d",
  title: "Tableau 2D",
  subtitle: "Une matrice : accès [ligne, colonne].",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    int[,] m = { { 1, 2 }, { 3, 4 } };",
    "    int v = m[1, 0];",
    "    Console.WriteLine(v);",
    "}"
  ],
  steps: [
    {
      id: "a2d0",
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
      id: "a2d1",
      highlightLines: [
        2
      ],
      narration: "Une matrice 2×2 va être créée sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-m",
              name: "m",
              value: "→ #M1",
              kind: "ref",
              targetId: "obj-m"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-m",
          typeLabel: "int[,]",
          address: "#M1",
          fields: [
            {
              label: "[0,0]",
              value: "1"
            },
            {
              label: "[0,1]",
              value: "2"
            },
            {
              label: "[1,0]",
              value: "3"
            },
            {
              label: "[1,1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-m",
          fromSlotId: "slot-m",
          toObjectId: "obj-m"
        }
      ],
      consoleLines: []
    },
    {
      id: "a2d2",
      highlightLines: [
        3
      ],
      narration: "m[1,0] va copier 3 dans v.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-m",
              name: "m",
              value: "→ #M1",
              kind: "ref",
              targetId: "obj-m"
            },
            {
              id: "slot-v",
              name: "v",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-m",
          typeLabel: "int[,]",
          address: "#M1",
          fields: [
            {
              label: "[0,0]",
              value: "1"
            },
            {
              label: "[0,1]",
              value: "2"
            },
            {
              label: "[1,0]",
              value: "3"
            },
            {
              label: "[1,1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-m",
          fromSlotId: "slot-m",
          toObjectId: "obj-m"
        }
      ],
      focus: "slot-v",
      consoleLines: []
    },
    {
      id: "a2d3",
      highlightLines: [
        4
      ],
      narration: "On va afficher 3.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-m",
              name: "m",
              value: "→ #M1",
              kind: "ref",
              targetId: "obj-m"
            },
            {
              id: "slot-v",
              name: "v",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-m",
          typeLabel: "int[,]",
          address: "#M1",
          fields: [
            {
              label: "[0,0]",
              value: "1"
            },
            {
              label: "[0,1]",
              value: "2"
            },
            {
              label: "[1,0]",
              value: "3"
            },
            {
              label: "[1,1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-m",
          fromSlotId: "slot-m",
          toObjectId: "obj-m"
        }
      ],
      consoleLines: [
        "3"
      ]
    },
    {
      id: "array-2d-end",
      highlightLines: [
        5
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-m",
              name: "m",
              value: "→ #M1",
              kind: "ref",
              targetId: "obj-m"
            },
            {
              id: "slot-v",
              name: "v",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-m",
          typeLabel: "int[,]",
          address: "#M1",
          fields: [
            {
              label: "[0,0]",
              value: "1"
            },
            {
              label: "[0,1]",
              value: "2"
            },
            {
              label: "[1,0]",
              value: "3"
            },
            {
              label: "[1,1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-m",
          fromSlotId: "slot-m",
          toObjectId: "obj-m"
        }
      ],
      consoleLines: [
        "3"
      ]
    }
  ]
};
