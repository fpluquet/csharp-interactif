import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

export const classGenericMethodScenario: Scenario = {
  id: "class-generic-method",
  title: "Méthode générique",
  subtitle: "Premier<T> infère T à l’appel : int ici, sans classe générique.",
  part: "oo-generics",
  code: [
    "T Premier<T>(T a, T b) => a;",
    "",
    "int x = Premier(10, 20);",
    "string s = Premier(\"A\", \"B\");",
  ],
  steps: [
    step("gm0", [2], "Le programme va démarrer.", main([]), [], []),
    step(
      "gm1",
      [2, 0],
      "Premier(10, 20) : T va être int. Frame avec a=10, b=20, va retourner a.",
      main(
        [],
        [frame("frame-p", "Premier<int>", [val("slot-a", "a", "10"), val("slot-b", "b", "20")])],
      ),
      [],
      [],
      { focus: "frame-p", highlightExpr: "Premier(10, 20)" },
    ),
    step(
      "gm2",
      [2],
      "x va valoir 10.",
      main([val("slot-x", "x", "10")]),
      [],
      [],
    ),
    step(
      "gm3",
      [3],
      "Premier(\"A\", \"B\") : T va être string. Même méthode, autre instanciation.",
      main([
        val("slot-x", "x", "10"),
        { id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s", declaredType: "string" },
      ]),
      [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"A"' }] }],
      [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }],
      { focus: "slot-s", highlightExpr: "Premier(\"A\", \"B\")" },
    ),
    step(
      "class-generic-method-end",
      [3],
      MAIN_DONE,
      main([
        val("slot-x", "x", "10"),
        { id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s", declaredType: "string" },
      ]),
      [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"A"' }] }],
      [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }],
    ),
  ],
};
