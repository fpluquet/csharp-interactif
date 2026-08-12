import fs from "fs";
import path from "path";

const dir = "src/data/scenarios";
const main = (slots = []) => [{ id: "frame-main", method: "Main", slots }];

function add(exportName, data) {
  const json = JSON.stringify(data, null, 2).replace(
    /^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":/gm,
    "$1$2:",
  );
  fs.writeFileSync(
    path.join(dir, `${data.id}.ts`),
    `import type { Scenario } from "../../types/memory";\n\nexport const ${exportName}: Scenario = ${json};\n`,
  );
  console.log("wrote", data.id);
}

add("ifElseScenario", {
  id: "if-else",
  title: "if / else",
  subtitle: "Une condition true exécute le bloc if.",
  part: "control",
  code: ["static void Main()", "{", "    int age = 20;", "    if (age >= 18)", "    {", "        Console.WriteLine(\"majeur\");", "    }", "    else", "    {", "        Console.WriteLine(\"mineur\");", "    }", "}"],
  steps: [
    { id: "ie0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "ie1", highlightLines: [2], narration: "age = 20.", stack: main([{ id: "slot-age", name: "age", value: "20", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "ie2", highlightLines: [3], narration: "age >= 18 → true : on entre dans le if.", stack: main([{ id: "slot-age", name: "age", value: "20", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "ie3", highlightLines: [5], narration: "Branche if : affiche majeur. Le else est ignoré.", stack: main([{ id: "slot-age", name: "age", value: "20", kind: "value" }]), heap: [], refs: [], consoleLines: ["majeur"] },
  ],
});

add("switchCaseScenario", {
  id: "switch-case",
  title: "switch / case",
  subtitle: "Un case correspondant est choisi, puis break.",
  part: "control",
  code: ["static void Main()", "{", "    int data = 1;", "    switch (data)", "    {", "        case 0:", "            Console.WriteLine(\"zéro\");", "            break;", "        case 1:", "            Console.WriteLine(\"un\");", "            break;", "        default:", "            Console.WriteLine(\"autre\");", "            break;", "    }", "}"],
  steps: [
    { id: "sw0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "sw1", highlightLines: [2], narration: "data = 1.", stack: main([{ id: "slot-data", name: "data", value: "1", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "sw2", highlightLines: [3, 8], narration: "switch(data) : case 1 correspond.", stack: main([{ id: "slot-data", name: "data", value: "1", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "sw3", highlightLines: [9, 10], narration: "Affiche un, puis break sort du switch.", stack: main([{ id: "slot-data", name: "data", value: "1", kind: "value" }]), heap: [], refs: [], consoleLines: ["un"] },
  ],
});

add("forLoopScenario", {
  id: "for-loop",
  title: "Boucle for",
  subtitle: "i évolue à chaque tour ; la console accumule.",
  part: "control",
  code: ["static void Main()", "{", "    for (int i = 0; i < 3; i++)", "    {", "        Console.WriteLine(i);", "    }", "}"],
  steps: [
    { id: "fl0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "fl1", highlightLines: [2], narration: "Init : i = 0. Condition 0 < 3 true.", stack: main([{ id: "slot-i", name: "i", value: "0", kind: "value" }]), heap: [], refs: [], focus: "slot-i", consoleLines: [] },
    { id: "fl2", highlightLines: [4], narration: "Tour 1 : affiche 0.", stack: main([{ id: "slot-i", name: "i", value: "0", kind: "value" }]), heap: [], refs: [], consoleLines: ["0"] },
    { id: "fl3", highlightLines: [2, 4], narration: "i++ → 1, encore < 3. Affiche 1.", stack: main([{ id: "slot-i", name: "i", value: "1", kind: "value" }]), heap: [], refs: [], consoleLines: ["0", "1"] },
    { id: "fl4", highlightLines: [2, 4], narration: "i++ → 2. Affiche 2.", stack: main([{ id: "slot-i", name: "i", value: "2", kind: "value" }]), heap: [], refs: [], consoleLines: ["0", "1", "2"] },
    { id: "fl5", highlightLines: [2], narration: "i++ → 3. 3 < 3 false : fin de boucle. i disparaît.", stack: main(), heap: [], refs: [], consoleLines: ["0", "1", "2"] },
  ],
});

add("whileLoopScenario", {
  id: "while-loop",
  title: "Boucle while",
  subtitle: "La condition est testée avant chaque tour.",
  part: "control",
  code: ["static void Main()", "{", "    int i = 0;", "    while (i < 2)", "    {", "        Console.WriteLine(i);", "        i++;", "    }", "}"],
  steps: [
    { id: "wl0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "wl1", highlightLines: [2], narration: "i = 0.", stack: main([{ id: "slot-i", name: "i", value: "0", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "wl2", highlightLines: [3, 5], narration: "0 < 2 true → affiche 0.", stack: main([{ id: "slot-i", name: "i", value: "0", kind: "value" }]), heap: [], refs: [], consoleLines: ["0"] },
    { id: "wl3", highlightLines: [6], narration: "i++ → 1.", stack: main([{ id: "slot-i", name: "i", value: "1", kind: "value" }]), heap: [], refs: [], consoleLines: ["0"] },
    { id: "wl4", highlightLines: [3, 5, 6], narration: "1 < 2 true → affiche 1, i devient 2.", stack: main([{ id: "slot-i", name: "i", value: "2", kind: "value" }]), heap: [], refs: [], consoleLines: ["0", "1"] },
    { id: "wl5", highlightLines: [3], narration: "2 < 2 false : on sort du while.", stack: main([{ id: "slot-i", name: "i", value: "2", kind: "value" }]), heap: [], refs: [], consoleLines: ["0", "1"] },
  ],
});

add("doWhileScenario", {
  id: "do-while",
  title: "do / while",
  subtitle: "Le corps s'exécute au moins une fois.",
  part: "control",
  code: ["static void Main()", "{", "    int i = 5;", "    do", "    {", "        Console.WriteLine(i);", "        i++;", "    } while (i < 5);", "}"],
  steps: [
    { id: "dw0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "dw1", highlightLines: [2], narration: "i = 5. La condition i < 5 est déjà fausse…", stack: main([{ id: "slot-i", name: "i", value: "5", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "dw2", highlightLines: [5, 6], narration: "…mais do exécute d'abord : affiche 5, i → 6.", stack: main([{ id: "slot-i", name: "i", value: "6", kind: "value" }]), heap: [], refs: [], consoleLines: ["5"] },
    { id: "dw3", highlightLines: [7], narration: "while (6 < 5) false : on s'arrête. Une itération malgré tout.", stack: main([{ id: "slot-i", name: "i", value: "6", kind: "value" }]), heap: [], refs: [], consoleLines: ["5"] },
  ],
});

add("foreachArrayScenario", {
  id: "foreach-array",
  title: "foreach sur tableau",
  subtitle: "Chaque élément est lu tour à tour.",
  part: "control",
  code: ["static void Main()", "{", "    int[] nums = { 10, 20 };", "    foreach (int n in nums)", "    {", "        Console.WriteLine(n);", "    }", "}"],
  steps: [
    { id: "fe0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "fe1", highlightLines: [2], narration: "Tableau {10,20} sur le heap.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "10" }, { label: "[1]", value: "20" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], consoleLines: [] },
    { id: "fe2", highlightLines: [3, 5], narration: "1er tour : n = 10 (copie valeur).", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }, { id: "slot-n", name: "n", value: "10", kind: "value" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "10" }, { label: "[1]", value: "20" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], consoleLines: ["10"] },
    { id: "fe3", highlightLines: [3, 5], narration: "2e tour : n = 20.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }, { id: "slot-n", name: "n", value: "20", kind: "value" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "10" }, { label: "[1]", value: "20" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], consoleLines: ["10", "20"] },
  ],
});

add("breakContinueScenario", {
  id: "break-continue",
  title: "break & continue",
  subtitle: "continue saute la fin du tour ; break quitte la boucle.",
  part: "control",
  code: ["static void Main()", "{", "    for (int i = 0; i < 5; i++)", "    {", "        if (i == 1) continue;", "        if (i == 3) break;", "        Console.WriteLine(i);", "    }", "}"],
  steps: [
    { id: "bc0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "bc1", highlightLines: [2, 6], narration: "i = 0 : affiche 0.", stack: main([{ id: "slot-i", name: "i", value: "0", kind: "value" }]), heap: [], refs: [], consoleLines: ["0"] },
    { id: "bc2", highlightLines: [4], narration: "i = 1 : continue → pas d'affichage.", stack: main([{ id: "slot-i", name: "i", value: "1", kind: "value" }]), heap: [], refs: [], consoleLines: ["0"] },
    { id: "bc3", highlightLines: [6], narration: "i = 2 : affiche 2.", stack: main([{ id: "slot-i", name: "i", value: "2", kind: "value" }]), heap: [], refs: [], consoleLines: ["0", "2"] },
    { id: "bc4", highlightLines: [5], narration: "i = 3 : break → on quitte le for.", stack: main([{ id: "slot-i", name: "i", value: "3", kind: "value" }]), heap: [], refs: [], consoleLines: ["0", "2"] },
  ],
});

add("stringMethodsScenario", {
  id: "string-methods",
  title: "Méthodes string",
  subtitle: "Length, ToUpper, Contains — souvent un nouvel objet.",
  part: "native-methods",
  code: ["static void Main()", "{", "    string s = \"ciao\";", "    int len = s.Length;", "    string u = s.ToUpper();", "    bool has = s.Contains(\"ia\");", "}"],
  steps: [
    { id: "sm0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "sm1", highlightLines: [2], narration: "s → \"ciao\".", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"ciao"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }] },
    { id: "sm2", highlightLines: [3], narration: "s.Length = 4 (propriété, int sur stack).", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }, { id: "slot-len", name: "len", value: "4", kind: "value" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"ciao"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }], focus: "slot-len" },
    { id: "sm3", highlightLines: [4], narration: "ToUpper() crée #S2 \"CIAO\". s inchangé.", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }, { id: "slot-len", name: "len", value: "4", kind: "value" }, { id: "slot-u", name: "u", value: "→ #S2", kind: "ref", targetId: "obj-u" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"ciao"' }] }, { id: "obj-u", typeLabel: "string", address: "#S2", fields: [{ label: "chars", value: '"CIAO"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }, { id: "ref-u", fromSlotId: "slot-u", toObjectId: "obj-u" }], focus: "obj-u" },
    { id: "sm4", highlightLines: [5], narration: "Contains(\"ia\") → true.", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }, { id: "slot-len", name: "len", value: "4", kind: "value" }, { id: "slot-u", name: "u", value: "→ #S2", kind: "ref", targetId: "obj-u" }, { id: "slot-has", name: "has", value: "true", kind: "value" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"ciao"' }] }, { id: "obj-u", typeLabel: "string", address: "#S2", fields: [{ label: "chars", value: '"CIAO"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }, { id: "ref-u", fromSlotId: "slot-u", toObjectId: "obj-u" }], focus: "slot-has" },
  ],
});

