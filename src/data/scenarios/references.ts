import type { Scenario } from "../../types/memory";

export const referencesScenario: Scenario = {
  id: "references",
  title: "Types référence & heap",
  subtitle: "La stack garde une adresse ; les données vivent sur le heap.",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    int[] nums = { 1, 2, 3 };",
    "    List<int> notes = new List<int>();",
    "    notes.Add(12);",
    "    string msg = \"Bonjour\";",
    "}"
  ],
  steps: [
    {
      id: "r0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer. Le heap va encore être vide.",
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
      id: "r1",
      highlightLines: [2],
      highlightExpr: "{ 1, 2, 3 }",
      narration: "int[] nums = {1,2,3} : l’objet tableau va être créé sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #A1",
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
          address: "#A1",
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
      id: "r2",
      highlightLines: [2],
      highlightExpr: "nums",
      narration: "Sur la stack, nums ne va pas contenir les éléments — seulement une référence.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #A1",
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
          address: "#A1",
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
      id: "r3",
      highlightLines: [
        3
      ],
      narration: "List<int> notes = new List<int>() : même schéma — référence + objet heap vont être créés.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-nums"
            },
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #B2",
              kind: "ref",
              targetId: "obj-notes"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#A1",
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
        },
        {
          id: "obj-notes",
          typeLabel: "List<int>",
          address: "#B2",
          fields: [
            {
              label: "Count",
              value: "0"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-nums"
        },
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-notes"
        }
      ],
      focus: "obj-notes"
    },
    {
      id: "r4",
      highlightLines: [
        4
      ],
      narration: "notes.Add(12) : on va muter l’objet sur le heap. La référence stack ne va pas changer.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-nums"
            },
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #B2",
              kind: "ref",
              targetId: "obj-notes"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#A1",
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
        },
        {
          id: "obj-notes",
          typeLabel: "List<int>",
          address: "#B2",
          fields: [
            {
              label: "[0]",
              value: "12"
            },
            {
              label: "Count",
              value: "1"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-nums"
        },
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-notes"
        }
      ],
      focus: "obj-notes"
    },
    {
      id: "r5",
      highlightLines: [
        5
      ],
      narration: "string msg = \"Bonjour\" : un objet string va être créé sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-nums",
              name: "nums",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-nums"
            },
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #B2",
              kind: "ref",
              targetId: "obj-notes"
            },
            {
              id: "slot-msg",
              name: "msg",
              value: "→ #C3",
              kind: "ref",
              targetId: "obj-msg"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#A1",
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
        },
        {
          id: "obj-notes",
          typeLabel: "List<int>",
          address: "#B2",
          fields: [
            {
              label: "[0]",
              value: "12"
            },
            {
              label: "Count",
              value: "1"
            }
          ]
        },
        {
          id: "obj-msg",
          typeLabel: "string",
          address: "#C3",
          fields: [
            {
              label: "chars",
              value: "\"Bonjour\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-nums"
        },
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-notes"
        },
        {
          id: "ref-msg",
          fromSlotId: "slot-msg",
          toObjectId: "obj-msg"
        }
      ],
      focus: "obj-msg"
    },
    {
      id: "references-end",
      highlightLines: [
        6
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
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-nums"
            },
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #B2",
              kind: "ref",
              targetId: "obj-notes"
            },
            {
              id: "slot-msg",
              name: "msg",
              value: "→ #C3",
              kind: "ref",
              targetId: "obj-msg"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-nums",
          typeLabel: "int[]",
          address: "#A1",
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
        },
        {
          id: "obj-notes",
          typeLabel: "List<int>",
          address: "#B2",
          fields: [
            {
              label: "[0]",
              value: "12"
            },
            {
              label: "Count",
              value: "1"
            }
          ]
        },
        {
          id: "obj-msg",
          typeLabel: "string",
          address: "#C3",
          fields: [
            {
              label: "chars",
              value: "\"Bonjour\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-nums"
        },
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-notes"
        },
        {
          id: "ref-msg",
          fromSlotId: "slot-msg",
          toObjectId: "obj-msg"
        }
      ]
    }
  ]
};
