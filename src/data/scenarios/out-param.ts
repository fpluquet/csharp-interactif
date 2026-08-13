import type { Scenario } from "../../types/memory";

export const outParamScenario: Scenario = {
  id: "out-param",
  title: "Paramètre out",
  subtitle: "out force l’écriture de la variable de l’appelant.",
  part: "functions",
  code: [
    "static void Lire(out int x)",
    "{",
    "    x = 42;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int n;",
    "    Lire(out n);",
    "    // n vaut 42",
    "}"
  ],
  steps: [
    {
      id: "op0",
      highlightLines: [
        5,
        6
      ],
      narration: "Main va démarrer. out va compléter le passage par référence vu avec ref.",
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
      id: "op1",
      highlightLines: [
        7
      ],
      narration: "int n : la case va exister, mais n ne va pas encore être initialisée (non assignée).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "?",
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
      id: "op2",
      highlightLines: [
        8
      ],
      highlightExpr: "Lire(out n)",
      narration: "Lire(out n) : on va passer un alias vers n — la méthode va devoir l’écrire.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "?",
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
      id: "op3",
      highlightLines: [
        0,
        1
      ],
      narration: "Frame Lire : x va être un out — il va désigner la même case que n.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "?",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-lire",
          method: "Lire",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "→ n",
              kind: "ref"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-x"
    },
    {
      id: "op4",
      highlightLines: [
        2
      ],
      narration: "x = 42 : écrire via out va mettre à jour n dans Main.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "42",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-lire",
          method: "Lire",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "→ n",
              kind: "ref"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n"
    },
    {
      id: "op5",
      highlightLines: [
        3,
        9
      ],
      narration: "Retour dans Main : n va valoir 42. out va bien initialiser l’appelant.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "42",
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
      id: "out-param-end",
      highlightLines: [
        10
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "42",
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
