import fs from "fs";
import path from "path";

const dir = "src/data/scenarios";

function write(name, content) {
  fs.writeFileSync(path.join(dir, name), content.replace(/\r?\n/g, "\n"));
  console.log("wrote", name);
}

function sc(exportName, data) {
  const body = JSON.stringify(data, null, 2)
    .replace(/^(\s*)"([A-Za-z0-9_]+)":/gm, "$1$2:")
    .replace(/'/g, "\\'")
    .replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (m, inner) => {
      // keep as double-quoted JSON strings converted carefully
      return `"${inner}"`;
    });
  // Simpler: just emit with double quotes (valid TS)
  const json = JSON.stringify(data, null, 2).replace(
    /^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":/gm,
    "$1$2:",
  );
  write(
    `${data.id.replace(/-/g, "-")}.ts`.includes("--")
      ? `${data.id}.ts`
      : `${data.id}.ts`,
    `import type { Scenario } from "../../types/memory";\n\nexport const ${exportName}: Scenario = ${json};\n`,
  );
}

const scenarios = [];

function add(exportName, data) {
  scenarios.push({ exportName, data });
  const json = JSON.stringify(data, null, 2).replace(
    /^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":/gm,
    "$1$2:",
  );
  write(
    `${data.id}.ts`,
    `import type { Scenario } from "../../types/memory";\n\nexport const ${exportName}: Scenario = ${json};\n`,
  );
}

const main = (slots = []) => [{ id: "frame-main", method: "Main", slots }];

add("typesNumericBoolScenario", {
  id: "types-numeric-bool",
  title: "Types numériques & bool",
  subtitle: "Plusieurs types valeur cohabitent sur la stack.",
  part: "variables",
  code: [
    "static void Main()",
    "{",
    "    int n = 42;",
    "    double x = 3.14;",
    "    bool ok = true;",
    "    char c = 'A';",
    "}",
  ],
  steps: [
    { id: "tn0", highlightLines: [0, 1], narration: "Main démarre. La stack est prête pour des types valeur.", stack: main(), heap: [], refs: [] },
    { id: "tn1", highlightLines: [2], narration: "int n = 42 : entier stocké directement dans la frame.", stack: main([{ id: "slot-n", name: "n", value: "42", kind: "value" }]), heap: [], refs: [], focus: "slot-n" },
    { id: "tn2", highlightLines: [3], narration: "double x = 3.14 : nombre à virgule, toujours sur la stack.", stack: main([{ id: "slot-n", name: "n", value: "42", kind: "value" }, { id: "slot-x", name: "x", value: "3.14", kind: "value" }]), heap: [], refs: [], focus: "slot-x" },
    { id: "tn3", highlightLines: [4], narration: "bool ok = true : vrai/faux, type valeur.", stack: main([{ id: "slot-n", name: "n", value: "42", kind: "value" }, { id: "slot-x", name: "x", value: "3.14", kind: "value" }, { id: "slot-ok", name: "ok", value: "true", kind: "value" }]), heap: [], refs: [], focus: "slot-ok" },
    { id: "tn4", highlightLines: [5], narration: "char c = 'A' : un caractère Unicode, aussi sur la stack.", stack: main([{ id: "slot-n", name: "n", value: "42", kind: "value" }, { id: "slot-x", name: "x", value: "3.14", kind: "value" }, { id: "slot-ok", name: "ok", value: "true", kind: "value" }, { id: "slot-c", name: "c", value: "'A'", kind: "value" }]), heap: [], refs: [], focus: "slot-c" },
  ],
});

