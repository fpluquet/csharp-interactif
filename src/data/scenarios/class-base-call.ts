import type { Scenario, StackFrame } from "../../types/memory";
import {
  MAIN_DONE,
  fieldLink,
  frame,
  link,
  main,
  obj,
  refSlot,
  step,
  strObj,
} from "./ooHelpers";

const nom = strObj("obj-s", "#S1", "Rex");
const resultat = strObj("obj-s2", "#S2", "Rex (chien)");

function chien(nomVal: string, named = false) {
  return obj("obj-c", "Chien", "#C1", [
    named
      ? { id: "field-nom", label: "Nom", value: nomVal, kind: "ref", targetId: "obj-s" }
      : { label: "Nom", value: nomVal, kind: "ref" },
  ]);
}

const empty = chien("null");
const filled = chien("→ #S1", true);

const slotA = refSlot("slot-a", "a", "#C1", "obj-c", "Animal");
const slotS = refSlot("slot-s", "s", "#S2", "obj-s2", "string");

const thisChien = refSlot("slot-this-c", "this", "#C1", "obj-c");
const thisAnimal = refSlot("slot-this-a", "this", "#C1", "obj-c");
const thisDc = refSlot("slot-this-dc", "this", "#C1", "obj-c");
const thisDa = refSlot("slot-this-da", "this", "#C1", "obj-c");
const nomC = refSlot("slot-nom-c", "nom", "#S1", "obj-s");
const nomA = refSlot("slot-nom-a", "nom", "#S1", "obj-s");

const fChien: StackFrame = frame("frame-chien", "Chien", [thisChien, nomC]);
const fAnimal: StackFrame = frame("frame-animal", "Animal", [thisAnimal, nomA]);
const fDc: StackFrame = frame("frame-decrire-c", "Chien.Decrire", [thisDc]);
const fDa: StackFrame = frame("frame-decrire-a", "Animal.Decrire", [thisDa]);

const rObj = [link("ref-a", "slot-a", "obj-c")];
const rNomField = [fieldLink("ref-nom", "field-nom", "obj-s")];
const rChien = [
  ...rObj,
  link("ref-this-c", "slot-this-c", "obj-c"),
  link("ref-nom-c", "slot-nom-c", "obj-s"),
];
const rBothCtor = [
  ...rChien,
  link("ref-this-a", "slot-this-a", "obj-c"),
  link("ref-nom-a", "slot-nom-a", "obj-s"),
];
const rFilled = [...rObj, ...rNomField];
const rDc = [
  ...rFilled,
  link("ref-this-dc", "slot-this-dc", "obj-c"),
];
const rDa = [
  ...rDc,
  link("ref-this-da", "slot-this-da", "obj-c"),
];
const rDone = [...rFilled, link("ref-s", "slot-s", "obj-s2")];

