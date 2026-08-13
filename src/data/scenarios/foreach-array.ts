import type { Scenario, StackFrame, StackSlot } from "../../types/memory";

const heap = [
  {
    id: "obj-a",
    typeLabel: "int[]",
    address: "#A1",
    fields: [
      { label: "[0]", value: "10" },
      { label: "[1]", value: "20" },
    ],
  },
];

function frame(n?: string): StackFrame[] {
  const slots: StackSlot[] = [
    {
      id: "slot-nums",
      name: "nums",
      value: "→ #A1",
      kind: "ref",
      targetId: "obj-a",
    },
  ];
  if (n !== undefined) {
    slots.push({
      id: "slot-n",
      name: "n",
      value: n,
      kind: "value",
      scopeDepth: 1,
      scopeLabel: "foreach",
    });
  }
  return [{ id: "frame-main", method: "Main", slots }];
}

const refs = [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }];

export const foreachArrayScenario: Scenario = {
  id: "foreach-array",
  title: "foreach sur tableau",
  subtitle: "Prochain élément → corps → prochain… jusqu’à épuisement.",
  part: "control",
  code: [
    "static void Main()",
    "{",
    "    int[] nums = { 10, 20 };",
    "    foreach (int n in nums)",
    "    {",
    "        Console.WriteLine(n);",
    "    }",
    "}",
  ],
  steps: [
    {
      id: "fe0",
      highlightLines: [0, 1],
      narration: "Main va démarrer.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
      consoleLines: [],
    },
    {
      id: "fe1",
      highlightLines: [2],
      narration: "Le tableau {10, 20} va être créé sur le heap.",
      stack: frame(),
      heap,
      refs,
      consoleLines: [],
    },
    {
      id: "fe2",
      highlightLines: [3],
      narration: "foreach : y aura-t-il un prochain élément ? Oui → n va valoir 10.",
      stack: frame("10"),
      heap,
      refs,
      focus: "slot-n",
      consoleLines: [],
      loopFlow: {
        kind: "foreach",
        phase: "test",
        condition: "encore un élément ?",
        conditionResult: true,
        detail: "n = 10",
        iteration: 1,
      },
    },
    {
      id: "fe3",
      highlightLines: [5],
      narration: "Corps (tour 1) : on va afficher 10.",
      stack: frame("10"),
      heap,
      refs,
      consoleLines: ["10"],
      loopFlow: { kind: "foreach", phase: "body", iteration: 1, detail: "WriteLine(10)" },
    },
    {
      id: "fe4",
      highlightLines: [3],
      narration: "Prochain élément ? Oui → n va valoir 20.",
      stack: frame("20"),
      heap,
      refs,
      focus: "slot-n",
      consoleLines: ["10"],
      loopFlow: {
        kind: "foreach",
        phase: "test",
        condition: "encore un élément ?",
        conditionResult: true,
        detail: "n = 20",
        iteration: 2,
      },
    },
    {
      id: "fe5",
      highlightLines: [5],
      narration: "Corps (tour 2) : on va afficher 20.",
      stack: frame("20"),
      heap,
      refs,
      consoleLines: ["10", "20"],
      loopFlow: { kind: "foreach", phase: "body", iteration: 2, detail: "WriteLine(20)" },
    },
    {
      id: "fe6",
      highlightLines: [3],
      narration: "Plus d'élément → on va quitter le foreach.",
      stack: frame("20"),
      heap,
      refs,
      consoleLines: ["10", "20"],
      loopFlow: {
        kind: "foreach",
        phase: "done",
        condition: "encore un élément ?",
        conditionResult: false,
        detail: "épuisé",
      },
    },
    {
      id: "foreach-array-end",
      highlightLines: [7],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: frame("20"),
      heap,
      refs,
      consoleLines: ["10", "20"],
    },
  ],
};
