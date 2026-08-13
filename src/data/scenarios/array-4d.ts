import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

function hyper(cells: Record<string, string>) {
  const keys = ["[0,0,0,0]", "[0,0,0,1]", "[1,0,0,0]", "[1,0,0,1]"];
  return obj(
    "obj-t",
    "int[,,,]",
    "#T1",
    keys.map((label) => ({ label, value: cells[label] ?? "0" })),
  );
}

const zeros = hyper({});
const written = hyper({ "[1,0,0,1]": "9" });
const slotT = refSlot("slot-t", "t", "#T1", "obj-t", "int[,,,]");
const refs = [link("ref-t", "slot-t", "obj-t")];

export const array4dScenario: Scenario = {
  id: "array-4d",
  title: "Tableau 4D",
  subtitle: "int[,,,] : toujours un seul objet. Chaque virgule ajoute une dimension, le Rank augmente.",
  part: "collections",
  code: [
    "static void Main()",
    "{",
    "    int[,,,] t = new int[2, 1, 1, 2];",
    "    t[1, 0, 0, 1] = 9;",
    "    int v = t[1, 0, 0, 1];",
    "    Console.WriteLine(t.Rank);",
    "    Console.WriteLine(v);",
    "}",
  ],
  steps: [
    step(
      "d40",
      [0, 1],
      "Main va démarrer. 4D = 3 virgules dans le type. On garde des tailles petites pour lire le heap.",
      main([]),
      [],
      [],
      { consoleLines: [] },
    ),
    step(
      "d4-new",
      [2],
      "new int[2, 1, 1, 2] : 2×1×1×2 = 4 cases, un seul objet. Les dimensions 1 sont « plates » mais comptent dans l’index.",
      main([slotT]),
      [zeros],
      refs,
      { highlightExpr: "new int[2, 1, 1, 2]", focus: "obj-t", consoleLines: [] },
    ),
    step(
      "d4-set",
      [3],
      "t[1, 0, 0, 1] = 9 : quatre indices, dans l’ordre des dimensions. Les 0 du milieu sont obligatoires.",
      main([slotT]),
      [written],
      refs,
      { highlightExpr: "t[1, 0, 0, 1]", focus: "obj-t", consoleLines: [] },
    ),
    step(
      "d4-get",
      [4],
      "Lecture : même quadruplet d’indices → v va valoir 9.",
      main([slotT, val("slot-v", "v", "9")]),
      [written],
      refs,
      { highlightExpr: "t[1, 0, 0, 1]", focus: "slot-v", consoleLines: [] },
    ),
    step(
      "d4-rank",
      [5],
      "t.Rank va valoir 4 : le nombre de dimensions, pas le nombre de cases (Length vaudrait 4).",
      main([slotT, val("slot-v", "v", "9")]),
      [written],
      refs,
      { highlightExpr: "t.Rank", focus: "obj-t", consoleLines: ["4"] },
    ),
    step(
      "d4-print",
      [6],
      "On va afficher 9.",
      main([slotT, val("slot-v", "v", "9")]),
      [written],
      refs,
      { consoleLines: ["4", "9"] },
    ),
    step(
      "array-4d-end",
      [7],
      MAIN_DONE,
      main([slotT, val("slot-v", "v", "9")]),
      [written],
      refs,
      { consoleLines: ["4", "9"] },
    ),
  ],
};
