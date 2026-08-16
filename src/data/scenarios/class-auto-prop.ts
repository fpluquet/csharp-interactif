import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

const heap = [
  obj("obj-p", "Produit", "#P1", [{ label: "<Nom>", value: "Stylo" }]),
];
const refs = [link("ref-p", "slot-p", "obj-p")];

export const classAutoPropScenario: Scenario = {
  id: "class-auto-prop",
  title: "Propriété automatique",
  subtitle: "get; set; : le compilateur crée un champ caché. On ne voit que Nom.",
  part: "oo-encapsulation",
  code: [
    "class Produit",
    "{",
    "    public string Nom { get; set; }",
    "}",
    "",
    "Produit p = new Produit();",
    "p.Nom = \"Stylo\";",
  ],
  steps: [
    step("ap0", [5], "Le programme va démarrer.", main([]), [], []),
    step(
      "ap1",
      [5],
      "new Produit() : propriété automatique, la valeur par défaut va être null (backing field caché).",
      main([refSlot("slot-p", "p", "#P1", "obj-p")]),
      [obj("obj-p", "Produit", "#P1", [{ label: "<Nom>", value: "null" }])],
      refs,
      { focus: "obj-p" },
    ),
    step(
      "ap2",
      [6],
      "p.Nom = \"Stylo\" va passer par le set automatique.",
      main([refSlot("slot-p", "p", "#P1", "obj-p")]),
      heap,
      refs,
      { focus: "obj-p" },
    ),
    step("class-auto-prop-end", [6], MAIN_DONE, main([refSlot("slot-p", "p", "#P1", "obj-p")]), heap, refs),
  ],
};
