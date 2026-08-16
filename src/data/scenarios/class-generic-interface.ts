import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

const mag = obj("obj-m", "Magasin : IStock<int>", "#M1", [
  { label: "Quantite", value: "5", kind: "value" },
]);

export const classGenericInterfaceScenario: Scenario = {
  id: "class-generic-interface",
  title: "Interface générique",
  subtitle: "IStock<int> : le contrat est typé. Magasin implémente Prendre() → int.",
  part: "oo-generics",
  code: [
    "interface IStock<T>",
    "{",
    "    T Prendre();",
    "}",
    "",
    "class Magasin : IStock<int>",
    "{",
    "    public int Quantite = 5;",
    "    public int Prendre() { Quantite--; return Quantite; }",
    "}",
    "",
    "IStock<int> s = new Magasin();",
    "int n = s.Prendre();",
  ],
  steps: [
    step("gi0", [11], "Le programme va démarrer.", main([]), [], []),
    step(
      "gi1",
      [11],
      "IStock<int> s = new Magasin() : contrat générique, l’objet va être concret.",
      main([refSlot("slot-s", "s", "#M1", "obj-m", "IStock<int>")]),
      [mag],
      [link("ref-s", "slot-s", "obj-m")],
      { focus: "obj-m" },
    ),
    step(
      "gi2",
      [12, 8],
      "s.Prendre() : Quantite va passer de 5 à 4, va retourner 4 (int, pas object).",
      main([
        refSlot("slot-s", "s", "#M1", "obj-m", "IStock<int>"),
        val("slot-n", "n", "4"),
      ]),
      [obj("obj-m", "Magasin : IStock<int>", "#M1", [{ label: "Quantite", value: "4", kind: "value" }])],
      [link("ref-s", "slot-s", "obj-m")],
      { focus: "slot-n" },
    ),
    step(
      "class-generic-interface-end",
      [12],
      MAIN_DONE,
      main([
        refSlot("slot-s", "s", "#M1", "obj-m", "IStock<int>"),
        val("slot-n", "n", "4"),
      ]),
      [obj("obj-m", "Magasin : IStock<int>", "#M1", [{ label: "Quantite", value: "4", kind: "value" }])],
      [link("ref-s", "slot-s", "obj-m")],
    ),
  ],
};
