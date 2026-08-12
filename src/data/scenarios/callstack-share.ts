import type { Scenario } from "../../types/memory";

export const callstackShareScenario: Scenario = {
  id: "callstack-share",
  title: "Call stack & partage",
  subtitle: "Appel de méthode : nouvelle frame, même objet heap.",
  part: "memory",
  code: [
    "static void Incrementer(int[] t)",
    "{",
    "    t[0] = t[0] + 1;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int[] scores = { 10, 20 };",
    "    Incrementer(scores);",
    "    // scores[0] vaut 11",
    "}"
  ],
  steps: [
    {
      id: "c0",
      highlightLines: [
        5,
        6
      ],
      narration: "On démarre dans Main. Une seule frame sur la stack.",
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
      id: "c1",
      highlightLines: [
        7
      ],
      narration: "int[] scores = {10, 20} : tableau sur le heap, référence sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "10"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        }
      ],
      focus: "obj-scores"
    },
    {
      id: "c2",
      highlightLines: [
        8
      ],
      narration: "Incrementer(scores) : on appelle la méthode — une nouvelle frame va s’empiler.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "10"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        }
      ],
      focus: "frame-main"
    },
    {
      id: "c3",
      highlightLines: [
        0,
        1
      ],
      narration: "Frame Incrementer empilée. Le paramètre t reçoit une copie de la référence.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        },
        {
          id: "frame-inc",
          method: "Incrementer",
          slots: [
            {
              id: "slot-t",
              name: "t",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "10"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        },
        {
          id: "ref-t",
          fromSlotId: "slot-t",
          toObjectId: "obj-scores"
        }
      ],
      focus: "frame-inc"
    },
    {
      id: "c4",
      highlightLines: [
        0,
        1
      ],
      narration: "scores et t pointent vers le même objet. Deux flèches, un seul tableau.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        },
        {
          id: "frame-inc",
          method: "Incrementer",
          slots: [
            {
              id: "slot-t",
              name: "t",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "10"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        },
        {
          id: "ref-t",
          fromSlotId: "slot-t",
          toObjectId: "obj-scores"
        }
      ],
      focus: "obj-scores"
    },
    {
      id: "c5",
      highlightLines: [
        2
      ],
      narration: "t[0] = t[0] + 1 : on mute le heap. Les deux références voient le changement.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        },
        {
          id: "frame-inc",
          method: "Incrementer",
          slots: [
            {
              id: "slot-t",
              name: "t",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "11"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        },
        {
          id: "ref-t",
          fromSlotId: "slot-t",
          toObjectId: "obj-scores"
        }
      ],
      focus: "obj-scores"
    },
    {
      id: "c6",
      highlightLines: [
        3
      ],
      narration: "Fin de Incrementer : la frame se dépile. Le tableau modifié reste sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "11"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        }
      ],
      focus: "frame-main"
    },
    {
      id: "c7",
      highlightLines: [
        9
      ],
      narration: "De retour dans Main : scores[0] vaut 11. Partage = mutation visible.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "11"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        }
      ],
      focus: "slot-scores"
    },
    {
      id: "callstack-share-end",
      highlightLines: [
        10
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-scores",
              name: "scores",
              value: "→ #D4",
              kind: "ref",
              targetId: "obj-scores"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-scores",
          typeLabel: "int[]",
          address: "#D4",
          fields: [
            {
              label: "[0]",
              value: "11"
            },
            {
              label: "[1]",
              value: "20"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-scores",
          fromSlotId: "slot-scores",
          toObjectId: "obj-scores"
        }
      ]
    }
  ]
};
