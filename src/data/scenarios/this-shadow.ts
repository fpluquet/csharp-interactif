import type { Scenario } from "../../types/memory";

const heapAda = [
  {
    id: "obj-p",
    typeLabel: "Personne",
    address: "#P1",
    fields: [
      { id: "field-nom", label: "nom", value: "null" as string, kind: "ref" as const },
      { label: "age", value: "0", kind: "value" as const },
    ],
  },
];

export const thisShadowScenario: Scenario = {
  id: "this-shadow",
  title: "this et homonymie",
  subtitle: "this.nom = le champ ; nom = le paramètre. Sans this, on n’assigne rien au champ.",
  part: "oo-classes",
  code: [
    "class Personne",
    "{",
    "    public string nom;",
    "    public int age;",
    "    public void Initialiser(string nom, int age)",
    "    {",
    "        this.nom = nom;",
    "        this.age = age;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Personne p = new Personne();",
    "    p.Initialiser(\"Ada\", 25);",
    "}",
  ],
  steps: [
    {
      id: "ts0",
      highlightLines: [11, 12],
      narration: "Main démarre.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "ts1",
      highlightLines: [13],
      narration: "new Personne() → #P1 (champs par défaut).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
      ],
      heap: heapAda,
      refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" }],
      focus: "obj-p",
    },
    {
      id: "ts2",
      highlightLines: [14, 5],
      narration:
        "p.Initialiser(\"Ada\", 25) : frame avec this → #P1, et les paramètres nom / age (même noms que les champs).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
        {
          id: "frame-init",
          method: "Initialiser",
          slots: [
            { id: "slot-this", name: "this", value: "→ #P1", kind: "ref", targetId: "obj-p" },
            { id: "slot-nom", name: "nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
            { id: "slot-age", name: "age", value: "25", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            { label: "nom", value: "null", kind: "ref" },
            { label: "age", value: "0", kind: "value" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-p" },
        { id: "ref-nom", fromSlotId: "slot-nom", toObjectId: "obj-s" },
      ],
      focus: "slot-this",
    },
    {
      id: "ts3",
      highlightLines: [6, 7],
      narration:
        "this.nom = nom : on écrit dans le champ de #P1 (via this), pas dans le paramètre. this.age = age idem.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
        {
          id: "frame-init",
          method: "Initialiser",
          slots: [
            { id: "slot-this", name: "this", value: "→ #P1", kind: "ref", targetId: "obj-p" },
            { id: "slot-nom", name: "nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
            { id: "slot-age", name: "age", value: "25", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            { id: "field-nom", label: "nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
            { label: "age", value: "25", kind: "value" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-p" },
        { id: "ref-nom", fromSlotId: "slot-nom", toObjectId: "obj-s" },
        { id: "ref-field", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
      focus: "obj-p",
    },
    {
      id: "ts4",
      highlightLines: [14],
      narration: "Fin d’Initialiser : this et les paramètres disparaissent ; #P1 garde ses valeurs.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            { id: "field-nom", label: "nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
            { label: "age", value: "25", kind: "value" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-field", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
      focus: "obj-p",
    },
    {
      id: "this-shadow-end",
      highlightLines: [15],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [
            { id: "field-nom", label: "nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
            { label: "age", value: "25", kind: "value" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-field", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
    },
  ],
};
