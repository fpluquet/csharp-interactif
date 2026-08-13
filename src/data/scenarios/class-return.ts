import type { Scenario } from "../../types/memory";

export const classReturnScenario: Scenario = {
  id: "class-return",
  title: "Retour d’objet",
  subtitle: "La frame meurt au return ; l’objet heap reste via la référence de l’appelant.",
  part: "oo-classes",
  code: [
    "class Point",
    "{",
    "    public int X;",
    "    public int Y;",
    "}",
    "",
    "static Point Creer(int x, int y)",
    "{",
    "    Point p = new Point();",
    "    p.X = x;",
    "    p.Y = y;",
    "    return p;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Point origin = Creer(0, 0);",
    "}"
  ],
  steps: [
    {
      id: "cr0",
      highlightLines: [
        14,
        15
      ],
      narration: "Main va démarrer. On va fabriquer un Point via Creer.",
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
      id: "cr1",
      highlightLines: [
        16
      ],
      narration: "L’appel Creer(0, 0) va empiler une nouvelle frame avec les paramètres x et y.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-creer",
          method: "Creer",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-creer"
    },
    {
      id: "cr2",
      highlightLines: [
        8
      ],
      narration: "new Point() dans Creer va créer l’objet #P1 sur le heap. p local va y pointer.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-creer",
          method: "Creer",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-p"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Point",
          address: "#P1",
          fields: [
            {
              label: "X",
              value: "0",
              kind: "value"
            },
            {
              label: "Y",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-p"
        }
      ],
      focus: "obj-p"
    },
    {
      id: "cr3",
      highlightLines: [
        9,
        10
      ],
      narration: "p.X et p.Y vont recevoir les paramètres. L’objet #P1 va être prêt.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-creer",
          method: "Creer",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-p"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Point",
          address: "#P1",
          fields: [
            {
              label: "X",
              value: "0",
              kind: "value"
            },
            {
              label: "Y",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-p"
        }
      ],
      focus: "obj-p"
    },
    {
      id: "cr4",
      highlightLines: [
        11
      ],
      narration: "return p : on va renvoyer la référence vers #P1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-creer",
          method: "Creer",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-p",
              name: "p",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-p"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Point",
          address: "#P1",
          fields: [
            {
              label: "X",
              value: "0",
              kind: "value"
            },
            {
              label: "Y",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-p"
        }
      ],
      focus: "frame-creer",
      returnFlow: {
        fromMethod: "Creer",
        callExpr: "Creer(0, 0)",
        value: "→ #P1",
        targetVar: "origin",
        phase: "returning",
        callLine: 16
      }
    },
    {
      id: "cr5",
      highlightLines: [
        16
      ],
      narration: "La frame Creer va être dépilée : x, y, p locaux vont disparaître. #P1 va rester vivant — origin dans Main va y pointer.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-origin",
              name: "origin",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-p"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Point",
          address: "#P1",
          fields: [
            {
              label: "X",
              value: "0",
              kind: "value"
            },
            {
              label: "Y",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-origin",
          fromSlotId: "slot-origin",
          toObjectId: "obj-p"
        }
      ],
      focus: "obj-p",
      returnFlow: {
        fromMethod: "Creer",
        callExpr: "Creer(0, 0)",
        value: "→ #P1",
        targetVar: "origin",
        phase: "assigned",
        callLine: 16
      }
    },
    {
      id: "class-return-end",
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
              id: "slot-origin",
              name: "origin",
              value: "→ #P1",
              kind: "ref",
              targetId: "obj-p"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Point",
          address: "#P1",
          fields: [
            {
              label: "X",
              value: "0",
              kind: "value"
            },
            {
              label: "Y",
              value: "0",
              kind: "value"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-origin",
          fromSlotId: "slot-origin",
          toObjectId: "obj-p"
        }
      ]
    }
  ]
};
