import type { Scenario } from "../../types/memory";

export const classCtorScenario: Scenario = {
  id: "class-ctor",
  title: "Constructeur avec paramètres",
  subtitle: "new Personne(...) alloue puis appelle le constructeur qui initialise les champs.",
  part: "oo-constructors",
  code: [
    "class Personne",
    "{",
    "    public string Nom;",
    "    public int Age;",
    "    public Personne(string nom, int age)",
    "    {",
    "        Nom = nom;",
    "        Age = age;",
    "    }",
    "}",
    "",
    "Personne p = new Personne(\"Ada\", 25);",
  ],
  steps: [
    {
      id: "ct0",
      highlightLines: [11],
      narration: "Le programme va démarrer.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "ct1",
      highlightLines: [11],
      narration: "new : l’objet Personne va être alloué sur le heap (champs par défaut), puis le constructeur va être appelé.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
        {
          id: "frame-ctor",
          method: "Personne",
          slots: [
            { id: "slot-this", name: "this", value: "→ #P1", kind: "ref", targetId: "obj-p" },
            { id: "slot-nom", name: "nom", value: "→ #S1", kind: "ref", targetId: "obj-nom" },
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
            { label: "Nom", value: "null", kind: "ref" },
            { label: "Age", value: "0", kind: "value" },
          ],
        },
        {
          id: "obj-nom",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-p" },
        { id: "ref-nom-arg", fromSlotId: "slot-nom", toObjectId: "obj-nom" },
      ],
      focus: "frame-ctor",
    },
    {
      id: "ct2",
      highlightLines: [6, 7],
      narration: "Dans le constructeur : Nom et Age de #P1 vont être initialisés via this.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
          ],
        },
        {
          id: "frame-ctor",
          method: "Personne",
          slots: [
            { id: "slot-this", name: "this", value: "→ #P1", kind: "ref", targetId: "obj-p" },
            { id: "slot-nom", name: "nom", value: "→ #S1", kind: "ref", targetId: "obj-nom" },
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
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-nom" },
            { label: "Age", value: "25", kind: "value" },
          ],
        },
        {
          id: "obj-nom",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-p" },
        { id: "ref-nom-arg", fromSlotId: "slot-nom", toObjectId: "obj-nom" },
        { id: "ref-field-nom", fromFieldId: "field-nom", toObjectId: "obj-nom" },
      ],
      focus: "obj-p",
    },
    {
      id: "ct3",
      highlightLines: [11],
      narration: "Fin du constructeur : la frame va disparaître. p va pointer vers l’objet initialisé.",
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
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-nom" },
            { label: "Age", value: "25", kind: "value" },
          ],
        },
        {
          id: "obj-nom",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-field-nom", fromFieldId: "field-nom", toObjectId: "obj-nom" },
      ],
      focus: "slot-p",
    },
    {
      id: "class-ctor-end",
      highlightLines: [11],
      narration: "Le programme va s'arrêter.",
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
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-nom" },
            { label: "Age", value: "25", kind: "value" },
          ],
        },
        {
          id: "obj-nom",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" },
        { id: "ref-field-nom", fromFieldId: "field-nom", toObjectId: "obj-nom" },
      ],
    },
  ],
};
