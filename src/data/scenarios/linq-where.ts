import type { Scenario } from "../../types/memory";

export const linqWhereScenario: Scenario = {
  id: "linq-where",
  title: "LINQ Where",
  subtitle: "Where produit une nouvelle séquence filtrée.",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    int[] nums = { 1, 2, 3, 4 };",
    "    int[] pairs = nums.Where(n => n % 2 == 0).ToArray();",
    "    Console.WriteLine(pairs.Length);",
    "}"
  ],
  steps: [
    {
      id: "lw0",
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
      id: "lw1",
      highlightLines: [
        2
      ],
      narration: "nums = {1,2,3,4}.",
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
              targetId: "obj-a"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
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
            },
            {
              label: "[3]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-a"
        }
      ],
      consoleLines: []
    },
    {
      id: "lw2",
      highlightLines: [
        3
      ],
      narration: "Where + ToArray → nouveau tableau {2,4}. nums intact.",
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
              targetId: "obj-a"
            },
            {
              id: "slot-pairs",
              name: "pairs",
              value: "→ #A2",
              kind: "ref",
              targetId: "obj-b"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
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
            },
            {
              label: "[3]",
              value: "4"
            }
          ]
        },
        {
          id: "obj-b",
          typeLabel: "int[]",
          address: "#A2",
          fields: [
            {
              label: "[0]",
              value: "2"
            },
            {
              label: "[1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-a"
        },
        {
          id: "ref-pairs",
          fromSlotId: "slot-pairs",
          toObjectId: "obj-b"
        }
      ],
      focus: "obj-b",
      consoleLines: []
    },
    {
      id: "lw3",
      highlightLines: [
        4
      ],
      narration: "pairs.Length = 2.",
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
              targetId: "obj-a"
            },
            {
              id: "slot-pairs",
              name: "pairs",
              value: "→ #A2",
              kind: "ref",
              targetId: "obj-b"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
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
            },
            {
              label: "[3]",
              value: "4"
            }
          ]
        },
        {
          id: "obj-b",
          typeLabel: "int[]",
          address: "#A2",
          fields: [
            {
              label: "[0]",
              value: "2"
            },
            {
              label: "[1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-a"
        },
        {
          id: "ref-pairs",
          fromSlotId: "slot-pairs",
          toObjectId: "obj-b"
        }
      ],
      consoleLines: [
        "2"
      ]
    },
    {
      id: "linq-where-end",
      highlightLines: [
        5
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
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
              targetId: "obj-a"
            },
            {
              id: "slot-pairs",
              name: "pairs",
              value: "→ #A2",
              kind: "ref",
              targetId: "obj-b"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
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
            },
            {
              label: "[3]",
              value: "4"
            }
          ]
        },
        {
          id: "obj-b",
          typeLabel: "int[]",
          address: "#A2",
          fields: [
            {
              label: "[0]",
              value: "2"
            },
            {
              label: "[1]",
              value: "4"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nums",
          fromSlotId: "slot-nums",
          toObjectId: "obj-a"
        },
        {
          id: "ref-pairs",
          fromSlotId: "slot-pairs",
          toObjectId: "obj-b"
        }
      ],
      consoleLines: [
        "2"
      ]
    }
  ]
};
