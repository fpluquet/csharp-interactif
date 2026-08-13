import type { DispatchFlow, HeapObject, RefLink, Scenario, StackFrame, StackSlot } from "../../types/memory";

function main(slots: StackSlot[]): StackFrame[] {
  return [{ id: "frame-main", method: "Main", slots }];
}

function slot(
  id: string,
  name: string,
  targetId: string,
  address: string,
  declaredType: string,
): StackSlot {
  return {
    id,
    name,
    value: `→ ${address}`,
    kind: "ref",
    targetId,
    declaredType,
  };
}

function animalObj(id: string, typeLabel: string, address: string): HeapObject {
  return {
    id,
    typeLabel,
    address,
    fields: [{ label: "(hérite Animal)", value: "" }],
  };
}

function ref(id: string, fromSlotId: string, toObjectId: string): RefLink {
  return { id, fromSlotId, toObjectId };
}

function dispatch(partial: DispatchFlow): DispatchFlow {
  return partial;
}

const objChien = animalObj("obj-chien", "Chien", "#C1");
const objChat = animalObj("obj-chat", "Chat", "#C2");
const objVache = animalObj("obj-vache", "Vache", "#C3");

const sA1 = slot("slot-a1", "a1", "obj-chien", "#C1", "Animal");
const sA2 = slot("slot-a2", "a2", "obj-chat", "#C2", "Animal");
const sA3 = slot("slot-a3", "a3", "obj-vache", "#C3", "Animal");
const sC = slot("slot-c", "c", "obj-chien", "#C1", "Chien");
const sChat = slot("slot-chat", "chat", "obj-chat", "#C2", "Chat");

