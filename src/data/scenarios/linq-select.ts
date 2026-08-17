import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

function arr(id: string, addr: string, values: number[]) {
  return obj(
    id,
    "int[]",
    addr,
    values.map((v, i) => ({ id: `${id}-${i}`, label: `[${i}]`, value: String(v) })),
  );
}

const nums = refSlot("slot-nums", "nums", "#A1", "obj-a");
const doubles = refSlot("slot-doubles", "doubles", "#A2", "obj-b");
const src = arr("obj-a", "#A1", [1, 2, 3]);
const dst = arr("obj-b", "#A2", [2, 4, 6]);
const refsBoth = [link("ref-nums", "slot-nums", "obj-a"), link("ref-doubles", "slot-doubles", "obj-b")];

export const linqSelectScenario: Scenario = {
  id: "linq-select",
  title: "LINQ Select",
  subtitle: "Select projette chaque élément ; un nouveau tableau, nums intact.",
  part: "collections",
  code: [
    "int[] nums = { 1, 2, 3 };",
    "int[] doubles = nums.Select(n => n * 2).ToArray();",
    "Console.WriteLine(doubles[1]);",
  ],
  steps: [
    step("ls0", [0], "Le programme va démarrer.", main([]), [], []),
    step("ls1", [0], "nums va valoir { 1, 2, 3 } sur le heap.", main([nums]), [src], [link("ref-nums", "slot-nums", "obj-a")], {
      focus: "obj-a",
    }),
    step(
      "ls2",
      [1],
      "Select(n => n * 2) + ToArray : un nouveau tableau { 2, 4, 6 } va apparaître. nums reste { 1, 2, 3 }.",
      main([nums, doubles]),
      [src, dst],
      refsBoth,
      { highlightExpr: "nums.Select(n => n * 2).ToArray()", focus: "obj-b" },
    ),
    step(
      "ls3",
      [2],
      "doubles[1] vaut 4. On va afficher 4.",
      main([nums, doubles]),
      [src, dst],
      refsBoth,
      { consoleLines: ["4"], focus: "obj-b-1" },
    ),
    step("linq-select-end", [2], MAIN_DONE, main([nums, doubles]), [src, dst], refsBoth, {
      consoleLines: ["4"],
    }),
  ],
};
