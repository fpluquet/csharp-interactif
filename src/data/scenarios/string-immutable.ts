import type { Scenario } from "../../types/memory";

export const stringImmutableScenario: Scenario = {
  id: "string-immutable",
  title: "String immuable",
  subtitle: "s = s + \"!\" crée un nouvel objet — l’ancien reste intact.",
  part: "native-methods",
  code: [
    "static void Main()",
    "{",
    "    string s = \"Hi\";",
    "    s = s + \"!\";",
    "    // s pointe vers un nouvel objet",
    "}"
  ],
  steps: [
    {
      id: "si0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer. Les string sont des types référence immuables.",
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
      id: "si1",
      highlightLines: [
        2
      ],
      narration: "string s = \"Hi\" : objet #S1 va être créé sur le heap, s va pointer dessus.",
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
              targetId: "obj-s1"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"Hi\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s1"
        }
      ],
      focus: "obj-s1"
    },
    {
      id: "si2",
      highlightLines: [
        3
      ],
      narration: "s = s + \"!\" : on ne va pas modifier #S1 — on va créer un nouvel objet.",
      highlightExpr: "s + \"!\"",
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
              targetId: "obj-s1"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"Hi\""
            }
          ]
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"Hi!\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s1"
        }
      ],
      focus: "obj-s2"
    },
    {
      id: "si3",
      highlightLines: [
        3
      ],
      narration: "s va pointer vers #S2. #S1 ne va plus être référencé.",
      highlightExpr: "s =",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-s2"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          orphan: true,
          fields: [
            {
              label: "chars",
              value: "\"Hi\""
            }
          ]
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"Hi!\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s2"
        }
      ],
      focus: "slot-s"
    },
    {
      id: "si4",
      highlightLines: [
        4
      ],
      narration: "Immuable = pas de mutation in-place. Concaténer va créer un nouvel objet (+ ancien orphelin).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-s2"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          orphan: true,
          fields: [
            {
              label: "chars",
              value: "\"Hi\""
            }
          ]
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"Hi!\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s2"
        }
      ],
      focus: "obj-s1"
    },
    {
      id: "string-immutable-end",
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
              id: "slot-s",
              name: "s",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-s2"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          orphan: true,
          fields: [
            {
              label: "chars",
              value: "\"Hi\""
            }
          ]
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"Hi!\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s2"
        }
      ]
    }
  ]
};
