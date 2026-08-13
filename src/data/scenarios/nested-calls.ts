import type { Scenario } from "../../types/memory";

export const nestedCallsScenario: Scenario = {
  id: "nested-calls",
  title: "Appels imbriqués",
  subtitle: "f(g(x)) : deux frames empilées, retours en cascade.",
  part: "functions",
  code: [
    "static int Increment(int n)",
    "{",
    "    return n + 1;",
    "}",
    "",
    "static int Double(int n)",
    "{",
    "    return n * 2;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int r = Double(Increment(3));",
    "}"
  ],
  steps: [
    {
      id: "nc0",
      highlightLines: [
        10,
        11
      ],
      narration: "Main va démarrer. L'expression Double(Increment(3)) va s'évaluer de l'intérieur.",
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
      id: "nc1",
      highlightLines: [12],
      highlightExpr: "Increment(3)",
      narration: "On va commencer par l'appel intérieur : Increment(3).",
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
      id: "nc2",
      highlightLines: [
        0,
        1
      ],
      narration: "La frame Increment va s'empiler. n va valoir 3.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-inc",
          method: "Increment",
          slots: [
            {
              id: "slot-n-inc",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-inc"
    },
    {
      id: "nc3",
      highlightLines: [
        2
      ],
      narration: "return n + 1 : Increment va produire 4.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-inc",
          method: "Increment",
          slots: [
            {
              id: "slot-n-inc",
              name: "n",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n-inc",
      returnFlow: {
        fromMethod: "Increment",
        callExpr: "Increment(3)",
        value: "4",
        phase: "returning",
        callLine: 12
      }
    },
    {
      id: "nc4",
      highlightLines: [
        12
      ],
      narration: "Increment va disparaître. Increment(3) va être remplacé par 4 → il restera Double(4).",
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
        fromMethod: "Increment",
        callExpr: "Increment(3)",
        value: "4",
        phase: "replaces",
        callLine: 12
      }
    },
    {
      id: "nc5",
      highlightLines: [
        5,
        6
      ],
      narration: "Ensuite Double(4) : la frame Double va s'empiler avec n = 4.",
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
              id: "slot-n-dbl",
              name: "n",
              value: "4",
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
      id: "nc6",
      highlightLines: [
        7
      ],
      narration: "return n * 2 : Double va produire 8.",
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
              id: "slot-n-dbl",
              name: "n",
              value: "4",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n-dbl",
      returnFlow: {
        fromMethod: "Double",
        callExpr: "Double(Increment(3))",
        value: "8",
        targetVar: "r",
        phase: "returning",
        callLine: 12
      }
    },
    {
      id: "nc7",
      highlightLines: [
        12
      ],
      narration: "Double va disparaître. L'appel entier va être remplacé par 8.",
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
        callExpr: "Double(Increment(3))",
        value: "8",
        targetVar: "r",
        phase: "replaces",
        callLine: 12
      }
    },
    {
      id: "nc8",
      highlightLines: [
        12,
        13
      ],
      narration: "8 va être affecté à r. Les deux frames d'appel auront disparu.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-r",
              name: "r",
              value: "8",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-r",
      returnFlow: {
        fromMethod: "Double",
        callExpr: "Double(Increment(3))",
        value: "8",
        targetVar: "r",
        phase: "assigned",
        callLine: 12
      }
    },
    {
      id: "nested-calls-end",
      highlightLines: [
        13
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
              value: "8",
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
