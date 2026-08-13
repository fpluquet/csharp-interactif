import type { Scenario } from "../../types/memory";

export const multiCallsScenario: Scenario = {
  id: "multi-calls",
  title: "Appels de plusieurs fonctions",
  subtitle: "La stack monte puis redescend ; le return remplace l’appel.",
  part: "functions",
  code: [
    "static int Double(int n)",
    "{",
    "    return n * 2;",
    "}",
    "",
    "static int Ajouter(int a, int b)",
    "{",
    "    return a + b;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int x = Double(3);",
    "    int y = Ajouter(x, 4);",
    "}"
  ],
  steps: [
    {
      id: "m0",
      highlightLines: [
        10,
        11
      ],
      narration: "Main va démarrer. La call stack ne va contenir qu'une frame.",
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
      id: "m1",
      highlightLines: [12],
      highlightExpr: "Double(3)",
      narration: "int x = Double(3) : l’expression contient un appel — on va l’évaluer.",
      stack: [
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
      id: "m2",
      highlightLines: [
        0,
        1
      ],
      narration: "La frame Double va s'empiler. Le paramètre n va recevoir 3 (copie par valeur).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-double",
          method: "Double",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-double"
    },
    {
      id: "m3",
      highlightLines: [
        2
      ],
      narration: "return n * 2 : Double va produire la valeur 6. Cette valeur va remonter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-double",
          method: "Double",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n",
      returnFlow: {
        fromMethod: "Double",
        callExpr: "Double(3)",
        value: "6",
        targetVar: "x",
        phase: "returning",
        callLine: 12
      }
    },
    {
      id: "m4",
      highlightLines: [
        12
      ],
      narration: "La frame Double va disparaître. Dans Main, Double(3) va être remplacé par 6.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main",
      returnFlow: {
        fromMethod: "Double",
        callExpr: "Double(3)",
        value: "6",
        targetVar: "x",
        phase: "replaces",
        callLine: 12
      }
    },
    {
      id: "m5",
      highlightLines: [
        12
      ],
      narration: "Ensuite seulement : 6 va être affecté à x sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-x",
      returnFlow: {
        fromMethod: "Double",
        callExpr: "Double(3)",
        value: "6",
        targetVar: "x",
        phase: "assigned",
        callLine: 12
      }
    },
    {
      id: "m6",
      highlightLines: [13],
      highlightExpr: "Ajouter(x, 4)",
      narration: "int y = Ajouter(x, 4) : nouvel appel va être évalué.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
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
      id: "m7",
      highlightLines: [
        5,
        6
      ],
      narration: "La frame Ajouter va s'empiler : a va valoir 6 et b va valoir 4 (copies des arguments).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-ajouter",
          method: "Ajouter",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "6",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "4",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-ajouter"
    },
    {
      id: "m8",
      highlightLines: [
        7
      ],
      narration: "return a + b : Ajouter va produire 10.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-ajouter",
          method: "Ajouter",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "6",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "4",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a",
      returnFlow: {
        fromMethod: "Ajouter",
        callExpr: "Ajouter(x, 4)",
        value: "10",
        targetVar: "y",
        phase: "returning",
        callLine: 13
      }
    },
    {
      id: "m9",
      highlightLines: [
        13
      ],
      narration: "Ajouter va disparaître. Ajouter(x, 4) va être remplacé par 10 dans l'expression.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main",
      returnFlow: {
        fromMethod: "Ajouter",
        callExpr: "Ajouter(x, 4)",
        value: "10",
        targetVar: "y",
        phase: "replaces",
        callLine: 13
      }
    },
    {
      id: "m10",
      highlightLines: [
        13,
        14
      ],
      narration: "10 va être affecté à y. Main va garder x = 6 et y = 10.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "10",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-y",
      returnFlow: {
        fromMethod: "Ajouter",
        callExpr: "Ajouter(x, 4)",
        value: "10",
        targetVar: "y",
        phase: "assigned",
        callLine: 13
      }
    },
    {
      id: "multi-calls-end",
      highlightLines: [
        14
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-x",
              name: "x",
              value: "6",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "10",
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
