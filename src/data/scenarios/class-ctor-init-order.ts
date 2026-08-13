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
    "static void Main()",
    "{",
    "    Compteur c = new Compteur();",
    "}",
  ],
  steps: [
    step("io0", [9, 10], "Main démarre.", main([]), [], []),
    step(
      "io1",
      [2, 11],
      "Allocation : l’initialiseur de champ s’exécute d’abord → N = 10.",
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
      "Puis le corps du constructeur : N = N + 1 → 11.",
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
      [12],
      MAIN_DONE,
      main([refSlot("slot-c", "c", "#C1", "obj-c")]),
      [obj("obj-c", "Compteur", "#C1", [{ label: "N", value: "11", kind: "value" }])],
      [link("ref-c", "slot-c", "obj-c")],
    ),
  ],
};
