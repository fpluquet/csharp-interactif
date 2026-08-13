import type { Scenario } from "../../types/memory";
import {
  MAIN_DONE,
  fieldLink,
  link,
  main,
  obj,
  refSlot,
  step,
  strObj,
} from "./ooHelpers";

const p = obj("obj-p", "Personne", "#P1", [
  { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
  { label: "Age", value: "30", kind: "value" },
]);
const s = strObj("obj-s", "#S1", "Ada");
const heap = [p, s];
const refs = [
  link("ref-p", "slot-p", "obj-p"),
  fieldLink("ref-nom", "field-nom", "obj-s"),
];

export const classObjectInitScenario: Scenario = {
  id: "class-object-init",
  title: "Initialiseur d’objet",
  subtitle: "new Personne { ... } alloue, puis assigne les champs publics un par un.",
  part: "oo-classes",
  code: [
    "class Personne",
    "{",
    "    public string Nom;",
    "    public int Age;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Personne p = new Personne { Nom = \"Ada\", Age = 30 };",
    "}",
  ],
  steps: [
    step("oi0", [6, 7], "Main va démarrer.", main([]), [], []),
    step(
      "oi1",
      [8],
      "new Personne : l’objet va être alloué, champs aux valeurs par défaut (null / 0).",
      main([refSlot("slot-p", "p", "#P1", "obj-p")]),
      [obj("obj-p", "Personne", "#P1", [
        { label: "Nom", value: "null", kind: "ref" },
        { label: "Age", value: "0", kind: "value" },
      ])],
      [link("ref-p", "slot-p", "obj-p")],
      { focus: "obj-p" },
    ),
    step(
      "oi2",
      [8],
      "L’initialiseur va assigner Nom puis Age — sans constructeur personnalisé.",
      main([refSlot("slot-p", "p", "#P1", "obj-p")]),
      heap,
      refs,
      { focus: "obj-p" },
    ),
    step("class-object-init-end", [9], MAIN_DONE, main([refSlot("slot-p", "p", "#P1", "obj-p")]), heap, refs),
  ],
};