export const classBaseCallScenario: Scenario = {
  id: "class-base-call",
  title: "Appel à base",
  subtitle: "base(nom) initialise l’objet ; base.Decrire() appelle la version Animal, sans liaison virtuelle.",
  part: "oo-polymorphism",
  code: [
    "class Animal",
    "{",
    "    public string Nom;",
    "    public Animal(string nom) { Nom = nom; }",
    "    public virtual string Decrire() => Nom;",
    "}",
    "",
    "class Chien : Animal",
    "{",
    "    public Chien(string nom) : base(nom) { }",
    "    public override string Decrire() => base.Decrire() + \" (chien)\";",
    "}",
    "",
    "static void Main()",
    "{",
    "    Animal a = new Chien(\"Rex\");",
    "    string s = a.Decrire();",
    "}",
  ],
  steps: [
    step("ba0", [13, 14], "Main va démarrer. On va voir deux appels à base : le constructeur, puis Decrire.", main([]), [], []),
    step(
      "ba-new",
      [15],
      "new Chien(\"Rex\") : on va allouer un objet, puis enchaîner les constructeurs Chien → Animal.",
      main([]),
      [],
      [],
      { highlightExpr: "new Chien(\"Rex\")", focus: "frame-main" },
    ),
    step(
      "ba-enter-chien",
      [9],
      "Un Chien va être alloué (Nom encore null). Frame Chien : this → #C1, nom va recevoir une copie de la référence \"Rex\".",
      main([slotA], [fChien]),
      [empty, nom],
      rChien,
      { highlightExpr: "Chien(string nom)", focus: "slot-nom-c" },
    ),
    step(
      "ba-base-ctor",
      [9],
      "Avant le corps (vide) : : base(nom). On va appeler Animal en lui passant ce nom. Chien va attendre.",
      main([slotA], [fChien]),
      [empty, nom],
      rChien,
      { highlightExpr: "base(nom)", focus: "frame-chien" },
    ),
    step(
      "ba-enter-animal",
      [3],
      "Frame Animal empilée. Même this → #C1 (pas un nouvel objet). nom est une autre copie, locale à Animal.",
      main([slotA], [fChien, fAnimal]),
      [empty, nom],
      rBothCtor,
      { highlightExpr: "Animal(string nom)", focus: "slot-nom-a" },
    ),
    step(
      "ba-set-nom",
      [3],
      "Nom = nom : le champ hérité de #C1 va pointer vers \"Rex\".",
      main([slotA], [fChien, fAnimal]),
      [filled, nom],
      [...rBothCtor, ...rNomField],
      { highlightExpr: "Nom = nom", focus: "obj-c" },
    ),
    step(
      "ba-ret-animal",
      [9],
      "Animal va se terminer. On revient dans Chien, juste après base(nom). Le corps { } est vide : rien de plus.",
      main([slotA], [fChien]),
      [filled, nom],
      [...rChien, ...rNomField],
      { highlightExpr: "{ }", focus: "frame-chien" },
    ),
    step(
      "ba-done-ctor",
      [15],
      "Fin de Chien : plus de this. a a le type déclaré Animal, l’objet réel est un Chien.",
      main([slotA]),
      [filled, nom],
      rFilled,
      { focus: "slot-a" },
    ),
    step(
      "ba-call-decrire",
      [16],
      "a.Decrire() : type statique Animal, type réel Chien → liaison virtuelle va choisir Chien.Decrire.",
      main([slotA]),
      [filled, nom],
      rFilled,
      {
        highlightExpr: "a.Decrire()",
        focus: "slot-a",
        dispatchFlow: {
          mode: "virtual",
          callExpr: "a.Decrire()",
          staticType: "Animal",
          dynamicType: "Chien",
          chosen: "Chien.Decrire",
          result: "…",
        },
      },
    ),
    step(
      "ba-enter-dc",
      [10],
      "Chien.Decrire s’empile. this va pointer vers le même #C1.",
      main([slotA], [fDc]),
      [filled, nom],
      rDc,
      { highlightExpr: "override string Decrire()", focus: "slot-this-dc" },
    ),
    step(
      "ba-call-base",
      [10],
      "base.Decrire() : ce n’est pas virtuel. base force Animal.Decrire, même si l’objet est un Chien.",
      main([slotA], [fDc]),
      [filled, nom],
      rDc,
      {
        highlightExpr: "base.Decrire()",
        focus: "frame-decrire-c",
        dispatchFlow: {
          mode: "static",
          callExpr: "base.Decrire()",
          staticType: "Animal",
          dynamicType: "Chien",
          chosen: "Animal.Decrire (base)",
          result: "Rex",
        },
      },
    ),
    step(
      "ba-enter-da",
      [4],
      "Animal.Decrire au sommet. Même this → #C1. Va lire Nom.",
      main([slotA], [fDc, fDa]),
      [filled, nom],
      rDa,
      { highlightExpr: "=> Nom", focus: "slot-this-da" },
    ),
    step(
      "ba-ret-base",
      [4],
      "return Nom : Animal.Decrire va renvoyer \"Rex\" vers Chien.Decrire.",
      main([slotA], [fDc, fDa]),
      [filled, nom],
      rDa,
      {
        highlightExpr: "Nom",
        focus: "obj-c",
        returnFlow: {
          fromMethod: "Animal.Decrire",
          callExpr: "base.Decrire()",
          value: "Rex",
          phase: "returning",
          callLine: 10,
        },
      },
    ),
    step(
      "ba-repl-base",
      [10],
      "Animal.Decrire va disparaître. Dans Chien.Decrire, base.Decrire() va être remplacé par Rex.",
      main([slotA], [fDc]),
      [filled, nom],
      rDc,
      {
        focus: "frame-decrire-c",
        returnFlow: {
          fromMethod: "Animal.Decrire",
          callExpr: "base.Decrire()",
          value: "Rex",
          phase: "replaces",
          callLine: 10,
        },
      },
    ),
    step(
      "ba-concat",
      [10],
      "Rex + \" (chien)\" : une nouvelle string va être créée. Chien.Decrire va renvoyer ce texte.",
      main([slotA], [fDc]),
      [filled, nom, resultat],
      rDc,
      {
        highlightExpr: "+ \" (chien)\"",
        focus: "obj-s2",
        returnFlow: {
          fromMethod: "Chien.Decrire",
          callExpr: "a.Decrire()",
          value: "Rex (chien)",
          targetVar: "s",
          phase: "returning",
          callLine: 16,
        },
      },
    ),
    step(
      "ba-repl-decrire",
      [16],
      "Chien.Decrire va disparaître. Dans Main, a.Decrire() va être remplacé par Rex (chien).",
      main([slotA]),
      [filled, nom, resultat],
      rFilled,
      {
        focus: "frame-main",
        returnFlow: {
          fromMethod: "Chien.Decrire",
          callExpr: "a.Decrire()",
          value: "Rex (chien)",
          targetVar: "s",
          phase: "replaces",
          callLine: 16,
        },
      },
    ),
    step(
      "ba-assign",
      [16],
      "s va pointer vers la nouvelle string. a et s : deux références, deux objets.",
      main([slotA, slotS]),
      [filled, nom, resultat],
      rDone,
      {
        focus: "slot-s",
        returnFlow: {
          fromMethod: "Chien.Decrire",
          callExpr: "a.Decrire()",
          value: "Rex (chien)",
          targetVar: "s",
          phase: "assigned",
          callLine: 16,
        },
      },
    ),
    step("class-base-call-end", [17], MAIN_DONE, main([slotA, slotS]), [filled, nom, resultat], rDone),
  ],
};
