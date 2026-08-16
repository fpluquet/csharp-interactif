import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step, val } from "./ooHelpers";

function cube(cells: Record<string, string>) {
  const keys = ["[0,0,0]", "[0,0,1]", "[0,1,0]", "[0,1,1]", "[1,0,0]", "[1,0,1]", "[1,1,0]", "[1,1,1]"];
  return obj(
    "obj-c",
    "int[,,]",
    "#C1",
    keys.map((label) => ({ label, value: cells[label] ?? "0" })),
  );
}

const zeros = cube({});
const written = cube({ "[0,1,0]": "7" });
const slotC = refSlot("slot-c", "c", "#C1", "obj-c", "int[,,]");
const refs = [link("ref-c", "slot-c", "obj-c")];

export const array3dScenario: Scenario = {
  id: "array-3d",
  title: "Tableau 3D",
  subtitle: "int[,,] : un seul objet, trois indices [i, j, k]. Toutes les cases ont la même taille.",
  part: "collections",
  code: [
    "int[,,] c = new int[2, 2, 2];",
    "c[0, 1, 0] = 7;",
    "int v = c[0, 1, 0];",
    "Console.WriteLine(v);",
  ],
  steps: [
    step("d30", [0], "Le programme va démarrer. Un tableau 3D rectangulaire : une virgule de plus que int[,].", main([]), [], [], {
      consoleLines: [],
    }),
    step(
      "d3-new",
      [0],
      "new int[2, 2, 2] : un seul objet sur le heap, 8 cases, toutes à 0. Ce n’est pas un tableau de tableaux.",
      main([slotC]),
      [zeros],
      refs,
      { highlightExpr: "new int[2, 2, 2]", focus: "obj-c", consoleLines: [] },
    ),
    step(
      "d3-set",
      [1],
      "c[0, 1, 0] = 7 : on adresse la case par trois indices. Les autres restent 0.",
      main([slotC]),
      [written],
      refs,
      { highlightExpr: "c[0, 1, 0]", focus: "obj-c", consoleLines: [] },
    ),
    step(
      "d3-get",
      [2],
      "Lecture : c[0, 1, 0] va copier 7 dans v (int, sur la stack).",
      main([slotC, val("slot-v", "v", "7")]),
      [written],
      refs,
      { highlightExpr: "c[0, 1, 0]", focus: "slot-v", consoleLines: [] },
    ),
    step(
      "d3-print",
      [3],
      "On va afficher 7.",
      main([slotC, val("slot-v", "v", "7")]),
      [written],
      refs,
      { consoleLines: ["7"] },
    ),
    step("array-3d-end", [3], MAIN_DONE, main([slotC, val("slot-v", "v", "7")]), [written], refs, {
      consoleLines: ["7"],
    }),
  ],
};
