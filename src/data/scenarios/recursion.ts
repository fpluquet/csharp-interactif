import type { Scenario } from "../../types/memory";

export const recursionScenario: Scenario = {
  id: "recursion",
  title: "Récursion courte",
  subtitle: "Fact(3) : plusieurs frames du même nom, puis retours en cascade.",
  part: "functions",
  code: [
    "static int Fact(int n)",
    "{",
    "    if (n <= 1) return 1;",
    "    return n * Fact(n - 1);",
    "}",
    "",
    "static void Main()",
    "{",
    "    int r = Fact(3);",
    "}"
  ],
  steps: [
    {
      id: "rc0",
      highlightLines: [
        6,
        7
      ],
      narration: "Main va démarrer. La récursion va empiler plusieurs frames Fact.",
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
      id: "rc1",
      highlightLines: [
        8
      ],
      narration: "int r = Fact(3) : on va lancer le premier appel.",
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
      id: "rc2",
      highlightLines: [
        0,
        1
      ],
      narration: "Fact(3) : frame va s’empiler, n va valoir 3.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-fact-3"
    },
    {
      id: "rc3",
      highlightLines: [3],
      highlightExpr: "Fact(n - 1)",
      narration: "return n * Fact(n-1) : appel récursif Fact(2) va être lancé — nouvelle frame va s’empiler.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-fact-2",
          method: "Fact",
          slots: [
            {
              id: "slot-n2",
              name: "n",
              value: "2",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-fact-2"
    },
    {
      id: "rc4",
      highlightLines: [
        3
      ],
      narration: "Encore Fact(1) : trois frames Fact vont être empilées (n=3,2,1).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-fact-2",
          method: "Fact",
          slots: [
            {
              id: "slot-n2",
              name: "n",
              value: "2",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-fact-1",
          method: "Fact",
          slots: [
            {
              id: "slot-n1",
              name: "n",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-fact-1"
    },
    {
      id: "rc5",
      highlightLines: [
        2
      ],
      narration: "n <= 1 : cas de base. Fact(1) va retourner 1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-fact-2",
          method: "Fact",
          slots: [
            {
              id: "slot-n2",
              name: "n",
              value: "2",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-fact-1",
          method: "Fact",
          slots: [
            {
              id: "slot-n1",
              name: "n",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n1",
      returnFlow: {
        fromMethod: "Fact",
        callExpr: "Fact(n - 1)",
        value: "1",
        phase: "returning",
        callLine: 3
      }
    },
    {
      id: "rc6",
      highlightLines: [
        3
      ],
      narration: "Fact(1) va disparaître. Dans Fact(2) : n * 1 va devenir 2.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-fact-2",
          method: "Fact",
          slots: [
            {
              id: "slot-n2",
              name: "n",
              value: "2",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-fact-2",
      returnFlow: {
        fromMethod: "Fact",
        callExpr: "Fact(n - 1)",
        value: "1",
        phase: "replaces",
        callLine: 3
      }
    },
    {
      id: "rc7",
      highlightLines: [
        3
      ],
      narration: "Fact(2) va retourner 2. Va remonter vers Fact(3).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-fact-3",
      returnFlow: {
        fromMethod: "Fact",
        callExpr: "Fact(n - 1)",
        value: "2",
        phase: "returning",
        callLine: 3
      }
    },
    {
      id: "rc8",
      highlightLines: [
        3
      ],
      narration: "Dans Fact(3) : n * 2 va valoir 6. Dernier return va remonter vers Main.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-fact-3",
          method: "Fact",
          slots: [
            {
              id: "slot-n3",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n3",
      returnFlow: {
        fromMethod: "Fact",
        callExpr: "Fact(3)",
        value: "6",
        targetVar: "r",
        phase: "returning",
        callLine: 8
      }
    },
    {
      id: "rc9",
      highlightLines: [
        8
      ],
      narration: "Toutes les frames Fact vont disparaître. Fact(3) va être remplacé par 6.",
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
        fromMethod: "Fact",
        callExpr: "Fact(3)",
        value: "6",
        targetVar: "r",
        phase: "replaces",
        callLine: 8
      }
    },
    {
      id: "rc10",
      highlightLines: [
        8,
        9
      ],
      narration: "r va valoir 6. La récursion va empiler, atteindre le cas de base, dépiler en multipliant.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-r",
              name: "r",
              value: "6",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-r",
      returnFlow: {
        fromMethod: "Fact",
        callExpr: "Fact(3)",
        value: "6",
        targetVar: "r",
        phase: "assigned",
        callLine: 8
      }
    },
    {
      id: "recursion-end",
      highlightLines: [
        9
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-r",
              name: "r",
              value: "6",
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
