import type { Scenario } from "../../types/memory";

export const localsScenario: Scenario = {
  id: "locals",
  title: "Variables locales",
  subtitle: "La stack empile les variables du programme.",
  part: "variables",
  code: [
    "static void Main()",
    "{",
    "    int a = 5;",
    "    bool ok = true;",
    "    double pi = 3.14;",
    "}"
  ],
  steps: [
    {
      id: "l0",
      highlightLines: [
        0
      ],
      narration: "On entre dans Main. La stack démarre vide.",
      stack: [],
      heap: [],
      refs: []
    },
    {
      id: "l1",
      highlightLines: [
        0,
        1
      ],
      narration: "Une frame Main apparaît : c’est le cadre d’exécution de la méthode.",
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
      id: "l2",
      highlightLines: [
        2
      ],
      narration: "int a = 5 : la valeur 5 est stockée directement sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-a"
    },
    {
      id: "l3",
      highlightLines: [
        3
      ],
      narration: "bool ok = true : un autre type valeur s’ajoute dans la même frame.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-ok"
    },
    {
      id: "l4",
      highlightLines: [
        4
      ],
      narration: "double pi = 3.14 : les locaux s’empilent dans la frame courante.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-ok",
              name: "ok",
              value: "true",
              kind: "value"
            },
            {
              id: "slot-pi",
              name: "pi",
              value: "3.14",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-pi"
    },
    {
      id: "l5",
      highlightLines: [
        5
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [],
      heap: [],
      refs: []
    }
  ]
};
