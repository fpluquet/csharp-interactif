import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, refSlot, step, strObj, val } from "./ooHelpers";

export const classNullableScenario: Scenario = {
  id: "class-nullable",
  title: "?. et ??",
  subtitle: "string? peut être null : ?. court-circuite, ?? fournit un défaut.",
  part: "oo-nullable",
  code: [
    "static void Main()",
    "{",
    "    string? a = null;",
    "    string? b = \"Ada\";",
    "    int? na = a?.Length;",
    "    int? nb = b?.Length;",
    "    string n = a ?? \"anonyme\";",
    "}",
  ],
  steps: [
    step("nu0", [0, 1], "Main démarre.", main([]), [], []),
    step(
      "nu1",
      [2, 3],
      "a = null (pas d’objet). b pointe vers \"Ada\".",
      main([
        { id: "slot-a", name: "a", value: "null", kind: "ref", declaredType: "string?" },
        refSlot("slot-b", "b", "#S1", "obj-b", "string?"),
      ]),
      [strObj("obj-b", "#S1", "Ada")],
      [link("ref-b", "slot-b", "obj-b")],
    ),
    step(
      "nu2",
      [4],
      "a?.Length : a est null → na = null, Length n’est pas appelé.",
      main([
        { id: "slot-a", name: "a", value: "null", kind: "ref", declaredType: "string?" },
        refSlot("slot-b", "b", "#S1", "obj-b", "string?"),
        val("slot-na", "na", "null"),
      ]),
      [strObj("obj-b", "#S1", "Ada")],
      [link("ref-b", "slot-b", "obj-b")],
      { focus: "slot-na" },
    ),
    step(
      "nu3",
      [5],
      "b?.Length : b non null → nb = 3.",
      main([
        { id: "slot-a", name: "a", value: "null", kind: "ref", declaredType: "string?" },
        refSlot("slot-b", "b", "#S1", "obj-b", "string?"),
        val("slot-na", "na", "null"),
        val("slot-nb", "nb", "3"),
      ]),
      [strObj("obj-b", "#S1", "Ada")],
      [link("ref-b", "slot-b", "obj-b")],
      { focus: "slot-nb" },
    ),
    step(
      "nu4",
      [6],
      "a ?? \"anonyme\" : a est null → n = \"anonyme\".",
      main([
        { id: "slot-a", name: "a", value: "null", kind: "ref", declaredType: "string?" },
        refSlot("slot-b", "b", "#S1", "obj-b", "string?"),
        val("slot-na", "na", "null"),
        val("slot-nb", "nb", "3"),
        refSlot("slot-n", "n", "#S2", "obj-n", "string"),
      ]),
      [strObj("obj-b", "#S1", "Ada"), strObj("obj-n", "#S2", "anonyme")],
      [link("ref-b", "slot-b", "obj-b"), link("ref-n", "slot-n", "obj-n")],
      { focus: "slot-n" },
    ),
    step(
      "class-nullable-end",
      [7],
      MAIN_DONE,
      main([
        { id: "slot-a", name: "a", value: "null", kind: "ref", declaredType: "string?" },
        refSlot("slot-b", "b", "#S1", "obj-b", "string?"),
        val("slot-na", "na", "null"),
        val("slot-nb", "nb", "3"),
        refSlot("slot-n", "n", "#S2", "obj-n", "string"),
      ]),
      [strObj("obj-b", "#S1", "Ada"), strObj("obj-n", "#S2", "anonyme")],
      [link("ref-b", "slot-b", "obj-b"), link("ref-n", "slot-n", "obj-n")],
    ),
  ],
};
