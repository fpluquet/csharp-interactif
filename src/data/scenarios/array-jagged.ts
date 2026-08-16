import type { HeapObject, RefLink, Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, val } from "./ooHelpers";

const outerNull = obj("obj-g", "int[][]", "#G1", [
  { label: "[0]", value: "null", kind: "ref" },
  { label: "[1]", value: "null", kind: "ref" },
]);

const row0 = obj("obj-r0", "int[]", "#A1", [
  { label: "[0]", value: "1" },
  { label: "[1]", value: "2" },
  { label: "[2]", value: "3" },
]);
const row1 = obj("obj-r1", "int[]", "#A2", [
  { label: "[0]", value: "4" },
]);

const outerRow0 = obj("obj-g", "int[][]", "#G1", [
  { id: "field-g0", label: "[0]", value: "→ #A1", kind: "ref", targetId: "obj-r0" },
  { label: "[1]", value: "null", kind: "ref" },
]);

const outerFull = obj("obj-g", "int[][]", "#G1", [
  { id: "field-g0", label: "[0]", value: "→ #A1", kind: "ref", targetId: "obj-r0" },
  { id: "field-g1", label: "[1]", value: "→ #A2", kind: "ref", targetId: "obj-r1" },
]);

const heapRow0: HeapObject[] = [outerRow0, row0];
const heapFull: HeapObject[] = [outerFull, row0, row1];

const slotG = refSlot("slot-g", "g", "#G1", "obj-g", "int[][]");
const rOuter = [link("ref-g", "slot-g", "obj-g")];
const rRow0: RefLink[] = [...rOuter, fieldLink("ref-g0", "field-g0", "obj-r0")];
const rAll: RefLink[] = [
  ...rOuter,
  fieldLink("ref-g0", "field-g0", "obj-r0"),
  fieldLink("ref-g1", "field-g1", "obj-r1"),
];

export const arrayJaggedScenario: Scenario = {
  id: "array-jagged",
  title: "Tableau jagged",
  subtitle: "int[][] : un tableau de références. Chaque ligne est un objet à part, de longueur libre.",
  part: "collections",
  code: [
    "int[][] g = new int[2][];",
    "g[0] = new int[] { 1, 2, 3 };",
    "g[1] = new int[] { 4 };",
    "int v = g[0][2];",
    "Console.WriteLine(v);",
    "Console.WriteLine(g[1].Length);",
  ],
  steps: [
    step(
      "jg0",
      [0],
      "Le programme va démarrer. Un jagged n’est pas int[,] : c’est un tableau dont les cases sont des références vers d’autres tableaux.",
      main([]),
      [],
      [],
      { consoleLines: [] },
    ),
    step(
      "jg-outer",
      [0],
      "new int[2][] : seulement le tableau extérieur — 2 cases, encore null. Aucune ligne n’existe.",
      main([slotG]),
      [outerNull],
      rOuter,
      { highlightExpr: "new int[2][]", focus: "obj-g", consoleLines: [] },
    ),
    step(
      "jg-row0",
      [1],
      "g[0] = { 1, 2, 3 } : une première ligne (longueur 3) va être créée. g[1] reste null.",
      main([slotG]),
      heapRow0,
      rRow0,
      { highlightExpr: "new int[] { 1, 2, 3 }", focus: "obj-r0", consoleLines: [] },
    ),
    step(
      "jg-row1",
      [2],
      "g[1] = { 4 } : deuxième ligne, longueur 1. Les lignes n’ont pas la même taille — impossible avec int[,].",
      main([slotG]),
      heapFull,
      rAll,
      { highlightExpr: "new int[] { 4 }", focus: "obj-r1", consoleLines: [] },
    ),
    step(
      "jg-index",
      [3],
      "g[0][2] : deux crochets, deux sauts — d’abord la référence g[0] vers #A1, puis la case [2] qui vaut 3.",
      main([slotG, val("slot-v", "v", "3")]),
      heapFull,
      rAll,
      { highlightExpr: "g[0][2]", focus: "slot-v", consoleLines: [] },
    ),
    step(
      "jg-print-v",
      [4],
      "On va afficher 3.",
      main([slotG, val("slot-v", "v", "3")]),
      heapFull,
      rAll,
      { consoleLines: ["3"] },
    ),
    step(
      "jg-len",
      [5],
      "g[1].Length va valoir 1 : Length est celui de cette ligne, pas du jagged entier (g.Length vaut 2).",
      main([slotG, val("slot-v", "v", "3")]),
      heapFull,
      rAll,
      { highlightExpr: "g[1].Length", focus: "obj-r1", consoleLines: ["3", "1"] },
    ),
    step(
      "array-jagged-end",
      [5],
      MAIN_DONE,
      main([slotG, val("slot-v", "v", "3")]),
      heapFull,
      rAll,
      { consoleLines: ["3", "1"] },
    ),
  ],
};
