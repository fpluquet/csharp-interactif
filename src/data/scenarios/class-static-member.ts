import type { Scenario } from "../../types/memory";

export const classStaticMemberScenario: Scenario = {
  id: "class-static-member",
  title: "Champ statique partagé",
  subtitle: "Total appartient à la classe, pas à chaque instance.",
  part: "oo-static",
  code: [
    "class Etudiant",
    "{",
    "    public static int Total = 0;",
    "    public string Nom;",
    "    public Etudiant(string nom)",
    "    {",
    "        Nom = nom;",
    "        Total++;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Etudiant a = new Etudiant(\"Ada\");",
    "    Etudiant b = new Etudiant(\"Alan\");",
    "    int n = Etudiant.Total;",
    "}",
  ],
  steps: [
    {
      id: "st0",
      highlightLines: [2],
      narration: "static int Total = 0 : un seul exemplaire va exister dans la zone de la classe.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [{ id: "slot-total", name: "Etudiant.Total", value: "0", kind: "value" }],
        },
      ],
      heap: [],
      refs: [],
      focus: "slot-total",
    },
    {
      id: "st1",
      highlightLines: [11, 12],
      narration: "Main va démarrer. Total est déjà là, partagé.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [{ id: "slot-total", name: "Etudiant.Total", value: "0", kind: "value" }],
        },
        { id: "frame-main", method: "Main", slots: [] },
      ],
      heap: [],
      refs: [],
    },
    {
      id: "st2",
      highlightLines: [13, 7],
      narration: "new Etudiant(\"Ada\") va créer l’objet #E1 et Total++ va donner 1.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [{ id: "slot-total", name: "Etudiant.Total", value: "1", kind: "value" }],
        },
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "→ #E1", kind: "ref", targetId: "obj-a" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            { id: "field-a-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
          ],
        },
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
      ],
      refs: [
        { id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" },
        { id: "ref-a-nom", fromFieldId: "field-a-nom", toObjectId: "obj-s1" },
      ],
      focus: "slot-total",
    },
    {
      id: "st3",
      highlightLines: [14, 7],
      narration: "new Etudiant(\"Alan\") va créer l’objet #E2, Total va passer à 2.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [{ id: "slot-total", name: "Etudiant.Total", value: "2", kind: "value" }],
        },
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "→ #E1", kind: "ref", targetId: "obj-a" },
            { id: "slot-b", name: "b", value: "→ #E2", kind: "ref", targetId: "obj-b" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            { id: "field-a-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
          ],
        },
        {
          id: "obj-b",
          typeLabel: "Etudiant",
          address: "#E2",
          fields: [
            { id: "field-b-nom", label: "Nom", value: "→ #S2", kind: "ref", targetId: "obj-s2" },
          ],
        },
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [{ label: "chars", value: '"Alan"' }],
        },
      ],
      refs: [
        { id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" },
        { id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" },
        { id: "ref-a-nom", fromFieldId: "field-a-nom", toObjectId: "obj-s1" },
        { id: "ref-b-nom", fromFieldId: "field-b-nom", toObjectId: "obj-s2" },
      ],
      focus: "slot-total",
    },
    {
      id: "st4",
      highlightLines: [15],
      narration: "Etudiant.Total va se lire via la classe (pas via a ou b).",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [{ id: "slot-total", name: "Etudiant.Total", value: "2", kind: "value" }],
        },
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "→ #E1", kind: "ref", targetId: "obj-a" },
            { id: "slot-b", name: "b", value: "→ #E2", kind: "ref", targetId: "obj-b" },
            { id: "slot-n", name: "n", value: "2", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            { id: "field-a-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
          ],
        },
        {
          id: "obj-b",
          typeLabel: "Etudiant",
          address: "#E2",
          fields: [
            { id: "field-b-nom", label: "Nom", value: "→ #S2", kind: "ref", targetId: "obj-s2" },
          ],
        },
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [{ label: "chars", value: '"Alan"' }],
        },
      ],
      refs: [
        { id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" },
        { id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" },
        { id: "ref-a-nom", fromFieldId: "field-a-nom", toObjectId: "obj-s1" },
        { id: "ref-b-nom", fromFieldId: "field-b-nom", toObjectId: "obj-s2" },
      ],
      focus: "slot-n",
    },
    {
      id: "class-static-member-end",
      highlightLines: [16],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-static",
          method: "static",
          slots: [{ id: "slot-total", name: "Etudiant.Total", value: "2", kind: "value" }],
        },
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-a", name: "a", value: "→ #E1", kind: "ref", targetId: "obj-a" },
            { id: "slot-b", name: "b", value: "→ #E2", kind: "ref", targetId: "obj-b" },
            { id: "slot-n", name: "n", value: "2", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-a",
          typeLabel: "Etudiant",
          address: "#E1",
          fields: [
            { id: "field-a-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s1" },
          ],
        },
        {
          id: "obj-b",
          typeLabel: "Etudiant",
          address: "#E2",
          fields: [
            { id: "field-b-nom", label: "Nom", value: "→ #S2", kind: "ref", targetId: "obj-s2" },
          ],
        },
        {
          id: "obj-s1",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Ada"' }],
        },
        {
          id: "obj-s2",
          typeLabel: "string",
          address: "#S2",
          fields: [{ label: "chars", value: '"Alan"' }],
        },
      ],
      refs: [
        { id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" },
        { id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" },
        { id: "ref-a-nom", fromFieldId: "field-a-nom", toObjectId: "obj-s1" },
        { id: "ref-b-nom", fromFieldId: "field-b-nom", toObjectId: "obj-s2" },
      ],
    },
  ],
};
