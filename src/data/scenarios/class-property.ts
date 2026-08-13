import type { Scenario } from "../../types/memory";

export const classPropertyScenario: Scenario = {
  id: "class-property",
  title: "Propriété get / set",
  subtitle: "Le champ privé est caché ; on passe par Age pour lire et valider.",
  part: "oo-encapsulation",
  code: [
    "class Personne",
    "{",
    "    private int _age;",
    "    public int Age",
    "    {",
    "        get { return _age; }",
    "        set { if (value >= 0) _age = value; }",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Personne p = new Personne();",
    "    p.Age = 20;",
    "    int a = p.Age;",
    "}",
  ],
  steps: [
    {
      id: "pr0",
      highlightLines: [10, 11],
      narration: "Main va démarrer.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "pr1",
      highlightLines: [12],
      narration: "new Personne() : seul le champ privé _age va exister dans l’objet (0).",
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
          fields: [{ label: "_age", value: "0", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" }],
      focus: "obj-p",
    },
    {
      id: "pr2",
      highlightLines: [13, 6],
      narration: "p.Age = 20 va appeler le set : value ≥ 0 → _age va devenir 20.",
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
          fields: [{ label: "_age", value: "20", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" }],
      focus: "obj-p",
    },
    {
      id: "pr3",
      highlightLines: [14, 5],
      narration: "int a = p.Age : le get va lire _age sans exposer le champ.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
            { id: "slot-a", name: "a", value: "20", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [{ label: "_age", value: "20", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" }],
      focus: "slot-a",
    },
    {
      id: "class-property-end",
      highlightLines: [15],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: [
        {
          id: "frame-main",
          method: "Main",
          slots: [
            { id: "slot-p", name: "p", value: "→ #P1", kind: "ref", targetId: "obj-p" },
            { id: "slot-a", name: "a", value: "20", kind: "value" },
          ],
        },
      ],
      heap: [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [{ label: "_age", value: "20", kind: "value" }],
        },
      ],
      refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-p" }],
    },
  ],
};
