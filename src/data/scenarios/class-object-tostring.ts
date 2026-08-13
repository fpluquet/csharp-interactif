import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const nom = strObj("obj-s", "#S1", "Rex");
const heap = [
  obj("obj-c", "Chien : object", "#C1", [
    { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
  ]),
  nom,
];
const refs = [link("ref-c", "slot-c", "obj-c"), fieldLink("ref-nom", "field-nom", "obj-s")];

export const classObjectToStringScenario: Scenario = {
  id: "class-object-tostring",
  title: "Tout hérite de object",
  subtitle: "ToString() est virtuel : sans override on a le nom du type ; avec override, le texte métier.",
  part: "oo-heritage",
  code: [
    "class Chien",
    "{",
    "    public string Nom;",
    "    public Chien(string nom) { Nom = nom; }",
    "    public override string ToString() => Nom;",
    "}",
    "",
    "static void Main()",
    "{",
    "    object o = new Chien(\"Rex\");",
    "    string s = o.ToString();",
    "}",
  ],
  steps: [
    step("ob0", [7, 8], "Main va démarrer.", main([]), [], []),
    step(
      "ob1",
      [9],
      "object o = new Chien : type déclaré object, type réel va être Chien.",
      main([refSlot("slot-o", "o", "#C1", "obj-c", "object")]),
      heap,
      refs,
      { focus: "slot-o" },
    ),
    step(
      "ob2",
      [10, 4],
      "o.ToString() : la liaison virtuelle va appeler Chien.ToString → \"Rex\" (pas le nom du type).",
      main([
        refSlot("slot-o", "o", "#C1", "obj-c", "object"),
        refSlot("slot-s", "s", "#S1", "obj-s", "string"),
      ]),
      heap,
      [...refs, link("ref-s", "slot-s", "obj-s")],
      {
        focus: "slot-s",
        dispatchFlow: {
          mode: "virtual",
          callExpr: "o.ToString()",
          staticType: "object",
          dynamicType: "Chien",
          chosen: "Chien.ToString",
          result: "Rex",
        },
        consoleLines: ["Rex"],
      },
    ),
    step(
      "class-object-tostring-end",
      [11],
      MAIN_DONE,
      main([
        refSlot("slot-o", "o", "#C1", "obj-c", "object"),
        refSlot("slot-s", "s", "#S1", "obj-s", "string"),
      ]),
      heap,
      [...refs, link("ref-s", "slot-s", "obj-s")],
      { consoleLines: ["Rex"] },
    ),
  ],
};
