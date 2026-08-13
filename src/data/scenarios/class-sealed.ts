import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const nom = strObj("obj-s", "#S1", "Rex");
const heap = [
  obj("obj-c", "Chien", "#C1", [
    { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
  ]),
  nom,
];
const refs = [link("ref-c", "slot-c", "obj-c"), fieldLink("ref-nom", "field-nom", "obj-s")];

export const classSealedScenario: Scenario = {
  id: "class-sealed",
  title: "sealed",
  subtitle: "Chien est sealed : on peut l’instancier, personne ne peut en hériter.",
  part: "oo-heritage",
  code: [
    "class Animal { public string Nom; }",
    "sealed class Chien : Animal { }",
    "// class Berger : Chien { }  // interdit",
    "",
    "static void Main()",
    "{",
    "    Chien c = new Chien { Nom = \"Rex\" };",
    "}",
  ],
  steps: [
    step("se0", [4, 5], "Main démarre.", main([]), [], []),
    step(
      "se1",
      [6],
      "new Chien fonctionne. sealed bloque seulement l’héritage, pas l’instanciation.",
      main([refSlot("slot-c", "c", "#C1", "obj-c", "Chien")]),
      heap,
      refs,
      { focus: "obj-c" },
    ),
    step("class-sealed-end", [7], MAIN_DONE, main([refSlot("slot-c", "c", "#C1", "obj-c", "Chien")]), heap, refs),
  ],
};
