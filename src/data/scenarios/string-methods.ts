import type { Scenario } from "../../types/memory";

export const stringMethodsScenario: Scenario = {
  id: "string-methods",
  title: "Méthodes string",
  subtitle: "Length, ToUpper, Contains — souvent un nouvel objet.",
  part: "native-methods",
  code: [
    "string s = \"ciao\";",
    "int len = s.Length;",
    "string u = s.ToUpper();",
    "bool has = s.Contains(\"ia\");"
  ],
  steps: [
    {
      id: "sm0",
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
      id: "sm1",
      highlightLines: [
        0
      ],
      narration: "s va pointer vers \"ciao\".",
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
        1
      ],
      highlightExpr: "s.Length",
      narration: "s.Length va valoir 4 (propriété, int sur stack).",
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
        2
      ],
      highlightExpr: "s.ToUpper()",
      narration: "ToUpper() va créer #S2 \"CIAO\". s va rester inchangé.",
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
        3
      ],
      highlightExpr: "s.Contains(\"ia\")",
      narration: "Contains(\"ia\") va retourner true.",
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
        3
      ],
      narration: "Le programme va s'arrêter.",
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
