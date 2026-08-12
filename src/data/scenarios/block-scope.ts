import type { Scenario, StackSlot } from "../../types/memory";

function frame(...slots: StackSlot[]): Scenario["steps"][0]["stack"] {
  return [{ id: "frame-main", method: "Main", slots }];
}

const a = (value = "1"): StackSlot => ({
  id: "slot-a",
  name: "a",
  value,
  kind: "value",
  scopeDepth: 0,
});

const b: StackSlot = {
  id: "slot-b",
  name: "b",
  value: "2",
  kind: "value",
  scopeDepth: 1,
  scopeLabel: "bloc",
};

const c: StackSlot = {
  id: "slot-c",
  name: "c",
  value: "3",
  kind: "value",
  scopeDepth: 2,
  scopeLabel: "bloc",
};

const d: StackSlot = {
  id: "slot-d",
  name: "d",
  value: "4",
  kind: "value",
  scopeDepth: 1,
  scopeLabel: "if",
};

const i: StackSlot = {
  id: "slot-i",
  name: "i",
  value: "0",
  kind: "value",
  scopeDepth: 1,
  scopeLabel: "for",
};

const e: StackSlot = {
  id: "slot-e",
  name: "e",
  value: "5",
  kind: "value",
  scopeDepth: 2,
  scopeLabel: "for",
};

export const blockScopeScenario: Scenario = {
  id: "block-scope",
  title: "Portée de bloc",
  subtitle:
    "Chaque { } (bloc, if, for…) a sa portée : les variables naissent et meurent avec lui.",
  part: "variables",
  code: [
    "static void Main()",
    "{",
    "    int a = 1;",
    "    {",
    "        int b = 2;",
    "        {",
    "            int c = 3;",
    "        }",
    "        // c n'existe plus",
    "    }",
    "    // b n'existe plus",
    "",
    "    if (a > 0)",
    "    {",
    "        int d = 4;",
    "    }",
    "    // d n'existe plus",
    "",
    "    for (int i = 0; i < 1; i++)",
    "    {",
    "        int e = 5;",
    "    }",
    "    // i et e n'existent plus",
    "}",
  ],
  steps: [
    {
      id: "bs0",
      highlightLines: [0, 1],
      narration: "Main démarre. On va enchaîner bloc imbriqué, if, puis for.",
      stack: frame(),
      heap: [],
      refs: [],
    },
    {
      id: "bs1",
      highlightLines: [2],
      narration: "int a = 1 : portée de toute la méthode Main.",
      stack: frame(a()),
      heap: [],
      refs: [],
      focus: "slot-a",
    },
    {
      id: "bs2",
      highlightLines: [3, 4],
      narration: "Premier bloc { } : int b = 2 apparaît dans une portée imbriquée.",
      stack: frame(a(), b),
      heap: [],
      refs: [],
      focus: "slot-b",
    },
    {
      id: "bs3",
      highlightLines: [5, 6],
      narration: "Bloc encore plus profond : int c = 3. a et b restent visibles.",
      stack: frame(a(), b, c),
      heap: [],
      refs: [],
      focus: "slot-c",
    },
    {
      id: "bs4",
      highlightLines: [7, 8],
      narration: "Fin du bloc interne : c disparaît. b vit encore dans son bloc.",
      stack: frame(a(), b),
      heap: [],
      refs: [],
      focus: "slot-b",
    },
    {
      id: "bs5",
      highlightLines: [9, 10],
      narration: "Fin du premier bloc : b disparaît. Seul a reste.",
      stack: frame(a()),
      heap: [],
      refs: [],
      focus: "slot-a",
    },
    {
      id: "bs6",
      highlightLines: [12, 13, 14],
      narration: "if (a > 0) : vraie → on entre. int d = 4 vit seulement dans le if.",
      stack: frame(a(), d),
      heap: [],
      refs: [],
      focus: "slot-d",
    },
    {
      id: "bs7",
      highlightLines: [15, 16],
      narration: "Fin du if : d disparaît. a est toujours là.",
      stack: frame(a()),
      heap: [],
      refs: [],
      focus: "slot-a",
    },
    {
      id: "bs8",
      highlightLines: [18],
      narration: "for (int i = 0; …) : i appartient à la portée du for (pas à Main).",
      stack: frame(a(), i),
      heap: [],
      refs: [],
      focus: "slot-i",
    },
    {
      id: "bs9",
      highlightLines: [19, 20],
      narration: "Corps du for : int e = 5 dans une portée encore plus locale.",
      stack: frame(a(), i, e),
      heap: [],
      refs: [],
      focus: "slot-e",
    },
    {
      id: "bs10",
      highlightLines: [21, 22],
      narration: "Fin du for : i et e disparaissent ensemble. a survit.",
      stack: frame(a()),
      heap: [],
      refs: [],
      focus: "slot-a",
    },
    {
      id: "block-scope-end",
      highlightLines: [23],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: frame(a()),
      heap: [],
      refs: [],
    },
  ],
};
