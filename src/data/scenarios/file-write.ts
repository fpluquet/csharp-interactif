import type { Scenario } from "../../types/memory";

export const fileWriteScenario: Scenario = {
  id: "file-write",
  title: "Écrire un fichier",
  subtitle: "WriteAllText crée/écrase le fichier virtuel.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    File.WriteAllText(\"out.txt\", \"OK\");",
    "}"
  ],
  steps: [
    {
      id: "fw0",
      highlightLines: [
        0,
        1
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
        2
      ],
      narration: "WriteAllText va créer out.txt avec OK.",
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
        3
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
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
