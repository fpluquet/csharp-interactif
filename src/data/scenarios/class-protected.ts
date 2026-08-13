import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const nom = strObj("obj-s", "#S1", "Rex");

export const classProtectedScenario: Scenario = {
  id: "class-protected",
  title: "protected",
  subtitle: "Age est visible dans Chien, pas depuis Main : on passe par Vieillir().",
  part: "oo-heritage",
  code: [
    "class Animal",
    "{",
    "    public string Nom;",
    "    protected int Age;",
    "    public Animal(string nom) { Nom = nom; Age = 0; }",
    "}",
    "",
    "class Chien : Animal",
    "{",
    "    public Chien(string nom) : base(nom) { }",
    "    public void Vieillir() { Age++; }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Chien c = new Chien(\"Rex\");",
    "    c.Vieillir();",
    "    // c.Age interdit ici",
    "}",
  ],
  steps: [
    step("pr0", [13, 14], "Main va démarrer.", main([]), [], []),
    step(
      "pr1",
      [15],
      "new Chien : l’objet va avoir Nom (public) et Age (protected, 0).",
      main([refSlot("slot-c", "c", "#C1", "obj-c", "Chien")]),
      [
        obj("obj-c", "Chien", "#C1", [
          { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          { label: "Age (protected)", value: "0", kind: "value" },
        ]),
        nom,
      ],
      [link("ref-c", "slot-c", "obj-c"), fieldLink("ref-nom", "field-nom", "obj-s")],
      { focus: "obj-c" },
    ),
    step(
      "pr2",
      [16, 10],
      "c.Vieillir() : code de Chien, donc Age++ va être autorisé → 1. Main ne pourra pas écrire c.Age.",
      main([refSlot("slot-c", "c", "#C1", "obj-c", "Chien")]),
      [
        obj("obj-c", "Chien", "#C1", [
          { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          { label: "Age (protected)", value: "1", kind: "value" },
        ]),
        nom,
      ],
      [link("ref-c", "slot-c", "obj-c"), fieldLink("ref-nom", "field-nom", "obj-s")],
      { focus: "obj-c" },
    ),
    step(
      "class-protected-end",
      [18],
      MAIN_DONE,
      main([refSlot("slot-c", "c", "#C1", "obj-c", "Chien")]),
      [
        obj("obj-c", "Chien", "#C1", [
          { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          { label: "Age (protected)", value: "1", kind: "value" },
        ]),
        nom,
      ],
      [link("ref-c", "slot-c", "obj-c"), fieldLink("ref-nom", "field-nom", "obj-s")],
    ),
  ],
};
