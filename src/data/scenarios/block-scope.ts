import type { Scenario } from "../../types/memory";

export const blockScopeScenario: Scenario = {
  id: "block-scope",
  title: "Portée de bloc",
  subtitle: "Une variable locale vit seulement dans son { }.",
  part: "variables",
  code: [
    "static void Main()",
    "{",
    "    int a = 1;",
    "    {",
    "        int b = 2;",
    "        // b existe ici",
    "    }",
    "    // b n'existe plus",
    "}",
  ],
  steps: [
    {
      id: "bs0",
      highlightLines: [0, 1],
      narration: "Main démarre.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "bs1",
      highlightLines: [2],
      narration: "int a = 1 : portée de la méthode Main.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "1", kind: "value", scopeDepth: 0 },
          ],
        },
      ],
      heap: [],
      refs: [],
      focus: "slot-a",
    },
    {
      id: "bs2",
      highlightLines: [3, 4],
      narration: "Bloc interne : b apparaît dans une portée imbriquée { }.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "1", kind: "value", scopeDepth: 0 },
            {
              id: "slot-b",
              name: "b",
              value: "2",
              kind: "value",
              scopeDepth: 1,
              scopeLabel: "bloc",
            },
          ],
        },
      ],
      heap: [],
      refs: [],
      focus: "slot-b",
    },
    {
      id: "bs3",
      highlightLines: [6, 7],
      narration: "Fin du bloc : la portée disparaît, b aussi. a reste.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "1", kind: "value", scopeDepth: 0 },
          ],
        },
      ],
      heap: [],
      refs: [],
      focus: "slot-a",
    },
    {
      id: "block-scope-end",
      highlightLines: [8],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "1", kind: "value", scopeDepth: 0 },
          ],
        },
      ],
      heap: [],
      refs: [],
    },
  ],
};
