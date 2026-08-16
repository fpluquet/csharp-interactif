import type { Scenario } from "../../types/memory";

export const listOpsScenario: Scenario = {
  id: "list-ops",
  title: "List Add & Count",
  subtitle: "Add fait grandir la liste ; Count suit le nombre d'éléments.",
  part: "collections",
  code: [
    "List<int> notes = new List<int>();",
    "notes.Add(12);",
    "notes.Add(15);",
    "int n = notes.Count;"
  ],
  steps: [
    {
      id: "lo0",
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
      refs: []
    },
    {
      id: "lo1",
      highlightLines: [
        0
      ],
      narration: "new List<int>() : une liste vide va être créée sur le heap.",
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
        1
      ],
      narration: "Add(12) va ajouter 12 à la liste.",
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
        2
      ],
      narration: "Add(15) va ajouter 15 à la liste.",
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
        3
      ],
      narration: "Count → n va valoir 2.",
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
        3
      ],
      narration: "Le programme va s'arrêter.",
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
