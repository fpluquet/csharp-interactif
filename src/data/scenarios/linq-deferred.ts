import type { HeapObject, Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step } from "./ooHelpers";

function numsArr(values: number[]): HeapObject {
  return obj(
    "obj-a",
    "int[]",
    "#A1",
    values.map((v, i) => ({ id: `cell-${i}`, label: `[${i}]`, value: String(v) })),
  );
}

const query = obj("obj-q", "IEnumerable<int>", "#Q1", [
  { id: "field-src", label: "source", value: "→ #A1", kind: "ref", targetId: "obj-a" },
  { label: "filtre", value: "n % 2 == 0" },
]);

const pairs = obj("obj-b", "int[]", "#A2", [{ id: "cell-p0", label: "[0]", value: "4" }]);

const nums = refSlot("slot-nums", "nums", "#A1", "obj-a");
const q = refSlot("slot-q", "q", "#Q1", "obj-q", "IEnumerable<int>");
const pairsSlot = refSlot("slot-pairs", "pairs", "#A2", "obj-b");

const refsQ = [
  link("ref-nums", "slot-nums", "obj-a"),
  link("ref-q", "slot-q", "obj-q"),
  fieldLink("ref-src", "field-src", "obj-a"),
];
const refsAll = [...refsQ, link("ref-pairs", "slot-pairs", "obj-b")];

const before = numsArr([1, 2, 3, 4]);
const after = numsArr([1, 9, 3, 4]);

export const linqDeferredScenario: Scenario = {
  id: "linq-deferred",
  title: "LINQ : exécution différée",
  subtitle: "Where sans ToArray : une recette, pas une copie. ToArray lit le tableau maintenant.",
  part: "collections",
  code: [
    "int[] nums = { 1, 2, 3, 4 };",
    "IEnumerable<int> q = nums.Where(n => n % 2 == 0);",
    "nums[1] = 9;",
    "int[] pairs = q.ToArray();",
    "Console.WriteLine(pairs.Length);",
  ],
  steps: [
    step("ld0", [0], "Le programme va démarrer. Where tout seul ne va pas encore parcourir nums.", main([]), [], []),
    step("ld1", [0], "nums va valoir { 1, 2, 3, 4 }.", main([nums]), [before], [link("ref-nums", "slot-nums", "obj-a")], {
      focus: "obj-a",
    }),
    step(
      "ld2",
      [1],
      "Where va créer un itérateur #Q1 qui pointe vers nums. Pas encore de { 2, 4 } : la requête n’a pas été exécutée.",
      main([nums, q]),
      [before, query],
      refsQ,
      { highlightExpr: "nums.Where(n => n % 2 == 0)", focus: "obj-q" },
    ),
    step(
      "ld3",
      [2],
      "nums[1] va passer de 2 à 9. q voit le même tableau : la recette n’a rien figé.",
      main([nums, q]),
      [after, query],
      refsQ,
      { highlightExpr: "nums[1] = 9", focus: "cell-1" },
    ),
    step(
      "ld4",
      [3],
      "ToArray va enfin parcourir : pairs = { 4 } seulement (9 n’est plus pair). Un vrai tableau #A2 va apparaître.",
      main([nums, q, pairsSlot]),
      [after, query, pairs],
      refsAll,
      { highlightExpr: "q.ToArray()", focus: "obj-b" },
    ),
    step(
      "ld5",
      [4],
      "pairs.Length vaut 1. On va afficher 1 — pas 2, parce que le 2 a disparu avant l’exécution.",
      main([nums, q, pairsSlot]),
      [after, query, pairs],
      refsAll,
      { consoleLines: ["1"], focus: "slot-pairs" },
    ),
    step("linq-deferred-end", [4], MAIN_DONE, main([nums, q, pairsSlot]), [after, query, pairs], refsAll, {
      consoleLines: ["1"],
    }),
  ],
};
