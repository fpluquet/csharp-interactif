import type { Scenario } from "../../types/memory";

export const tryParseScenario: Scenario = {
  id: "try-parse",
  title: "TryParse",
  subtitle: "TryParse renvoie bool et écrit le résultat via out.",
  part: "conversions",
  code: [
    "static void Main()",
    "{",
    "    bool ok = int.TryParse(\"7\", out int n);",
    "    Console.WriteLine(ok);",
    "    Console.WriteLine(n);",
    "}"
  ],
  steps: [
    {
      id: "tp0",
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
      refs: [],
      consoleLines: []
    },
    {
      id: "tp1",
      highlightLines: [
        2
      ],
      narration: "TryParse réussit : ok = true, n = 7. Pas d'exception.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n",
      consoleLines: []
    },
    {
      id: "tp2",
      highlightLines: [
        3
      ],
      narration: "Affiche True.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-n",
              name: "n",
              value: "7",
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
      id: "tp3",
      highlightLines: [
        4
      ],
      narration: "Affiche 7.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "True",
        "7"
      ]
    },
    {
      id: "try-parse-end",
      highlightLines: [
        5
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-n",
              name: "n",
              value: "7",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "True",
        "7"
      ]
    }
  ]
};
