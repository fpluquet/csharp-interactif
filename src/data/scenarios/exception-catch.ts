import type { Scenario } from "../../types/memory";

export const exceptionCatchScenario: Scenario = {
  id: "exception-catch",
  title: "try / catch",
  subtitle: "Un catch arrête le dépilement : la stack se stabilise.",
  part: "exceptions",
  code: [
    "static void Risquer()",
    "{",
    "    throw new InvalidOperationException(\"boom\");",
    "}",
    "",
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        Risquer();",
    "    }",
    "    catch (InvalidOperationException ex)",
    "    {",
    "        Console.WriteLine(ex.Message);",
    "    }",
    "    // on continue ici",
    "}"
  ],
  steps: [
    {
      id: "ec0",
      highlightLines: [
        5,
        6
      ],
      narration: "Main démarre. Un bloc try/catch protège l’appel.",
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
      id: "ec1",
      highlightLines: [
        7,
        8,
        9
      ],
      narration: "On entre dans le try. Risquer() va être appelé.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main"
    },
    {
      id: "ec2",
      highlightLines: [
        9
      ],
      narration: "Frame Risquer empilée au-dessus de Main.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
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
      id: "ec3",
      highlightLines: [
        2
      ],
      narration: "throw : l’exception est levée dans Risquer.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
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
      id: "ec4",
      highlightLines: [
        2
      ],
      narration: "Pas de catch dans Risquer : sa frame est dépilée. L’exception remonte vers Main.",
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
      id: "ec5",
      highlightLines: [
        11,
        12,
        13
      ],
      narration: "Main a un catch compatible : l’exception est attrapée. ex reçoit le message. La stack reste.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-ex",
              name: "ex",
              value: "→ #EX1",
              kind: "ref",
              targetId: "obj-ex"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-ex",
          typeLabel: "InvalidOperationException",
          address: "#EX1",
          fields: [
            {
              label: "Message",
              value: "\"boom\""
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-ex",
          fromSlotId: "slot-ex",
          toObjectId: "obj-ex"
        }
      ],
      focus: "obj-ex",
      exceptionFlow: {
        typeName: "InvalidOperationException",
        message: "boom",
        phase: "caught",
        catchMethod: "Main"
      }
    },
    {
      id: "ec6",
      highlightLines: [
        15
      ],
      narration: "Après le catch, l’exécution reprend dans Main. Contrairement au throw non géré, le programme continue.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: [],
      focus: "frame-main"
    },
    {
      id: "exception-catch-end",
      highlightLines: [
        16
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: []
        }
      ],
      heap: [],
      refs: []
    }
  ]
};
