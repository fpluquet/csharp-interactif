import type { Scenario } from "../../types/memory";

export const classGraphScenario: Scenario = {
  id: "class-graph",
  title: "Graphe d’objets",
  subtitle: "Un champ référence un autre objet : flèche heap → heap.",
  part: "oo-classes",
  code: [
    "class Adresse",
    "{",
    "    public string Ville;",
    "}",
    "",
    "class Personne",
    "{",
    "    public string Nom;",
    "    public Adresse Adresse;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Personne p = new Personne();",
    "    p.Nom = \"Sam\";",
    "    p.Adresse = new Adresse();",
    "    p.Adresse.Ville = \"Mons\";",
    "}"
  ],
  steps: [
    {
      id: "cg0",
      highlightLines: [
        11,
        12
      ],
      narration: "Main va démarrer. On va construire un petit graphe Personne → Adresse.",
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
      id: "cg1",
      highlightLines: [
        13
      ],
      narration: "new Personne() : objet #P1 va être créé. Adresse va encore être null.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-pers"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-pers",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            {
              label: "Nom",
              value: "null",
              kind: "ref"
            },
            {
              id: "field-pers-addr",
              label: "Adresse",
              value: "null",
              kind: "ref"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-pers"
        }
      ],
      focus: "obj-pers"
    },
    {
      id: "cg2",
      highlightLines: [
        14
      ],
      narration: "p.Nom = \"Sam\" : la string #S1 va être sur le heap, liée au champ Nom.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-pers"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-pers",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            {
              id: "field-pers-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              id: "field-pers-addr",
              label: "Adresse",
              value: "null",
              kind: "ref"
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
              value: "\"Sam\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-pers"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-pers-nom",
          toObjectId: "obj-nom"
        }
      ],
      focus: "obj-nom"
    },
    {
      id: "cg3",
      highlightLines: [
        15
      ],
      narration: "p.Adresse = new Adresse() : un nouvel objet #A1 va être créé. Une flèche heap→heap va partir du champ Adresse.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-pers"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-pers",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            {
              id: "field-pers-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              id: "field-pers-addr",
              label: "Adresse",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-addr"
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
              value: "\"Sam\""
            }
          ]
        },
        {
          id: "obj-addr",
          typeLabel: "Adresse",
          address: "#A1",
          fields: [
            {
              label: "Ville",
              value: "null",
              kind: "ref"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-pers"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-pers-nom",
          toObjectId: "obj-nom"
        },
        {
          id: "ref-addr",
          fromFieldId: "field-pers-addr",
          toObjectId: "obj-addr"
        }
      ],
      focus: "obj-addr"
    },
    {
      id: "cg4",
      highlightLines: [
        16
      ],
      narration: "p.Adresse.Ville = \"Mons\" : on va suivre la flèche jusqu’à #A1, puis on va attacher la string #S2.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-pers"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-pers",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            {
              id: "field-pers-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              id: "field-pers-addr",
              label: "Adresse",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-addr"
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
              value: "\"Sam\""
            }
          ]
        },
        {
          id: "obj-addr",
          typeLabel: "Adresse",
          address: "#A1",
          fields: [
            {
              id: "field-addr-ville",
              label: "Ville",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-ville"
            }
          ]
        },
        {
          id: "obj-ville",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"Mons\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-pers"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-pers-nom",
          toObjectId: "obj-nom"
        },
        {
          id: "ref-addr",
          fromFieldId: "field-pers-addr",
          toObjectId: "obj-addr"
        },
        {
          id: "ref-ville",
          fromFieldId: "field-addr-ville",
          toObjectId: "obj-ville"
        }
      ],
      focus: "obj-ville"
    },
    {
      id: "class-graph-end",
      highlightLines: [
        17
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-pers"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-pers",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            {
              id: "field-pers-nom",
              label: "Nom",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-nom"
            },
            {
              id: "field-pers-addr",
              label: "Adresse",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-addr"
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
              value: "\"Sam\""
            }
          ]
        },
        {
          id: "obj-addr",
          typeLabel: "Adresse",
          address: "#A1",
          fields: [
            {
              id: "field-addr-ville",
              label: "Ville",
              value: "→ #S2",
              kind: "ref",
              targetId: "obj-ville"
            }
          ]
        },
        {
          id: "obj-ville",
          typeLabel: "string",
          address: "#S2",
          fields: [
            {
              label: "chars",
              value: "\"Mons\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-pers"
        },
        {
          id: "ref-nom",
          fromFieldId: "field-pers-nom",
          toObjectId: "obj-nom"
        },
        {
          id: "ref-addr",
          fromFieldId: "field-pers-addr",
          toObjectId: "obj-addr"
        },
        {
          id: "ref-ville",
          fromFieldId: "field-addr-ville",
          toObjectId: "obj-ville"
        }
      ]
    }
  ]
};
