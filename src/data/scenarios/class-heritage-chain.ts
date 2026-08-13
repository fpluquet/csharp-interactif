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
  subtitle: "Chaque : base(...) s’empile avec ses paramètres, s’exécute, puis revient : Etre → Animal → Chien.",
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
    step("hc0", [27, 28], "Main va démarrer. Un new Chien va empiler trois constructeurs, du plus dérivé vers la base.", main([]), [], []),
    step(
      "hc-new",
      [29],
      "new Chien(1, \"Rex\", \"Berger\") : on va allouer un seul objet, puis entrer dans Chien avec trois arguments.",
      main([]),
      [],
      [],
      { highlightExpr: "new Chien(1, \"Rex\", \"Berger\")", focus: "frame-main" },
    ),
    step(
      "hc-enter-chien",
      [21],
      "Objet #C1 alloué (Id 0, Nom/Race null). Frame Chien : this, et des copies — id = 1, nom → Rex, race → Berger.",
      main([slotC], [fChien]),
      [empty, ...heapStrings],
      rChien,
      { highlightExpr: "Chien(int id, string nom, string race)", focus: "frame-chien" },
    ),
    step(
      "hc-base-animal",
      [21],
      "Avant le corps : : base(id, nom). On va passer id et nom à Animal. race reste ici, pas encore utilisé.",
      main([slotC], [fChien]),
      [empty, ...heapStrings],
      rChien,
      { highlightExpr: "base(id, nom)", focus: "slot-id-c" },
    ),
    step(
      "hc-enter-animal",
      [12],
      "Frame Animal. Même this → #C1. id et nom sont recopiés. Il n’y a pas de race dans cette frame.",
      main([slotC], [fChien, fAnimal]),
      [empty, ...heapStrings],
      [...rChien, ...rAnimal],
      { highlightExpr: "Animal(int id, string nom)", focus: "frame-animal" },
    ),
    step(
      "hc-base-etre",
      [12],
      "Animal délègue à son tour : : base(id). Seul id va descendre vers Etre. nom attend dans Animal.",
      main([slotC], [fChien, fAnimal]),
      [empty, ...heapStrings],
      [...rChien, ...rAnimal],
      { highlightExpr: "base(id)", focus: "slot-id-a" },
    ),
    step(
      "hc-enter-etre",
      [3],
      "Frame Etre au sommet. Toujours le même objet. Paramètre : seulement id = 1 (copie encore).",
      main([slotC], [fChien, fAnimal, fEtre]),
      [empty, ...heapStrings],
      [...rChien, ...rAnimal, ...rEtre],
      { highlightExpr: "Etre(int id)", focus: "slot-id-e" },
    ),
    step(
      "hc-set-id",
      [5],
      "Id = id → 1. C’est le premier champ posé. Etre n’a rien d’autre à faire.",
      main([slotC], [fChien, fAnimal, fEtre]),
      [afterEtre, ...heapStrings],
      [...rChien, ...rAnimal, ...rEtre],
      { highlightExpr: "Id = id", focus: "obj-c" },
    ),
    step(
      "hc-ret-etre",
      [12],
      "Etre va se terminer. On revient dans Animal, juste après base(id). Id est déjà là ; Nom est encore null.",
      main([slotC], [fChien, fAnimal]),
      [afterEtre, ...heapStrings],
      [...rChien, ...rAnimal],
      { highlightExpr: "base(id)", focus: "frame-animal" },
    ),
    step(
      "hc-set-nom",
      [14],
      "Corps d’Animal : Nom = nom. On utilise le nom gardé dans cette frame, pas celui de Chien (même valeur, autre slot).",
      main([slotC], [fChien, fAnimal]),
      [afterAnimal, ...heapStrings],
      [...rChien, ...rAnimal, ...rNom],
      { highlightExpr: "Nom = nom", focus: "obj-c" },
    ),
    step(
      "hc-ret-animal",
      [21],
      "Animal va se terminer. On revient dans Chien, après base(id, nom). Race est encore null.",
      main([slotC], [fChien]),
      [afterAnimal, ...heapStrings],
      [...rChien, ...rNom],
      { highlightExpr: "base(id, nom)", focus: "frame-chien" },
    ),
    step(
      "hc-set-race",
      [23],
      "Corps de Chien, maintenant seulement : Race = race. La chaîne de délégation va se terminer.",
      main([slotC], [fChien]),
      [filled, ...heapStrings],
      [...rChien, ...rNom, ...rRace],
      { highlightExpr: "Race = race", focus: "obj-c" },
    ),
    step(
      "hc-done",
      [29],
      "Plus de frames ctor. c pointe vers #C1 complet : Id, Nom et Race ont été posés de la base vers le dérivé.",
      main([slotC]),
      [filled, ...heapStrings],
      rDone,
      { highlightExpr: "new Chien(1, \"Rex\", \"Berger\")", focus: "slot-c" },
    ),
    step("class-heritage-chain-end", [30], MAIN_DONE, main([slotC]), [filled, ...heapStrings], rDone),
  ],
};
