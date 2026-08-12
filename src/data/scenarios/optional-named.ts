import type { Scenario } from "../../types/memory";

export const optionalNamedScenario: Scenario = {
  id: "optional-named",
  title: "Paramètres optionnels & nommés",
  subtitle: "Un défaut comble l'absent ; le nom clarifie l'appel.",
  part: "functions",
  code: [
    "static int Ajouter(int a, int b = 1)",
    "{",
    "    return a + b;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int x = Ajouter(5);",
    "    int y = Ajouter(a: 2, b: 3);",
    "}"
  ],
  steps: [
    {
      id: "on0",
      highlightLines: [
        5,
        6
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
      id: "on1",
      highlightLines: [
        7
      ],
      narration: "Ajouter(5) : b prend la valeur par défaut 1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-aj",
          method: "Ajouter",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-aj"
    },
    {
      id: "on2",
      highlightLines: [
        7
      ],
      narration: "return 6 → x = 6.",
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
      returnFlow: {
        fromMethod: "Ajouter",
        callExpr: "Ajouter(5)",
        value: "6",
        targetVar: "x",
        phase: "assigned",
        callLine: 7
      }
    },
    {
      id: "on3",
      highlightLines: [
        8
      ],
      narration: "Ajouter(a: 2, b: 3) : paramètres nommés.",
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
          id: "frame-aj2",
          method: "Ajouter",
          slots: [
            {
              id: "slot-a2",
              name: "a",
              value: "2",
              kind: "value"
            },
            {
              id: "slot-b2",
              name: "b",
              value: "3",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-aj2"
    },
    {
      id: "on4",
      highlightLines: [
        8
      ],
      narration: "return 5 → y = 5.",
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
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-y"
    },
    {
      id: "optional-named-end",
      highlightLines: [
        9
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
              value: "5",
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
