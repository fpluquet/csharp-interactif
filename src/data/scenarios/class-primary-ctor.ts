import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const s = strObj("obj-s", "#S1", "Ada");
const heap = [
  obj("obj-c", "Compte", "#C1", [
    { id: "field-t", label: "Titulaire", value: "→ #S1", kind: "ref", targetId: "obj-s" },
    { label: "Solde", value: "100", kind: "value" },
  ]),
  s,
];
const refs = [link("ref-c", "slot-c", "obj-c"), fieldLink("ref-t", "field-t", "obj-s")];

export const classPrimaryCtorScenario: Scenario = {
  id: "class-primary-ctor",
  title: "Primary constructor",
  subtitle: "class Compte(string titulaire) : le paramètre vit pour toute la classe.",
  part: "oo-primary-ctors",
  code: [
    "class Compte(string titulaire)",
    "{",
    "    public string Titulaire => titulaire;",
    "    public int Solde { get; set; } = 100;",
    "}",
    "",
    "static void Main()",
    "{",
    "    Compte c = new Compte(\"Ada\");",
    "    string n = c.Titulaire;",
    "}",
  ],
  steps: [
    step("pc0", [6, 7], "Main démarre.", main([]), [], []),
    step(
      "pc1",
      [8, 0],
      "new Compte(\"Ada\") : le primary ctor capture titulaire dans l’objet (pas besoin d’un ctor classique).",
      main([refSlot("slot-c", "c", "#C1", "obj-c")]),
      heap,
      refs,
      { focus: "obj-c" },
    ),
    step(
      "pc2",
      [9, 2],
      "c.Titulaire lit le paramètre capturé → \"Ada\".",
      main([
        refSlot("slot-c", "c", "#C1", "obj-c"),
        refSlot("slot-n", "n", "#S1", "obj-s", "string"),
      ]),
      heap,
      [...refs, link("ref-n", "slot-n", "obj-s")],
      { focus: "slot-n" },
    ),
    step(
      "class-primary-ctor-end",
      [10],
      MAIN_DONE,
      main([
        refSlot("slot-c", "c", "#C1", "obj-c"),
        refSlot("slot-n", "n", "#S1", "obj-s", "string"),
      ]),
      heap,
      [...refs, link("ref-n", "slot-n", "obj-s")],
    ),
  ],
};
