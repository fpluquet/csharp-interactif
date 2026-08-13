import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

const arr = obj("obj-a", "int[]", "#A1", [
  { label: "[0]", value: "2" },
  { label: "[1]", value: "5" },
  { label: "[2]", value: "3" },
]);

export const paramParamsScenario: Scenario = {
  id: "param-params",
  title: "params",
  subtitle: "Somme(2, 5, 3) emballe les arguments dans un tableau créé pour l’appel.",
  part: "functions",
  code: [
    "static int Somme(params int[] vals)",
    "{",
    "    int s = 0;",
    "    foreach (int v in vals) s += v;",
    "    return s;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int t = Somme(2, 5, 3);",
    "}",
  ],
  steps: [
    step("pp0", [7, 8], "Main démarre.", main([]), [], []),
    step(
      "pp1",
      [9],
      "Somme(2, 5, 3) : le runtime alloue un int[] de 3 éléments, passé à vals.",
      main(
        [],
        [
          frame("frame-s", "Somme", [
            refSlot("slot-vals", "vals", "#A1", "obj-a"),
            val("slot-s", "s", "0"),
          ]),
        ],
      ),
      [arr],
      [link("ref-vals", "slot-vals", "obj-a")],
      { focus: "obj-a" },
    ),
    step(
      "pp2",
      [3],
      "foreach : s accumule 2 + 5 + 3 → 10.",
      main(
        [],
        [
          frame("frame-s", "Somme", [
            refSlot("slot-vals", "vals", "#A1", "obj-a"),
            val("slot-s", "s", "10"),
          ]),
        ],
      ),
      [arr],
      [link("ref-vals", "slot-vals", "obj-a")],
      { focus: "slot-s" },
    ),
    step(
      "pp3",
      [9],
      "return 10 → t. Le tableau temporaire n’est plus référencé.",
      main([val("slot-t", "t", "10")]),
      [{ ...arr, orphan: true }],
      [],
      { focus: "slot-t" },
    ),
    step("param-params-end", [10], MAIN_DONE, main([val("slot-t", "t", "10")]), [], []),
  ],
};