add("intToStringScenario", {
  id: "int-tostring",
  title: "int.ToString",
  subtitle: "ToString alloue une string sur le heap.",
  part: "native-methods",
  code: ["static void Main()", "{", "    int n = 7;", "    string s = n.ToString();", "    Console.WriteLine(s);", "}"],
  steps: [
    { id: "it0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "it1", highlightLines: [2], narration: "n = 7 sur la stack.", stack: main([{ id: "slot-n", name: "n", value: "7", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "it2", highlightLines: [3], narration: "ToString() → string \"7\" sur le heap.", stack: main([{ id: "slot-n", name: "n", value: "7", kind: "value" }, { id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"7"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }], consoleLines: [] },
    { id: "it3", highlightLines: [4], narration: "Affiche 7.", stack: main([{ id: "slot-n", name: "n", value: "7", kind: "value" }, { id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"7"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }], consoleLines: ["7"] },
  ],
});

add("charIsDigitScenario", {
  id: "char-isdigit",
  title: "char.IsDigit",
  subtitle: "Tester un caractère sans allouer sur le heap.",
  part: "native-methods",
  code: ["static void Main()", "{", "    char c = '5';", "    bool digit = char.IsDigit(c);", "    Console.WriteLine(digit);", "}"],
  steps: [
    { id: "ci0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "ci1", highlightLines: [2], narration: "c = '5' sur la stack.", stack: main([{ id: "slot-c", name: "c", value: "'5'", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "ci2", highlightLines: [3], narration: "IsDigit('5') → true.", stack: main([{ id: "slot-c", name: "c", value: "'5'", kind: "value" }, { id: "slot-digit", name: "digit", value: "true", kind: "value" }]), heap: [], refs: [], focus: "slot-digit", consoleLines: [] },
    { id: "ci3", highlightLines: [4], narration: "Affiche True.", stack: main([{ id: "slot-c", name: "c", value: "'5'", kind: "value" }, { id: "slot-digit", name: "digit", value: "true", kind: "value" }]), heap: [], refs: [], consoleLines: ["True"] },
  ],
});

add("datetimePartsScenario", {
  id: "datetime-parts",
  title: "DateTime",
  subtitle: "Une date/heure comme valeur (champs Year, Month…).",
  part: "native-methods",
  code: ["static void Main()", "{", "    DateTime d = new DateTime(2026, 8, 12);", "    int y = d.Year;", "    int m = d.Month;", "    Console.WriteLine(y);", "}"],
  steps: [
    { id: "dt0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "dt1", highlightLines: [2], narration: "DateTime est un struct (type valeur) : stocké sur la stack.", stack: main([{ id: "slot-d", name: "d", value: "2026-08-12", kind: "value" }]), heap: [], refs: [], focus: "slot-d", consoleLines: [] },
    { id: "dt2", highlightLines: [3, 4], narration: "Year et Month extraient des int.", stack: main([{ id: "slot-d", name: "d", value: "2026-08-12", kind: "value" }, { id: "slot-y", name: "y", value: "2026", kind: "value" }, { id: "slot-m", name: "m", value: "8", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "dt3", highlightLines: [5], narration: "Affiche 2026.", stack: main([{ id: "slot-d", name: "d", value: "2026-08-12", kind: "value" }, { id: "slot-y", name: "y", value: "2026", kind: "value" }, { id: "slot-m", name: "m", value: "8", kind: "value" }]), heap: [], refs: [], consoleLines: ["2026"] },
  ],
});

add("arrayIndexScenario", {
  id: "array-index",
  title: "Indexation de tableau",
  subtitle: "Modifier nums[i] change l'objet heap, pas la référence.",
  part: "collections",
  code: ["static void Main()", "{", "    int[] nums = { 1, 2, 3 };", "    nums[1] = 9;", "    Console.WriteLine(nums[1]);", "}"],
  steps: [
    { id: "ai0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "ai1", highlightLines: [2], narration: "Tableau {1,2,3} sur le heap.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "1" }, { label: "[1]", value: "2" }, { label: "[2]", value: "3" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], consoleLines: [] },
    { id: "ai2", highlightLines: [3], narration: "nums[1] = 9 : on mute la case [1] de #A1.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "1" }, { label: "[1]", value: "9" }, { label: "[2]", value: "3" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], focus: "obj-a", consoleLines: [] },
    { id: "ai3", highlightLines: [4], narration: "Affiche 9.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "1" }, { label: "[1]", value: "9" }, { label: "[2]", value: "3" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], consoleLines: ["9"] },
  ],
});

add("array2dScenario", {
  id: "array-2d",
  title: "Tableau 2D",
  subtitle: "Une matrice : accès [ligne, colonne].",
  part: "collections",
  code: ["static void Main()", "{", "    int[,] m = { { 1, 2 }, { 3, 4 } };", "    int v = m[1, 0];", "    Console.WriteLine(v);", "}"],
  steps: [
    { id: "a2d0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "a2d1", highlightLines: [2], narration: "Matrice 2×2 sur le heap.", stack: main([{ id: "slot-m", name: "m", value: "→ #M1", kind: "ref", targetId: "obj-m" }]), heap: [{ id: "obj-m", typeLabel: "int[,]", address: "#M1", fields: [{ label: "[0,0]", value: "1" }, { label: "[0,1]", value: "2" }, { label: "[1,0]", value: "3" }, { label: "[1,1]", value: "4" }] }], refs: [{ id: "ref-m", fromSlotId: "slot-m", toObjectId: "obj-m" }], consoleLines: [] },
    { id: "a2d2", highlightLines: [3], narration: "m[1,0] copie 3 dans v.", stack: main([{ id: "slot-m", name: "m", value: "→ #M1", kind: "ref", targetId: "obj-m" }, { id: "slot-v", name: "v", value: "3", kind: "value" }]), heap: [{ id: "obj-m", typeLabel: "int[,]", address: "#M1", fields: [{ label: "[0,0]", value: "1" }, { label: "[0,1]", value: "2" }, { label: "[1,0]", value: "3" }, { label: "[1,1]", value: "4" }] }], refs: [{ id: "ref-m", fromSlotId: "slot-m", toObjectId: "obj-m" }], focus: "slot-v", consoleLines: [] },
    { id: "a2d3", highlightLines: [4], narration: "Affiche 3.", stack: main([{ id: "slot-m", name: "m", value: "→ #M1", kind: "ref", targetId: "obj-m" }, { id: "slot-v", name: "v", value: "3", kind: "value" }]), heap: [{ id: "obj-m", typeLabel: "int[,]", address: "#M1", fields: [{ label: "[0,0]", value: "1" }, { label: "[0,1]", value: "2" }, { label: "[1,0]", value: "3" }, { label: "[1,1]", value: "4" }] }], refs: [{ id: "ref-m", fromSlotId: "slot-m", toObjectId: "obj-m" }], consoleLines: ["3"] },
  ],
});

add("listOpsScenario", {
  id: "list-ops",
  title: "List Add & Count",
  subtitle: "Add fait grandir la liste ; Count suit le nombre d'éléments.",
  part: "collections",
  code: ["static void Main()", "{", "    List<int> notes = new List<int>();", "    notes.Add(12);", "    notes.Add(15);", "    int n = notes.Count;", "}"],
  steps: [
    { id: "lo0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "lo1", highlightLines: [2], narration: "new List<int>() : liste vide sur le heap.", stack: main([{ id: "slot-notes", name: "notes", value: "→ #L1", kind: "ref", targetId: "obj-l" }]), heap: [{ id: "obj-l", typeLabel: "List<int>", address: "#L1", fields: [{ label: "Count", value: "0" }] }], refs: [{ id: "ref-notes", fromSlotId: "slot-notes", toObjectId: "obj-l" }] },
    { id: "lo2", highlightLines: [3], narration: "Add(12).", stack: main([{ id: "slot-notes", name: "notes", value: "→ #L1", kind: "ref", targetId: "obj-l" }]), heap: [{ id: "obj-l", typeLabel: "List<int>", address: "#L1", fields: [{ label: "Count", value: "1" }, { label: "[0]", value: "12" }] }], refs: [{ id: "ref-notes", fromSlotId: "slot-notes", toObjectId: "obj-l" }], focus: "obj-l" },
    { id: "lo3", highlightLines: [4], narration: "Add(15).", stack: main([{ id: "slot-notes", name: "notes", value: "→ #L1", kind: "ref", targetId: "obj-l" }]), heap: [{ id: "obj-l", typeLabel: "List<int>", address: "#L1", fields: [{ label: "Count", value: "2" }, { label: "[0]", value: "12" }, { label: "[1]", value: "15" }] }], refs: [{ id: "ref-notes", fromSlotId: "slot-notes", toObjectId: "obj-l" }], focus: "obj-l" },
    { id: "lo4", highlightLines: [5], narration: "Count → n = 2.", stack: main([{ id: "slot-notes", name: "notes", value: "→ #L1", kind: "ref", targetId: "obj-l" }, { id: "slot-n", name: "n", value: "2", kind: "value" }]), heap: [{ id: "obj-l", typeLabel: "List<int>", address: "#L1", fields: [{ label: "Count", value: "2" }, { label: "[0]", value: "12" }, { label: "[1]", value: "15" }] }], refs: [{ id: "ref-notes", fromSlotId: "slot-notes", toObjectId: "obj-l" }], focus: "slot-n" },
  ],
});

add("tupleScenario", {
  id: "tuple",
  title: "Tuple",
  subtitle: "(int, string) regroupe deux valeurs (souvent sur la stack).",
  part: "collections",
  code: ["static void Main()", "{", "    (int code, string nom) t = (1, \"Ada\");", "    Console.WriteLine(t.code);", "    Console.WriteLine(t.nom);", "}"],
  steps: [
    { id: "tu0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "tu1", highlightLines: [2], narration: "Tuple ValueTuple : code=1 sur stack ; nom référence une string.", stack: main([{ id: "slot-code", name: "t.code", value: "1", kind: "value" }, { id: "slot-nom", name: "t.nom", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Ada"' }] }], refs: [{ id: "ref-nom", fromSlotId: "slot-nom", toObjectId: "obj-s" }], consoleLines: [] },
    { id: "tu2", highlightLines: [3], narration: "Affiche 1.", stack: main([{ id: "slot-code", name: "t.code", value: "1", kind: "value" }, { id: "slot-nom", name: "t.nom", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Ada"' }] }], refs: [{ id: "ref-nom", fromSlotId: "slot-nom", toObjectId: "obj-s" }], consoleLines: ["1"] },
    { id: "tu3", highlightLines: [4], narration: "Affiche Ada.", stack: main([{ id: "slot-code", name: "t.code", value: "1", kind: "value" }, { id: "slot-nom", name: "t.nom", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Ada"' }] }], refs: [{ id: "ref-nom", fromSlotId: "slot-nom", toObjectId: "obj-s" }], consoleLines: ["1", "Ada"] },
  ],
});

add("linqWhereScenario", {
  id: "linq-where",
  title: "LINQ Where",
  subtitle: "Where produit une nouvelle séquence filtrée.",
  part: "collections",
  code: ["static void Main()", "{", "    int[] nums = { 1, 2, 3, 4 };", "    int[] pairs = nums.Where(n => n % 2 == 0).ToArray();", "    Console.WriteLine(pairs.Length);", "}"],
  steps: [
    { id: "lw0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "lw1", highlightLines: [2], narration: "nums = {1,2,3,4}.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "1" }, { label: "[1]", value: "2" }, { label: "[2]", value: "3" }, { label: "[3]", value: "4" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }], consoleLines: [] },
    { id: "lw2", highlightLines: [3], narration: "Where + ToArray → nouveau tableau {2,4}. nums intact.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }, { id: "slot-pairs", name: "pairs", value: "→ #A2", kind: "ref", targetId: "obj-b" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "1" }, { label: "[1]", value: "2" }, { label: "[2]", value: "3" }, { label: "[3]", value: "4" }] }, { id: "obj-b", typeLabel: "int[]", address: "#A2", fields: [{ label: "[0]", value: "2" }, { label: "[1]", value: "4" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }, { id: "ref-pairs", fromSlotId: "slot-pairs", toObjectId: "obj-b" }], focus: "obj-b", consoleLines: [] },
    { id: "lw3", highlightLines: [4], narration: "pairs.Length = 2.", stack: main([{ id: "slot-nums", name: "nums", value: "→ #A1", kind: "ref", targetId: "obj-a" }, { id: "slot-pairs", name: "pairs", value: "→ #A2", kind: "ref", targetId: "obj-b" }]), heap: [{ id: "obj-a", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "1" }, { label: "[1]", value: "2" }, { label: "[2]", value: "3" }, { label: "[3]", value: "4" }] }, { id: "obj-b", typeLabel: "int[]", address: "#A2", fields: [{ label: "[0]", value: "2" }, { label: "[1]", value: "4" }] }], refs: [{ id: "ref-nums", fromSlotId: "slot-nums", toObjectId: "obj-a" }, { id: "ref-pairs", fromSlotId: "slot-pairs", toObjectId: "obj-b" }], consoleLines: ["2"] },
  ],
});

add("valueVsRefScenario", {
  id: "value-vs-ref",
  title: "Où vit quoi ?",
  subtitle: "Valeur sur la stack, objet sur le heap — côte à côte.",
  part: "memory",
  code: ["static void Main()", "{", "    int n = 5;", "    int[] t = { 5 };", "}"],
  steps: [
    { id: "vv0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "vv1", highlightLines: [2], narration: "int n = 5 : la valeur 5 est dans la frame (stack).", stack: main([{ id: "slot-n", name: "n", value: "5", kind: "value" }]), heap: [], refs: [], focus: "slot-n" },
    { id: "vv2", highlightLines: [3], narration: "int[] t = {5} : t sur la stack pointe vers l'objet tableau sur le heap.", stack: main([{ id: "slot-n", name: "n", value: "5", kind: "value" }, { id: "slot-t", name: "t", value: "→ #A1", kind: "ref", targetId: "obj-t" }]), heap: [{ id: "obj-t", typeLabel: "int[]", address: "#A1", fields: [{ label: "[0]", value: "5" }] }], refs: [{ id: "ref-t", fromSlotId: "slot-t", toObjectId: "obj-t" }], focus: "obj-t" },
  ],
});

console.log("batch B done");
