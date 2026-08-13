import type { Scenario } from "../../types/memory";

export const paramsPassScenario: Scenario = {
  id: "params-pass",
  title: "Paramètres : valeur & référence",
  subtitle: "Par valeur on copie ; avec ref on modifie l’original.",
  part: "functions",
  code: [
    "static void ModifierValeur(int x)",
    "{",
    "    x = 99;",
    "}",
    "",
    "static void ModifierRef(ref int x)",
    "{",
    "    x = 99;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int a = 5;",
    "    ModifierValeur(a);",
    "    // a vaut toujours 5",
    "    ModifierRef(ref a);",
    "    // a vaut 99",
    "}"
  ],
  steps: [
    {
      id: "p0",
      highlightLines: [
        10,
        11
      ],
      narration: "Main va démarrer. On va comparer passage par valeur et par référence.",
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
      id: "p1",
      highlightLines: [
        12
      ],
      narration: "int a = 5 : la valeur va être stockée sur la stack, dans la frame Main.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a"
    },
    {
      id: "p2",
      highlightLines: [
        13
      ],
      narration: "ModifierValeur(a) : appel — une nouvelle frame va s’empiler.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main"
    },
    {
      id: "p3",
      highlightLines: [
        0,
        1
      ],
      narration: "Par valeur : x va recevoir une copie de 5. a et x vont être indépendants.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-val",
          method: "ModifierValeur",
          slots: [
            {
              id: "slot-x-val",
              name: "x",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-x-val"
    },
    {
      id: "p4",
      highlightLines: [
        2
      ],
      narration: "x = 99 : seule la copie va changer. a va rester à 5.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-val",
          method: "ModifierValeur",
          slots: [
            {
              id: "slot-x-val",
              name: "x",
              value: "99",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-x-val"
    },
    {
      id: "p5",
      highlightLines: [
        3,
        14
      ],
      narration: "Retour dans Main : a va toujours valoir 5. La frame ModifierValeur va disparaître.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a"
    },
    {
      id: "p6",
      highlightLines: [
        15
      ],
      narration: "ModifierRef(ref a) : on va passer une référence vers a, pas une copie.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a"
    },
    {
      id: "p7",
      highlightLines: [
        5,
        6
      ],
      narration: "Avec ref, x va désigner la même case que a (alias sur la stack).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-ref",
          method: "ModifierRef",
          slots: [
            {
              id: "slot-x-ref",
              name: "x",
              value: "→ a",
              kind: "ref",
              targetId: "slot-a"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-x-ref"
    },
    {
      id: "p8",
      highlightLines: [
        7
      ],
      narration: "x = 99 : comme x va pointer vers a, a va devenir 99.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "99",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-ref",
          method: "ModifierRef",
          slots: [
            {
              id: "slot-x-ref",
              name: "x",
              value: "→ a",
              kind: "ref"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a"
    },
    {
      id: "p9",
      highlightLines: [
        8,
        16
      ],
      narration: "Retour dans Main : a va valoir 99. ref va bien modifier l’original.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "99",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a"
    },
    {
      id: "params-pass-end",
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
              id: "slot-a",
              name: "a",
              value: "99",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: []
    }
  ]
};
