import type { Scenario } from "../../types/memory";

export const arrayIndexScenario: Scenario = {
  id: "array-index",
  title: "Indexation de tableau",
  subtitle: "Modifier nums[i] change l'objet heap, pas la référence.",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    int[] nums = { 1, 2, 3 };",
    "    nums[1] = 9;",
    "    Console.WriteLine(nums[1]);",
    "}"
  ],
  steps: [
    {
      id: "ai0",
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
      id: "ai1",
      highlightLines: [
        2
      ],
      narration: "Tableau {1,2,3} sur le heap.",
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
      id: "ai2",
      highlightLines: [
        3
      ],
      narration: "nums[1] = 9 : on mute la case [1] de #A1.",
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
              value: "9"
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
          toObjectId: "obj-a"
        }
      ],
      focus: "obj-a",
      consoleLines: []
    },
    {
      id: "ai3",
      highlightLines: [
        4
      ],
      narration: "Affiche 9.",
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
              value: "9"
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
          toObjectId: "obj-a"
        }
      ],
      consoleLines: [
        "9"
      ]
    },
    {
      id: "array-index-end",
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
              value: "9"
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
          toObjectId: "obj-a"
        }
      ],
      consoleLines: [
        "9"
      ]
    }
  ]
};