add("blockScopeScenario", {
  id: "block-scope",
  title: "Portée de bloc",
  subtitle: "Une variable locale vit seulement dans son { }.",
  part: "variables",
  code: ["static void Main()", "{", "    int a = 1;", "    {", "        int b = 2;", "        // b existe ici", "    }", "    // b n'existe plus", "}"],
  steps: [
    { id: "bs0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "bs1", highlightLines: [2], narration: "int a = 1 : visible dans tout Main.", stack: main([{ id: "slot-a", name: "a", value: "1", kind: "value" }]), heap: [], refs: [], focus: "slot-a" },
    { id: "bs2", highlightLines: [3, 4], narration: "Bloc interne : int b = 2 apparaît à côté de a.", stack: main([{ id: "slot-a", name: "a", value: "1", kind: "value" }, { id: "slot-b", name: "b", value: "2", kind: "value" }]), heap: [], refs: [], focus: "slot-b" },
    { id: "bs3", highlightLines: [6, 7], narration: "Fin du bloc : b disparaît. a reste.", stack: main([{ id: "slot-a", name: "a", value: "1", kind: "value" }]), heap: [], refs: [], focus: "slot-a" },
  ],
});

add("arithmeticAssignScenario", {
  id: "arithmetic-assign",
  title: "Arithmétique & affectation",
  subtitle: "+= et ++ modifient la case sur la stack.",
  part: "operators",
  code: ["static void Main()", "{", "    int n = 5;", "    n += 3;", "    n++;", "    Console.WriteLine(n);", "}"],
  steps: [
    { id: "aa0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "aa1", highlightLines: [2], narration: "int n = 5.", stack: main([{ id: "slot-n", name: "n", value: "5", kind: "value" }]), heap: [], refs: [], focus: "slot-n", consoleLines: [] },
    { id: "aa2", highlightLines: [3], narration: "n += 3 → n vaut 8.", stack: main([{ id: "slot-n", name: "n", value: "8", kind: "value" }]), heap: [], refs: [], focus: "slot-n", consoleLines: [] },
    { id: "aa3", highlightLines: [4], narration: "n++ : post-incrément, n devient 9.", stack: main([{ id: "slot-n", name: "n", value: "9", kind: "value" }]), heap: [], refs: [], focus: "slot-n", consoleLines: [] },
    { id: "aa4", highlightLines: [5], narration: "Console.WriteLine(n) affiche 9.", stack: main([{ id: "slot-n", name: "n", value: "9", kind: "value" }]), heap: [], refs: [], consoleLines: ["9"] },
  ],
});

add("relationalLogicalScenario", {
  id: "relational-logical",
  title: "Relationnels & logiques",
  subtitle: "&& court-circuite : la 2ᵉ condition n'est pas évaluée.",
  part: "operators",
  code: ["static void Main()", "{", "    int a = 0;", "    bool ok = a != 0 && 10 / a > 1;", "    Console.WriteLine(ok);", "}"],
  steps: [
    { id: "rl0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "rl1", highlightLines: [2], narration: "a = 0.", stack: main([{ id: "slot-a", name: "a", value: "0", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "rl2", highlightLines: [3], narration: "a != 0 est false → && n'évalue pas 10/a. ok = false. Pas d'exception.", stack: main([{ id: "slot-a", name: "a", value: "0", kind: "value" }, { id: "slot-ok", name: "ok", value: "false", kind: "value" }]), heap: [], refs: [], focus: "slot-ok", consoleLines: [] },
    { id: "rl3", highlightLines: [4], narration: "Affiche false.", stack: main([{ id: "slot-a", name: "a", value: "0", kind: "value" }, { id: "slot-ok", name: "ok", value: "false", kind: "value" }]), heap: [], refs: [], consoleLines: ["False"] },
  ],
});

add("ternaryScenario", {
  id: "ternary",
  title: "Opérateur ternaire",
  subtitle: "condition ? siVrai : siFaux — une expression, deux chemins.",
  part: "operators",
  code: ["static void Main()", "{", "    int age = 20;", "    string msg = age >= 18 ? \"majeur\" : \"mineur\";", "    Console.WriteLine(msg);", "}"],
  steps: [
    { id: "te0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "te1", highlightLines: [2], narration: "age = 20.", stack: main([{ id: "slot-age", name: "age", value: "20", kind: "value" }]), heap: [], refs: [], consoleLines: [] },
    { id: "te2", highlightLines: [3], narration: "age >= 18 est true → on prend \"majeur\". String sur le heap.", stack: main([{ id: "slot-age", name: "age", value: "20", kind: "value" }, { id: "slot-msg", name: "msg", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"majeur"' }] }], refs: [{ id: "ref-msg", fromSlotId: "slot-msg", toObjectId: "obj-s" }], focus: "obj-s", consoleLines: [] },
    { id: "te3", highlightLines: [4], narration: "Affiche majeur.", stack: main([{ id: "slot-age", name: "age", value: "20", kind: "value" }, { id: "slot-msg", name: "msg", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"majeur"' }] }], refs: [{ id: "ref-msg", fromSlotId: "slot-msg", toObjectId: "obj-s" }], consoleLines: ["majeur"] },
  ],
});

add("stringConcatScenario", {
  id: "string-concat",
  title: "Concaténation de strings",
  subtitle: "a + b crée un nouvel objet string sur le heap.",
  part: "operators",
  code: ["static void Main()", "{", "    string a = \"Bon\";", "    string b = \"jour\";", "    string c = a + b;", "}"],
  steps: [
    { id: "sc0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "sc1", highlightLines: [2], narration: "a pointe vers \"Bon\".", stack: main([{ id: "slot-a", name: "a", value: "→ #S1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Bon"' }] }], refs: [{ id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" }], focus: "obj-a" },
    { id: "sc2", highlightLines: [3], narration: "b pointe vers \"jour\".", stack: main([{ id: "slot-a", name: "a", value: "→ #S1", kind: "ref", targetId: "obj-a" }, { id: "slot-b", name: "b", value: "→ #S2", kind: "ref", targetId: "obj-b" }]), heap: [{ id: "obj-a", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Bon"' }] }, { id: "obj-b", typeLabel: "string", address: "#S2", fields: [{ label: "chars", value: '"jour"' }] }], refs: [{ id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" }, { id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" }], focus: "obj-b" },
    { id: "sc3", highlightLines: [4], narration: "a + b crée #S3 \"Bonjour\". a et b inchangés.", stack: main([{ id: "slot-a", name: "a", value: "→ #S1", kind: "ref", targetId: "obj-a" }, { id: "slot-b", name: "b", value: "→ #S2", kind: "ref", targetId: "obj-b" }, { id: "slot-c", name: "c", value: "→ #S3", kind: "ref", targetId: "obj-c" }]), heap: [{ id: "obj-a", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"Bon"' }] }, { id: "obj-b", typeLabel: "string", address: "#S2", fields: [{ label: "chars", value: '"jour"' }] }, { id: "obj-c", typeLabel: "string", address: "#S3", fields: [{ label: "chars", value: '"Bonjour"' }] }], refs: [{ id: "ref-a", fromSlotId: "slot-a", toObjectId: "obj-a" }, { id: "ref-b", fromSlotId: "slot-b", toObjectId: "obj-b" }, { id: "ref-c", fromSlotId: "slot-c", toObjectId: "obj-c" }], focus: "obj-c" },
  ],
});

add("numericCastScenario", {
  id: "numeric-cast",
  title: "Cast numérique",
  subtitle: "Implicite élargit ; explicite peut tronquer.",
  part: "conversions",
  code: ["static void Main()", "{", "    int n = 3;", "    double d = n;", "    double x = 3.9;", "    int m = (int)x;", "}"],
  steps: [
    { id: "nc0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "nc1", highlightLines: [2], narration: "int n = 3.", stack: main([{ id: "slot-n", name: "n", value: "3", kind: "value" }]), heap: [], refs: [], focus: "slot-n" },
    { id: "nc2", highlightLines: [3], narration: "double d = n : conversion implicite, d = 3.0.", stack: main([{ id: "slot-n", name: "n", value: "3", kind: "value" }, { id: "slot-d", name: "d", value: "3.0", kind: "value" }]), heap: [], refs: [], focus: "slot-d" },
    { id: "nc3", highlightLines: [4], narration: "double x = 3.9.", stack: main([{ id: "slot-n", name: "n", value: "3", kind: "value" }, { id: "slot-d", name: "d", value: "3.0", kind: "value" }, { id: "slot-x", name: "x", value: "3.9", kind: "value" }]), heap: [], refs: [], focus: "slot-x" },
    { id: "nc4", highlightLines: [5], narration: "(int)x tronque → m = 3 (pas d'arrondi).", stack: main([{ id: "slot-n", name: "n", value: "3", kind: "value" }, { id: "slot-d", name: "d", value: "3.0", kind: "value" }, { id: "slot-x", name: "x", value: "3.9", kind: "value" }, { id: "slot-m", name: "m", value: "3", kind: "value" }]), heap: [], refs: [], focus: "slot-m" },
  ],
});

add("parseOkScenario", {
  id: "parse-ok",
  title: "Parse réussi",
  subtitle: "int.Parse convertit une string valide en entier.",
  part: "conversions",
  code: ["static void Main()", "{", "    string s = \"42\";", "    int n = int.Parse(s);", "    Console.WriteLine(n);", "}"],
  steps: [
    { id: "po0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "po1", highlightLines: [2], narration: "s pointe vers \"42\".", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"42"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }], consoleLines: [] },
    { id: "po2", highlightLines: [3], narration: "int.Parse(s) → n = 42 sur la stack.", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }, { id: "slot-n", name: "n", value: "42", kind: "value" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"42"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }], focus: "slot-n", consoleLines: [] },
    { id: "po3", highlightLines: [4], narration: "Affiche 42.", stack: main([{ id: "slot-s", name: "s", value: "→ #S1", kind: "ref", targetId: "obj-s" }, { id: "slot-n", name: "n", value: "42", kind: "value" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"42"' }] }], refs: [{ id: "ref-s", fromSlotId: "slot-s", toObjectId: "obj-s" }], consoleLines: ["42"] },
  ],
});

add("parseThrowScenario", {
  id: "parse-throw",
  title: "Parse qui échoue",
  subtitle: "Parse lance FormatException si le texte est invalide.",
  part: "conversions",
  code: ["static void Main()", "{", "    try", "    {", "        int n = int.Parse(\"abc\");", "    }", "    catch (FormatException)", "    {", "        Console.WriteLine(\"invalide\");", "    }", "}"],
  steps: [
    { id: "pt0", highlightLines: [0, 1], narration: "Main démarre avec un try/catch.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "pt1", highlightLines: [4], narration: "int.Parse(\"abc\") échoue → FormatException.", stack: main(), heap: [], refs: [], consoleLines: [], exceptionFlow: { typeName: "FormatException", message: "Input string was not in a correct format.", phase: "throwing" } },
    { id: "pt2", highlightLines: [6, 7, 8], narration: "catch attrape FormatException. Affiche invalide.", stack: main(), heap: [], refs: [], consoleLines: ["invalide"], exceptionFlow: { typeName: "FormatException", message: "Input string was not in a correct format.", phase: "caught", catchMethod: "Main" } },
  ],
});

add("tryParseScenario", {
  id: "try-parse",
  title: "TryParse",
  subtitle: "TryParse renvoie bool et écrit le résultat via out.",
  part: "conversions",
  code: ["static void Main()", "{", "    bool ok = int.TryParse(\"7\", out int n);", "    Console.WriteLine(ok);", "    Console.WriteLine(n);", "}"],
  steps: [
    { id: "tp0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "tp1", highlightLines: [2], narration: "TryParse réussit : ok = true, n = 7. Pas d'exception.", stack: main([{ id: "slot-ok", name: "ok", value: "true", kind: "value" }, { id: "slot-n", name: "n", value: "7", kind: "value" }]), heap: [], refs: [], focus: "slot-n", consoleLines: [] },
    { id: "tp2", highlightLines: [3], narration: "Affiche True.", stack: main([{ id: "slot-ok", name: "ok", value: "true", kind: "value" }, { id: "slot-n", name: "n", value: "7", kind: "value" }]), heap: [], refs: [], consoleLines: ["True"] },
    { id: "tp3", highlightLines: [4], narration: "Affiche 7.", stack: main([{ id: "slot-ok", name: "ok", value: "true", kind: "value" }, { id: "slot-n", name: "n", value: "7", kind: "value" }]), heap: [], refs: [], consoleLines: ["True", "7"] },
  ],
});

console.log("batch A count", scenarios.length);
