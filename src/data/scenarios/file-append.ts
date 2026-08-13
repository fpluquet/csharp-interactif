import type { Scenario } from "../../types/memory";

export const fileAppendScenario: Scenario = {
  id: "file-append",
  title: "AppendAllText",
  subtitle: "Ajoute à la fin sans effacer le début.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    File.AppendAllText(\"log.txt\", \"a\");",
    "    File.AppendAllText(\"log.txt\", \"b\");",
    "}"
  ],
  steps: [
    {
      id: "fa0",
      highlightLines: [
        0,
        1
      ],
      narration: "On va partir d'un log.txt vide.",
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
          path: "log.txt",
          content: ""
        }
      ]
    },
    {
      id: "fa1",
      highlightLines: [
        2
      ],
      narration: "On va ajouter \"a\".",
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
          path: "log.txt",
          content: "a"
        }
      ]
    },
    {
      id: "fa2",
      highlightLines: [
        3
      ],
      narration: "On va ajouter \"b\" → le fichier va valoir \"ab\".",
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
          path: "log.txt",
          content: "ab"
        }
      ]
    },
    {
      id: "file-append-end",
      highlightLines: [
        4
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
          path: "log.txt",
          content: "ab"
        }
      ]
    }
  ]
};