export const classVirtualScenario: Scenario = {
  id: "class-virtual",
  title: "virtual / override / new",
  subtitle:
    "Liaison statique (new), dynamique (virtual/override), et héritage sans redéfinition.",
  part: "oo-polymorphism",
  code: [
    "class Animal",
    "{",
    "    public string Info() => \"Animal\";",
    "    public virtual string Crier() => \"...\";",
    "}",
    "",
    "class Chien : Animal",
    "{",
    "    public new string Info() => \"Chien\";",
    "    public override string Crier() => \"Wouf\";",
    "}",
    "",
    "class Chat : Animal",
    "{",
    "    public override string Crier() => \"Miaou\";",
    "    // Info non redéfinie",
    "}",
    "",
    "class Vache : Animal",
    "{",
    "    // ni Info ni Crier redéfinis",
    "}",
    "",
    "static void Main()",
    "{",
    "    Animal a1 = new Chien();",
    "    Console.WriteLine(a1.Info());",
    "    Console.WriteLine(a1.Crier());",
    "",
    "    Animal a2 = new Chat();",
    "    Console.WriteLine(a2.Crier());",
    "    Chat chat = new Chat();",
    "    Console.WriteLine(chat.Info());",
    "",
    "    Animal a3 = new Vache();",
    "    Console.WriteLine(a3.Crier());",
    "",
    "    Chien c = (Chien)a1;",
    "    Console.WriteLine(c.Info());",
    "}",
  ],
  steps: [
    {
      id: "pv0",
      highlightLines: [23, 24],
      narration:
        "Main va démarrer. Trois dérivés : Chien (override + new), Chat (override seulement), Vache (rien).",
      stack: main([]),
      heap: [],
      refs: [],
      consoleLines: [],
    },
    {
      id: "pv1",
      highlightLines: [25],
      narration: "a1 va avoir le type statique Animal, objet réel Chien (#C1).",
      stack: main([sA1]),
      heap: [objChien],
      refs: [ref("r-a1", "slot-a1", "obj-chien")],
      focus: "slot-a1",
      consoleLines: [],
    },
    {
      id: "pv2",
      highlightLines: [26, 2, 8],
      highlightExpr: "a1.Info()",
      narration:
        "a1.Info() : pas virtual + new dans Chien → liaison statique va choisir Animal.Info.",
      stack: main([sA1]),
      heap: [objChien],
      refs: [ref("r-a1", "slot-a1", "obj-chien")],
      consoleLines: [],
      dispatchFlow: dispatch({
        mode: "static",
        callExpr: "a1.Info()",
        staticType: "Animal",
        dynamicType: "Chien",
        chosen: "Animal.Info",
        result: '"Animal"',
      }),
    },
    {
      id: "pv3",
      highlightLines: [26],
      narration: "On va afficher Animal.",
      stack: main([sA1]),
      heap: [objChien],
      refs: [ref("r-a1", "slot-a1", "obj-chien")],
      consoleLines: ["Animal"],
    },
    {
      id: "pv4",
      highlightLines: [27, 3, 9],
      highlightExpr: "a1.Crier()",
      narration:
        "a1.Crier() : virtual + override → liaison dynamique va choisir Chien.Crier.",
      stack: main([sA1]),
      heap: [objChien],
      refs: [ref("r-a1", "slot-a1", "obj-chien")],
      focus: "obj-chien",
      consoleLines: ["Animal"],
      dispatchFlow: dispatch({
        mode: "virtual",
        callExpr: "a1.Crier()",
        staticType: "Animal",
        dynamicType: "Chien",
        chosen: "Chien.Crier",
        result: '"Wouf"',
      }),
    },
    {
      id: "pv5",
      highlightLines: [27],
      narration: "On va afficher Wouf.",
      stack: main([sA1]),
      heap: [objChien],
      refs: [ref("r-a1", "slot-a1", "obj-chien")],
      consoleLines: ["Animal", "Wouf"],
    },
    {
      id: "pv6",
      highlightLines: [29],
      narration: "a2 va être un Animal pointant vers un Chat (#C2).",
      stack: main([sA1, sA2]),
      heap: [objChien, objChat],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
      ],
      focus: "slot-a2",
      consoleLines: ["Animal", "Wouf"],
    },
    {
      id: "pv7",
      highlightLines: [30, 14],
      highlightExpr: "a2.Crier()",
      narration:
        "a2.Crier() : Chat override Crier va renvoyer Miaou (autre redéfinition du même virtual).",
      stack: main([sA1, sA2]),
      heap: [objChien, objChat],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
      ],
      focus: "obj-chat",
      consoleLines: ["Animal", "Wouf"],
      dispatchFlow: dispatch({
        mode: "virtual",
        callExpr: "a2.Crier()",
        staticType: "Animal",
        dynamicType: "Chat",
        chosen: "Chat.Crier",
        result: '"Miaou"',
      }),
    },
    {
      id: "pv8",
      highlightLines: [30],
      narration: "On va afficher Miaou.",
      stack: main([sA1, sA2]),
      heap: [objChien, objChat],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou"],
    },
    {
      id: "pv9",
      highlightLines: [31],
      narration: "chat va être une variable de type Chat (même objet #C2).",
      stack: main([sA1, sA2, sChat]),
      heap: [objChien, objChat],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
      ],
      focus: "slot-chat",
      consoleLines: ["Animal", "Wouf", "Miaou"],
    },
    {
      id: "pv10",
      highlightLines: [32, 2, 15],
      highlightExpr: "chat.Info()",
      narration:
        "chat.Info() : Chat n’a pas redéfini Info → va hériter Animal.Info (même avec type statique Chat).",
      stack: main([sA1, sA2, sChat]),
      heap: [objChien, objChat],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou"],
      dispatchFlow: dispatch({
        mode: "static",
        callExpr: "chat.Info()",
        staticType: "Chat",
        dynamicType: "Chat",
        chosen: "Animal.Info",
        result: '"Animal"',
      }),
    },
    {
      id: "pv11",
      highlightLines: [32],
      narration: "On va afficher Animal — pas de version Chat.Info.",
      stack: main([sA1, sA2, sChat]),
      heap: [objChien, objChat],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal"],
    },
    {
      id: "pv12",
      highlightLines: [34],
      narration: "a3 va être un Animal pointant vers une Vache (#C3) qui ne redéfinit rien.",
      stack: main([sA1, sA2, sChat, sA3]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
      ],
      focus: "slot-a3",
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal"],
    },
    {
      id: "pv13",
      highlightLines: [35, 3, 20],
      highlightExpr: "a3.Crier()",
      narration:
        "a3.Crier() : virtual, mais Vache n’override pas → va utiliser la version de base Animal.Crier.",
      stack: main([sA1, sA2, sChat, sA3]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
      ],
      focus: "obj-vache",
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal"],
      dispatchFlow: dispatch({
        mode: "virtual",
        callExpr: "a3.Crier()",
        staticType: "Animal",
        dynamicType: "Vache",
        chosen: "Animal.Crier",
        result: '"..."',
      }),
    },
    {
      id: "pv14",
      highlightLines: [35],
      narration: "On va afficher ... — le virtual va « tomber » sur la classe de base.",
      stack: main([sA1, sA2, sChat, sA3]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal", "..."],
    },
    {
      id: "pv15",
      highlightLines: [37],
      narration: "Le cast va donner à c le type statique Chien, même objet que a1 (#C1).",
      stack: main([sA1, sA2, sChat, sA3, sC]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
        ref("r-c", "slot-c", "obj-chien"),
      ],
      focus: "slot-c",
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal", "..."],
    },
    {
      id: "pv16",
      highlightLines: [38, 8],
      highlightExpr: "c.Info()",
      narration:
        "c.Info() : type statique Chien → va choisir Chien.Info (new). Même objet qu’a1.Info(), autre résultat.",
      stack: main([sA1, sA2, sChat, sA3, sC]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
        ref("r-c", "slot-c", "obj-chien"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal", "..."],
      dispatchFlow: dispatch({
        mode: "static",
        callExpr: "c.Info()",
        staticType: "Chien",
        dynamicType: "Chien",
        chosen: "Chien.Info",
        result: '"Chien"',
      }),
    },
    {
      id: "pv17",
      highlightLines: [38],
      narration: "On va afficher Chien. Récap : new suit le type statique ; virtual suit le type réel (ou la base si pas d’override).",
      stack: main([sA1, sA2, sChat, sA3, sC]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
        ref("r-c", "slot-c", "obj-chien"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal", "...", "Chien"],
    },
    {
      id: "class-virtual-end",
      highlightLines: [39],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: main([sA1, sA2, sChat, sA3, sC]),
      heap: [objChien, objChat, objVache],
      refs: [
        ref("r-a1", "slot-a1", "obj-chien"),
        ref("r-a2", "slot-a2", "obj-chat"),
        ref("r-chat", "slot-chat", "obj-chat"),
        ref("r-a3", "slot-a3", "obj-vache"),
        ref("r-c", "slot-c", "obj-chien"),
      ],
      consoleLines: ["Animal", "Wouf", "Miaou", "Animal", "...", "Chien"],
    },
  ],
};
