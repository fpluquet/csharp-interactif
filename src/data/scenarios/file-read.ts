import type { Scenario } from "../../types/memory";

export const fileReadScenario: Scenario = {
  id: "file-read",
  title: "Lire un fichier",
  subtitle: "ReadAllText charge le contenu dans une string.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    string txt = File.ReadAllText(\"note.txt\");",
    "    Console.WriteLine(txt);",
    "}"
  ],
  steps: [
    {
      id: "fr0",
      highlightLines: [
        0,
        1
      ],
      narration: "Le fichier note.txt existe déjà.",
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
      files: [
        {
          path: "note.txt",
          content: "hello"
        }
      ]
    },
    {
      id: "fr1",
      highlightLines: [
        2
      ],
      narration: "ReadAllText copie le contenu vers une string sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-txt",
              name: "txt",
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
              value: "\"hello\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-txt",
          fromSlotId: "slot-txt",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [],
      files: [
        {
          path: "note.txt",
          content: "hello"
        }
      ]
    },
    {
      id: "fr2",
      highlightLines: [
        3
      ],
      narration: "Affiche hello.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-txt",
              name: "txt",
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
              value: "\"hello\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-txt",
          fromSlotId: "slot-txt",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "hello"
      ],
      files: [
        {
          path: "note.txt",
          content: "hello"
        }
      ]
    },
    {
      id: "file-read-end",
      highlightLines: [
        4
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-txt",
              name: "txt",
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
              value: "\"hello\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-txt",
          fromSlotId: "slot-txt",
          toObjectId: "obj-s"
        }
      ],
      consoleLines: [
        "hello"
      ],
      files: [
        {
          path: "note.txt",
          content: "hello"
        }
      ]
    }
  ]
};
