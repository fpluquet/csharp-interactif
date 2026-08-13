import type { Scenario } from "../../types/memory";

export const localsGlobalsScenario: Scenario = {
  id: "locals-globals",
  title: "Locales & globales",
  subtitle: "Les globales (static) persistent ; les locales meurent avec la frame.",
  part: "variables",
  code: [
    "static int total = 10;",
    "",
    "static void Ajouter(int n)",
    "{",
    "    int local = n;",
    "    total = total + local;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Ajouter(5);",
    "    // total vaut 15",
    "}"
  ],
  steps: [
    {
      id: "g0",
      highlightLines: [
        0
      ],
      narration: "static int total = 10 : la variable globale va vivre hors des frames d'appel (zone static).",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "10",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-total"
    },
    {
      id: "g1",
      highlightLines: [
        8,
        9
      ],
      narration: "Main va démarrer. total va rester visible dans la zone static.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "10",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main"
    },
    {
      id: "g2",
      highlightLines: [
        10
      ],
      narration: "Ajouter(5) : on va appeler la fonction — une frame va s'empiler.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "10",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main"
    },
    {
      id: "g3",
      highlightLines: [
        2,
        3
      ],
      narration: "La frame Ajouter va s'empiler : le paramètre n va valoir 5 (local à cette frame).",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "10",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-ajouter",
          method: "Ajouter",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n"
    },
    {
      id: "g4",
      highlightLines: [
        4
      ],
      narration: "int local = n : un autre local va s'ajouter dans Ajouter. total (global) n'aura pas bougé.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "10",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-ajouter",
          method: "Ajouter",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-local",
              name: "local",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-local"
    },
    {
      id: "g5",
      highlightLines: [
        5
      ],
      narration: "total = total + local : on va lire/écrire la globale. total va passer à 15.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "15",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-ajouter",
          method: "Ajouter",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-local",
              name: "local",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-total"
    },
    {
      id: "g6",
      highlightLines: [
        6,
        11
      ],
      narration: "Fin d'Ajouter : n et local vont disparaître. total (global) va rester à 15.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "15",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-total"
    },
    {
      id: "locals-globals-end",
      highlightLines: [
        12
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [
            {
              id: "slot-total",
              name: "total",
              value: "15",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: []
    }
  ]
};
