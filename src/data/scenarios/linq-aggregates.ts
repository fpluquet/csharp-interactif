import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

const notes = refSlot("slot-notes", "notes", "#A1", "obj-a");
const heap = [
  obj("obj-a", "int[]", "#A1", [
    { id: "cell-0", label: "[0]", value: "12" },
    { id: "cell-1", label: "[1]", value: "15" },
    { id: "cell-2", label: "[2]", value: "8" },
  ]),
];
const refs = [link("ref-notes", "slot-notes", "obj-a")];
const n = val("slot-n", "n", "3");
const s = val("slot-s", "s", "35");
const m = val("slot-m", "m", "15");

export const linqAggregatesScenario: Scenario = {
  id: "linq-aggregates",
  title: "LINQ Count, Sum, Max",
  subtitle: "Count / Sum / Max : un nombre sur la stack, pas une nouvelle séquence.",
  part: "collections",
  code: [
    "int[] notes = { 12, 15, 8 };",
    "int n = notes.Count();",
    "int s = notes.Sum();",
    "int m = notes.Max();",
    "Console.WriteLine(s);",
  ],
  steps: [
    step("la0", [0], "Le programme va démarrer. LINQ peut aussi produire un seul nombre.", main([]), [], []),
    step("la1", [0], "notes va valoir { 12, 15, 8 } sur le heap.", main([notes]), heap, refs, {
      focus: "obj-a",
    }),
    step("la2", [1], "Count() va parcourir la séquence et poser 3 dans n. Pas de nouveau tableau.", main([notes, n]), heap, refs, {
      highlightExpr: "notes.Count()",
      focus: "slot-n",
    }),
    step("la3", [2], "Sum() va additionner 12 + 15 + 8. s va valoir 35, toujours sur la stack.", main([notes, n, s]), heap, refs, {
      highlightExpr: "notes.Sum()",
      focus: "slot-s",
    }),
    step("la4", [3], "Max() va valoir 15. notes n’a pas bougé.", main([notes, n, s, m]), heap, refs, {
      highlightExpr: "notes.Max()",
      focus: "slot-m",
    }),
    step("la5", [4], "On va afficher s, donc 35.", main([notes, n, s, m]), heap, refs, {
      consoleLines: ["35"],
      focus: "slot-s",
    }),
    step("linq-aggregates-end", [4], MAIN_DONE, main([notes, n, s, m]), heap, refs, {
      consoleLines: ["35"],
    }),
  ],
};
