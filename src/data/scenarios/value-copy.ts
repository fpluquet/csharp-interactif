import type { Scenario } from "../../types/memory";

export const valueCopyScenario: Scenario = {
  id: "value-copy",
  title: "Copie de types valeur",
  subtitle: "Affecter copie la valeur — deux cases indépendantes.",
  part: "variables",
  code: [
    "static void Main()",
    "{",
    "    int a = 10;",
    "    int b = a;",
    "    b = 20;",
    "    // a vaut toujours 10",
    "}"
  ],
  steps: [
    {
      id: "v0",
      highlightLines: [
        0,
        1
      ],
      narration: "Frame Main prête. On va voir comment se comportent les types valeur.",
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
        2
      ],
      narration: "int a = 10 : a contient directement la valeur 10 sur la stack.",
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
        3
      ],
      narration: "int b = a : on copie la valeur. b reçoit 10, pas un lien vers a.",
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
        4
      ],
      narration: "b = 20 : seule la case b change. a reste intacte.",
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
        5
      ],
      narration: "Deux variables, deux valeurs. Modifier l’une n’affecte pas l’autre.",
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
        6
      ],
      narration: "La fonction Main est terminée, le programme s'arrête.",
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
