import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

export const classGenericMethodScenario: Scenario = {
  id: "class-generic-method",
  title: "Méthode générique",
  subtitle: "Premier<T> infère T à l’appel : int ici, sans classe générique.",
  part: "oo-generics",
  code: [
    "static T Premier<T>(T a, T b) => a;",
    "",
    "static void Main()",
    "{",
    "    int x = Premier(10, 20);",
    "    string s = Premier(\"A\", \"B\");",
    "}",
  ],
  steps: [
    step("gm0", [2, 3], "Main démarre.", main([]), [], []),
    step(
      "gm1",
      [4, 0],
      "Premier(10, 20) : T = int. Frame avec a=10, b=20, retourne a.",
      main(
        [],
        [frame("frame-p", "Premier<int>", [val("slot-a", "a", "10"), val("slot-b", "b", "20")])],
      ),
      [],
      [],
      { focus: "frame-p" },
    ),
    step(
      "gm2",
      [4],
      "x = 10.",
      main([val("slot-x", "x", "10")]),
      [],
      [],
    ),
    step(
      "gm3",
      [5],
      "Premier(\"A\", \"B\") : T = string. Même méthode, autre instanciation.",
      main([
        val("slot-x", "x", "10"),
        { id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s", declaredType: "string" },
      ]),
      [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"A"' }] }],
      [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }],
      { focus: "slot-s" },
    ),
    step(
      "class-generic-method-end",
      [6],
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
