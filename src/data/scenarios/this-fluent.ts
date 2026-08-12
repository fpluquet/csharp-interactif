import type { Scenario } from "../../types/memory";

export const thisFluentScenario: Scenario = {
  id: "this-fluent",
  title: "return this (chaînage)",
  subtitle: "Chaque méthode retourne this : même objet, appels enchaînés.",
  part: "oo-classes",
  code: [
    "class Compteur",
    "{",
    "    public int Valeur;",
    "    public Compteur Plus(int n)",
    "    {",
    "        Valeur += n;",
    "        return this;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Compteur c = new Compteur();",
    "    c.Plus(2).Plus(3);",
    "}",
  ],
  steps: [
    {
      id: "tf0",
      highlightLines: [10, 11],
      narration: "Main démarre.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "tf1",
      highlightLines: [12],
      narration: "new Compteur() → #C1, Valeur = 0.",
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
          typeLabel: "Compteur",
          address: "#C1",
          fields: [{ label: "Valeur", value: "0", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" }],
      focus: "obj-c",
    },
    {
      id: "tf2",
      highlightLines: [13, 5],
      narration: "Premier Plus(2) : this → #C1, Valeur devient 2, puis return this.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-c", name: "c", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
        {
          id: "frame-plus1",
          method: "Plus",
          slots: [
            { id: "slot-this", name: "this", value: "→ #C1", kind: "ref", targetId: "obj-c" },
            { id: "slot-n", name: "n", value: "2", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [{ label: "Valeur", value: "2", kind: "value" }],
        },
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-c" },
      ],
      focus: "slot-this",
      returnFlow: {
        fromMethod: "Plus",
        callExpr: "c.Plus(2)",
        value: "→ #C1",
        phase: "returning",
        callLine: 13,
      },
    },
    {
      id: "tf3",
      highlightLines: [13, 6],
      narration: "return this : on renvoie la même référence #C1 (pas une copie).",
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
          typeLabel: "Compteur",
          address: "#C1",
          fields: [{ label: "Valeur", value: "2", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" }],
      focus: "obj-c",
      returnFlow: {
        fromMethod: "Plus",
        callExpr: "c.Plus(2)",
        value: "→ #C1",
        phase: "replaces",
        callLine: 13,
      },
    },
    {
      id: "tf4",
      highlightLines: [13, 5],
      narration: "Deuxième .Plus(3) : encore this → #C1 (le résultat du return précédent).",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-c", name: "c", value: "→ #C1", kind: "ref", targetId: "obj-c" },
          ],
        },
        {
          id: "frame-plus2",
          method: "Plus",
          slots: [
            { id: "slot-this2", name: "this", value: "→ #C1", kind: "ref", targetId: "obj-c" },
            { id: "slot-n2", name: "n", value: "3", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-c",
          typeLabel: "Compteur",
          address: "#C1",
          fields: [{ label: "Valeur", value: "5", kind: "value" }],
        },
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        { id: "ref-this2", fromSlotId: "slot-this2", toObjectId: "obj-c" },
      ],
      focus: "obj-c",
    },
    {
      id: "tf5",
      highlightLines: [13],
      narration: "Chaîne terminée : un seul objet, Valeur = 5.",
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
          typeLabel: "Compteur",
          address: "#C1",
          fields: [{ label: "Valeur", value: "5", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" }],
      focus: "obj-c",
    },
    {
      id: "this-fluent-end",
      highlightLines: [14],
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
          typeLabel: "Compteur",
          address: "#C1",
          fields: [{ label: "Valeur", value: "5", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" }],
    },
  ],
};
