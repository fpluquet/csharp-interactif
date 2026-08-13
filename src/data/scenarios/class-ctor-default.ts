import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

const heap = [
  obj("obj-c", "Compte", "#C1", [
    { label: "Solde", value: "0", kind: "value" },
  ]),
];
const refs = [link("ref-c", "slot-c", "obj-c")];

export const classCtorDefaultScenario: Scenario = {
  id: "class-ctor-default",
  title: "Constructeur par défaut",
  subtitle: "Sans constructeur écrit, C# en fournit un invisible : new Compte() met les champs à 0 / null.",
  part: "oo-constructors",
  code: [
    "class Compte",
    "{",
    "    public int Solde;",
    "    // aucun constructeur déclaré",
    "}",
    "",
    "static void Main()",
    "{",
    "    Compte c = new Compte();",
    "}",
  ],
  steps: [
    step("cd0", [6, 7], "Main va démarrer.", main([]), [], []),
    step(
      "cd1",
      [8],
      "new Compte() va appeler le constructeur par défaut : Solde va valoir 0.",
      main([refSlot("slot-c", "c", "#C1", "obj-c")]),
      heap,
      refs,
      { focus: "obj-c" },
    ),
    step("class-ctor-default-end", [9], MAIN_DONE, main([refSlot("slot-c", "c", "#C1", "obj-c")]), heap, refs),
  ],
};
