import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

export const classConstReadonlyScenario: Scenario = {
  id: "class-const-readonly",
  title: "const vs readonly",
  subtitle: "const est figé à la compilation ; readonly d’instance se fixe dans le constructeur.",
  part: "oo-static",
  code: [
    "class Cercle",
    "{",
    "    public const double Pi = 3.14;",
    "    public readonly int Id;",
    "    public Cercle(int id) { Id = id; }",
    "}",
    "",
    "Cercle a = new Cercle(1);",
    "Cercle b = new Cercle(2);",
    "double p = Cercle.Pi;",
  ],
  steps: [
    step(
      "cr0",
      [2, 7],
      "Pi est une constante de classe (pas dans les objets). Le programme va démarrer.",
      [{ id: "frame-static", method: "static", slots: [val("slot-pi", "Cercle.Pi", "3.14")] }, ...main([])],
      [],
      [],
      { focus: "slot-pi" },
    ),
    step(
      "cr1",
      [7, 4],
      "new Cercle(1) : Id readonly va valoir 1, propre à #C1.",
      [
        { id: "frame-static", method: "static", slots: [val("slot-pi", "Cercle.Pi", "3.14")] },
        ...main([refSlot("slot-a", "a", "#C1", "obj-a")]),
      ],
      [obj("obj-a", "Cercle", "#C1", [{ label: "Id (readonly)", value: "1", kind: "value" }])],
      [link("ref-a", "slot-a", "obj-a")],
      { focus: "obj-a" },
    ),
    step(
      "cr2",
      [8],
      "new Cercle(2) : un autre Id va être assigné. Pi va rester unique, partagé.",
      [
        { id: "frame-static", method: "static", slots: [val("slot-pi", "Cercle.Pi", "3.14")] },
        ...main([
          refSlot("slot-a", "a", "#C1", "obj-a"),
          refSlot("slot-b", "b", "#C2", "obj-b"),
        ]),
      ],
      [
        obj("obj-a", "Cercle", "#C1", [{ label: "Id (readonly)", value: "1", kind: "value" }]),
        obj("obj-b", "Cercle", "#C2", [{ label: "Id (readonly)", value: "2", kind: "value" }]),
      ],
      [link("ref-a", "slot-a", "obj-a"), link("ref-b", "slot-b", "obj-b")],
    ),
    step(
      "cr3",
      [9],
      "Cercle.Pi va se lire via la classe, pas via a ou b.",
      [
        { id: "frame-static", method: "static", slots: [val("slot-pi", "Cercle.Pi", "3.14")] },
        ...main([
          refSlot("slot-a", "a", "#C1", "obj-a"),
          refSlot("slot-b", "b", "#C2", "obj-b"),
          val("slot-p", "p", "3.14"),
        ]),
      ],
      [
        obj("obj-a", "Cercle", "#C1", [{ label: "Id (readonly)", value: "1", kind: "value" }]),
        obj("obj-b", "Cercle", "#C2", [{ label: "Id (readonly)", value: "2", kind: "value" }]),
      ],
      [link("ref-a", "slot-a", "obj-a"), link("ref-b", "slot-b", "obj-b")],
      { focus: "slot-p" },
    ),
    step(
      "class-const-readonly-end",
      [9],
      MAIN_DONE,
      [
        { id: "frame-static", method: "static", slots: [val("slot-pi", "Cercle.Pi", "3.14")] },
        ...main([
          refSlot("slot-a", "a", "#C1", "obj-a"),
          refSlot("slot-b", "b", "#C2", "obj-b"),
          val("slot-p", "p", "3.14"),
        ]),
      ],
      [
        obj("obj-a", "Cercle", "#C1", [{ label: "Id (readonly)", value: "1", kind: "value" }]),
        obj("obj-b", "Cercle", "#C2", [{ label: "Id (readonly)", value: "2", kind: "value" }]),
      ],
      [link("ref-a", "slot-a", "obj-a"), link("ref-b", "slot-b", "obj-b")],
    ),
  ],
};
