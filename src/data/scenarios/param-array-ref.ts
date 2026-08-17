import type { HeapObject, Scenario, StackSlot } from "../../types/memory";
import { MAIN_DONE, frame, link, main, obj, refSlot, step } from "./ooHelpers";

function tab(id: string, address: string, value: string, orphan = false): HeapObject {
  return {
    ...obj(id, "int[]", address, [{ label: "[0]", value }]),
    ...(orphan ? { orphan: true } : {}),
  };
}

const t1 = (orphan = false) => tab("obj-t1", "#T1", "1", orphan);
const t2 = (orphan = false) => tab("obj-t2", "#T2", "9", orphan);
const t3 = () => tab("obj-t3", "#T3", "9");

const slotA = (target = "obj-t1", address = "#T1") =>
  refSlot("slot-a", "a", address, target);
const slotT = (target = "obj-t1", address = "#T1") =>
  refSlot("slot-t", "t", address, target);
const slotTAlias: StackSlot = {
  id: "slot-t",
  name: "t",
  value: "→ a",
  kind: "ref",
  targetId: "slot-a",
};

const refsA = (to = "obj-t1") => [link("ref-a", "slot-a", to)];
const refsShare = (to = "obj-t1") => [
  ...refsA(to),
  link("ref-t", "slot-t", to),
];
const refsSplit = [
  link("ref-a", "slot-a", "obj-t1"),
  link("ref-t", "slot-t", "obj-t2"),
];

const remplacer = (t = slotT()) =>
  main([slotA()], [frame("frame-remplacer", "Remplacer", [t])]);
const remplacerRef = (a = slotA()) =>
  main([a], [frame("frame-ref", "RemplacerRef", [slotTAlias])]);

export const paramArrayRefScenario: Scenario = {
  id: "param-array-ref",
  title: "ref sur un tableau",
  subtitle:
    "Sans ref, t = new int[] ne change pas a. Avec ref int[], a pointe vers le nouveau tableau.",
  part: "functions",
  code: [
    "void Remplacer(int[] t)",
    "{",
    "    t = new int[] { 9 };",
    "}",
    "",
    "void RemplacerRef(ref int[] t)",
    "{",
    "    t = new int[] { 9 };",
    "}",
    "",
    "int[] a = { 1 };",
    "Remplacer(a);",
    "// a[0] vaut encore 1",
    "RemplacerRef(ref a);",
    "// a[0] vaut 9",
  ],
  steps: [
    step(
      "par0",
      [10],
      "Le programme va démarrer. On va comparer réassigner le paramètre avec et sans ref.",
      main([]),
      [],
      [],
    ),
    step(
      "par1",
      [10],
      "int[] a = { 1 } : le tableau va être sur le heap, a va pointer vers #T1.",
      main([slotA()]),
      [t1()],
      refsA(),
      { focus: "obj-t1" },
    ),
    step(
      "par2",
      [11, 0],
      "Remplacer(a) : t va recevoir une copie de la référence. Deux flèches, un seul tableau.",
      remplacer(),
      [t1()],
      refsShare(),
      { focus: "slot-t", highlightExpr: "Remplacer(a)" },
    ),
    step(
      "par3",
      [2],
      "t = new int[] { 9 } : seule la copie t va viser #T2. a reste sur #T1.",
      remplacer(slotT("obj-t2", "#T2")),
      [t1(), t2()],
      refsSplit,
      { focus: "obj-t2", highlightExpr: "t =" },
    ),
    step(
      "par4",
      [3, 12],
      "Retour : a[0] vaut encore 1. #T2 devient orphelin — sans ref, réassigner t ne remplace pas a.",
      main([slotA()]),
      [t1(), t2(true)],
      refsA(),
      { focus: "slot-a" },
    ),
    step(
      "par5",
      [13, 5],
      "RemplacerRef(ref a) : t n’est plus une copie, c’est un alias de a (comme ref int).",
      remplacerRef(),
      [t1()],
      refsA(),
      { focus: "slot-t", highlightExpr: "RemplacerRef(ref a)" },
    ),
    step(
      "par6",
      [7],
      "t = new int[] { 9 } : comme t alias a, a va pointer vers #T3. #T1 n’a plus de flèche.",
      remplacerRef(slotA("obj-t3", "#T3")),
      [t1(true), t3()],
      refsA("obj-t3"),
      { focus: "obj-t3", highlightExpr: "t =" },
    ),
    step(
      "par7",
      [8, 14],
      "Retour : a[0] vaut 9. Avec ref, réassigner le paramètre remplace bien la variable de l’appelant.",
      main([slotA("obj-t3", "#T3")]),
      [t1(true), t3()],
      refsA("obj-t3"),
      { focus: "slot-a" },
    ),
    step(
      "param-array-ref-end",
      [14],
      MAIN_DONE,
      main([slotA("obj-t3", "#T3")]),
      [t1(true), t3()],
      refsA("obj-t3"),
    ),
  ],
};
