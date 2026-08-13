import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

const chien = obj("obj-c", "Chien", "#C1", [{ label: "(hérite Animal)", value: "" }]);
const refsA = [link("ref-a", "slot-a", "obj-c")];

export const classIsAsScenario: Scenario = {
  id: "class-is-as",
  title: "is / as / cast",
  subtitle: "is teste le type réel ; as convertit ou donne null ; le cast lève si ça ne colle pas.",
  part: "oo-polymorphism",
  code: [
    "class Animal { }",
    "class Chien : Animal { }",
    "class Chat : Animal { }",
    "",
    "static void Main()",
    "{",
    "    Animal a = new Chien();",
    "    bool ok = a is Chien;",
    "    Chien c = a as Chien;",
    "    Chat t = a as Chat;",
    "}",
  ],
  steps: [
    step("ia0", [4, 5], "Main démarre.", main([]), [], []),
    step(
      "ia1",
      [6],
      "Animal a = new Chien() : type déclaré Animal, objet Chien.",
      main([refSlot("slot-a", "a", "#C1", "obj-c", "Animal")]),
      [chien],
      refsA,
      { focus: "slot-a" },
    ),
    step(
      "ia2",
      [7],
      "a is Chien → true (le type réel est Chien).",
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        val("slot-ok", "ok", "true"),
      ]),
      [chien],
      refsA,
      { focus: "slot-ok" },
    ),
    step(
      "ia3",
      [8],
      "a as Chien réussit : c pointe vers le même objet #C1.",
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        val("slot-ok", "ok", "true"),
        refSlot("slot-c", "c", "#C1", "obj-c", "Chien"),
      ]),
      [chien],
      [...refsA, link("ref-c", "slot-c", "obj-c")],
      { focus: "slot-c" },
    ),
    step(
      "ia4",
      [9],
      "a as Chat échoue sans exception : t = null (pas un Chat).",
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        val("slot-ok", "ok", "true"),
        refSlot("slot-c", "c", "#C1", "obj-c", "Chien"),
        { id: "slot-t", name: "t", value: "null", kind: "ref", declaredType: "Chat" },
      ]),
      [chien],
      [...refsA, link("ref-c", "slot-c", "obj-c")],
      { focus: "slot-t" },
    ),
    step(
      "class-is-as-end",
      [10],
      MAIN_DONE,
      main([
        refSlot("slot-a", "a", "#C1", "obj-c", "Animal"),
        val("slot-ok", "ok", "true"),
        refSlot("slot-c", "c", "#C1", "obj-c", "Chien"),
        { id: "slot-t", name: "t", value: "null", kind: "ref", declaredType: "Chat" },
      ]),
      [chien],
      [...refsA, link("ref-c", "slot-c", "obj-c")],
    ),
  ],
};
