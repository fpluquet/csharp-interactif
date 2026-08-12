import type { Scenario } from "../../types/memory";

export const exceptionThrowScenario: Scenario = {
  id: "exception-throw",
  title: "Exception non gérée",
  subtitle: "throw dépile les frames jusqu’à quitter le programme.",
  part: "exceptions",
  code: [
    "static void Risquer()",
    "{",
    "    throw new InvalidOperationException(\"boom\");",
    "}",
    "",
    "static void Appeler()",
    "{",
    "    Risquer();",
    "}",
    "",
    "static void Main()",
    "{",
    "    Appeler();",
    "}"
  ],
  steps: [
    {
      id: "et0",
      highlightLines: [
        10,
        11
      ],
      narration: "Main démarre. Aucune exception pour l’instant.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: []
    },
    {
      id: "et1",
      highlightLines: [
        12
      ],
      narration: "Appeler() : une nouvelle frame s’empile.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-appeler",
          method: "Appeler",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-appeler"
    },
    {
      id: "et2",
      highlightLines: [
        7
      ],
      narration: "Risquer() : encore une frame au sommet.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-appeler",
          method: "Appeler",
          slots: []
        },
        {
          id: "frame-risquer",
          method: "Risquer",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-risquer"
    },
    {
      id: "et3",
      highlightLines: [
        2
      ],
      narration: "throw new InvalidOperationException(\"boom\") : l’exception est levée.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-appeler",
          method: "Appeler",
          slots: []
        },
        {
          id: "frame-risquer",
          method: "Risquer",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-risquer",
      exceptionFlow: {
        typeName: "InvalidOperationException",
        message: "boom",
        phase: "throwing"
      }
    },
    {
      id: "et4",
      highlightLines: [
        2
      ],
      narration: "Aucun catch dans Risquer : la frame est dépilée (unwinding).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        },
        {
          id: "frame-appeler",
          method: "Appeler",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-appeler",
      exceptionFlow: {
        typeName: "InvalidOperationException",
        message: "boom",
        phase: "unwinding"
      }
    },
    {
      id: "et5",
      highlightLines: [
        7
      ],
      narration: "Appeler non plus : sa frame disparaît. L’exception remonte.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main",
      exceptionFlow: {
        typeName: "InvalidOperationException",
        message: "boom",
        phase: "unwinding"
      }
    },
    {
      id: "et6",
      highlightLines: [
        12
      ],
      narration: "Main n’a pas de catch non plus : la stack se vide. Le programme s’arrête sur l’exception.",
      stack: [],
      heap: [],
      refs: [],
      exceptionFlow: {
        typeName: "InvalidOperationException",
        message: "boom",
        phase: "unwinding"
      }
    },
    {
      id: "exception-throw-end",
      highlightLines: [
        13
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [],
      heap: [],
      refs: []
    }
  ]
};
