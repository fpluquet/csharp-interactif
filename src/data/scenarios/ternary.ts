import type { Scenario } from "../../types/memory";

export const ternaryScenario: Scenario = {
  id: "ternary",
  title: "Opérateur ternaire",
  subtitle: "condition ? siVrai : siFaux — une expression, deux chemins.",
  part: "operators",
  code: [
    "static void Main()",
    "{",
    "    int age = 20;",
    "    string msg = age >= 18 ? \"majeur\" : \"mineur\";",
    "    Console.WriteLine(msg);",
    "}"
  ],
  steps: [
    {
      id: "te0",
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
      id: "te1",
      highlightLines: [
        2
      ],
      narration: "age = 20.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
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
      id: "te2",
      highlightLines: [
        3
      ],
      narration: "age >= 18 est true → on prend \"majeur\". String sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            },
            {
              id: "slot-msg",
              name: "msg",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"majeur\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-msg",
          fromSlotId: "slot-msg",
          toObjectId: "obj-s"
        }
      ],
      focus: "obj-s",
      consoleLines: []
    },
    {
      id: "te3",
      highlightLines: [
        4
      ],
      narration: "Affiche majeur.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            },
            {
              id: "slot-msg",
              name: "msg",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"majeur\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-msg",
          fromSlotId: "slot-msg",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "majeur"
      ]
    },
    {
      id: "ternary-end",
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
              id: "slot-age",
              name: "age",
              value: "20",
              kind: "value"
            },
            {
              id: "slot-msg",
              name: "msg",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [
            {
              label: "chars",
              value: "\"majeur\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-msg",
          fromSlotId: "slot-msg",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "majeur"
      ]
    }
  ]
};
