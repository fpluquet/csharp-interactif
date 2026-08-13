import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

const cercle = obj("obj-c", "Cercle", "#C1", [{ label: "R", value: "2", kind: "value" }]);

export const classPatternScenario: Scenario = {
  id: "class-pattern",
  title: "Pattern matching",
  subtitle: "switch sur le type réel : Cercle → formule, autre → 0. Extraction de R dans le pattern.",
  part: "oo-pattern",
  code: [
    "abstract class Forme { }",
    "class Cercle : Forme { public int R; public Cercle(int r) { R = r; } }",
    "class Carre : Forme { public int Cote; }",
    "",
    "static double Aire(Forme f) => f switch",
    "{",
    "    Cercle { R: var r } => 3.14 * r * r,",
    "    Carre { Cote: var c } => c * c,",
    "    _ => 0",
    "};",
    "",
    "static void Main()",
    "{",
    "    Forme f = new Cercle(2);",
    "    double a = Aire(f);",
    "}",
  ],
  steps: [
    step("pm0", [11, 12], "Main va démarrer.", main([]), [], []),
    step(
      "pm1",
      [13],
      "Forme f = new Cercle(2) : un Cercle va être créé.",
      main([refSlot("slot-f", "f", "#C1", "obj-c", "Forme")]),
      [cercle],
      [link("ref-f", "slot-f", "obj-c")],
      { focus: "obj-c" },
    ),
    step(
      "pm2",
      [14, 6],
      "Aire(f) : le pattern Cercle { R: var r } va matcher, r va valoir 2 → 12.56.",
      main([
        refSlot("slot-f", "f", "#C1", "obj-c", "Forme"),
        val("slot-a", "a", "12.56"),
      ]),
      [cercle],
      [link("ref-f", "slot-f", "obj-c")],
      { focus: "slot-a" },
    ),
    step(
      "class-pattern-end",
      [15],
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
