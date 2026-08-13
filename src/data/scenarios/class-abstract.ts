import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

const cercle = obj("obj-c", "Cercle", "#C1", [{ label: "Rayon", value: "2", kind: "value" }]);

export const classAbstractScenario: Scenario = {
  id: "class-abstract",
  title: "Classe et méthode abstract",
  subtitle: "On ne new pas Forme : seul Cercle existe, et Aire() est obligatoire.",
  part: "oo-polymorphism",
  code: [
    "abstract class Forme",
    "{",
    "    public abstract double Aire();",
    "}",
    "",
    "class Cercle : Forme",
    "{",
    "    public double Rayon;",
    "    public Cercle(double r) { Rayon = r; }",
    "    public override double Aire() => 3.14 * Rayon * Rayon;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Forme f = new Cercle(2);",
    "    double a = f.Aire();",
    "}",
  ],
  steps: [
    step("ab0", [12, 13], "Main démarre. Forme est abstract : pas d’instance Forme.", main([]), [], []),
    step(
      "ab1",
      [14],
      "Forme f = new Cercle(2) : type déclaré Forme, objet réel Cercle.",
      main([refSlot("slot-f", "f", "#C1", "obj-c", "Forme")]),
      [cercle],
      [link("ref-f", "slot-f", "obj-c")],
      { focus: "obj-c" },
    ),
    step(
      "ab2",
      [15, 9],
      "f.Aire() : liaison dynamique → Cercle.Aire → 12.56.",
      main([
        refSlot("slot-f", "f", "#C1", "obj-c", "Forme"),
        val("slot-a", "a", "12.56"),
      ]),
      [cercle],
      [link("ref-f", "slot-f", "obj-c")],
      {
        focus: "slot-a",
        dispatchFlow: {
          mode: "virtual",
          callExpr: "f.Aire()",
          staticType: "Forme",
          dynamicType: "Cercle",
          chosen: "Cercle.Aire",
          result: "12.56",
        },
      },
    ),
    step(
      "class-abstract-end",
      [16],
      MAIN_DONE,
      main([
        refSlot("slot-f", "f", "#C1", "obj-c", "Forme"),
        val("slot-a", "a", "12.56"),
      ]),
      [cercle],
      [link("ref-f", "slot-f", "obj-c")],
    ),
  ],
};
