import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const nom = strObj("obj-s", "#S1", "Rex");
const heap = [
  obj("obj-c", "Chien", "#C1", [
    { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
  ]),
  nom,
];
const refs = [link("ref-a", "slot-a", "obj-c"), fieldLink("ref-nom", "field-nom", "obj-s")];

export const classBaseCallScenario: Scenario = {
  id: "class-base-call",
  title: "Appel à base",
  subtitle: "Chien.Decrire étend Animal.Decrire : d’abord la base, puis le complément.",
  part: "oo-polymorphism",
  code: [
    "class Animal",
    "{",
    "    public string Nom;",
    "    public Animal(string nom) { Nom = nom; }",
    "    public virtual string Decrire() => Nom;",
    "}",
    "",
    "class Chien : Animal",
    "{",
    "    public Chien(string nom) : base(nom) { }",
    "    public override string Decrire() => base.Decrire() + \" (chien)\";",
    "}",
    "",
    "static void Main()",
    "{",
    "    Animal a = new Chien(\"Rex\");",
    "    string s = a.Decrire();",
    "}",
  ],
  steps: [
    step("ba0", [13, 14], "Main va démarrer.", main([]), [], []),
    step(
      "ba1",
      [15],
      "Animal a = new Chien(\"Rex\") : un Chien va être créé.",
      main([refSlot("slot-a", "a", "#C1", "obj-c", "Animal")]),
      heap,
      refs,
      { focus: "obj-c", highlightExpr: "new Chien(\"Rex\")" },
    ),
    step(
      "ba2",
      [16, 10, 4],
      "a.Decrire() → Chien.Decrire, qui va appeler base.Decrire() (\"Rex\") puis ajouter \" (chien)\".",
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        refSlot("slot-s", "s", "#S2", "obj-s2", "string"),
      ]),
      [...heap, strObj("obj-s2", "#S2", "Rex (chien)")],
      [...refs, link("ref-s", "slot-s", "obj-s2")],
      {
        focus: "slot-s",
        highlightExpr: "a.Decrire()",
        dispatchFlow: {
          mode: "virtual",
          callExpr: "a.Decrire()",
          staticType: "Animal",
          dynamicType: "Chien",
          chosen: "Chien.Decrire → base.Decrire",
          result: "Rex (chien)",
        },
      },
    ),
    step(
      "class-base-call-end",
      [17],
      MAIN_DONE,
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        refSlot("slot-s", "s", "#S2", "obj-s2", "string"),
      ]),
      [...heap, strObj("obj-s2", "#S2", "Rex (chien)")],
      [...refs, link("ref-s", "slot-s", "obj-s2")],
    ),
  ],
};
