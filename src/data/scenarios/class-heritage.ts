import type { Scenario } from "../../types/memory";

function str(id: string, address: string, chars: string) {
  return {
    id,
    typeLabel: "string",
    address,
    fields: [{ label: "chars", value: `"${chars}"` }],
  };
}

const sNom = str("obj-s1", "#S1", "Rex");
const sRace = str("obj-s2", "#S2", "Berger");

function chien(nom: string, race: string, named = false) {
  return {
    id: "obj-c",
    typeLabel: "Chien",
    address: "#C1",
    fields: [
      named
        ? { id: "field-nom", label: "Nom", value: nom, kind: "ref" as const, targetId: "obj-s1" }
        : { label: "Nom", value: nom, kind: "ref" as const },
      named && race.startsWith("→")
        ? { id: "field-race", label: "Race", value: race, kind: "ref" as const, targetId: "obj-s2" }
        : { label: "Race", value: race, kind: "ref" as const },
    ],
  };
}

const slotC = { id: "slot-c", name: "c", value: "→ #C1", kind: "ref" as const, targetId: "obj-c" };
const thisChien = { id: "slot-this-c", name: "this", value: "→ #C1", kind: "ref" as const, targetId: "obj-c" };
const thisAnimal = { id: "slot-this-a", name: "this", value: "→ #C1", kind: "ref" as const, targetId: "obj-c" };
const nomArg = { id: "slot-nom", name: "nom", value: "→ #S1", kind: "ref" as const, targetId: "obj-s1" };
const raceArg = { id: "slot-race", name: "race", value: "→ #S2", kind: "ref" as const, targetId: "obj-s2" };
const nomArgA = { id: "slot-nom-a", name: "nom", value: "→ #S1", kind: "ref" as const, targetId: "obj-s1" };

const frameChien = {
  id: "frame-chien",
  method: "Chien",
  slots: [thisChien, nomArg, raceArg],
};
const frameAnimal = {
  id: "frame-animal",
  method: "Animal",
  slots: [thisAnimal, nomArgA],
};

const refsChien = [
  { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
  { id: "ref-this-c", fromSlotId: "slot-this-c", toObjectId: "obj-c" },
  { id: "ref-nom-arg", fromSlotId: "slot-nom", toObjectId: "obj-s1" },
  { id: "ref-race-arg", fromSlotId: "slot-race", toObjectId: "obj-s2" },
];
const refsBoth = [
  ...refsChien,
  { id: "ref-this-a", fromSlotId: "slot-this-a", toObjectId: "obj-c" },
  { id: "ref-nom-a", fromSlotId: "slot-nom-a", toObjectId: "obj-s1" },
];
const refsNomField = { id: "ref-nom", fromFieldId: "field-nom", toObjectId: "obj-s1" };
const refsRaceField = { id: "ref-race", fromFieldId: "field-race", toObjectId: "obj-s2" };

export const classHeritageScenario: Scenario = {
  id: "class-heritage",
  title: "Classe dérivée",
  subtitle: "base(...) s’exécute entièrement avant le corps du constructeur dérivé.",
  part: "oo-heritage",
  code: [
    "class Animal",
    "{",
    "    public string Nom;",
    "    public Animal(string nom)",
    "    {",
    "        Nom = nom;",
    "    }",
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
      highlightLines: [18, 19],
      narration: "Main démarre.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
    },
    {
      id: "he1",
      highlightLines: [20],
      narration: "new Chien : un seul objet (Chien) alloué, champs par défaut. Entrée dans le constructeur Chien.",
      stack: [
        { id: "frame-main", method: "Main", slots: [slotC] },
        frameChien,
      ],
      heap: [chien("null", "null"), sNom, sRace],
      refs: refsChien,
      focus: "frame-chien",
    },
    {
      id: "he2",
      highlightLines: [12],
      narration: "Avant le corps de Chien : : base(nom). On délègue au constructeur Animal. Race n’est pas encore assigné.",
      stack: [
        { id: "frame-main", method: "Main", slots: [slotC] },
        frameChien,
      ],
      heap: [chien("null", "null"), sNom, sRace],
      refs: refsChien,
      focus: "frame-chien",
    },
    {
      id: "he3",
      highlightLines: [3, 4],
      narration: "Frame Animal empilée. Même this → #C1 (pas un nouvel objet).",
      stack: [
        { id: "frame-main", method: "Main", slots: [slotC] },
        frameChien,
        frameAnimal,
      ],
      heap: [chien("null", "null"), sNom, sRace],
      refs: refsBoth,
      focus: "frame-animal",
    },
    {
      id: "he4",
      highlightLines: [5],
      narration: "Nom = nom dans Animal : le champ hérité de #C1 est initialisé.",
      stack: [
        { id: "frame-main", method: "Main", slots: [slotC] },
        frameChien,
        frameAnimal,
      ],
      heap: [chien("→ #S1", "null", true), sNom, sRace],
      refs: [...refsBoth, refsNomField],
      focus: "obj-c",
    },
    {
      id: "he5",
      highlightLines: [12],
      narration: "Animal se termine : sa frame disparaît. Retour dans Chien, juste après base(nom).",
      stack: [
        { id: "frame-main", method: "Main", slots: [slotC] },
        frameChien,
      ],
      heap: [chien("→ #S1", "null", true), sNom, sRace],
      refs: [...refsChien, refsNomField],
      focus: "frame-chien",
    },
    {
      id: "he6",
      highlightLines: [14],
      narration: "Corps de Chien : Race = race. Nom était déjà prêt grâce à base.",
      stack: [
        { id: "frame-main", method: "Main", slots: [slotC] },
        frameChien,
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
        sNom,
        sRace,
      ],
      refs: [...refsChien, refsNomField, refsRaceField],
      focus: "obj-c",
    },
    {
      id: "he7",
      highlightLines: [20],
      narration: "Fin de Chien : plus de this. c pointe vers l’objet complet.",
      stack: [{ id: "frame-main", method: "Main", slots: [slotC] }],
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
        sNom,
        sRace,
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        refsNomField,
        refsRaceField,
      ],
      focus: "slot-c",
    },
    {
      id: "class-heritage-end",
      highlightLines: [21],
      narration: "La fonction Main est terminée, le programme s'arrête.",
      stack: [{ id: "frame-main", method: "Main", slots: [slotC] }],
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
        sNom,
        sRace,
      ],
      refs: [
        { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" },
        refsNomField,
        refsRaceField,
      ],
    },
  ],
};
