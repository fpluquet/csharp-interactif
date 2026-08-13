import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

function ndKeys(...dims: number[]): string[] {
  const keys: string[] = [];
  const acc: number[] = [];
  function rec() {
    if (acc.length === dims.length) {
      keys.push(`[${acc.join(",")}]`);
      return;
    }
    const n = dims[acc.length] ?? 0;
    for (let i = 0; i < n; i++) {
      acc.push(i);
      rec();
      acc.pop();
    }
  }
  rec();
  return keys;
}

function hyper(cells: Record<string, string>) {
  return obj(
    "obj-t",
    "int[,,,]",
    "#T1",
    ndKeys(2, 2, 2, 2).map((label) => ({ label, value: cells[label] ?? "0" })),
  );
}

const zeros = hyper({});
const written = hyper({ "[1,0,1,0]": "9" });
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
    "    int[,,,] t = new int[2, 2, 2, 2];",
    "    t[1, 0, 1, 0] = 9;",
    "    int v = t[1, 0, 1, 0];",
    "    Console.WriteLine(t.Rank);",
    "    Console.WriteLine(v);",
    "}",
  ],
  steps: [
    step(
      "d40",
      [0, 1],
      "Main va démarrer. 4D = 3 virgules dans le type. 2×2×2×2 = 16 cases, toutes visibles sur le heap.",
      main([]),
      [],
      [],
      { consoleLines: [] },
    ),
    step(
      "d4-new",
      [2],
      "new int[2, 2, 2, 2] : un seul objet, 16 cases à 0. Les 4 indices existent vraiment — aucune dimension n’est « sautée ».",
      main([slotT]),
      [zeros],
      refs,
      { highlightExpr: "new int[2, 2, 2, 2]", focus: "obj-t", consoleLines: [] },
    ),
    step(
      "d4-set",
      [3],
      "t[1, 0, 1, 0] = 9 : quatre indices, dans l’ordre des dimensions. Les 15 autres cases restent 0.",
      main([slotT]),
      [written],
      refs,
      { highlightExpr: "t[1, 0, 1, 0]", focus: "obj-t", consoleLines: [] },
    ),
    step(
      "d4-get",
      [4],
      "Lecture : même quadruplet d’indices → v va valoir 9.",
      main([slotT, val("slot-v", "v", "9")]),
      [written],
      refs,
      { highlightExpr: "t[1, 0, 1, 0]", focus: "slot-v", consoleLines: [] },
    ),
    step(
      "d4-rank",
      [5],
      "t.Rank va valoir 4 : le nombre de dimensions, pas le nombre de cases (Length vaudrait 16).",
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
