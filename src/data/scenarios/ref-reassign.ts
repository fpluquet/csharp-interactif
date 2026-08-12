import type { Scenario } from "../../types/memory";

export const refReassignScenario: Scenario = {
  id: "ref-reassign",
  title: "Réaffectation de référence",
  subtitle: "Partager un objet, puis pointer ailleurs — l’autre référence ne change pas.",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    int[] a = { 1 };",
    "    int[] b = a;",
    "    b[0] = 9;",
    "    b = new int[] { 2 };",
    "    // a[0] vaut encore 9",
    "}"
  ],
  steps: [
    {
      id: "rr0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main démarre. On va distinguer partage et réaffectation.",
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
      id: "rr1",
      highlightLines: [
        2
      ],
      narration: "int[] a = {1} : tableau sur le heap, a pointe vers #E1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "1"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        }
      ],
      focus: "obj-e1"
    },
    {
      id: "rr2",
      highlightLines: [
        3
      ],
      narration: "int[] b = a : on copie la référence. a et b pointent vers le même objet.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "1"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-e1"
        }
      ],
      focus: "slot-b"
    },
    {
      id: "rr3",
      highlightLines: [
        4
      ],
      narration: "b[0] = 9 : mutation du heap. a voit aussi 9 — même objet.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "9"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-e1"
        }
      ],
      focus: "obj-e1"
    },
    {
      id: "rr4",
      highlightLines: [
        5
      ],
      narration: "b = new int[]{2} : un nouvel objet #E2 apparaît sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "9"
            }
          ]
        },
        {
          id: "obj-e2",
          typeLabel: "int[]",
          address: "#E2",
          fields: [
            {
              label: "[0]",
              value: "2"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-e1"
        }
      ],
      focus: "obj-e2"
    },
    {
      id: "rr5",
      highlightLines: [
        5
      ],
      narration: "Seule la flèche de b change vers #E2. a reste sur #E1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #E2",
              kind: "ref",
              targetId: "obj-e2"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "9"
            }
          ]
        },
        {
          id: "obj-e2",
          typeLabel: "int[]",
          address: "#E2",
          fields: [
            {
              label: "[0]",
              value: "2"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-e2"
        }
      ],
      focus: "slot-b"
    },
    {
      id: "rr6",
      highlightLines: [
        6
      ],
      narration: "a[0] vaut encore 9. Réaffecter b ≠ muter l’objet partagé.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #E2",
              kind: "ref",
              targetId: "obj-e2"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "9"
            }
          ]
        },
        {
          id: "obj-e2",
          typeLabel: "int[]",
          address: "#E2",
          fields: [
            {
              label: "[0]",
              value: "2"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-e2"
        }
      ],
      focus: "slot-a"
    },
    {
      id: "ref-reassign-end",
      highlightLines: [
        7
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e1"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #E2",
              kind: "ref",
              targetId: "obj-e2"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e1",
          typeLabel: "int[]",
          address: "#E1",
          fields: [
            {
              label: "[0]",
              value: "9"
            }
          ]
        },
        {
          id: "obj-e2",
          typeLabel: "int[]",
          address: "#E2",
          fields: [
            {
              label: "[0]",
              value: "2"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-e1"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-e2"
        }
      ]
    }
  ]
};
