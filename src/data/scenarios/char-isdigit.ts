import type { Scenario } from "../../types/memory";

export const charIsDigitScenario: Scenario = {
  id: "char-isdigit",
  title: "char.IsDigit",
  subtitle: "Tester un caractère sans allouer sur le heap.",
  part: "native-methods",
  code: [
    "char c = '5';",
    "bool digit = char.IsDigit(c);",
    "Console.WriteLine(digit);"
  ],
  steps: [
    {
      id: "ci0",
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
      refs: [],
      consoleLines: []
    },
    {
      id: "ci1",
      highlightLines: [
        0
      ],
      narration: "c = '5' va être stocké sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-c",
              name: "c",
              value: "'5'",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: []
    },
    {
      id: "ci2",
      highlightLines: [
        1
      ],
      highlightExpr: "char.IsDigit(c)",
      narration: "IsDigit('5') va retourner true.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-c",
              name: "c",
              value: "'5'",
              kind: "value"
            },
            {
              id: "slot-digit",
              name: "digit",
              value: "true",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-digit",
      consoleLines: []
    },
    {
      id: "ci3",
      highlightLines: [
        2
      ],
      narration: "On va afficher True.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-c",
              name: "c",
              value: "'5'",
              kind: "value"
            },
            {
              id: "slot-digit",
              name: "digit",
              value: "true",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "True"
      ]
    },
    {
      id: "char-isdigit-end",
      highlightLines: [
        2
      ],
      narration: "Le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-c",
              name: "c",
              value: "'5'",
              kind: "value"
            },
            {
              id: "slot-digit",
              name: "digit",
              value: "true",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "True"
      ]
    }
  ]
};
