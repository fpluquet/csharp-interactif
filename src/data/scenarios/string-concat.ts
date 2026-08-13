import type { Scenario } from "../../types/memory";

export const stringConcatScenario: Scenario = {
  id: "string-concat",
  title: "Concaténation de strings",
  subtitle: "a + b crée un nouvel objet string sur le heap.",
  part: "operators",
  code: [
    "static void Main()",
    "{",
    "    string a = \"Bon\";",
    "    string b = \"jour\";",
    "    string c = a + b;",
    "}"
  ],
  steps: [
    {
      id: "sc0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer.",
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
      id: "sc1",
      highlightLines: [
        2
      ],
      narration: "a va pointer vers \"Bon\".",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-a"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"Bon\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-a"
        }
      ],
      focus: "obj-a"
    },
    {
      id: "sc2",
      highlightLines: [
        3
      ],
      narration: "b va pointer vers \"jour\".",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-a"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-b"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"Bon\""
            }
          ]
        },
        {
          id: "obj-b",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"jour\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-a"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-b"
        }
      ],
      focus: "obj-b"
    },
    {
      id: "sc3",
      highlightLines: [
        4
      ],
      narration: "a + b va créer #S3 \"Bonjour\". a et b vont rester inchangés.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-a"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-b"
            },
            {
              id: "slot-c",
              name: "c",
              value: "→ #S3",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"Bon\""
            }
          ]
        },
        {
          id: "obj-b",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"jour\""
            }
          ]
        },
        {
          id: "obj-c",
          typeLabel: "string",
          address: "#S3",
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
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-a"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-b"
        },
        {
          id: "ref-c",
          fromSlotId: "slot-c",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "string-concat-end",
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
              id: "slot-a",
              name: "a",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-a"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-b"
            },
            {
              id: "slot-c",
              name: "c",
              value: "→ #S3",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"Bon\""
            }
          ]
        },
        {
          id: "obj-b",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"jour\""
            }
          ]
        },
        {
          id: "obj-c",
          typeLabel: "string",
          address: "#S3",
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
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-a"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-b"
        },
        {
          id: "ref-c",
          fromSlotId: "slot-c",
          toObjectId: "obj-c"
        }
      ]
    }
  ]
};
