import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

export const paramInScenario: Scenario = {
  id: "param-in",
  title: "Paramètre in",
  subtitle: "in passe une référence en lecture seule : on ne peut pas réassigner le paramètre.",
  part: "functions",
  code: [
    "static int Triple(in int x)",
    "{",
    "    return x * 3;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int n = 4;",
    "    int t = Triple(in n);",
    "}",
  ],
  steps: [
    step("in0", [5, 6], "Main démarre.", main([]), [], []),
    step("in1", [7], "n = 4 sur la stack.", main([val("slot-n", "n", "4")]), [], []),
    step(
      "in2",
      [8, 2],
      "Triple(in n) : x aliasse n (pas de copie). Lecture seulement.",
      main(
        [val("slot-n", "n", "4")],
        [frame("frame-t", "Triple", [val("slot-x", "x (in → n)", "4")])],
      ),
      [],
      [],
      { focus: "frame-t" },
    ),
    step(
      "in3",
      [8],
      "return 12 → t. n est inchangé (et n’aurait pas pu l’être via x).",
      main([val("slot-n", "n", "4"), val("slot-t", "t", "12")]),
      [],
      [],
      { focus: "slot-t" },
    ),
    step(
      "param-in-end",
      [9],
      MAIN_DONE,
      main([val("slot-n", "n", "4"), val("slot-t", "t", "12")]),
      [],
      [],
    ),
  ],
};
