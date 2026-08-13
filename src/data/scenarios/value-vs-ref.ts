import type { Scenario } from "../../types/memory";

export const valueVsRefScenario: Scenario = {
  id: "value-vs-ref",
  title: "Où vit quoi ?",
  subtitle: "Valeur sur la stack, objet sur le heap — côte à côte.",
  part: "memory",
  code: [
    "static void Main()",
    "{",
    "    int n = 5;",
    "    int[] t = { 5 };",
    "}"
  ],
  steps: [
    {
      id: "vv0",
      highlightLines: [
        0,
        1
      ],
      narration: "Main va démarrer.",
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
      id: "vv1",
      highlightLines: [
        2
      ],
      narration: "int n = 5 : la valeur 5 va être dans la frame (stack).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            }
          ]
        }
      ],
      heap: [],
      refs: [],
      focus: "slot-n"
    },
    {
      id: "vv2",
      highlightLines: [
        3
      ],
      narration: "int[] t = {5} : t sur la stack va pointer vers l'objet tableau sur le heap.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-t",
              name: "t",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-t"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-t",
          typeLabel: "int[]",
          address: "#A1",
          fields: [
            {
              label: "[0]",
              value: "5"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-t",
          fromSlotId: "slot-t",
          toObjectId: "obj-t"
        }
      ],
      focus: "obj-t"
    },
    {
      id: "value-vs-ref-end",
      highlightLines: [
        4
      ],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            {
              id: "slot-n",
              name: "n",
              value: "5",
              kind: "value"
            },
            {
              id: "slot-t",
              name: "t",
              value: "→ #A1",
              kind: "ref",
              targetId: "obj-t"
            }
          ]
        }
      ],
      heap: [
        {
          id: "obj-t",
          typeLabel: "int[]",
          address: "#A1",
          fields: [
            {
              label: "[0]",
              value: "5"
            }
          ]
        }
      ],
      refs: [
        {
          id: "ref-t",
          fromSlotId: "slot-t",
          toObjectId: "obj-t"
        }
      ]
    }
  ]
};
