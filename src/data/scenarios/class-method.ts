import type { HeapObject, RefLink, Scenario, StackFrame, StackSlot } from "../../types/memory";

function compteur(id: string, address: string, valeur: string): HeapObject {
  return {
    id,
    typeLabel: "Compteur",
    address,
    fields: [{ label: "Valeur", value: valeur, kind: "value" }],
  };
}

function slot(id: string, name: string, address: string, targetId: string): StackSlot {
  return { id, name, value: `→ ${address}`, kind: "ref", targetId };
}

function main(slots: StackSlot[], extra: StackFrame[] = []): StackFrame[] {
  return [{ id: "frame-main", method: "Main", slots }, ...extra];
}

function refs(links: Array<[string, string, string]>): RefLink[] {
  return links.map(([id, fromSlotId, toObjectId]) => ({ id, fromSlotId, toObjectId }));
}

const a = slot("slot-a", "a", "#C1", "obj-a");
const b = slot("slot-b", "b", "#C2", "obj-b");
const thisA = slot("slot-this", "this", "#C1", "obj-a");
const thisB = slot("slot-this", "this", "#C2", "obj-b");

export const classMethodScenario: Scenario = {
  id: "class-method",
  title: "this = objet courant",
  subtitle: "Même méthode Incrementer, deux objets : this pointe vers celui sur lequel on a appelé.",
  part: "oo-classes",
  code: [
    "class Compteur",
    "{",
    "    public int Valeur;",
    "    public void Incrementer()",
    "    {",
    "        this.Valeur++;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Compteur a = new Compteur();",
    "    Compteur b = new Compteur();",
    "    a.Valeur = 1;",
    "    b.Valeur = 10;",
    "    a.Incrementer();",
    "    b.Incrementer();",
    "}",
  ],
  steps: [
    {
      id: "cm0",
      highlightLines: [9, 10],
      narration: "Main démarre. On va créer deux Compteur distincts.",
      stack: main([]),
      heap: [],
      refs: [],
    },
    {
      id: "cm1",
      highlightLines: [11],
      narration: "new Compteur() → a pointe vers #C1 (Valeur = 0).",
      stack: main([a]),
      heap: [compteur("obj-a", "#C1", "0")],
      refs: refs([["ref-a", "slot-a", "obj-a"]]),
      focus: "obj-a",
    },
    {
      id: "cm2",
      highlightLines: [12],
      narration: "Autre new → b pointe vers #C2, un deuxième objet de la même classe.",
      stack: main([a, b]),
      heap: [compteur("obj-a", "#C1", "0"), compteur("obj-b", "#C2", "0")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
      ]),
      focus: "obj-b",
    },
    {
      id: "cm3",
      highlightLines: [13, 14],
      narration: "a.Valeur = 1 et b.Valeur = 10 : chaque objet a son propre état.",
      stack: main([a, b]),
      heap: [compteur("obj-a", "#C1", "1"), compteur("obj-b", "#C2", "10")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
      ]),
    },
    {
      id: "cm4",
      highlightLines: [15, 5],
      narration: "a.Incrementer() : this → #C1 (le même objet que a). #C2 n’est pas concerné.",
      stack: main([a, b], [{ id: "frame-inc", method: "Incrementer", slots: [thisA] }]),
      heap: [compteur("obj-a", "#C1", "1"), compteur("obj-b", "#C2", "10")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
        ["ref-this", "slot-this", "obj-a"],
      ]),
      focus: "slot-this",
    },
    {
      id: "cm5",
      highlightLines: [5],
      narration: "this.Valeur++ : #C1 passe à 2. #C2 reste à 10. La frame (et this) disparaît.",
      stack: main([a, b]),
      heap: [compteur("obj-a", "#C1", "2"), compteur("obj-b", "#C2", "10")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
      ]),
      focus: "obj-a",
    },
    {
      id: "cm6",
      highlightLines: [16, 5],
      narration: "b.Incrementer() : même code, mais this → #C2 cette fois.",
      stack: main([a, b], [{ id: "frame-inc", method: "Incrementer", slots: [thisB] }]),
      heap: [compteur("obj-a", "#C1", "2"), compteur("obj-b", "#C2", "10")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
        ["ref-this", "slot-this", "obj-b"],
      ]),
      focus: "slot-this",
    },
    {
      id: "cm7",
      highlightLines: [5],
      narration: "this.Valeur++ : #C2 passe à 11. #C1 reste à 2. this suit l’objet de l’appel.",
      stack: main([a, b]),
      heap: [compteur("obj-a", "#C1", "2"), compteur("obj-b", "#C2", "11")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
      ]),
      focus: "obj-b",
    },
    {
      id: "class-method-end",
      highlightLines: [17],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: main([a, b]),
      heap: [compteur("obj-a", "#C1", "2"), compteur("obj-b", "#C2", "11")],
      refs: refs([
        ["ref-a", "slot-a", "obj-a"],
        ["ref-b", "slot-b", "obj-b"],
      ]),
    },
  ],
};
