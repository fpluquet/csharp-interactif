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
    step("in0", [5, 6], "Main va démarrer.", main([]), [], []),
    step("in1", [7], "n va valoir 4 sur la stack.", main([val("slot-n", "n", "4")]), [], []),
    step(
      "in2",
      [8, 2],
      "Triple(in n) : x va aliasser n (pas de copie). Lecture seulement.",
      main(
        [val("slot-n", "n", "4")],
        [frame("frame-t", "Triple", [val("slot-x", "x (in → n)", "4")])],
      ),
      [],
      [],
      { focus: "frame-t", highlightExpr: "Triple(in n)" },
    ),
    step(
      "in3",
      [8],
      "return 12 → t va valoir 12. n va rester inchangé (et n’aurait pas pu l’être via x).",
      main([val("slot-n", "n", "4"), val("slot-t", "t", "12")]),
      [],
      [],
      {
        focus: "slot-t",
        returnFlow: {
          fromMethod: "Triple",
          callExpr: "Triple(in n)",
          value: "12",
          targetVar: "t",
          phase: "assigned",
          callLine: 8,
        },
      },
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
