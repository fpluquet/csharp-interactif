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
const tri = refSlot("slot-tri", "tri", "#A2", "obj-b");
const src = arr("obj-a", "#A1", [3, 1, 2]);
const dst = arr("obj-b", "#A2", [1, 2, 3]);
const refsBoth = [link("ref-nums", "slot-nums", "obj-a"), link("ref-tri", "slot-tri", "obj-b")];

export const linqOrderByScenario: Scenario = {
  id: "linq-orderby",
  title: "LINQ OrderBy",
  subtitle: "OrderBy produit une nouvelle séquence triée ; nums n’est pas modifié.",
  part: "collections",
  code: [
    "int[] nums = { 3, 1, 2 };",
    "int[] tri = nums.OrderBy(n => n).ToArray();",
    "Console.WriteLine(tri[0]);",
  ],
  steps: [
    step("lo0", [0], "Le programme va démarrer.", main([]), [], []),
    step("lo1", [0], "nums va valoir { 3, 1, 2 } — pas encore trié.", main([nums]), [src], [link("ref-nums", "slot-nums", "obj-a")], {
      focus: "obj-a",
    }),
    step(
      "lo2",
      [1],
      "OrderBy + ToArray : un nouveau tableau { 1, 2, 3 } va être créé. nums reste { 3, 1, 2 }.",
      main([nums, tri]),
      [src, dst],
      refsBoth,
      { highlightExpr: "nums.OrderBy(n => n).ToArray()", focus: "obj-b" },
    ),
    step(
      "lo3",
      [2],
      "tri[0] vaut 1 (le plus petit). On va afficher 1.",
      main([nums, tri]),
      [src, dst],
      refsBoth,
      { consoleLines: ["1"], focus: "obj-b-0" },
    ),
    step("linq-orderby-end", [2], MAIN_DONE, main([nums, tri]), [src, dst], refsBoth, {
      consoleLines: ["1"],
    }),
  ],
};
