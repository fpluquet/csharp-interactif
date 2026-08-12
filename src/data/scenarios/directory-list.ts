import type { Scenario } from "../../types/memory";

export const directoryListScenario: Scenario = {
  id: "directory-list",
  title: "Directory",
  subtitle: "Créer un dossier et lister ses fichiers.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    Directory.CreateDirectory(\"tmp\");",
    "    File.WriteAllText(\"tmp/a.txt\", \"x\");",
    "    string[] files = Directory.GetFiles(\"tmp\");",
    "    Console.WriteLine(files.Length);",
    "}"
  ],
  steps: [
    {
      id: "dl0",
      highlightLines: [
        0,
        1
      ],
      narration: "Rien pour l'instant.",
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
      id: "dl1",
      highlightLines: [
        2
      ],
      narration: "CreateDirectory(\"tmp\").",
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
          path: "tmp/",
          content: "(dossier)"
        }
      ]
    },
    {
      id: "dl2",
      highlightLines: [
        3
      ],
      narration: "Écrit tmp/a.txt.",
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
          path: "tmp/",
          content: "(dossier)"
        },
        {
          path: "tmp/a.txt",
          content: "x"
        }
      ]
    },
    {
      id: "dl3",
      highlightLines: [
        4
      ],
      narration: "GetFiles → tableau d'1 chemin.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-files",
              name: "files",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-a"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string[]",
          address: "#A1",
          fields: [
            {
              label: "[0]",
              value: "\"tmp/a.txt\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-files",
          fromSlotId: "slot-files",
          toObjectId: "obj-a"
        }
      ],
      consoleLines: [],
      files: [
        {
          path: "tmp/",
          content: "(dossier)"
        },
        {
          path: "tmp/a.txt",
          content: "x"
        }
      ]
    },
    {
      id: "dl4",
      highlightLines: [
        5
      ],
      narration: "Length = 1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-files",
              name: "files",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-a"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string[]",
          address: "#A1",
          fields: [
            {
              label: "[0]",
              value: "\"tmp/a.txt\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-files",
          fromSlotId: "slot-files",
          toObjectId: "obj-a"
        }
      ],
      consoleLines: [
        "1"
      ],
      files: [
        {
          path: "tmp/",
          content: "(dossier)"
        },
        {
          path: "tmp/a.txt",
          content: "x"
        }
      ]
    },
    {
      id: "directory-list-end",
      highlightLines: [
        6
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-files",
              name: "files",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-a"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "string[]",
          address: "#A1",
          fields: [
            {
              label: "[0]",
              value: "\"tmp/a.txt\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-files",
          fromSlotId: "slot-files",
          toObjectId: "obj-a"
        }
      ],
      consoleLines: [
        "1"
      ],
      files: [
        {
          path: "tmp/",
          content: "(dossier)"
        },
        {
          path: "tmp/a.txt",
          content: "x"
        }
      ]
    }
  ]
};
