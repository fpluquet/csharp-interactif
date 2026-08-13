import type { Scenario } from "../../types/memory";

export const classNewScenario: Scenario = {
  id: "class-new",
  title: "new & champs",
  subtitle: "new crée un objet sur le heap ; la stack garde la référence.",
  part: "oo-classes",
  code: [
    "class Etudiant",
    "{",
    "    public string Nom;",
    "    public int Age;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Etudiant e = new Etudiant();",
    "    e.Nom = \"Ada\";",
    "    e.Age = 20;",
    "}"
  ],
  steps: [
    {
      id: "cn0",
      highlightLines: [
        6,
        7
      ],
      narration: "Main va démarrer. Aucun objet Etudiant pour l’instant.",
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
      id: "cn1",
      highlightLines: [
        8
      ],
      narration: "new Etudiant() : l’objet va être alloué sur le heap. e sur la stack va pointer vers #E1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            {
              label: "Nom",
              value: "null",
              kind: "ref"
            },
            {
              label: "Age",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-e"
        }
      ],
      focus: "obj-e"
    },
    {
      id: "cn2",
      highlightLines: [
        9
      ],
      narration: "e.Nom = \"Ada\" : le champ Nom de l’objet #E1 va être mis à jour (string sur le heap).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            {
              id: "field-e-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              label: "Age",
              value: "0",
              kind: "value"
            }
          ]
        },
        {
          id: "obj-nom",
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
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-e"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-e-nom",
          toObjectId: "obj-nom"
        }
      ],
      focus: "obj-nom"
    },
    {
      id: "cn3",
      highlightLines: [
        10
      ],
      narration: "e.Age = 20 : Age est un type valeur — va être stocké dans l’objet, pas une référence séparée.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            {
              id: "field-e-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              label: "Age",
              value: "20",
              kind: "value"
            }
          ]
        },
        {
          id: "obj-nom",
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
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-e"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-e-nom",
          toObjectId: "obj-nom"
        }
      ],
      focus: "obj-e"
    },
    {
      id: "class-new-end",
      highlightLines: [
        11
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
              value: "→ #E1",
              kind: "ref",
              targetId: "obj-e"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-e",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            {
              id: "field-e-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              label: "Age",
              value: "20",
              kind: "value"
            }
          ]
        },
        {
          id: "obj-nom",
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
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-e"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-e-nom",
          toObjectId: "obj-nom"
        }
      ]
    }
  ]
};
