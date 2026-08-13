import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const s = strObj("obj-s", "#S1", "Ada");
const heap = [
  obj("obj-p", "Personne", "#P1", [
    { id: "field-nom", label: "Nom (init)", value: "→ #S1", kind: "ref", targetId: "obj-s" },
  ]),
  s,
];
const refs = [link("ref-p", "slot-p", "obj-p"), fieldLink("ref-nom", "field-nom", "obj-s")];

export const classInitOnlyScenario: Scenario = {
  id: "class-init-only",
  title: "Propriété init",
  subtitle: "Nom se fixe à la construction (initialiseur) ; p.Nom = ... est interdit ensuite.",
  part: "oo-init",
  code: [
    "class Personne",
    "{",
    "    public string Nom { get; init; }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Personne p = new Personne { Nom = \"Ada\" };",
    "    // p.Nom = \"Alan\";  // interdit",
    "}",
  ],
  steps: [
    step("io0", [5, 6], "Main démarre.", main([]), [], []),
    step(
      "io1",
      [7],
      "L’initialiseur d’objet a le droit d’écrire Nom (contexte init).",
      main([refSlot("slot-p", "p", "#P1", "obj-p")]),
      heap,
      refs,
      { focus: "obj-p" },
    ),
    step(
      "class-init-only-end",
      [9],
      MAIN_DONE,
      main([refSlot("slot-p", "p", "#P1", "obj-p")]),
      heap,
      refs,
    ),
  ],
};
