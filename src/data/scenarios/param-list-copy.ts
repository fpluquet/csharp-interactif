import type { HeapObject, Scenario } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step } from "./ooHelpers";

function liste(id: string, address: string, items: string[], orphan = false): HeapObject {
  return {
    ...obj(id, "List<int>", address, [
      { label: "Count", value: String(items.length) },
      ...items.map((v, i) => ({ label: `[${i}]`, value: v })),
    ]),
    ...(orphan ? { orphan: true } : {}),
  };
}

const l1 = (...items: string[]) => liste("obj-l1", "#L1", items);
const l2 = (orphan = false) => liste("obj-l2", "#L2", ["99"], orphan);

const slotN = refSlot("slot-n", "n", "#L1", "obj-l1");
const slotL = refSlot("slot-l", "l", "#L1", "obj-l1");
const slotL2 = refSlot("slot-l", "l", "#L2", "obj-l2");

const refsN = [link("ref-n", "slot-n", "obj-l1")];
const refsShare = [...refsN, link("ref-l", "slot-l", "obj-l1")];
const refsSplit = [...refsN, link("ref-l", "slot-l", "obj-l2")];

const muter = () => main([slotN], [frame("frame-muter", "Muter", [slotL])]);
const remplacer = (l = slotL) => main([slotN], [frame("frame-remplacer", "Remplacer", [l])]);

export const paramListCopyScenario: Scenario = {
  id: "param-list-copy",
  title: "List : muter vs réassigner",
  subtitle:
    "On copie la référence. Add change l’objet partagé ; l = new List… ne change pas n. Même principe pour un objet ou un tableau.",
  part: "functions",
  code: [
    "void Muter(List<int> l)",
    "{",
    "    l.Add(3);",
    "}",
    "",
    "void Remplacer(List<int> l)",
    "{",
    "    l = new List<int> { 99 };",
    "}",
    "",
    "List<int> n = new List<int> { 1 };",
    "Muter(n);",
    "// n contient 1, 3",
    "Remplacer(n);",
    "// n contient encore 1, 3",
  ],
  steps: [
    step(
      "plc0",
      [10],
      "Le programme va démarrer. On va distinguer muter l’objet et réassigner le paramètre.",
      main([]),
      [],
      [],
    ),
    step(
      "plc1",
      [10],
      "new List<int> { 1 } : la liste va être sur le heap, n va pointer vers #L1.",
      main([slotN]),
      [l1("1")],
      refsN,
      { focus: "obj-l1", highlightExpr: "new List<int> { 1 }" },
    ),
    step(
      "plc2",
      [11, 0],
      "Muter(n) : l va recevoir une copie de la référence. n et l vont pointer vers le même objet.",
      muter(),
      [l1("1")],
      refsShare,
      { focus: "slot-l", highlightExpr: "Muter(n)" },
    ),
    step(
      "plc3",
      [2],
      "l.Add(3) : on va modifier l’objet #L1, pas la variable n. Les deux flèches voient le 3.",
      muter(),
      [l1("1", "3")],
      refsShare,
      { focus: "obj-l1", highlightExpr: "l.Add(3)" },
    ),
    step(
      "plc4",
      [3, 12],
      "Retour dans Main : n pointe toujours vers #L1, qui contient maintenant 1 et 3.",
      main([slotN]),
      [l1("1", "3")],
      refsN,
      { focus: "obj-l1" },
    ),
    step(
      "plc5",
      [13, 5],
      "Remplacer(n) : encore une copie de la référence. l et n visent #L1.",
      remplacer(),
      [l1("1", "3")],
      refsShare,
      { focus: "slot-l", highlightExpr: "Remplacer(n)" },
    ),
    step(
      "plc6",
      [7],
      "l = new List<int> { 99 } : seule la copie l va pointer vers #L2. n reste sur #L1.",
      remplacer(slotL2),
      [l1("1", "3"), l2()],
      refsSplit,
      { focus: "obj-l2", highlightExpr: "l =" },
    ),
    step(
      "plc7",
      [8, 14],
      "Retour : n contient encore 1, 3. #L2 n’a plus de flèche — orphelin. Réassigner le paramètre ne remplace pas n.",
      main([slotN]),
      [l1("1", "3"), l2(true)],
      refsN,
      { focus: "slot-n" },
    ),
    step(
      "param-list-copy-end",
      [14],
      MAIN_DONE,
      main([slotN]),
      [l1("1", "3"), l2(true)],
      refsN,
    ),
  ],
};
