import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

export const classOperatorScenario: Scenario = {
  id: "class-operator",
  title: "Surcharge d’opérateur",
  subtitle: "a + b appelle operator+ : un nouvel objet Vecteur, a et b inchangés.",
  part: "oo-advanced",
  code: [
    "class Vecteur",
    "{",
    "    public int X;",
    "    public int Y;",
    "    public Vecteur(int x, int y) { X = x; Y = y; }",
    "    public static Vecteur operator +(Vecteur a, Vecteur b)",
    "        => new Vecteur(a.X + b.X, a.Y + b.Y);",
    "}",
    "",
    "static void Main()",
    "{",
    "    Vecteur a = new Vecteur(1, 2);",
    "    Vecteur b = new Vecteur(3, 4);",
    "    Vecteur c = a + b;",
    "}",
  ],
  steps: [
    step("op0", [9, 10], "Main va démarrer.", main([]), [], []),
    step(
      "op1",
      [11, 12],
      "Deux vecteurs distincts vont être sur le heap.",
      main([
        refSlot("slot-a", "a", "#V1", "obj-a"),
        refSlot("slot-b", "b", "#V2", "obj-b"),
      ]),
      [
        obj("obj-a", "Vecteur", "#V1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Vecteur", "#V2", [
          { label: "X", value: "3", kind: "value" },
          { label: "Y", value: "4", kind: "value" },
        ]),
      ],
      [link("ref-a", "slot-a", "obj-a"), link("ref-b", "slot-b", "obj-b")],
    ),
    step(
      "op2",
      [13, 5],
      "a + b → operator+ va créer #V3 (4, 6). a et b ne vont pas être mutés.",
      main([
        refSlot("slot-a", "a", "#V1", "obj-a"),
        refSlot("slot-b", "b", "#V2", "obj-b"),
        refSlot("slot-c", "c", "#V3", "obj-c"),
      ]),
      [
        obj("obj-a", "Vecteur", "#V1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Vecteur", "#V2", [
          { label: "X", value: "3", kind: "value" },
          { label: "Y", value: "4", kind: "value" },
        ]),
        obj("obj-c", "Vecteur", "#V3", [
          { label: "X", value: "4", kind: "value" },
          { label: "Y", value: "6", kind: "value" },
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
      "class-operator-end",
      [14],
      MAIN_DONE,
      main([
        refSlot("slot-a", "a", "#V1", "obj-a"),
        refSlot("slot-b", "b", "#V2", "obj-b"),
        refSlot("slot-c", "c", "#V3", "obj-c"),
      ]),
      [
        obj("obj-a", "Vecteur", "#V1", [
          { label: "X", value: "1", kind: "value" },
          { label: "Y", value: "2", kind: "value" },
        ]),
        obj("obj-b", "Vecteur", "#V2", [
          { label: "X", value: "3", kind: "value" },
          { label: "Y", value: "4", kind: "value" },
        ]),
        obj("obj-c", "Vecteur", "#V3", [
          { label: "X", value: "4", kind: "value" },
          { label: "Y", value: "6", kind: "value" },
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
