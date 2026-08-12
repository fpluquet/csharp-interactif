import type { Scenario } from "../../types/memory";

export const tupleScenario: Scenario = {
  id: "tuple",
  title: "Tuple",
  subtitle: "(int, string) regroupe deux valeurs (souvent sur la stack).",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    (int code, string nom) t = (1, \"Ada\");",
    "    Console.WriteLine(t.code);",
    "    Console.WriteLine(t.nom);",
    "}"
  ],
  steps: [
    {
      id: "tu0",
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
      id: "tu1",
      highlightLines: [
        2
      ],
      narration: "Tuple ValueTuple : code=1 sur stack ; nom référence une string.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-code",
              name: "t.code",
              value: "1",
              kind: "value"
            },
            {
              id: "slot-nom",
              name: "t.nom",
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
              value: "\"Ada\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nom",
          fromSlotId: "slot-nom",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: []
    },
    {
      id: "tu2",
      highlightLines: [
        3
      ],
      narration: "Affiche 1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-code",
              name: "t.code",
              value: "1",
              kind: "value"
            },
            {
              id: "slot-nom",
              name: "t.nom",
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
              value: "\"Ada\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nom",
          fromSlotId: "slot-nom",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "1"
      ]
    },
    {
      id: "tu3",
      highlightLines: [
        4
      ],
      narration: "Affiche Ada.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-code",
              name: "t.code",
              value: "1",
              kind: "value"
            },
            {
              id: "slot-nom",
              name: "t.nom",
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
              value: "\"Ada\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nom",
          fromSlotId: "slot-nom",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "1",
        "Ada"
      ]
    },
    {
      id: "tuple-end",
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
              id: "slot-code",
              name: "t.code",
              value: "1",
              kind: "value"
            },
            {
              id: "slot-nom",
              name: "t.nom",
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
              value: "\"Ada\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-nom",
          fromSlotId: "slot-nom",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "1",
        "Ada"
      ]
    }
  ]
};
