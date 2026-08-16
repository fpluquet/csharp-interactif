import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

const doc = obj("obj-d", "Document : IImprimable, ISauvegardable", "#D1", [
  { label: "Titre", value: "Rapport", kind: "value" },
]);

export const classMultiInterfaceScenario: Scenario = {
  id: "class-multi-interface",
  title: "Plusieurs interfaces",
  subtitle: "Un même objet Document est vu comme IImprimable ou ISauvegardable.",
  part: "oo-interfaces",
  code: [
    "interface IImprimable { void Imprimer(); }",
    "interface ISauvegardable { void Sauver(); }",
    "",
    "class Document : IImprimable, ISauvegardable",
    "{",
    "    public string Titre = \"Rapport\";",
    "    public void Imprimer() { Console.WriteLine(\"print\"); }",
    "    public void Sauver() { Console.WriteLine(\"save\"); }",
    "}",
    "",
    "Document d = new Document();",
    "IImprimable i = d;",
    "ISauvegardable s = d;",
    "i.Imprimer();",
    "s.Sauver();",
  ],
  steps: [
    step("mi0", [10], "Le programme va démarrer.", main([]), [], []),
    step(
      "mi1",
      [10],
      "new Document : un objet va être créé, deux contrats.",
      main([refSlot("slot-d", "d", "#D1", "obj-d", "Document")]),
      [doc],
      [link("ref-d", "slot-d", "obj-d")],
      { focus: "obj-d" },
    ),
    step(
      "mi2",
      [11, 12],
      "i et s vont être des alias du même #D1, avec des types déclarés différents.",
      main([
        refSlot("slot-d", "d", "#D1", "obj-d", "Document"),
        refSlot("slot-i", "i", "#D1", "obj-d", "IImprimable"),
        refSlot("slot-s", "s", "#D1", "obj-d", "ISauvegardable"),
      ]),
      [doc],
      [
        link("ref-d", "slot-d", "obj-d"),
        link("ref-i", "slot-i", "obj-d"),
        link("ref-s", "slot-s", "obj-d"),
      ],
    ),
    step(
      "mi3",
      [13, 6],
      "i.Imprimer() : type statique IImprimable, objet Document → print.",
      main([
        refSlot("slot-d", "d", "#D1", "obj-d", "Document"),
        refSlot("slot-i", "i", "#D1", "obj-d", "IImprimable"),
        refSlot("slot-s", "s", "#D1", "obj-d", "ISauvegardable"),
      ]),
      [doc],
      [
        link("ref-d", "slot-d", "obj-d"),
        link("ref-i", "slot-i", "obj-d"),
        link("ref-s", "slot-s", "obj-d"),
      ],
      {
        consoleLines: ["print"],
        highlightExpr: "i.Imprimer()",
        dispatchFlow: {
          mode: "virtual",
          callExpr: "i.Imprimer()",
          staticType: "IImprimable",
          dynamicType: "Document",
          chosen: "Document.Imprimer",
          result: "print",
        },
      },
    ),
    step(
      "mi4",
      [14, 7],
      "s.Sauver() : même objet, autre contrat → save.",
      main([
        refSlot("slot-d", "d", "#D1", "obj-d", "Document"),
        refSlot("slot-i", "i", "#D1", "obj-d", "IImprimable"),
        refSlot("slot-s", "s", "#D1", "obj-d", "ISauvegardable"),
      ]),
      [doc],
      [
        link("ref-d", "slot-d", "obj-d"),
        link("ref-i", "slot-i", "obj-d"),
        link("ref-s", "slot-s", "obj-d"),
      ],
      {
        consoleLines: ["print", "save"],
        highlightExpr: "s.Sauver()",
        dispatchFlow: {
          mode: "virtual",
          callExpr: "s.Sauver()",
          staticType: "ISauvegardable",
          dynamicType: "Document",
          chosen: "Document.Sauver",
          result: "save",
        },
      },
    ),
    step(
      "class-multi-interface-end",
      [14],
      MAIN_DONE,
      main([
        refSlot("slot-d", "d", "#D1", "obj-d", "Document"),
        refSlot("slot-i", "i", "#D1", "obj-d", "IImprimable"),
        refSlot("slot-s", "s", "#D1", "obj-d", "ISauvegardable"),
      ]),
      [doc],
      [
        link("ref-d", "slot-d", "obj-d"),
        link("ref-i", "slot-i", "obj-d"),
        link("ref-s", "slot-s", "obj-d"),
      ],
      { consoleLines: ["print", "save"] },
    ),
  ],
};
