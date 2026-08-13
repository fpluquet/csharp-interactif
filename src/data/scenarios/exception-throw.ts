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
      narration: "Main va démarrer. Aucune exception pour l’instant.",
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
      narration: "Appeler() : une nouvelle frame va s’empiler.",
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
      narration: "Risquer() : une frame de plus va s’empiler au sommet.",
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
      narration: "throw new InvalidOperationException(\"boom\") : l’exception va être levée.",
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
      narration: "Aucun catch dans Risquer : la frame va être dépilée (unwinding).",
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
      narration: "Appeler non plus : sa frame va disparaître. L’exception va remonter.",
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
      narration: "Main n’a pas de catch non plus : la stack va se vider. Le programme va s’arrêter sur l’exception.",
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
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [],
      heap: [],
      refs: []
    }
  ]
};
