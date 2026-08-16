import type { Scenario, StackSlot } from "../../types/memory";
import { MAIN_DONE, link, main, refSlot, step, strObj, val } from "./ooHelpers";

const aNull: StackSlot = {
  id: "slot-a",
  name: "a",
  value: "null",
  kind: "ref",
  declaredType: "string?",
};
const bAda = refSlot("slot-b", "b", "#S1", "obj-b", "string?");
const na: StackSlot = { ...val("slot-na", "na", "null"), declaredType: "int?" };
const nb: StackSlot = { ...val("slot-nb", "nb", "3"), declaredType: "int?" };
const defaut = refSlot("slot-defaut", "defaut", "#S2", "obj-def", "string");
const meme = refSlot("slot-meme", "meme", "#S1", "obj-b", "string");
const n: StackSlot = { ...val("slot-n", "n", "0"), declaredType: "int" };

const ada = strObj("obj-b", "#S1", "Ada");
const anon = strObj("obj-def", "#S2", "anonyme");

const rB = [link("ref-b", "slot-b", "obj-b")];
const rDef = [...rB, link("ref-defaut", "slot-defaut", "obj-def")];
const rAll = [...rDef, link("ref-meme", "slot-meme", "obj-b")];

export const classNullableScenario: Scenario = {
  id: "class-nullable",
  title: "?. et ??",
  subtitle: "?. court-circuite si null ; ?? prend la gauche si elle existe, sinon un défaut. On peut les enchaîner.",
  part: "oo-nullable",
  code: [
    "string? a = null;",
    "string? b = \"Ada\";",
    "int? na = a?.Length;",
    "int? nb = b?.Length;",
    "string defaut = a ?? \"anonyme\";",
    "string meme = b ?? \"anonyme\";",
    "int n = a?.Length ?? 0;",
  ],
  steps: [
    step("nu0", [0], "Le programme va démarrer. On va comparer ?. et ?? quand la valeur est null, et quand elle ne l’est pas.", main([]), [], []),
    step(
      "nu-a",
      [0],
      "string? a = null : a va valoir null. Pas d’objet sur le heap.",
      main([aNull]),
      [],
      [],
      { focus: "slot-a" },
    ),
    step(
      "nu-b",
      [1],
      "string? b = \"Ada\" : b va pointer vers un objet string. a reste null — deux cas côte à côte.",
      main([aNull, bAda]),
      [ada],
      rB,
      { focus: "slot-b" },
    ),
    step(
      "nu-a-len",
      [2],
      "a?.Length : a est null → on ne va pas appeler Length (pas de NullReferenceException). na (int?) va valoir null.",
      main([aNull, bAda, na]),
      [ada],
      rB,
      { highlightExpr: "a?.Length", focus: "slot-na" },
    ),
    step(
      "nu-b-len",
      [3],
      "b?.Length : b n’est pas null → Length va être appelé. nb va valoir 3.",
      main([aNull, bAda, na, nb]),
      [ada],
      rB,
      { highlightExpr: "b?.Length", focus: "slot-nb" },
    ),
    step(
      "nu-a-coalesce",
      [4],
      "a ?? \"anonyme\" : a est null → on va prendre le défaut. Une string \"anonyme\" va apparaître sur le heap.",
      main([aNull, bAda, na, nb, defaut]),
      [ada, anon],
      rDef,
      { highlightExpr: "a ?? \"anonyme\"", focus: "slot-defaut" },
    ),
    step(
      "nu-b-coalesce",
      [5],
      "b ?? \"anonyme\" : b n’est pas null → on garde b. meme va pointer vers le même #S1. \"anonyme\" à droite ne va même pas être évalué.",
      main([aNull, bAda, na, nb, defaut, meme]),
      [ada, anon],
      rAll,
      { highlightExpr: "b ?? \"anonyme\"", focus: "slot-meme" },
    ),
    step(
      "nu-combo",
      [6],
      "a?.Length ?? 0 : ?. donne null, puis ?? 0. n est un int (plus un int?) : on a un vrai 0, utilisable sans test.",
      main([aNull, bAda, na, nb, defaut, meme, n]),
      [ada, anon],
      rAll,
      { highlightExpr: "a?.Length ?? 0", focus: "slot-n" },
    ),
    step(
      "class-nullable-end",
      [6],
      MAIN_DONE,
      main([aNull, bAda, na, nb, defaut, meme, n]),
      [ada, anon],
      rAll,
    ),
  ],
};
