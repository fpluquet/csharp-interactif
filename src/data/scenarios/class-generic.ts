import type { Scenario } from "../../types/memory";

export const classGenericScenario: Scenario = {
  id: "class-generic",
  title: "Classe générique",
  subtitle: "Boite<T> : même code, type concret Boite<int> sur le heap.",
  part: "oo-generics",
  code: [
    "class Boite<T>",
    "{",
    "    public T Valeur;",
    "    public Boite(T valeur) { Valeur = valeur; }",
    "}",
    "",
    "Boite<int> b = new Boite<int>(42);",
    "int x = b.Valeur;",
  ],
  steps: [
    {
      id: "ge0",
      highlightLines: [6],
      narration: "Le programme va démarrer.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "ge1",
      highlightLines: [6],
      narration: "new Boite<int>(42) : l’objet va être typé Boite<int>, Valeur va être un int (stack dans l’objet).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-b", name: "b", value: "→ #B1", kind: "ref", targetId: "obj-b" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-b",
          typeLabel: "Boite<int>",
          address: "#B1",
          fields: [{ label: "Valeur", value: "42", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" }],
      focus: "obj-b",
    },
    {
      id: "ge2",
      highlightLines: [7],
      narration: "Lecture de b.Valeur : le int va être copié vers x sur la stack.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-b", name: "b", value: "→ #B1", kind: "ref", targetId: "obj-b" },
            { id: "slot-x", name: "x", value: "42", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-b",
          typeLabel: "Boite<int>",
          address: "#B1",
          fields: [{ label: "Valeur", value: "42", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" }],
      focus: "slot-x",
    },
    {
      id: "class-generic-end",
      highlightLines: [7],
      narration: "Le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-b", name: "b", value: "→ #B1", kind: "ref", targetId: "obj-b" },
            { id: "slot-x", name: "x", value: "42", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-b",
          typeLabel: "Boite<int>",
          address: "#B1",
          fields: [{ label: "Valeur", value: "42", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" }],
    },
  ],
};
