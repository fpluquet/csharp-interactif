import type { Scenario } from "../../types/memory";

export const pathCombineScenario: Scenario = {
  id: "path-combine",
  title: "Path.Combine",
  subtitle: "Construit un chemin sans concaténer à la main.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    string p = Path.Combine(\"data\", \"a.txt\");",
    "    Console.WriteLine(p);",
    "}"
  ],
  steps: [
    {
      id: "pc0",
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
      consoleLines: [],
      files: []
    },
    {
      id: "pc1",
      highlightLines: [
        2
      ],
      highlightExpr: "Path.Combine(\"data\", \"a.txt\")",
      narration: "Path.Combine va produire data\\\\a.txt (séparateur OS).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
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
              value: "\"data\\\\a.txt\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [],
      files: []
    },
    {
      id: "pc2",
      highlightLines: [
        3
      ],
      narration: "Console va afficher le chemin.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
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
              value: "\"data\\\\a.txt\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "data\\\\a.txt"
      ],
      files: []
    },
    {
      id: "path-combine-end",
      highlightLines: [
        4
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-p",
              name: "p",
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
              value: "\"data\\\\a.txt\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-p",
          fromSlotId: "slot-p",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "data\\\\a.txt"
      ],
      files: []
    }
  ]
};
