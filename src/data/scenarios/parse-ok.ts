import type { Scenario } from "../../types/memory";

export const parseOkScenario: Scenario = {
  id: "parse-ok",
  title: "Parse réussi",
  subtitle: "int.Parse convertit une string valide en entier.",
  part: "conversions",
  code: [
    "string s = \"42\";",
    "int n = int.Parse(s);",
    "Console.WriteLine(n);"
  ],
  steps: [
    {
      id: "po0",
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
      id: "po1",
      highlightLines: [
        0
      ],
      narration: "s va pointer vers \"42\".",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
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
              value: "\"42\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: []
    },
    {
      id: "po2",
      highlightLines: [
        1
      ],
      highlightExpr: "int.Parse(s)",
      narration: "int.Parse(s) → n va valoir 42 sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-n",
              name: "n",
              value: "42",
              kind: "value"
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
              value: "\"42\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      focus: "slot-n",
      consoleLines: []
    },
    {
      id: "po3",
      highlightLines: [
        2
      ],
      narration: "Console va afficher 42.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-n",
              name: "n",
              value: "42",
              kind: "value"
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
              value: "\"42\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "42"
      ]
    },
    {
      id: "parse-ok-end",
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
              id: "slot-s",
              name: "s",
              value: "→ #S1",
              kind: "ref",
              targetId: "obj-s"
            },
            {
              id: "slot-n",
              name: "n",
              value: "42",
              kind: "value"
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
              value: "\"42\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-s",
          fromSlotId: "slot-s",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "42"
      ]
    }
  ]
};
