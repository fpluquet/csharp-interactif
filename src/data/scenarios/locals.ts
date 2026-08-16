import type { Scenario } from "../../types/memory";

export const localsScenario: Scenario = {
  id: "locals",
  title: "Variables locales",
  subtitle: "La stack empile les variables du programme.",
  part: "variables",
  code: [
    "int a = 5;",
    "bool ok = true;",
    "double pi = 3.14;"
  ],
  steps: [
    {
      id: "l0",
      highlightLines: [
        0
      ],
      narration: "Le programme va démarrer. La stack va démarrer vide.",
      stack: [],
      heap: [],
      refs: []
    },
    {
      id: "l1",
      highlightLines: [
        0
      ],
      narration: "Une frame Main va apparaître : c'est le cadre d'exécution de la méthode.",
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
        0
      ],
      narration: "int a = 5 : la valeur 5 va être stockée directement sur la stack.",
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
        1
      ],
      narration: "bool ok = true : un autre type valeur va s'ajouter dans la même frame.",
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
        2
      ],
      narration: "double pi = 3.14 : les locaux vont s'empiler dans la frame courante.",
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
        2
      ],
      narration: "Le programme va s'arrêter.",
      stack: [],
      heap: [],
      refs: []
    }
  ]
};
