import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

export const classCtorInitOrderScenario: Scenario = {
  id: "class-ctor-init-order",
  title: "Ordre d’initialisation",
  subtitle: "D’abord les initialiseurs de champs, ensuite le corps du constructeur.",
  part: "oo-constructors",
  code: [
    "class Compteur",
    "{",
    "    public int N = 10;",
    "    public Compteur()",
    "    {",
    "        N = N + 1;",
    "    }",
    "}",
    "",
    "Compteur c = new Compteur();",
  ],
  steps: [
    step("io0", [9], "Le programme va démarrer.", main([]), [], []),
    step(
      "io1",
      [2, 9],
      "Allocation : l’initialiseur de champ va s’exécuter d’abord → N va valoir 10.",
      main(
        [refSlot("slot-c", "c", "#C1", "obj-c")],
        [{ id: "frame-ctor", method: "Compteur", slots: [refSlot("slot-this", "this", "#C1", "obj-c")] }],
      ),
      [obj("obj-c", "Compteur", "#C1", [{ label: "N", value: "10", kind: "value" }])],
      [link("ref-c", "slot-c", "obj-c"), link("ref-this", "slot-this", "obj-c")],
      { focus: "obj-c" },
    ),
    step(
      "io2",
      [5],
      "Puis le corps du constructeur : N = N + 1 va donner 11.",
      main(
        [refSlot("slot-c", "c", "#C1", "obj-c")],
        [{ id: "frame-ctor", method: "Compteur", slots: [refSlot("slot-this", "this", "#C1", "obj-c")] }],
      ),
      [obj("obj-c", "Compteur", "#C1", [{ label: "N", value: "11", kind: "value" }])],
      [link("ref-c", "slot-c", "obj-c"), link("ref-this", "slot-this", "obj-c")],
      { focus: "obj-c" },
    ),
    step(
      "class-ctor-init-order-end",
      [9],
      MAIN_DONE,
      main([refSlot("slot-c", "c", "#C1", "obj-c")]),
      [obj("obj-c", "Compteur", "#C1", [{ label: "N", value: "11", kind: "value" }])],
      [link("ref-c", "slot-c", "obj-c")],
    ),
  ],
};
