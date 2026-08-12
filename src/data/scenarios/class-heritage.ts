import type { Scenario } from "../../types/memory";

export const classHeritageScenario: Scenario = {
  id: "class-heritage",
  title: "Classe dérivée",
  subtitle: "Chien hérite de Animal : l’objet contient les champs de base + les siens.",
  part: "oo-heritage",
  code: [
    "class Animal",
    "{",
    "    public string Nom;",
    "    public Animal(string nom) { Nom = nom; }",
    "}",
    "",
    "class Chien : Animal",
    "{",
    "    public string Race;",
    "    public Chien(string nom, string race) : base(nom)",
    "    {",
    "        Race = race;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Chien c = new Chien(\"Rex\", \"Berger\");",
    "}",
  ],
  steps: [
    {
      id: "he0",
      highlightLines: [15, 16],
      narration: "Main démarre.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "he1",
      highlightLines: [17, 9],
      narration: "new Chien : alloue un objet Chien, puis constructeur (qui appelle base).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-c", name: "c", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
        {
          id: "frame-ctor",
          method: "Chien",
          slots: [
            { id: "slot-this", name: "this", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Chien",
          address: "#C1",
          fields: [
            { label: "Nom", value: "null", kind: "ref" },
            { label: "Race", value: "null", kind: "ref" },
          ],
        },
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-c" },
      ],
      focus: "obj-c",
    },
    {
      id: "he2",
      highlightLines: [3, 11],
      narration: "base(nom) puis Race = race : #C1 a Nom (hérité) et Race (propre).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-c", name: "c", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Chien",
          address: "#C1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
            { id: "field-race", label: "Race", value: "→ #S2", kind: "ref", targetId: "obj-s2" },
          ],
        },
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Rex"' }],
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [{ label: "chars", value: '"Berger"' }],
        },
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s1" },
        { id: "ref-race", fromFieldId: "field-race", toObjectId: "obj-s2" },
      ],
      focus: "obj-c",
    },
    {
      id: "class-heritage-end",
      highlightLines: [18],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-c", name: "c", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Chien",
          address: "#C1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
            { id: "field-race", label: "Race", value: "→ #S2", kind: "ref", targetId: "obj-s2" },
          ],
        },
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Rex"' }],
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [{ label: "chars", value: '"Berger"' }],
        },
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s1" },
        { id: "ref-race", fromFieldId: "field-race", toObjectId: "obj-s2" },
      ],
    },
  ],
};
