import type { Scenario } from "../../types/memory";

export const switchCaseScenario: Scenario = {
  id: "switch-case",
  title: "switch / case",
  subtitle: "Un case correspondant est choisi, puis break.",
  part: "control",
  code: [
    "static void Main()",
    "{",
    "    int data = 1;",
    "    switch (data)",
    "    {",
    "        case 0:",
    "            Console.WriteLine(\"zéro\");",
    "            break;",
    "        case 1:",
    "            Console.WriteLine(\"un\");",
    "            break;",
    "        default:",
    "            Console.WriteLine(\"autre\");",
    "            break;",
    "    }",
    "}"
  ],
  steps: [
    {
      id: "sw0",
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
      id: "sw1",
      highlightLines: [
        2
      ],
      narration: "data = 1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-data",
              name: "data",
              value: "1",
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
      id: "sw2",
      highlightLines: [
        3,
        8
      ],
      narration: "switch(data) : case 1 correspond.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-data",
              name: "data",
              value: "1",
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
      id: "sw3",
      highlightLines: [
        9,
        10
      ],
      narration: "Affiche un, puis break sort du switch.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-data",
              name: "data",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "un"
      ]
    },
    {
      id: "switch-case-end",
      highlightLines: [
        15
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-data",
              name: "data",
              value: "1",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      consoleLines: [
        "un"
      ]
    }
  ]
};
