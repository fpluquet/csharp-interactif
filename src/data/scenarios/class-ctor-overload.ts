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

const sAda = strObj("obj-s1", "#S1", "Ada");
const sInconnu = strObj("obj-s2", "#S2", "Inconnu");
const p1 = obj("obj-p1", "Livre", "#L1", [
  { id: "field-t1", label: "Titre", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
  { label: "Pages", value: "120", kind: "value" },
]);
const p2 = obj("obj-p2", "Livre", "#L2", [
  { id: "field-t2", label: "Titre", value: "→ #S2", kind: "ref", targetId: "obj-s2" },
  { label: "Pages", value: "0", kind: "value" },
]);

export const classCtorOverloadScenario: Scenario = {
  id: "class-ctor-overload",
  title: "Surcharge de constructeurs",
  subtitle: "Plusieurs constructeurs : le compilateur choisit selon les arguments.",
  part: "oo-constructors",
  code: [
    "class Livre",
    "{",
    "    public string Titre;",
    "    public int Pages;",
    "    public Livre(string titre, int pages)",
    "    {",
    "        Titre = titre;",
    "        Pages = pages;",
    "    }",
    "    public Livre(string titre)",
    "    {",
    "        Titre = titre;",
    "        Pages = 0;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Livre a = new Livre(\"Ada\", 120);",
    "    Livre b = new Livre(\"Inconnu\");",
    "}",
  ],
  steps: [
    step("co0", [16, 17], "Main va démarrer. Deux signatures de constructeur.", main([]), [], []),
    step(
      "co1",
      [18, 4],
      "new Livre(\"Ada\", 120) : le constructeur à 2 paramètres va être appelé.",
      main([refSlot("slot-a", "a", "#L1", "obj-p1")]),
      [p1, sAda],
      [link("ref-a", "slot-a", "obj-p1"), fieldLink("ref-t1", "field-t1", "obj-s1")],
      { focus: "obj-p1" },
    ),
    step(
      "co2",
      [19, 9],
      "new Livre(\"Inconnu\") : l'autre constructeur (1 paramètre) va être appelé, Pages va valoir 0.",
      main([
        refSlot("slot-a", "a", "#L1", "obj-p1"),
        refSlot("slot-b", "b", "#L2", "obj-p2"),
      ]),
      [p1, p2, sAda, sInconnu],
      [
        link("ref-a", "slot-a", "obj-p1"),
        link("ref-b", "slot-b", "obj-p2"),
        fieldLink("ref-t1", "field-t1", "obj-s1"),
        fieldLink("ref-t2", "field-t2", "obj-s2"),
      ],
      { focus: "obj-p2" },
    ),
    step(
      "class-ctor-overload-end",
      [20],
      MAIN_DONE,
      main([
        refSlot("slot-a", "a", "#L1", "obj-p1"),
        refSlot("slot-b", "b", "#L2", "obj-p2"),
      ]),
      [p1, p2, sAda, sInconnu],
      [
        link("ref-a", "slot-a", "obj-p1"),
        link("ref-b", "slot-b", "obj-p2"),
        fieldLink("ref-t1", "field-t1", "obj-s1"),
        fieldLink("ref-t2", "field-t2", "obj-s2"),
      ],
    ),
  ],
};
