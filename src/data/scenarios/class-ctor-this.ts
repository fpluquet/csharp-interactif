import type { Scenario } from "../../types/memory";
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
  val,
} from "./ooHelpers";

const s = strObj("obj-s", "#S1", "Ada");
const p = refSlot("slot-p", "p", "#P1", "obj-p");

function personne(
  nom: string,
  age: string,
  complet: string,
  withNomField = false,
) {
  return obj("obj-p", "Personne", "#P1", [
    withNomField
      ? { id: "field-nom", label: "Nom", value: nom, kind: "ref", targetId: "obj-s" }
      : { label: "Nom", value: nom, kind: "ref" },
    { label: "Age", value: age, kind: "value" },
    { label: "Complet", value: complet, kind: "value" },
  ]);
}

const defaults = personne("null", "0", "false");
const afterInner = personne("→ #S1", "0", "false", true);
const done = personne("→ #S1", "0", "true", true);

const ctor1 = frame("frame-ctor1", "Personne(string)", [
  refSlot("slot-this1", "this", "#P1", "obj-p"),
  refSlot("slot-nom1", "nom", "#S1", "obj-s"),
]);
const ctor2 = frame("frame-ctor2", "Personne(string, int)", [
  refSlot("slot-this2", "this", "#P1", "obj-p"),
  refSlot("slot-nom2", "nom", "#S1", "obj-s"),
  val("slot-age", "age", "0"),
]);

const refsOuter = [
  link("ref-p", "slot-p", "obj-p"),
  link("ref-this1", "slot-this1", "obj-p"),
  link("ref-nom1", "slot-nom1", "obj-s"),
];
const refsBoth = [
  ...refsOuter,
  link("ref-this2", "slot-this2", "obj-p"),
  link("ref-nom2", "slot-nom2", "obj-s"),
];
const refsDone = [link("ref-p", "slot-p", "obj-p"), fieldLink("ref-field", "field-nom", "obj-s")];
const refsAfterInner = [
  ...refsOuter,
  fieldLink("ref-field", "field-nom", "obj-s"),
];
const refsBothFilled = [
  ...refsBoth,
  fieldLink("ref-field", "field-nom", "obj-s"),
];

export const classCtorThisScenario: Scenario = {
  id: "class-ctor-this",
  title: "Chaînage : this(...)",
  subtitle: "this(...) s’exécute entièrement avant le corps du constructeur qui délègue.",
  part: "oo-constructors",
  code: [
    "class Personne",
    "{",
    "    public string Nom;",
    "    public int Age;",
    "    public bool Complet;",
    "    public Personne(string nom, int age)",
    "    {",
    "        Nom = nom;",
    "        Age = age;",
    "    }",
    "    public Personne(string nom) : this(nom, 0)",
    "    {",
    "        Complet = true;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Personne p = new Personne(\"Ada\");",
    "}",
  ],
  steps: [
    step("th0", [16, 17], "Main démarre.", main([]), [], []),
    step(
      "th1",
      [18],
      "new Personne(\"Ada\") : objet alloué (valeurs par défaut), puis entrée dans le constructeur à 1 argument.",
      main([p], [ctor1]),
      [defaults, s],
      refsOuter,
      { focus: "frame-ctor1" },
    ),
    step(
      "th2",
      [10],
      "Avant le corps : : this(nom, 0). On délègue au constructeur à 2 arguments. Complet n’est pas encore touché.",
      main([p], [ctor1]),
      [defaults, s],
      refsOuter,
      { focus: "frame-ctor1" },
    ),
    step(
      "th3",
      [5, 6],
      "Frame empilée : Personne(string, int). Même this → #P1. age = 0 (fourni par this).",
      main([p], [ctor1, ctor2]),
      [defaults, s],
      refsBoth,
      { focus: "frame-ctor2" },
    ),
    step(
      "th4",
      [7],
      "Nom = nom : le champ de #P1 pointe vers \"Ada\".",
      main([p], [ctor1, ctor2]),
      [personne("→ #S1", "0", "false", true), s],
      refsBothFilled,
      { focus: "obj-p" },
    ),
    step(
      "th5",
      [8],
      "Age = age : Age devient 0. Fin du constructeur délégué.",
      main([p], [ctor1, ctor2]),
      [afterInner, s],
      refsBothFilled,
      { focus: "obj-p" },
    ),
    step(
      "th6",
      [10],
      "Retour de this(nom, 0) : la frame à 2 args disparaît. On reprend le constructeur à 1 arg, juste après la délégation.",
      main([p], [ctor1]),
      [afterInner, s],
      refsAfterInner,
      { focus: "frame-ctor1" },
    ),
    step(
      "th7",
      [12],
      "Maintenant seulement le corps : Complet = true. this(...) a déjà fini.",
      main([p], [ctor1]),
      [done, s],
      refsAfterInner,
      { focus: "obj-p" },
    ),
    step(
      "th8",
      [18],
      "Fin du constructeur externe : plus de this. p pointe vers l’objet initialisé.",
      main([p]),
      [done, s],
      refsDone,
      { focus: "slot-p" },
    ),
    step("class-ctor-this-end", [19], MAIN_DONE, main([p]), [done, s], refsDone),
  ],
};
