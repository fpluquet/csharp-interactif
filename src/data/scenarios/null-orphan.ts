import type { Scenario } from "../../types/memory";

export const nullOrphanScenario: Scenario = {
  id: "null-orphan",
  title: "null & référence perdue",
  subtitle: "Couper la flèche laisse un objet orphelin — candidat au GC.",
  part: "memory",
  code: [
    "static void Main()",
    "{",
    "    int[] nums = { 1, 2, 3 };",
    "    nums = null;",
    "    // plus aucune référence vers le tableau",
    "}"
  ],
  steps: [
    {
      id: "no0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer. Le heap va démarrer vide.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: []
    },
    {
      id: "no1",
      highlightLines: [
        2
      ],
      narration: "int[] nums = {1,2,3} : un objet va être créé sur le heap, avec une flèche depuis nums.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #F1",
              kind: "ref",
              targetId: "obj-nums"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#F1",
          fields: [
            {
              label: "[0]",
              value: "1"
            },
            {
              label: "[1]",
              value: "2"
            },
            {
              label: "[2]",
              value: "3"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-nums"
        }
      ],
      focus: "obj-nums"
    },
    {
      id: "no2",
      highlightLines: [3],
      highlightExpr: "null",
      narration: "nums = null : on va couper la seule référence vivante.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #F1",
              kind: "ref",
              targetId: "obj-nums"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#F1",
          fields: [
            {
              label: "[0]",
              value: "1"
            },
            {
              label: "[1]",
              value: "2"
            },
            {
              label: "[2]",
              value: "3"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-nums"
        }
      ],
      focus: "slot-nums"
    },
    {
      id: "no3",
      highlightLines: [
        3
      ],
      narration: "La flèche va disparaître. nums va valoir null — plus de lien vers #F1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "null",
              kind: "ref"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#F1",
          orphan: true,
          fields: [
            {
              label: "[0]",
              value: "1"
            },
            {
              label: "[1]",
              value: "2"
            },
            {
              label: "[2]",
              value: "3"
            }
          ]
        }
      ],
      refs: [],
      focus: "obj-nums"
    },
    {
      id: "no4",
      highlightLines: [
        4
      ],
      narration: "Objet orphelin : plus aucune variable ne le référencera. Le GC pourra le récupérer plus tard.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "null",
              kind: "ref"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#F1",
          orphan: true,
          fields: [
            {
              label: "[0]",
              value: "1"
            },
            {
              label: "[1]",
              value: "2"
            },
            {
              label: "[2]",
              value: "3"
            }
          ]
        }
      ],
      refs: [],
      focus: "obj-nums"
    },
    {
      id: "null-orphan-end",
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
              id: "slot-nums",
              name: "nums",
              value: "null",
              kind: "ref"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#F1",
          orphan: true,
          fields: [
            {
              label: "[0]",
              value: "1"
            },
            {
              label: "[1]",
              value: "2"
            },
            {
              label: "[2]",
              value: "3"
            }
          ]
        }
      ],
      refs: []
    }
  ]
};
