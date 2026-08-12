import type { Scenario } from "../../types/memory";

export const numericCastScenario: Scenario = {
  id: "numeric-cast",
  title: "Cast numérique",
  subtitle: "Implicite élargit ; explicite peut tronquer.",
  part: "conversions",
  code: [
    "static void Main()",
    "{",
    "    int n = 3;",
    "    double d = n;",
    "    double x = 3.9;",
    "    int m = (int)x;",
    "}"
  ],
  steps: [
    {
      id: "nc0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main démarre.",
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
      highlightLines: [
        2
      ],
      narration: "int n = 3.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
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
      focus: "slot-n"
    },
    {
      id: "nc2",
      highlightLines: [
        3
      ],
      narration: "double d = n : conversion implicite, d = 3.0.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "3",
              kind: "value"
            },
            {
              id: "slot-d",
              name: "d",
              value: "3.0",
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
      id: "nc3",
      highlightLines: [
        4
      ],
      narration: "double x = 3.9.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "3",
              kind: "value"
            },
            {
              id: "slot-d",
              name: "d",
              value: "3.0",
              kind: "value"
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.9",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-x"
    },
    {
      id: "nc4",
      highlightLines: [
        5
      ],
      narration: "(int)x tronque → m = 3 (pas d'arrondi).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "3",
              kind: "value"
            },
            {
              id: "slot-d",
              name: "d",
              value: "3.0",
              kind: "value"
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.9",
              kind: "value"
            },
            {
              id: "slot-m",
              name: "m",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-m"
    },
    {
      id: "numeric-cast-end",
      highlightLines: [
        6
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "3",
              kind: "value"
            },
            {
              id: "slot-d",
              name: "d",
              value: "3.0",
              kind: "value"
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.9",
              kind: "value"
            },
            {
              id: "slot-m",
              name: "m",
              value: "3",
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
