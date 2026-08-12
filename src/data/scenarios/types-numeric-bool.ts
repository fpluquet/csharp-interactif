import type { Scenario } from "../../types/memory";

export const typesNumericBoolScenario: Scenario = {
  id: "types-numeric-bool",
  title: "Types numériques & bool",
  subtitle: "Plusieurs types valeur cohabitent sur la stack.",
  part: "variables",
  code: [
    "static void Main()",
    "{",
    "    int n = 42;",
    "    double x = 3.14;",
    "    bool ok = true;",
    "    char c = 'A';",
    "}"
  ],
  steps: [
    {
      id: "tn0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main démarre. La stack est prête pour des types valeur.",
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
      id: "tn1",
      highlightLines: [
        2
      ],
      narration: "int n = 42 : entier stocké directement dans la frame.",
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
      id: "tn2",
      highlightLines: [
        3
      ],
      narration: "double x = 3.14 : nombre à virgule, toujours sur la stack.",
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
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.14",
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
      id: "tn3",
      highlightLines: [
        4
      ],
      narration: "bool ok = true : vrai/faux, type valeur.",
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
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.14",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-ok"
    },
    {
      id: "tn4",
      highlightLines: [
        5
      ],
      narration: "char c = 'A' : un caractère Unicode, aussi sur la stack.",
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
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.14",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-c",
              name: "c",
              value: "'A'",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-c"
    },
    {
      id: "types-numeric-bool-end",
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
              value: "42",
              kind: "value"
            },
            {
              id: "slot-x",
              name: "x",
              value: "3.14",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-c",
              name: "c",
              value: "'A'",
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
