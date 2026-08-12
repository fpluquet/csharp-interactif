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
    "static void Main()",
    "{",
    "    Compteur a = new Compteur();",
    "    a.Valeur = 1;",
    "    Compteur b = a;",
    "    b.Valeur = 9;",
    "    // a.Valeur vaut aussi 9",
    "}"
  ],
  steps: [
    {
      id: "ca0",
      highlightLines: [
        5,
        6
      ],
      narration: "Main démarre. On va partager un même objet Compteur.",
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
        7
      ],
      narration: "new Compteur() : objet #C1 sur le heap, a y pointe.",
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
        8
      ],
      narration: "a.Valeur = 1 : on mute le champ de #C1 via a.",
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
        9
      ],
      narration: "Compteur b = a : on copie la référence, pas l’objet. Deux flèches vers #C1.",
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
        10
      ],
      narration: "b.Valeur = 9 : mutation via b. a « voit » 9 aussi — même objet.",
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
        11
      ],
      narration: "a.Valeur vaut 9. Alias = deux noms pour un seul objet sur le heap.",
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
        12
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
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
