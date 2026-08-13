import type { Scenario } from "../../types/memory";

export const classInterfaceScenario: Scenario = {
  id: "class-interface",
  title: "Référence d’interface",
  subtitle: "IForme f pointe vers un Cercle : contrat sur la stack, objet réel sur le heap.",
  part: "oo-interfaces",
  code: [
    "interface IForme",
    "{",
    "    double Aire();",
    "}",
    "",
    "class Cercle : IForme",
    "{",
    "    public double Rayon;",
    "    public Cercle(double r) { Rayon = r; }",
    "    public double Aire() => 3.14 * Rayon * Rayon;",
    "}",
    "",
    "static void Main()",
    "{",
    "    IForme f = new Cercle(2);",
    "    double a = f.Aire();",
    "}",
  ],
  steps: [
    {
      id: "if0",
      highlightLines: [12, 13],
      narration: "Main va démarrer.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "if1",
      highlightLines: [14],
      narration: "IForme f = new Cercle(2) : f va avoir le type interface, l’objet va être un Cercle.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-f", name: "f", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Cercle : IForme",
          address: "#C1",
          fields: [{ label: "Rayon", value: "2", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-f", fromSlotId: "slot-f", toObjectId: "obj-c" }],
      focus: "obj-c",
    },
    {
      id: "if2",
      highlightLines: [15, 9],
      narration: "f.Aire() va appeler l’implémentation de Cercle → 12.56.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-f", name: "f", value: "→ #C1", kind: "ref", targetId: "obj-c" },
            { id: "slot-a", name: "a", value: "12.56", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Cercle : IForme",
          address: "#C1",
          fields: [{ label: "Rayon", value: "2", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-f", fromSlotId: "slot-f", toObjectId: "obj-c" }],
      focus: "slot-a",
    },
    {
      id: "class-interface-end",
      highlightLines: [16],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-f", name: "f", value: "→ #C1", kind: "ref", targetId: "obj-c" },
            { id: "slot-a", name: "a", value: "12.56", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Cercle : IForme",
          address: "#C1",
          fields: [{ label: "Rayon", value: "2", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-f", fromSlotId: "slot-f", toObjectId: "obj-c" }],
    },
  ],
};
