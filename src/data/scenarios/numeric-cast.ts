import type { Scenario } from "../../types/memory";

export const numericCastScenario: Scenario = {
  id: "numeric-cast",
  title: "Cast numérique",
  subtitle: "Implicite élargit ; explicite peut tronquer.",
  part: "conversions",
  code: [
    "int n = 3;",
    "double d = n;",
    "double x = 3.9;",
    "int m = (int)x;"
  ],
  steps: [
    {
      id: "nc0",
      highlightLines: [
        0
      ],
      narration: "Le programme va démarrer.",
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
        0
      ],
      narration: "int n va valoir 3.",
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
        1
      ],
      narration: "double d = n : conversion implicite, d va valoir 3.0.",
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
        2
      ],
      narration: "double x va valoir 3.9.",
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
        3
      ],
      narration: "(int)x va tronquer → m va valoir 3 (pas d'arrondi).",
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
        3
      ],
      narration: "Le programme va s'arrêter.",
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
