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
    "static void Main()",
    "{",
    "    Document d = new Document();",
    "    IImprimable i = d;",
    "    ISauvegardable s = d;",
    "    i.Imprimer();",
    "    s.Sauver();",
    "}",
  ],
  steps: [
    step("mi0", [10, 11], "Main démarre.", main([]), [], []),
    step(
      "mi1",
      [12],
      "new Document : un objet, deux contrats.",
      main([refSlot("slot-d", "d", "#D1", "obj-d", "Document")]),
      [doc],
      [link("ref-d", "slot-d", "obj-d")],
      { focus: "obj-d" },
    ),
    step(
      "mi2",
      [13, 14],
      "i et s sont des alias du même #D1, avec des types déclarés différents.",
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
      [15, 16],
      "i.Imprimer() et s.Sauver() appellent les méthodes de Document.",
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
    step(
      "class-multi-interface-end",
      [17],
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
