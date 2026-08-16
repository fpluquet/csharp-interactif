import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

export const classPropComputedScenario: Scenario = {
  id: "class-prop-computed",
  title: "Propriété calculée",
  subtitle: "Aire n’est pas stockée : le get la calcule à chaque lecture.",
  part: "oo-encapsulation",
  code: [
    "class Rectangle",
    "{",
    "    public int L;",
    "    public int H;",
    "    public int Aire => L * H;",
    "}",
    "",
    "Rectangle r = new Rectangle { L = 4, H = 3 };",
    "int a = r.Aire;",
  ],
  steps: [
    step("pc0", [7], "Le programme va démarrer.", main([]), [], []),
    step(
      "pc1",
      [7],
      "L et H vont être des champs. Aire n’apparaîtra pas dans l’objet : pas de stockage.",
      main([refSlot("slot-r", "r", "#R1", "obj-r")]),
      [obj("obj-r", "Rectangle", "#R1", [
        { label: "L", value: "4", kind: "value" },
        { label: "H", value: "3", kind: "value" },
      ])],
      [link("ref-r", "slot-r", "obj-r")],
      { focus: "obj-r" },
    ),
    step(
      "pc2",
      [8, 4],
      "r.Aire va exécuter L * H → 12. Le résultat va être une copie sur la stack.",
      main([
        refSlot("slot-r", "r", "#R1", "obj-r"),
        val("slot-a", "a", "12"),
      ]),
      [obj("obj-r", "Rectangle", "#R1", [
        { label: "L", value: "4", kind: "value" },
        { label: "H", value: "3", kind: "value" },
      ])],
      [link("ref-r", "slot-r", "obj-r")],
      { focus: "slot-a" },
    ),
    step(
      "class-prop-computed-end",
      [8],
      MAIN_DONE,
      main([
        refSlot("slot-r", "r", "#R1", "obj-r"),
        val("slot-a", "a", "12"),
      ]),
      [obj("obj-r", "Rectangle", "#R1", [
        { label: "L", value: "4", kind: "value" },
        { label: "H", value: "3", kind: "value" },
      ])],
      [link("ref-r", "slot-r", "obj-r")],
    ),
  ],
};
