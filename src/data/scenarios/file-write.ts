import type { Scenario } from "../../types/memory";

export const fileWriteScenario: Scenario = {
  id: "file-write",
  title: "Écrire un fichier",
  subtitle: "WriteAllText crée/écrase le fichier virtuel.",
  part: "files",
  code: [
    "File.WriteAllText(\"out.txt\", \"OK\");"
  ],
  steps: [
    {
      id: "fw0",
      highlightLines: [
        0
      ],
      narration: "out.txt n'existera pas encore.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      files: []
    },
    {
      id: "fw1",
      highlightLines: [
        0
      ],
      narration: "WriteAllText va créer out.txt avec OK.",
      highlightExpr: "File.WriteAllText(\"out.txt\", \"OK\")",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      files: [
        {
          path: "out.txt",
          content: "OK"
        }
      ]
    },
    {
      id: "file-write-end",
      highlightLines: [
        0
      ],
      narration: "Le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      files: [
        {
          path: "out.txt",
          content: "OK"
        }
      ]
    }
  ]
};
