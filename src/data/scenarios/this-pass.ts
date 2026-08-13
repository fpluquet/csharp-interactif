import type { Scenario } from "../../types/memory";

export const thisPassScenario: Scenario = {
  id: "this-pass",
  title: "Passer this en paramètre",
  subtitle: "equipe.Ajouter(this) : le joueur se donne lui-même à l’équipe.",
  part: "oo-classes",
  code: [
    "class Joueur",
    "{",
    "    public string Nom;",
    "    public void Rejoindre(Equipe equipe)",
    "    {",
    "        equipe.Ajouter(this);",
    "    }",
    "}",
    "",
    "class Equipe",
    "{",
    "    public Joueur Membre;",
    "    public void Ajouter(Joueur joueur)",
    "    {",
    "        Membre = joueur;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Joueur alice = new Joueur();",
    "    alice.Nom = \"Alice\";",
    "    Equipe e = new Equipe();",
    "    alice.Rejoindre(e);",
    "}",
  ],
  steps: [
    {
      id: "tp0",
      highlightLines: [18, 19],
      narration: "Main va démarrer.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "tp1",
      highlightLines: [20, 21],
      narration: "Alice va être créée sur le heap (#J1).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-alice", name: "alice", value: "→ #J1", kind: "ref", targetId: "obj-j" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-j",
          typeLabel: "Joueur",
          address: "#J1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Alice"' }],
        },
      ],
      refs: [
        { id: "ref-alice", fromSlotId: "slot-alice", toObjectId: "obj-j" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
      focus: "obj-j",
    },
    {
      id: "tp2",
      highlightLines: [22],
      narration: "Equipe e va pointer vers #E1 (Membre encore null).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-alice", name: "alice", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-e", name: "e", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-j",
          typeLabel: "Joueur",
          address: "#J1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          ],
        },
        {
          id: "obj-e",
          typeLabel: "Equipe",
          address: "#E1",
          fields: [{ label: "Membre", value: "null", kind: "ref" }],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Alice"' }],
        },
      ],
      refs: [
        { id: "ref-alice", fromSlotId: "slot-alice", toObjectId: "obj-j" },
        { id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-e" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
      focus: "obj-e",
    },
    {
      id: "tp3",
      highlightLines: [23, 4],
      narration: "alice.Rejoindre(e) : this va être Alice (#J1), parametre equipe va être #E1.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-alice", name: "alice", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-e", name: "e", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
        {
          id: "frame-rej",
          method: "Rejoindre",
          slots: [
            { id: "slot-this", name: "this", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-equipe", name: "equipe", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-j",
          typeLabel: "Joueur",
          address: "#J1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          ],
        },
        {
          id: "obj-e",
          typeLabel: "Equipe",
          address: "#E1",
          fields: [{ label: "Membre", value: "null", kind: "ref" }],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Alice"' }],
        },
      ],
      refs: [
        { id: "ref-alice", fromSlotId: "slot-alice", toObjectId: "obj-j" },
        { id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-e" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-j" },
        { id: "ref-equipe", fromSlotId: "slot-equipe", toObjectId: "obj-e" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
      focus: "slot-this",
    },
    {
      id: "tp4",
      highlightLines: [5, 12],
      narration:
        "equipe.Ajouter(this) : on va passer this (#J1) comme argument joueur. Même objet, autre nom dans la frame.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-alice", name: "alice", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-e", name: "e", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
        {
          id: "frame-rej",
          method: "Rejoindre",
          slots: [
            { id: "slot-this", name: "this", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-equipe", name: "equipe", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
        {
          id: "frame-add",
          method: "Ajouter",
          slots: [
            { id: "slot-this-eq", name: "this", value: "→ #E1", kind: "ref", targetId: "obj-e" },
            { id: "slot-joueur", name: "joueur", value: "→ #J1", kind: "ref", targetId: "obj-j" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-j",
          typeLabel: "Joueur",
          address: "#J1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          ],
        },
        {
          id: "obj-e",
          typeLabel: "Equipe",
          address: "#E1",
          fields: [{ label: "Membre", value: "null", kind: "ref" }],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Alice"' }],
        },
      ],
      refs: [
        { id: "ref-alice", fromSlotId: "slot-alice", toObjectId: "obj-j" },
        { id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-e" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-j" },
        { id: "ref-equipe", fromSlotId: "slot-equipe", toObjectId: "obj-e" },
        { id: "ref-this-eq", fromSlotId: "slot-this-eq", toObjectId: "obj-e" },
        { id: "ref-joueur", fromSlotId: "slot-joueur", toObjectId: "obj-j" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s" },
      ],
      focus: "slot-joueur",
    },
    {
      id: "tp5",
      highlightLines: [14],
      narration: "Membre = joueur : #E1 va pointer vers #J1. Alice va s’ajouter elle-même.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-alice", name: "alice", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-e", name: "e", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-j",
          typeLabel: "Joueur",
          address: "#J1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          ],
        },
        {
          id: "obj-e",
          typeLabel: "Equipe",
          address: "#E1",
          fields: [
            { id: "field-membre", label: "Membre", value: "→ #J1", kind: "ref", targetId: "obj-j" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Alice"' }],
        },
      ],
      refs: [
        { id: "ref-alice", fromSlotId: "slot-alice", toObjectId: "obj-j" },
        { id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-e" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s" },
        { id: "ref-membre", fromFieldId: "field-membre", toObjectId: "obj-j" },
      ],
      focus: "obj-e",
    },
    {
      id: "this-pass-end",
      highlightLines: [24],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-alice", name: "alice", value: "→ #J1", kind: "ref", targetId: "obj-j" },
            { id: "slot-e", name: "e", value: "→ #E1", kind: "ref", targetId: "obj-e" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-j",
          typeLabel: "Joueur",
          address: "#J1",
          fields: [
            { id: "field-nom", label: "Nom", value: "→ #S1", kind: "ref", targetId: "obj-s" },
          ],
        },
        {
          id: "obj-e",
          typeLabel: "Equipe",
          address: "#E1",
          fields: [
            { id: "field-membre", label: "Membre", value: "→ #J1", kind: "ref", targetId: "obj-j" },
          ],
        },
        {
          id: "obj-s",
          typeLabel: "string",
          address: "#S1",
          fields: [{ label: "chars", value: '"Alice"' }],
        },
      ],
      refs: [
        { id: "ref-alice", fromSlotId: "slot-alice", toObjectId: "obj-j" },
        { id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-e" },
        { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s" },
        { id: "ref-membre", fromFieldId: "field-membre", toObjectId: "obj-j" },
      ],
    },
  ],
};
