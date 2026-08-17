import type { HeapObject, Scenario, StackSlot } from "../../types/memory";
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
const l1Orphan = (...items: string[]) => liste("obj-l1", "#L1", items, true);
const l2 = () => liste("obj-l2", "#L2", ["99"]);

const slotN = (target = "obj-l1", address = "#L1") =>
  refSlot("slot-n", "n", address, target);
const slotLAlias: StackSlot = {
  id: "slot-l",
  name: "l",
  value: "→ n",
  kind: "ref",
  targetId: "slot-n",
};

const refsN = (to = "obj-l1") => [link("ref-n", "slot-n", to)];

const muter = () => main([slotN()], [frame("frame-muter", "Muter", [slotLAlias])]);
const remplacer = (n = slotN()) =>
  main([n], [frame("frame-remplacer", "Remplacer", [slotLAlias])]);

export const paramListRefScenario: Scenario = {
  id: "param-list-ref",
  title: "List : muter vs réassigner (ref)",
  subtitle:
    "Même code, avec ref. Add se voyait déjà ; l = new List… remplace maintenant n.",
  part: "functions",
  code: [
    "void Muter(ref List<int> l)",
    "{",
    "    l.Add(3);",
    "}",
    "",
    "void Remplacer(ref List<int> l)",
    "{",
    "    l = new List<int> { 99 };",
    "}",
    "",
    "List<int> n = new List<int> { 1 };",
    "Muter(ref n);",
    "// n contient 1, 3",
    "Remplacer(ref n);",
    "// n contient 99",
  ],
  steps: [
    step(
      "plr0",
      [10],
      "Le programme va démarrer. Même exemple que sans ref : on va voir ce que ref change.",
      main([]),
      [],
      [],
    ),
    step(
      "plr1",
      [10],
      "new List<int> { 1 } : n va pointer vers #L1, comme avant.",
      main([slotN()]),
      [l1("1")],
      refsN(),
      { focus: "obj-l1", highlightExpr: "new List<int> { 1 }" },
    ),
    step(
      "plr2",
      [11, 0],
      "Muter(ref n) : l n’est plus une copie, c’est un alias de n (comme ref int).",
      muter(),
      [l1("1")],
      refsN(),
      { focus: "slot-l", highlightExpr: "Muter(ref n)" },
    ),
    step(
      "plr3",
      [2],
      "l.Add(3) : on mute encore #L1. ref n’apporte rien ici — sans ref, Add se voyait déjà.",
      muter(),
      [l1("1", "3")],
      refsN(),
      { focus: "obj-l1", highlightExpr: "l.Add(3)" },
    ),
    step(
      "plr4",
      [3, 12],
      "Retour : n contient 1, 3. Jusqu’ici, le résultat est le même que sans ref.",
      main([slotN()]),
      [l1("1", "3")],
      refsN(),
      { focus: "obj-l1" },
    ),
    step(
      "plr5",
      [13, 5],
      "Remplacer(ref n) : l alias encore n. C’est ici que ref va changer quelque chose.",
      remplacer(),
      [l1("1", "3")],
      refsN(),
      { focus: "slot-l", highlightExpr: "Remplacer(ref n)" },
    ),
    step(
      "plr6",
      [7],
      "l = new List<int> { 99 } : comme l alias n, n va pointer vers #L2. #L1 n’a plus de flèche.",
      remplacer(slotN("obj-l2", "#L2")),
      [l1Orphan("1", "3"), l2()],
      refsN("obj-l2"),
      { focus: "obj-l2", highlightExpr: "l =" },
    ),
    step(
      "plr7",
      [8, 14],
      "Retour : n contient 99. Avec ref, réassigner le paramètre remplace bien la liste de l’appelant.",
      main([slotN("obj-l2", "#L2")]),
      [l1Orphan("1", "3"), l2()],
      refsN("obj-l2"),
      { focus: "slot-n" },
    ),
    step(
      "param-list-ref-end",
      [14],
      MAIN_DONE,
      main([slotN("obj-l2", "#L2")]),
      [l1Orphan("1", "3"), l2()],
      refsN("obj-l2"),
    ),
  ],
};
