import type { Scenario } from "../../types/memory";

export const stringMethodsScenario: Scenario = {
  id: "string-methods",
  title: "Méthodes string",
  subtitle: "Length, ToUpper, Contains — souvent un nouvel objet.",
  part: "native-methods",
  code: [
    "static void Main()",
    "{",
    "    string s = \"ciao\";",
    "    int len = s.Length;",
    "    string u = s.ToUpper();",
    "    bool has = s.Contains(\"ia\");",
    "}"
  ],
  steps: [
    {
      id: "sm0",
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
      id: "sm1",
      highlightLines: [
        2
      ],
      narration: "s → \"ciao\".",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
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
              value: "\"ciao\""
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
      ]
    },
    {
      id: "sm2",
      highlightLines: [
        3
      ],
      narration: "s.Length = 4 (propriété, int sur stack).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-len",
              name: "len",
              value: "4",
              kind: "value"
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
              value: "\"ciao\""
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
      focus: "slot-len"
    },
    {
      id: "sm3",
      highlightLines: [
        4
      ],
      narration: "ToUpper() crée #S2 \"CIAO\". s inchangé.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-len",
              name: "len",
              value: "4",
              kind: "value"
            },
            {
              id: "slot-u",
              name: "u",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-u"
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
              value: "\"ciao\""
            }
          ]
        },
        {
          id: "obj-u",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"CIAO\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        },
        {
          id: "ref-u",
          fromSlotId: "slot-u",
          toObjectId: "obj-u"
        }
      ],
      focus: "obj-u"
    },
    {
      id: "sm4",
      highlightLines: [
        5
      ],
      narration: "Contains(\"ia\") → true.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-len",
              name: "len",
              value: "4",
              kind: "value"
            },
            {
              id: "slot-u",
              name: "u",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-u"
            },
            {
              id: "slot-has",
              name: "has",
              value: "true",
              kind: "value"
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
              value: "\"ciao\""
            }
          ]
        },
        {
          id: "obj-u",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"CIAO\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        },
        {
          id: "ref-u",
          fromSlotId: "slot-u",
          toObjectId: "obj-u"
        }
      ],
      focus: "slot-has"
    },
    {
      id: "string-methods-end",
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
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-len",
              name: "len",
              value: "4",
              kind: "value"
            },
            {
              id: "slot-u",
              name: "u",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-u"
            },
            {
              id: "slot-has",
              name: "has",
              value: "true",
              kind: "value"
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
              value: "\"ciao\""
            }
          ]
        },
        {
          id: "obj-u",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"CIAO\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        },
        {
          id: "ref-u",
          fromSlotId: "slot-u",
          toObjectId: "obj-u"
        }
      ]
    }
  ]
};
