import type { Scenario } from "../../types/memory";

export const classMethodScenario: Scenario = {
  id: "class-method",
  title: "this = objet courant",
  subtitle: "e.Incrementer() reçoit this → e : c’est via this qu’on mute Valeur.",
  part: "oo-classes",
  code: [
    "class Compteur",
    "{",
    "    public int Valeur;",
    "    public void Incrementer()",
    "    {",
    "        this.Valeur++;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Compteur e = new Compteur();",
    "    e.Valeur = 1;",
    "    e.Incrementer();",
    "}"
  ],
  steps: [
    {
      id: "cm0",
      highlightLines: [
        9,
        10
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
      id: "cm1",
      highlightLines: [
        11
      ],
      narration: "new Compteur() → #C1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
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
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-c"
        }
      ]
    },
    {
      id: "cm2",
      highlightLines: [
        12
      ],
      narration: "e.Valeur = 1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
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
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "cm3",
      highlightLines: [
        13,
        5
      ],
      narration: "e.Incrementer() : la frame reçoit this → #C1 (le même objet que e).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
              value: "→ #C1",
              kind: "ref",
              targetId: "obj-c"
            }
          ]
        },
        {
          id: "frame-inc",
          method: "Incrementer",
          slots: [
            {
              id: "slot-this",
              name: "this",
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
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-c"
        },
        {
          id: "ref-this",
          fromSlotId: "slot-this",
          toObjectId: "obj-c"
        }
      ],
      focus: "frame-inc"
    },
    {
      id: "cm4",
      highlightLines: [
        5
      ],
      narration: "this.Valeur++ → 2. Puis return : this disparaît, l’objet reste.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
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
              value: "2",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-c"
        }
      ],
      focus: "obj-c"
    },
    {
      id: "class-method-end",
      highlightLines: [
        14
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-e",
              name: "e",
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
              value: "2",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-e",
          fromSlotId: "slot-e",
          toObjectId: "obj-c"
        }
      ]
    }
  ]
};
