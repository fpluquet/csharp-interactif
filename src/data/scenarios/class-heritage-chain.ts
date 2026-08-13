import type { HeapObject, RefLink, Scenario, StackFrame } from "../../types/memory";
import { MAIN_DONE, fieldLink, frame, link, main, obj, refSlot, step, strObj, val } from "./ooHelpers";

const nom = strObj("obj-s", "#S1", "Rex");
const race = strObj("obj-s2", "#S2", "Berger");
const slotC = refSlot("slot-c", "c", "#C1", "obj-c", "Chien");

function chienObj(idVal: string, nomVal: string, raceVal: string, named = false): HeapObject {
  return obj("obj-c", "Chien", "#C1", [
    { label: "Id", value: idVal, kind: "value" },
    named && nomVal.startsWith("→")
      ? { id: "field-nom", label: "Nom", value: nomVal, kind: "ref", targetId: "obj-s" }
      : { label: "Nom", value: nomVal, kind: "ref" },
    named && raceVal.startsWith("→")
      ? { id: "field-race", label: "Race", value: raceVal, kind: "ref", targetId: "obj-s2" }
      : { label: "Race", value: raceVal, kind: "ref" },
  ]);
}

const empty = chienObj("0", "null", "null");
const afterEtre = chienObj("1", "null", "null");
const afterAnimal = chienObj("1", "→ #S1", "null", true);
const filled = chienObj("1", "→ #S1", "→ #S2", true);

const fChien: StackFrame = frame("frame-chien", "Chien", [
  refSlot("slot-this-c", "this", "#C1", "obj-c"),
  val("slot-id-c", "id", "1"),
  refSlot("slot-nom-c", "nom", "#S1", "obj-s"),
  refSlot("slot-race-c", "race", "#S2", "obj-s2"),
]);
const fAnimal: StackFrame = frame("frame-animal", "Animal", [
  refSlot("slot-this-a", "this", "#C1", "obj-c"),
  val("slot-id-a", "id", "1"),
  refSlot("slot-nom-a", "nom", "#S1", "obj-s"),
]);
const fEtre: StackFrame = frame("frame-etre", "Etre", [
  refSlot("slot-this-e", "this", "#C1", "obj-c"),
  val("slot-id-e", "id", "1"),
]);

const heapStrings = [nom, race];

function L(...ids: Array<[string, string, string]>): RefLink[] {
  return ids.map(([id, from, to]) =>
    from.startsWith("field-") ? fieldLink(id, from, to) : link(id, from, to),
  );
}

const rChien = L(
  ["ref-c", "slot-c", "obj-c"],
  ["ref-this-c", "slot-this-c", "obj-c"],
  ["ref-nom-c", "slot-nom-c", "obj-s"],
  ["ref-race-c", "slot-race-c", "obj-s2"],
);
const rAnimal = L(
  ["ref-this-a", "slot-this-a", "obj-c"],
  ["ref-nom-a", "slot-nom-a", "obj-s"],
);
const rEtre = L(["ref-this-e", "slot-this-e", "obj-c"]);
const rNom = L(["ref-nom", "field-nom", "obj-s"]);
const rRace = L(["ref-race", "field-race", "obj-s2"]);
const rDone = L(["ref-c", "slot-c", "obj-c"], ["ref-nom", "field-nom", "obj-s"], ["ref-race", "field-race", "obj-s2"]);

