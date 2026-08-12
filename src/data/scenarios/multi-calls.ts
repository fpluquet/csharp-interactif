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
      narration: "Main démarre. La call stack ne contient qu’une frame.",
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
      highlightLines: [
        12
      ],
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
      narration: "Frame Double empilée. Le paramètre n reçoit 3 (copie par valeur).",
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
      narration: "return n * 2 : Double produit la valeur 6. Cette valeur va remonter.",
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
      narration: "La frame Double disparaît. Dans Main, Double(3) est remplacé par 6.",
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
      narration: "Ensuite seulement : 6 est affecté à x sur la stack.",
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
      highlightLines: [
        13
      ],
      narration: "int y = Ajouter(x, 4) : nouvel appel à évaluer.",
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
      narration: "Frame Ajouter : a = 6 et b = 4, copies des arguments.",
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
      narration: "return a + b : Ajouter produit 10.",
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
      narration: "Ajouter disparaît. Ajouter(x, 4) est remplacé par 10 dans l’expression.",
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
      narration: "10 est affecté à y. Main garde x = 6 et y = 10.",
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
      narration: "La fonction Main est terminée, le programme s'arrête.",
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
