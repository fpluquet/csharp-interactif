import type { Scenario } from "../../types/memory";

export const relationalLogicalScenario: Scenario = {
  id: "relational-logical",
  title: "Relationnels & logiques",
  subtitle: "&& court-circuite : la 2ᵉ condition n'est pas évaluée.",
  part: "operators",
  code: [
    "int a = 0;",
    "bool ok = a != 0 && 10 / a > 1;",
    "Console.WriteLine(ok);"
  ],
  steps: [
    {
      id: "rl0",
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
      id: "rl1",
      highlightLines: [
        0
      ],
      narration: "a va valoir 0.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "0",
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
      id: "rl2",
      highlightLines: [
        1
      ],
      narration: "a != 0 va être false → && ne va pas évaluer 10/a. ok va valoir false. Pas d'exception.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "false",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-ok",
      consoleLines: []
    },
    {
      id: "rl3",
      highlightLines: [
        2
      ],
      narration: "Console va afficher false.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "false",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "False"
      ]
    },
    {
      id: "relational-logical-end",
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
              id: "slot-a",
              name: "a",
              value: "0",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "false",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "False"
      ]
    }
  ]
};
