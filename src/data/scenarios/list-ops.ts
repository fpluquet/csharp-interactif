import type { Scenario } from "../../types/memory";

export const listOpsScenario: Scenario = {
  id: "list-ops",
  title: "List Add & Count",
  subtitle: "Add fait grandir la liste ; Count suit le nombre d'éléments.",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    List<int> notes = new List<int>();",
    "    notes.Add(12);",
    "    notes.Add(15);",
    "    int n = notes.Count;",
    "}"
  ],
  steps: [
    {
      id: "lo0",
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
      refs: []
    },
    {
      id: "lo1",
      highlightLines: [
        2
      ],
      narration: "new List<int>() : liste vide sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #L1",
              kind: "ref",
              targetId: "obj-l"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-l",
          typeLabel: "List<int>",
          address: "#L1",
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
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-l"
        }
      ]
    },
    {
      id: "lo2",
      highlightLines: [
        3
      ],
      narration: "Add(12).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #L1",
              kind: "ref",
              targetId: "obj-l"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-l",
          typeLabel: "List<int>",
          address: "#L1",
          fields: [
            {
              label: "Count",
              value: "1"
            },
            {
              label: "[0]",
              value: "12"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-l"
        }
      ],
      focus: "obj-l"
    },
    {
      id: "lo3",
      highlightLines: [
        4
      ],
      narration: "Add(15).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #L1",
              kind: "ref",
              targetId: "obj-l"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-l",
          typeLabel: "List<int>",
          address: "#L1",
          fields: [
            {
              label: "Count",
              value: "2"
            },
            {
              label: "[0]",
              value: "12"
            },
            {
              label: "[1]",
              value: "15"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-l"
        }
      ],
      focus: "obj-l"
    },
    {
      id: "lo4",
      highlightLines: [
        5
      ],
      narration: "Count → n = 2.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-notes",
              name: "notes",
              value: "→ #L1",
              kind: "ref",
              targetId: "obj-l"
            },
            {
              id: "slot-n",
              name: "n",
              value: "2",
              kind: "value"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-l",
          typeLabel: "List<int>",
          address: "#L1",
          fields: [
            {
              label: "Count",
              value: "2"
            },
            {
              label: "[0]",
              value: "12"
            },
            {
              label: "[1]",
              value: "15"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-l"
        }
      ],
      focus: "slot-n"
    },
    {
      id: "list-ops-end",
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
              id: "slot-notes",
              name: "notes",
              value: "→ #L1",
              kind: "ref",
              targetId: "obj-l"
            },
            {
              id: "slot-n",
              name: "n",
              value: "2",
              kind: "value"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-l",
          typeLabel: "List<int>",
          address: "#L1",
          fields: [
            {
              label: "Count",
              value: "2"
            },
            {
              label: "[0]",
              value: "12"
            },
            {
              label: "[1]",
              value: "15"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-notes",
          fromSlotId: "slot-notes",
          toObjectId: "obj-l"
        }
      ]
    }
  ]
};
