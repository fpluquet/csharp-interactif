import type { Scenario } from "../../types/memory";

export const valueCopyScenario: Scenario = {
  id: "value-copy",
  title: "Copie de types valeur",
  subtitle: "Affecter copie la valeur — deux cases indépendantes.",
  part: "variables",
  code: [
    "int a = 10;",
    "int b = a;",
    "b = 20;",
    "// a vaut toujours 10"
  ],
  steps: [
    {
      id: "v0",
      highlightLines: [
        0
      ],
      narration: "Le programme va démarrer. On va voir comment vont se comporter les types valeur.",
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
      id: "v1",
      highlightLines: [
        0
      ],
      narration: "int a = 10 : a va contenir directement la valeur 10 sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "10",
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
      id: "v2",
      highlightLines: [
        1
      ],
      narration: "int b = a : on va copier la valeur. b va recevoir 10, pas un lien vers a.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "10",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "10",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-b"
    },
    {
      id: "v3",
      highlightLines: [
        2
      ],
      narration: "b = 20 : seule la case b va changer. a va rester intacte.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "10",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "20",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-b"
    },
    {
      id: "v4",
      highlightLines: [
        3
      ],
      narration: "Deux variables, deux valeurs. Modifier l’une ne va pas affecter l’autre.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-a",
              name: "a",
              value: "10",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "20",
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
      id: "value-copy-end",
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
              id: "slot-a",
              name: "a",
              value: "10",
              kind: "value"
            },
            {
              id: "slot-b",
              name: "b",
              value: "20",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: []
    }
  ]
};
