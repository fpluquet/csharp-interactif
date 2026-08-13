import type { Scenario } from "../../types/memory";

export const datetimePartsScenario: Scenario = {
  id: "datetime-parts",
  title: "DateTime",
  subtitle: "Une date/heure comme valeur (champs Year, Month…).",
  part: "native-methods",
  code: [
    "static void Main()",
    "{",
    "    DateTime d = new DateTime(2026, 8, 12);",
    "    int y = d.Year;",
    "    int m = d.Month;",
    "    Console.WriteLine(y);",
    "}"
  ],
  steps: [
    {
      id: "dt0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer.",
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
      id: "dt1",
      highlightLines: [
        2
      ],
      highlightExpr: "new DateTime(2026, 8, 12)",
      narration: "DateTime est un struct (type valeur) : il va être stocké sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-d",
              name: "d",
              value: "2026-08-12",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-d",
      consoleLines: []
    },
    {
      id: "dt2",
      highlightLines: [
        3,
        4
      ],
      narration: "Year et Month vont extraire des int.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-d",
              name: "d",
              value: "2026-08-12",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "2026",
              kind: "value"
            },
            {
              id: "slot-m",
              name: "m",
              value: "8",
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
      id: "dt3",
      highlightLines: [
        5
      ],
      narration: "On va afficher 2026.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-d",
              name: "d",
              value: "2026-08-12",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "2026",
              kind: "value"
            },
            {
              id: "slot-m",
              name: "m",
              value: "8",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "2026"
      ]
    },
    {
      id: "datetime-parts-end",
      highlightLines: [
        6
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-d",
              name: "d",
              value: "2026-08-12",
              kind: "value"
            },
            {
              id: "slot-y",
              name: "y",
              value: "2026",
              kind: "value"
            },
            {
              id: "slot-m",
              name: "m",
              value: "8",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "2026"
      ]
    }
  ]
};
