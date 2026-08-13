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
    "    public Personne(string nom)",
    "        : this(nom, 0)",
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
    step(
      "th0",
      [17, 18],
      "Main va démarrer. new Personne(\"Ada\") va d’abord déléguer via : this(...), avant le corps Complet = true.",
      main([]),
      [],
      [],
    ),
    step(
      "th-new",
      [19],
      "new Personne(\"Ada\") : on va allouer un objet, puis entrer dans le constructeur à 1 argument — pas celui à 2.",
      main([]),
      [],
      [],
      { highlightExpr: "new Personne(\"Ada\")", focus: "frame-main" },
    ),
    step(
      "th-enter-1",
      [10],
      "Objet #P1 alloué (Nom null, Age 0, Complet false). Frame Personne(string) : this → #P1, nom → \"Ada\".",
      main([p], [ctor1]),
      [defaults, s],
      refsOuter,
      { highlightExpr: "Personne(string nom)", focus: "frame-ctor1" },
    ),
    step(
      "th-this",
      [11],
      "Avant le corps : : this(nom, 0). On va appeler l’autre constructeur. Complet ne va pas encore être touché.",
      main([p], [ctor1]),
      [defaults, s],
      refsOuter,
      { highlightExpr: ": this(nom, 0)", focus: "slot-nom1" },
    ),
    step(
      "th-enter-2",
      [5],
      "Frame Personne(string, int) empilée. Même this → #P1. nom est recopié ; age va valoir 0 (le littéral passé par this).",
      main([p], [ctor1, ctor2]),
      [defaults, s],
      refsBoth,
      { highlightExpr: "Personne(string nom, int age)", focus: "slot-age" },
    ),
    step(
      "th-nom",
      [7],
      "Corps du constructeur délégué : Nom = nom. Le champ de #P1 va pointer vers \"Ada\".",
      main([p], [ctor1, ctor2]),
      [personne("→ #S1", "0", "false", true), s],
      refsBothFilled,
      { highlightExpr: "Nom = nom", focus: "obj-p" },
    ),
    step(
      "th-age",
      [8],
      "Age = age : Age va devenir 0. Complet est encore false — ce n’est pas le rôle de ce constructeur.",
      main([p], [ctor1, ctor2]),
      [afterInner, s],
      refsBothFilled,
      { highlightExpr: "Age = age", focus: "obj-p" },
    ),
    step(
      "th-ret-this",
      [11],
      "Personne(string, int) va se terminer. On revient juste après : this(nom, 0). La frame à 1 arg attendait ici.",
      main([p], [ctor1]),
      [afterInner, s],
      refsAfterInner,
      { highlightExpr: ": this(nom, 0)", focus: "frame-ctor1" },
    ),
    step(
      "th-complet",
      [13],
      "Maintenant seulement le corps du constructeur externe : Complet va valoir true. this(...) est déjà fini.",
      main([p], [ctor1]),
      [done, s],
      refsAfterInner,
      { highlightExpr: "Complet = true", focus: "obj-p" },
    ),
    step(
      "th-done",
      [19],
      "Fin du constructeur à 1 argument : plus de this. p va pointer vers l’objet entièrement initialisé.",
      main([p]),
      [done, s],
      refsDone,
      { highlightExpr: "new Personne(\"Ada\")", focus: "slot-p" },
    ),
    step("class-ctor-this-end", [20], MAIN_DONE, main([p]), [done, s], refsDone),
  ],
};
