import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

const chat = obj("obj-c", "Siamois", "#C1", [{ label: "(hérite Chat)", value: "" }]);

export const classSealedOverrideScenario: Scenario = {
  id: "class-sealed-override",
  title: "sealed override",
  subtitle: "Chat scelle Crier : Siamois hérite du Miaou, il ne peut plus override.",
  part: "oo-polymorphism",
  code: [
    "class Animal { public virtual string Crier() => \"...\"; }",
    "class Chat : Animal { public sealed override string Crier() => \"Miaou\"; }",
    "class Siamois : Chat { /* pas d’override Crier possible */ }",
    "",
    "static void Main()",
    "{",
    "    Animal a = new Siamois();",
    "    string s = a.Crier();",
    "}",
  ],
  steps: [
    step("so0", [4, 5], "Main va démarrer.", main([]), [], []),
    step(
      "so1",
      [6],
      "Animal a = new Siamois() va créer un type réel Siamois, qui hérite de Chat.",
      main([refSlot("slot-a", "a", "#C1", "obj-c", "Animal")]),
      [chat],
      [link("ref-a", "slot-a", "obj-c")],
    ),
    step(
      "so2",
      [7],
      "a.Crier() : le lookup va s’arrêter à Chat.Crier (sealed) → Miaou.",
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        refSlot("slot-s", "s", "#S1", "obj-s", "string"),
      ]),
      [chat, { id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Miaou"' }] }],
      [link("ref-a", "slot-a", "obj-c"), link("ref-s", "slot-s", "obj-s")],
      {
        dispatchFlow: {
          mode: "virtual",
          callExpr: "a.Crier()",
          staticType: "Animal",
          dynamicType: "Siamois",
          chosen: "Chat.Crier (sealed)",
          result: "Miaou",
        },
      },
    ),
    step(
      "class-sealed-override-end",
      [8],
      MAIN_DONE,
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        refSlot("slot-s", "s", "#S1", "obj-s", "string"),
      ]),
      [chat, { id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Miaou"' }] }],
      [link("ref-a", "slot-a", "obj-c"), link("ref-s", "slot-s", "obj-s")],
    ),
  ],
};
