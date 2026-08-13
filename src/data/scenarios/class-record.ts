import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

export const classRecordScenario: Scenario = {
  id: "class-record",
  title: "Record et with",
  subtitle: "Égalité par valeur ; with copie vers un nouvel objet sans muter l’original.",
  part: "oo-records",
  code: [
    "record Point(int X, int Y);",
    "",
    "static void Main()",
    "{",
    "    Point a = new Point(1, 2);",
    "    Point b = new Point(1, 2);",
    "    bool eq = a == b;",
    "    Point c = a with { Y = 9 };",
    "}",
  ],
  steps: [
    step("re0", [2, 3], "Main démarre.", main([]), [], []),
    step(
      "re1",
      [4, 5],
      "Deux records distincts, mêmes valeurs (X=1, Y=2).",
      main([
        refSlot("slot-a", "a", "#P1", "obj-a", "Point"),
        refSlot("slot-b", "b", "#P2", "obj-b", "Point"),
      ]),
      [
        obj("obj-a", "Point (record)", "#P1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Point (record)", "#P2", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
      ],
      [link("ref-a", "slot-a", "obj-a"), link("ref-b", "slot-b", "obj-b")],
    ),
    step(
      "re2",
      [6],
      "a == b → true : égalité par valeur, pas par référence.",
      main([
        refSlot("slot-a", "a", "#P1", "obj-a", "Point"),
        refSlot("slot-b", "b", "#P2", "obj-b", "Point"),
        val("slot-eq", "eq", "true"),
      ]),
      [
        obj("obj-a", "Point (record)", "#P1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Point (record)", "#P2", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
      ],
      [link("ref-a", "slot-a", "obj-a"), link("ref-b", "slot-b", "obj-b")],
      { focus: "slot-eq" },
    ),
    step(
      "re3",
      [7],
      "with crée #P3 (1, 9). a reste (1, 2).",
      main([
        refSlot("slot-a", "a", "#P1", "obj-a", "Point"),
        refSlot("slot-b", "b", "#P2", "obj-b", "Point"),
        val("slot-eq", "eq", "true"),
        refSlot("slot-c", "c", "#P3", "obj-c", "Point"),
      ]),
      [
        obj("obj-a", "Point (record)", "#P1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Point (record)", "#P2", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-c", "Point (record)", "#P3", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "9", kind: "value" },
        ]),
      ],
      [
        link("ref-a", "slot-a", "obj-a"),
        link("ref-b", "slot-b", "obj-b"),
        link("ref-c", "slot-c", "obj-c"),
      ],
      { focus: "obj-c" },
    ),
    step(
      "class-record-end",
      [8],
      MAIN_DONE,
      main([
        refSlot("slot-a", "a", "#P1", "obj-a", "Point"),
        refSlot("slot-b", "b", "#P2", "obj-b", "Point"),
        val("slot-eq", "eq", "true"),
        refSlot("slot-c", "c", "#P3", "obj-c", "Point"),
      ]),
      [
        obj("obj-a", "Point (record)", "#P1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Point (record)", "#P2", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-c", "Point (record)", "#P3", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "9", kind: "value" },
        ]),
      ],
      [
        link("ref-a", "slot-a", "obj-a"),
        link("ref-b", "slot-b", "obj-b"),
        link("ref-c", "slot-c", "obj-c"),
      ],
    ),
  ],
};
