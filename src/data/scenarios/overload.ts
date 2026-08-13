import type { Scenario } from "../../types/memory";

export const overloadScenario: Scenario = {
  id: "overload",
  title: "Surcharge",
  subtitle: "Même nom, signatures différentes → appels distincts.",
  part: "functions",
  code: [
    "static int Max(int a, int b) => a > b ? a : b;",
    "static double Max(double a, double b) => a > b ? a : b;",
    "",
    "static void Main()",
    "{",
    "    int i = Max(3, 5);",
    "    double d = Max(2.5, 1.1);",
    "}"
  ],
  steps: [
    {
      id: "ov0",
      highlightLines: [
        3,
        4
      ],
      narration: "Main va démarrer. Deux Max vont être disponibles.",
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
      id: "ov1",
      highlightLines: [5],
      highlightExpr: "Max(3, 5)",
      narration: "Max(3,5) va choisir la surcharge int.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-max-i",
          method: "Max(int,int)",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "3",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-max-i"
    },
    {
      id: "ov2",
      highlightLines: [
        5
      ],
      narration: "i va valoir 5.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-i",
              name: "i",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: []
    },
    {
      id: "ov3",
      highlightLines: [
        6
      ],
      highlightExpr: "Max(2.5, 1.1)",
      narration: "Max(2.5, 1.1) va choisir la surcharge double.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-i",
              name: "i",
              value: "5",
              kind: "value"
            }
          ]
        },
        {
          id: "frame-max-d",
          method: "Max(double,double)",
          slots: [
            {
              id: "slot-a2",
              name: "a",
              value: "2.5",
              kind: "value"
            },
            {
              id: "slot-b2",
              name: "b",
              value: "1.1",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-max-d"
    },
    {
      id: "ov4",
      highlightLines: [
        6
      ],
      narration: "d va valoir 2.5.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-i",
              name: "i",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-d",
              name: "d",
              value: "2.5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-d"
    },
    {
      id: "overload-end",
      highlightLines: [
        7
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-i",
              name: "i",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-d",
              name: "d",
              value: "2.5",
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
