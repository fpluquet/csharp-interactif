import type { Scenario } from "../../types/memory";

export const intToStringScenario: Scenario = {
  id: "int-tostring",
  title: "int.ToString",
  subtitle: "ToString alloue une string sur le heap.",
  part: "native-methods",
  code: [
    "static void Main()",
    "{",
    "    int n = 7;",
    "    string s = n.ToString();",
    "    Console.WriteLine(s);",
    "}"
  ],
  steps: [
    {
      id: "it0",
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
      id: "it1",
      highlightLines: [
        2
      ],
      narration: "n = 7 sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: []
    },
    {
      id: "it2",
      highlightLines: [
        3
      ],
      narration: "ToString() → string \"7\" sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            },
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"7\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: []
    },
    {
      id: "it3",
      highlightLines: [
        4
      ],
      narration: "Affiche 7.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            },
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"7\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "7"
      ]
    },
    {
      id: "int-tostring-end",
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
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            },
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"7\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "7"
      ]
    }
  ]
};
