import type { Scenario } from "../../types/memory";

export const classAliasScenario: Scenario = {
  id: "class-alias",
  title: "Alias & mutation",
  subtitle: "Deux variables, un seul objet : muter via l’une affecte l’autre.",
  part: "oo-classes",
  code: [
    "class Compteur",
    "{",
    "    public int Valeur;",
    "}",
    "",
    "Compteur a = new Compteur();",
    "a.Valeur = 1;",
    "Compteur b = a;",
    "b.Valeur = 9;",
    "// a.Valeur vaut aussi 9"
  ],
  steps: [
    {
      id: "ca0",
      highlightLines: [
        5
      ],
      narration: "Le programme va démarrer. On va partager un même objet Compteur.",
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
      id: "ca1",
      highlightLines: [
        5
      ],
      narration: "new Compteur() : l'objet #C1 va être sur le heap, a va y pointer.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [
            {
              label: "Valeur",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "ca2",
      highlightLines: [
        6
      ],
      narration: "a.Valeur = 1 : on va muter le champ de #C1 via a.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [
            {
              label: "Valeur",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "ca3",
      highlightLines: [
        7
      ],
      narration: "Compteur b = a : on va copier la référence, pas l’objet. Deux flèches vers #C1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [
            {
              label: "Valeur",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-c"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-c"
        }
      ],
      focus: "slot-b"
    },
    {
      id: "ca4",
      highlightLines: [
        8
      ],
      narration: "b.Valeur = 9 : mutation via b. a va aussi « voir » 9 — même objet.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [
            {
              label: "Valeur",
              value: "9",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-c"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "ca5",
      highlightLines: [
        9
      ],
      narration: "a.Valeur va valoir 9. Alias = deux noms pour un seul objet sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [
            {
              label: "Valeur",
              value: "9",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-c"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "class-alias-end",
      highlightLines: [
        9
      ],
      narration: "Le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            },
            {
              id: "slot-b",
              name: "b",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [
            {
              label: "Valeur",
              value: "9",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-a",
          fromSlotId: "slot-a",
          toObjectId: "obj-c"
        },
        {
          id: "ref-b",
          fromSlotId: "slot-b",
          toObjectId: "obj-c"
        }
      ]
    }
  ]
};
