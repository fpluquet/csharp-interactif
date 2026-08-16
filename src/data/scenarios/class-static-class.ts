import type { Scenario } from "../../types/memory";
import { MAIN_DONE, main, step, val } from "./ooHelpers";

export const classStaticClassScenario: Scenario = {
  id: "class-static-class",
  title: "Classe statique",
  subtitle: "On ne peut pas faire new : uniquement des membres de classe.",
  part: "oo-static",
  code: [
    "static class Convertisseur",
    "{",
    "    public static double MToCm(double m) => m * 100;",
    "}",
    "",
    "double cm = Convertisseur.MToCm(1.5);",
  ],
  steps: [
    step("ss0", [5], "Le programme va démarrer. Pas d’instance possible.", main([]), [], []),
    step(
      "ss1",
      [5, 2],
      "Convertisseur.MToCm(1.5) va renvoyer 150. Aucun objet ne sera sur le heap.",
      main([val("slot-cm", "cm", "150")]),
      [],
      [],
      { focus: "slot-cm" },
    ),
    step("class-static-class-end", [5], MAIN_DONE, main([val("slot-cm", "cm", "150")]), [], []),
  ],
};
