import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

export const classStaticMethodScenario: Scenario = {
  id: "class-static-method",
  title: "Méthode statique",
  subtitle: "MathUtil.Carre(n) s’appelle sans objet : pas de this.",
  part: "oo-static",
  code: [
    "class MathUtil",
    "{",
    "    public static int Carre(int n) => n * n;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int x = MathUtil.Carre(4);",
    "}",
  ],
  steps: [
    step("sm0", [5, 6], "Main démarre. Aucune instance de MathUtil.", main([]), [], []),
    step(
      "sm1",
      [7, 2],
      "MathUtil.Carre(4) : frame sans this, seulement n = 4.",
      main(
        [],
        [frame("frame-carre", "MathUtil.Carre", [val("slot-n", "n", "4")])],
      ),
      [],
      [],
      { focus: "frame-carre" },
    ),
    step(
      "sm2",
      [7],
      "return 16 → x. Toujours aucun objet heap.",
      main([val("slot-x", "x", "16")]),
      [],
      [],
      { focus: "slot-x" },
    ),
    step("class-static-method-end", [8], MAIN_DONE, main([val("slot-x", "x", "16")]), [], []),
  ],
};
