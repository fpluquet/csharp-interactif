import type { Scenario } from "../../types/memory";

export const functionLocalsScenario: Scenario = {
  id: "function-locals",
  title: "Fonctions & variables locales",
  subtitle: "Les locaux meurent avec la frame ; le return remplace l’appel.",
  part: "functions",
  code: [
    "static int Calculer(int n)",
    "{",
    "    int temp = n + 1;",
    "    int resultat = temp * 2;",
    "    return resultat;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int r = Calculer(5);",
    "}"
  ],
  steps: [
    {
      id: "f0",
      highlightLines: [
        7,
        8
      ],
      narration: "Main démarre. Pas encore de locaux dans sa frame.",
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
      id: "f1",
      highlightLines: [
        9
      ],
      narration: "int r = Calculer(5) : l’appel doit d’abord être évalué.",
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
      id: "f2",
      highlightLines: [
        0,
        1
      ],
      narration: "Frame Calculer empilée. Le paramètre n = 5 est un local de cette frame.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-calc",
          method: "Calculer",
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
      id: "f3",
      highlightLines: [
        2
      ],
      narration: "int temp = n + 1 : temp s’ajoute dans la frame Calculer (valeur 6).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-calc",
          method: "Calculer",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-temp",
              name: "temp",
              value: "6",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-temp"
    },
    {
      id: "f4",
      highlightLines: [
        3
      ],
      narration: "int resultat = temp * 2 : encore un local dans la même frame (12).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-calc",
          method: "Calculer",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-temp",
              name: "temp",
              value: "6",
              kind: "value"
            },
            {
              id: "slot-resultat",
              name: "resultat",
              value: "12",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-resultat"
    },
    {
      id: "f5",
      highlightLines: [
        4
      ],
      narration: "return resultat : on renvoie 12. Les locaux vont disparaître, pas la valeur retournée.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-calc",
          method: "Calculer",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-temp",
              name: "temp",
              value: "6",
              kind: "value"
            },
            {
              id: "slot-resultat",
              name: "resultat",
              value: "12",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-resultat",
      returnFlow: {
        fromMethod: "Calculer",
        callExpr: "Calculer(5)",
        value: "12",
        targetVar: "r",
        phase: "returning",
        callLine: 9
      }
    },
    {
      id: "f6",
      highlightLines: [
        9
      ],
      narration: "Frame Calculer disparue. Calculer(5) est remplacé par 12 dans l’expression.",
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
        fromMethod: "Calculer",
        callExpr: "Calculer(5)",
        value: "12",
        targetVar: "r",
        phase: "replaces",
        callLine: 9
      }
    },
    {
      id: "f7",
      highlightLines: [
        9,
        10
      ],
      narration: "12 est affecté à r. n, temp et resultat n’existent plus.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-r",
              name: "r",
              value: "12",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-r",
      returnFlow: {
        fromMethod: "Calculer",
        callExpr: "Calculer(5)",
        value: "12",
        targetVar: "r",
        phase: "assigned",
        callLine: 9
      }
    },
    {
      id: "function-locals-end",
      highlightLines: [
        10
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-r",
              name: "r",
              value: "12",
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
