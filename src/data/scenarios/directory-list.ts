import type { Scenario } from "../../types/memory";

export const directoryListScenario: Scenario = {
  id: "directory-list",
  title: "Directory",
  subtitle: "Créer un dossier et lister ses fichiers.",
  part: "files",
  code: [
    "Directory.CreateDirectory(\"tmp\");",
    "File.WriteAllText(\"tmp/a.txt\", \"x\");",
    "string[] files = Directory.GetFiles(\"tmp\");",
    "Console.WriteLine(files.Length);"
  ],
  steps: [
    {
      id: "dl0",
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
      consoleLines: [],
      files: []
    },
    {
      id: "dl1",
      highlightLines: [
        0
      ],
      narration: "On va appeler CreateDirectory(\"tmp\").",
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
        1
      ],
      narration: "On va écrire tmp/a.txt.",
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
        2
      ],
      highlightExpr: "Directory.GetFiles(\"tmp\")",
      narration: "GetFiles va renvoyer un tableau d'1 chemin.",
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
        3
      ],
      narration: "On va afficher Length = 1.",
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
        3
      ],
      narration: "Le programme va s'arrêter.",
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
