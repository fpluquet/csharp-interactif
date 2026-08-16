import type { Scenario } from "../../types/memory";
import { MAIN_DONE, fieldLink, link, main, obj, refSlot, step, strObj } from "./ooHelpers";

const s = strObj("obj-s", "#S1", "Ada");
const heap = [
  obj("obj-b", "Depot<string>", "#B1", [
    { id: "field-v", label: "Valeur", value: "→ #S1", kind: "ref", targetId: "obj-s" },
  ]),
  s,
];
const refs = [link("ref-d", "slot-d", "obj-b"), fieldLink("ref-v", "field-v", "obj-s")];

export const classGenericWhereScenario: Scenario = {
  id: "class-generic-where",
  title: "Contrainte where",
  subtitle: "where T : class : T doit être un type référence. Depot<string> OK, Depot<int> interdit.",
  part: "oo-generics",
  code: [
    "class Depot<T> where T : class",
    "{",
    "    public T Valeur;",
    "    public Depot(T valeur) { Valeur = valeur; }",
    "}",
    "",
    "Depot<string> d = new Depot<string>(\"Ada\");",
    "// Depot<int> interdit : int n’est pas une classe",
  ],
  steps: [
    step("gw0", [6], "Le programme va démarrer. La contrainte where T : class est déjà vérifiée à la compilation.", main([]), [], []),
    step(
      "gw1",
      [6],
      "Depot<string> : string est une classe → l’objet va être sur le heap, Valeur va être une référence.",
      main([refSlot("slot-d", "d", "#B1", "obj-b", "Depot<string>")]),
      heap,
      refs,
      { focus: "obj-b", highlightExpr: "new Depot<string>(\"Ada\")" },
    ),
    step(
      "class-generic-where-end",
      [7],
      MAIN_DONE,
      main([refSlot("slot-d", "d", "#B1", "obj-b", "Depot<string>")]),
      heap,
      refs,
    ),
  ],
};
