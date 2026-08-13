import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

export const classYieldScenario: Scenario = {
  id: "class-yield",
  title: "yield return",
  subtitle: "Paires() ne construit pas toute la liste d’un coup : chaque MoveNext produit une valeur.",
  part: "oo-advanced",
  code: [
    "static IEnumerable<int> Paires()",
    "{",
    "    yield return 2;",
    "    yield return 4;",
    "}",
    "",
    "static void Main()",
    "{",
    "    foreach (int n in Paires())",
    "        Console.WriteLine(n);",
    "}",
  ],
  steps: [
    step("y0", [6, 7], "Main démarre.", main([]), [], []),
    step(
      "y1",
      [8],
      "foreach appelle Paires() : un itérateur (machine à états) est créé, pas encore de yield.",
      main(
        [refSlot("slot-it", "iter", "#I1", "obj-it")],
        [frame("frame-enum", "Paires (iter)", [val("slot-state", "état", "0")])],
      ),
      [obj("obj-it", "IEnumerator<int>", "#I1", [{ label: "Current", value: "∅" }])],
      [link("ref-it", "slot-it", "obj-it")],
      { focus: "obj-it" },
    ),
    step(
      "y2",
      [2, 8],
      "MoveNext : yield return 2. Current = 2, n = 2. Paires est suspendu.",
      main([
        refSlot("slot-it", "iter", "#I1", "obj-it"),
        { id: "slot-n", name: "n", value: "2", kind: "value", scopeDepth: 1, scopeLabel: "foreach" },
      ]),
      [obj("obj-it", "IEnumerator<int>", "#I1", [{ label: "Current", value: "2" }])],
      [link("ref-it", "slot-it", "obj-it")],
      { consoleLines: ["2"], focus: "slot-n" },
    ),
    step(
      "y3",
      [3, 8],
      "Tour suivant : yield return 4. Current = 4. Toujours le même itérateur.",
      main([
        refSlot("slot-it", "iter", "#I1", "obj-it"),
        { id: "slot-n", name: "n", value: "4", kind: "value", scopeDepth: 1, scopeLabel: "foreach" },
      ]),
      [obj("obj-it", "IEnumerator<int>", "#I1", [{ label: "Current", value: "4" }])],
      [link("ref-it", "slot-it", "obj-it")],
      { consoleLines: ["2", "4"], focus: "slot-n" },
    ),
    step(
      "y4",
      [8],
      "Plus de yield : MoveNext = false, foreach s’arrête.",
      main([refSlot("slot-it", "iter", "#I1", "obj-it")]),
      [obj("obj-it", "IEnumerator<int>", "#I1", [{ label: "Current", value: "4" }])],
      [link("ref-it", "slot-it", "obj-it")],
      { consoleLines: ["2", "4"] },
    ),
    step(
      "class-yield-end",
      [10],
      MAIN_DONE,
      main([]),
      [],
      [],
      { consoleLines: ["2", "4"] },
    ),
  ],
};