export const classHeritageChainScenario: Scenario = {
  id: "class-heritage-chain",
  title: "Chaîne d’héritage",
  subtitle: "Chaque : base(...) s’empile, s’exécute, puis revient : Etre → Animal → Chien.",
  part: "oo-heritage",
  code: [
    "class Etre",
    "{",
    "    public int Id;",
    "    public Etre(int id)",
    "    {",
    "        Id = id;",
    "    }",
    "}",
    "",
    "class Animal : Etre",
    "{",
    "    public string Nom;",
    "    public Animal(int id, string nom) : base(id)",
    "    {",
    "        Nom = nom;",
    "    }",
    "}",
    "",
    "class Chien : Animal",
    "{",
    "    public string Race;",
    "    public Chien(int id, string nom, string race) : base(id, nom)",
    "    {",
    "        Race = race;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Chien c = new Chien(1, \"Rex\", \"Berger\");",
    "}",
  ],
  steps: [
    step("hc0", [27, 28], "Main va démarrer.", main([]), [], []),
    step(
      "hc1",
      [29],
      "new Chien : un seul objet va être alloué, trois couches de champs encore aux défauts. On va entrer dans Chien.",
      main([slotC], [fChien]),
      [empty, ...heapStrings],
      rChien,
      { focus: "frame-chien" },
    ),
    step(
      "hc2",
      [21],
      "Chien va déléguer : base(id, nom) → constructeur Animal. Son corps (Race = …) va attendre.",
      main([slotC], [fChien]),
      [empty, ...heapStrings],
      rChien,
      { focus: "frame-chien" },
    ),
    step(
      "hc3",
      [12],
      "La frame Animal va être empilée. Même this → #C1.",
      main([slotC], [fChien, fAnimal]),
      [empty, ...heapStrings],
      [...rChien, ...rAnimal],
      { focus: "frame-animal" },
    ),
    step(
      "hc4",
      [12],
      "Animal va déléguer à son tour : base(id) → constructeur Etre.",
      main([slotC], [fChien, fAnimal]),
      [empty, ...heapStrings],
      [...rChien, ...rAnimal],
      { focus: "frame-animal" },
    ),
    step(
      "hc5",
      [3, 4],
      "La frame Etre va être au sommet. Toujours le même objet #C1.",
      main([slotC], [fChien, fAnimal, fEtre]),
      [empty, ...heapStrings],
      [...rChien, ...rAnimal, ...rEtre],
      { focus: "frame-etre" },
    ),
    step(
      "hc6",
      [5],
      "Id = id → 1. Etre va se terminer : on va dépiler vers Animal.",
      main([slotC], [fChien, fAnimal, fEtre]),
      [afterEtre, ...heapStrings],
      [...rChien, ...rAnimal, ...rEtre],
      { focus: "obj-c" },
    ),
    step(
      "hc7",
      [12],
      "On va revenir dans Animal, après base(id). Id va déjà être posé.",
      main([slotC], [fChien, fAnimal]),
      [afterEtre, ...heapStrings],
      [...rChien, ...rAnimal],
      { focus: "frame-animal" },
    ),
    step(
      "hc8",
      [14],
      "Corps d’Animal : Nom va être assigné à nom.",
      main([slotC], [fChien, fAnimal]),
      [afterAnimal, ...heapStrings],
      [...rChien, ...rAnimal, ...rNom],
      { focus: "obj-c" },
    ),
    step(
      "hc9",
      [21],
      "On va revenir dans Chien, après base(id, nom). Race va encore être null.",
      main([slotC], [fChien]),
      [afterAnimal, ...heapStrings],
      [...rChien, ...rNom],
      { focus: "frame-chien" },
    ),
    step(
      "hc10",
      [23],
      "Corps de Chien : Race va être assignée à race. La chaîne de délégation va se terminer.",
      main([slotC], [fChien]),
      [filled, ...heapStrings],
      [...rChien, ...rNom, ...rRace],
      { focus: "obj-c" },
    ),
    step(
      "hc11",
      [29],
      "Il n’y aura plus de frames ctor. c va pointer vers #C1 complet (Id, Nom, Race).",
      main([slotC]),
      [filled, ...heapStrings],
      rDone,
      { focus: "slot-c" },
    ),
    step("class-heritage-chain-end", [30], MAIN_DONE, main([slotC]), [filled, ...heapStrings], rDone),
  ],
};
