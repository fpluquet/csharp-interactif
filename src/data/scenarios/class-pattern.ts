import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

const cercle = obj("obj-c", "Cercle", "#C1", [{ label: "R", value: "2", kind: "value" }]);
const slotF = refSlot("slot-f", "f", "#C1", "obj-c", "Forme");
const slotFAire = refSlot("slot-f-aire", "f", "#C1", "obj-c", "Forme");
const slotR = val("slot-r", "r", "2");
const slotA = val("slot-a", "a", "12.56");
const refsMain = [link("ref-f", "slot-f", "obj-c")];
const refsCall = [...refsMain, link("ref-f-aire", "slot-f-aire", "obj-c")];
const aire = (extra = [slotFAire]) => main([slotF], [frame("frame-aire", "Aire", extra)]);

export const classPatternScenario: Scenario = {
  id: "class-pattern",
  title: "Pattern matching",
  subtitle:
    "switch choisit selon le type réel de l’objet, pas le type déclaré. Un motif peut extraire un champ (R → r).",
  part: "oo-pattern",
  code: [
    "abstract class Forme { }",
    "",
    "class Cercle : Forme",
    "{",
    "    public int R;",
    "    public Cercle(int r) { R = r; }",
    "}",
    "",
    "class Carre : Forme",
    "{",
    "    public int Cote;",
    "}",
    "",
    "double Aire(Forme f) => f switch",
    "{",
    "    Cercle { R: var r } => 3.14 * r * r,",
    "    Carre { Cote: var c } => c * c,",
    "    _ => 0",
    "};",
    "",
    "Forme f = new Cercle(2);",
    "double a = Aire(f);",
  ],
  steps: [
    step(
      "pm0",
      [20],
      "Le programme va démarrer. f sera déclaré Forme : on ne saura pas encore si c’est un Cercle ou un Carré.",
      main([]),
      [],
      [],
    ),
    step(
      "pm1",
      [20],
      "new Cercle(2) : l’objet réel va être un Cercle, avec R = 2. Le type déclaré de f reste Forme.",
      main([slotF]),
      [cercle],
      refsMain,
      { focus: "obj-c", highlightExpr: "new Cercle(2)" },
    ),
    step(
      "pm2",
      [21, 13],
      "Aire(f) : une frame Aire va s’empiler. Son paramètre f pointe vers le même Cercle — toujours déclaré Forme.",
      aire(),
      [cercle],
      refsCall,
      { focus: "frame-aire", highlightExpr: "Aire(f)" },
    ),
    step(
      "pm3",
      [13, 14],
      "f switch : on ne regarde pas le type déclaré Forme, mais le type réel de l’objet (Cercle). Les motifs sont testés de haut en bas.",
      aire(),
      [cercle],
      refsCall,
      { focus: "obj-c", highlightExpr: "f switch" },
    ),
    step(
      "pm4",
      [15],
      "Premier motif : Cercle { R: var r }. L’objet est bien un Cercle → ça matche. { R: var r } copie le champ R dans un local r (ici 2).",
      aire([slotFAire, slotR]),
      [cercle],
      refsCall,
      { focus: "slot-r", highlightExpr: "Cercle { R: var r }" },
    ),
    step(
      "pm5",
      [16, 17],
      "Les motifs suivants ne seront pas testés : Carre et _ (le « sinon ») sont ignorés, parce que le premier a déjà réussi.",
      aire([slotFAire, slotR]),
      [cercle],
      refsCall,
      { highlightExpr: "Carre { Cote: var c }" },
    ),
    step(
      "pm6",
      [15],
      "Branche choisie : 3.14 * r * r → 3.14 * 2 * 2 va valoir 12.56. C’est le résultat de Aire.",
      aire([slotFAire, slotR]),
      [cercle],
      refsCall,
      { highlightExpr: "3.14 * r * r", focus: "slot-r" },
    ),
    step(
      "pm7",
      [21],
      "Aire va renvoyer 12.56. Sa frame (f et r) va disparaître. a va recevoir 12.56 dans Main.",
      main([slotF, slotA]),
      [cercle],
      refsMain,
      {
        focus: "slot-a",
        highlightExpr: "Aire(f)",
        returnFlow: {
          fromMethod: "Aire",
          callExpr: "Aire(f)",
          value: "12.56",
          targetVar: "a",
          phase: "assigned",
          callLine: 21,
        },
      },
    ),
    step(
      "class-pattern-end",
      [],
      MAIN_DONE,
      main([slotF, slotA]),
      [cercle],
      refsMain,
    ),
  ],
};
