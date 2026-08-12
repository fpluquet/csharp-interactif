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

add("optionalNamedScenario", {
  id: "optional-named",
  title: "Paramètres optionnels & nommés",
  subtitle: "Un défaut comble l'absent ; le nom clarifie l'appel.",
  part: "functions",
  code: [
    "static int Ajouter(int a, int b = 1)",
    "{",
    "    return a + b;",
    "}",
    "",
    "static void Main()",
    "{",
    "    int x = Ajouter(5);",
    "    int y = Ajouter(a: 2, b: 3);",
    "}",
  ],
  steps: [
    { id: "on0", highlightLines: [5, 6], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "on1", highlightLines: [7], narration: "Ajouter(5) : b prend la valeur par défaut 1.", stack: [{ id: "frame-main", method: "Main", slots: [] }, { id: "frame-aj", method: "Ajouter", slots: [{ id: "slot-a", name: "a", value: "5", kind: "value" }, { id: "slot-b", name: "b", value: "1", kind: "value" }] }], heap: [], refs: [], focus: "frame-aj" },
    { id: "on2", highlightLines: [7], narration: "return 6 → x = 6.", stack: main([{ id: "slot-x", name: "x", value: "6", kind: "value" }]), heap: [], refs: [], returnFlow: { fromMethod: "Ajouter", callExpr: "Ajouter(5)", value: "6", targetVar: "x", phase: "assigned", callLine: 7 } },
    { id: "on3", highlightLines: [8], narration: "Ajouter(a: 2, b: 3) : paramètres nommés.", stack: [{ id: "frame-main", method: "Main", slots: [{ id: "slot-x", name: "x", value: "6", kind: "value" }] }, { id: "frame-aj2", method: "Ajouter", slots: [{ id: "slot-a2", name: "a", value: "2", kind: "value" }, { id: "slot-b2", name: "b", value: "3", kind: "value" }] }], heap: [], refs: [], focus: "frame-aj2" },
    { id: "on4", highlightLines: [8], narration: "return 5 → y = 5.", stack: main([{ id: "slot-x", name: "x", value: "6", kind: "value" }, { id: "slot-y", name: "y", value: "5", kind: "value" }]), heap: [], refs: [], focus: "slot-y" },
  ],
});

add("overloadScenario", {
  id: "overload",
  title: "Surcharge",
  subtitle: "Même nom, signatures différentes → appels distincts.",
  part: "functions",
  code: [
    "static int Max(int a, int b) => a > b ? a : b;",
    "static double Max(double a, double b) => a > b ? a : b;",
    "",
    "static void Main()",
    "{",
    "    int i = Max(3, 5);",
    "    double d = Max(2.5, 1.1);",
    "}",
  ],
  steps: [
    { id: "ov0", highlightLines: [3, 4], narration: "Main démarre. Deux Max sont disponibles.", stack: main(), heap: [], refs: [] },
    { id: "ov1", highlightLines: [5], narration: "Max(3,5) choisit la surcharge int.", stack: [{ id: "frame-main", method: "Main", slots: [] }, { id: "frame-max-i", method: "Max(int,int)", slots: [{ id: "slot-a", name: "a", value: "3", kind: "value" }, { id: "slot-b", name: "b", value: "5", kind: "value" }] }], heap: [], refs: [], focus: "frame-max-i" },
    { id: "ov2", highlightLines: [5], narration: "i = 5.", stack: main([{ id: "slot-i", name: "i", value: "5", kind: "value" }]), heap: [], refs: [] },
    { id: "ov3", highlightLines: [6], narration: "Max(2.5, 1.1) choisit la surcharge double.", stack: [{ id: "frame-main", method: "Main", slots: [{ id: "slot-i", name: "i", value: "5", kind: "value" }] }, { id: "frame-max-d", method: "Max(double,double)", slots: [{ id: "slot-a2", name: "a", value: "2.5", kind: "value" }, { id: "slot-b2", name: "b", value: "1.1", kind: "value" }] }], heap: [], refs: [], focus: "frame-max-d" },
    { id: "ov4", highlightLines: [6], narration: "d = 2.5.", stack: main([{ id: "slot-i", name: "i", value: "5", kind: "value" }, { id: "slot-d", name: "d", value: "2.5", kind: "value" }]), heap: [], refs: [], focus: "slot-d" },
  ],
});

add("exceptionFinallyScenario", {
  id: "exception-finally",
  title: "finally",
  subtitle: "finally s'exécute toujours, après catch ou non.",
  part: "exceptions",
  code: [
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        throw new Exception(\"x\");",
    "    }",
    "    catch",
    "    {",
    "        Console.WriteLine(\"catch\");",
    "    }",
    "    finally",
    "    {",
    "        Console.WriteLine(\"finally\");",
    "    }",
    "}",
  ],
  steps: [
    { id: "ef0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "ef1", highlightLines: [4], narration: "throw : exception levée.", stack: main(), heap: [], refs: [], consoleLines: [], exceptionFlow: { typeName: "Exception", message: "x", phase: "throwing" } },
    { id: "ef2", highlightLines: [6, 8], narration: "catch s'exécute.", stack: main(), heap: [], refs: [], consoleLines: ["catch"], exceptionFlow: { typeName: "Exception", message: "x", phase: "caught", catchMethod: "Main" } },
    { id: "ef3", highlightLines: [10, 12], narration: "finally s'exécute ensuite — toujours.", stack: main(), heap: [], refs: [], consoleLines: ["catch", "finally"] },
  ],
});

add("multiCatchScenario", {
  id: "multi-catch",
  title: "Multi-catch",
  subtitle: "Le catch le plus spécifique doit venir en premier.",
  part: "exceptions",
  code: [
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        int.Parse(\"x\");",
    "    }",
    "    catch (FormatException)",
    "    {",
    "        Console.WriteLine(\"format\");",
    "    }",
    "    catch (Exception)",
    "    {",
    "        Console.WriteLine(\"autre\");",
    "    }",
    "}",
  ],
  steps: [
    { id: "mc0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [] },
    { id: "mc1", highlightLines: [4], narration: "Parse(\"x\") → FormatException.", stack: main(), heap: [], refs: [], consoleLines: [], exceptionFlow: { typeName: "FormatException", message: "bad format", phase: "throwing" } },
    { id: "mc2", highlightLines: [6, 8], narration: "Premier catch compatible : FormatException. Le catch Exception n'est pas atteint.", stack: main(), heap: [], refs: [], consoleLines: ["format"], exceptionFlow: { typeName: "FormatException", message: "bad format", phase: "caught", catchMethod: "Main" } },
  ],
});

add("fileReadScenario", {
  id: "file-read",
  title: "Lire un fichier",
  subtitle: "ReadAllText charge le contenu dans une string.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    string txt = File.ReadAllText(\"note.txt\");",
    "    Console.WriteLine(txt);",
    "}",
  ],
  steps: [
    {
      id: "fr0",
      highlightLines: [0, 1],
      narration: "Le fichier note.txt existe déjà.",
      stack: main(),
      heap: [],
      refs: [],
      consoleLines: [],
      files: [{ path: "note.txt", content: "hello" }],
    },
    {
      id: "fr1",
      highlightLines: [2],
      narration: "ReadAllText copie le contenu vers une string sur le heap.",
      stack: main([{ id: "slot-txt", name: "txt", value: "→ #S1", kind: "ref", targetId: "obj-s" }]),
      heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"hello"' }] }],
      refs: [{ id: "ref-txt", fromSlotId: "slot-txt", toObjectId: "obj-s" }],
      consoleLines: [],
      files: [{ path: "note.txt", content: "hello" }],
    },
    {
      id: "fr2",
      highlightLines: [3],
      narration: "Affiche hello.",
      stack: main([{ id: "slot-txt", name: "txt", value: "→ #S1", kind: "ref", targetId: "obj-s" }]),
      heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"hello"' }] }],
      refs: [{ id: "ref-txt", fromSlotId: "slot-txt", toObjectId: "obj-s" }],
      consoleLines: ["hello"],
      files: [{ path: "note.txt", content: "hello" }],
    },
  ],
});

add("fileWriteScenario", {
  id: "file-write",
  title: "Écrire un fichier",
  subtitle: "WriteAllText crée/écrase le fichier virtuel.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    File.WriteAllText(\"out.txt\", \"OK\");",
    "}",
  ],
  steps: [
    { id: "fw0", highlightLines: [0, 1], narration: "Pas encore de out.txt.", stack: main(), heap: [], refs: [], files: [] },
    { id: "fw1", highlightLines: [2], narration: "WriteAllText crée out.txt avec OK.", stack: main(), heap: [], refs: [], files: [{ path: "out.txt", content: "OK" }] },
  ],
});

add("fileAppendScenario", {
  id: "file-append",
  title: "AppendAllText",
  subtitle: "Ajoute à la fin sans effacer le début.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    File.AppendAllText(\"log.txt\", \"a\");",
    "    File.AppendAllText(\"log.txt\", \"b\");",
    "}",
  ],
  steps: [
    { id: "fa0", highlightLines: [0, 1], narration: "log.txt est vide.", stack: main(), heap: [], refs: [], files: [{ path: "log.txt", content: "" }] },
    { id: "fa1", highlightLines: [2], narration: "Append \"a\".", stack: main(), heap: [], refs: [], files: [{ path: "log.txt", content: "a" }] },
    { id: "fa2", highlightLines: [3], narration: "Append \"b\" → \"ab\".", stack: main(), heap: [], refs: [], files: [{ path: "log.txt", content: "ab" }] },
  ],
});

add("pathCombineScenario", {
  id: "path-combine",
  title: "Path.Combine",
  subtitle: "Construit un chemin sans concaténer à la main.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    string p = Path.Combine(\"data\", \"a.txt\");",
    "    Console.WriteLine(p);",
    "}",
  ],
  steps: [
    { id: "pc0", highlightLines: [0, 1], narration: "Main démarre.", stack: main(), heap: [], refs: [], consoleLines: [], files: [] },
    { id: "pc1", highlightLines: [2], narration: "Path.Combine produit data\\\\a.txt (séparateur OS).", stack: main([{ id: "slot-p", name: "p", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"data\\\\a.txt"' }] }], refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-s" }], consoleLines: [], files: [] },
    { id: "pc2", highlightLines: [3], narration: "Affiche le chemin.", stack: main([{ id: "slot-p", name: "p", value: "→ #S1", kind: "ref", targetId: "obj-s" }]), heap: [{ id: "obj-s", typeLabel: "string", address: "#S1", fields: [{ label: "chars", value: '"data\\\\a.txt"' }] }], refs: [{ id: "ref-p", fromSlotId: "slot-p", toObjectId: "obj-s" }], consoleLines: ["data\\\\a.txt"], files: [] },
  ],
});

add("directoryListScenario", {
  id: "directory-list",
  title: "Directory",
  subtitle: "Créer un dossier et lister ses fichiers.",
  part: "files",
  code: [
    "static void Main()",
    "{",
    "    Directory.CreateDirectory(\"tmp\");",
    "    File.WriteAllText(\"tmp/a.txt\", \"x\");",
    "    string[] files = Directory.GetFiles(\"tmp\");",
    "    Console.WriteLine(files.Length);",
    "}",
  ],
  steps: [
    { id: "dl0", highlightLines: [0, 1], narration: "Rien pour l'instant.", stack: main(), heap: [], refs: [], consoleLines: [], files: [] },
    { id: "dl1", highlightLines: [2], narration: "CreateDirectory(\"tmp\").", stack: main(), heap: [], refs: [], consoleLines: [], files: [{ path: "tmp/", content: "(dossier)" }] },
    { id: "dl2", highlightLines: [3], narration: "Écrit tmp/a.txt.", stack: main(), heap: [], refs: [], consoleLines: [], files: [{ path: "tmp/", content: "(dossier)" }, { path: "tmp/a.txt", content: "x" }] },
    { id: "dl3", highlightLines: [4], narration: "GetFiles → tableau d'1 chemin.", stack: main([{ id: "slot-files", name: "files", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "string[]", address: "#A1", fields: [{ label: "[0]", value: '"tmp/a.txt"' }] }], refs: [{ id: "ref-files", fromSlotId: "slot-files", toObjectId: "obj-a" }], consoleLines: [], files: [{ path: "tmp/", content: "(dossier)" }, { path: "tmp/a.txt", content: "x" }] },
    { id: "dl4", highlightLines: [5], narration: "Length = 1.", stack: main([{ id: "slot-files", name: "files", value: "→ #A1", kind: "ref", targetId: "obj-a" }]), heap: [{ id: "obj-a", typeLabel: "string[]", address: "#A1", fields: [{ label: "[0]", value: '"tmp/a.txt"' }] }], refs: [{ id: "ref-files", fromSlotId: "slot-files", toObjectId: "obj-a" }], consoleLines: ["1"], files: [{ path: "tmp/", content: "(dossier)" }, { path: "tmp/a.txt", content: "x" }] },
  ],
});

add("classMethodScenario", {
  id: "class-method",
  title: "Méthode d'instance",
  subtitle: "e.Incrementer() utilise this pour muter l'objet.",
  part: "objects",
  code: [
    "class Compteur",
    "{",
    "    public int Valeur;",
    "    public void Incrementer()",
    "    {",
    "        Valeur++;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    Compteur e = new Compteur();",
    "    e.Valeur = 1;",
    "    e.Incrementer();",
    "}",
  ],
  steps: [
    { id: "cm0", highlightLines: [9, 10], narration: "Main démarre.", stack: main(), heap: [], refs: [] },
    { id: "cm1", highlightLines: [11], narration: "new Compteur() → #C1.", stack: main([{ id: "slot-e", name: "e", value: "→ #C1", kind: "ref", targetId: "obj-c" }]), heap: [{ id: "obj-c", typeLabel: "Compteur", address: "#C1", fields: [{ label: "Valeur", value: "0", kind: "value" }] }], refs: [{ id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-c" }] },
    { id: "cm2", highlightLines: [12], narration: "e.Valeur = 1.", stack: main([{ id: "slot-e", name: "e", value: "→ #C1", kind: "ref", targetId: "obj-c" }]), heap: [{ id: "obj-c", typeLabel: "Compteur", address: "#C1", fields: [{ label: "Valeur", value: "1", kind: "value" }] }], refs: [{ id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-c" }], focus: "obj-c" },
    { id: "cm3", highlightLines: [13, 5], narration: "e.Incrementer() : frame avec this → #C1.", stack: [{ id: "frame-main", method: "Main", slots: [{ id: "slot-e", name: "e", value: "→ #C1", kind: "ref", targetId: "obj-c" }] }, { id: "frame-inc", method: "Incrementer", slots: [{ id: "slot-this", name: "this", value: "→ #C1", kind: "ref", targetId: "obj-c" }] }], heap: [{ id: "obj-c", typeLabel: "Compteur", address: "#C1", fields: [{ label: "Valeur", value: "1", kind: "value" }] }], refs: [{ id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-c" }, { id: "ref-this", fromSlotId: "slot-this", toObjectId: "obj-c" }], focus: "frame-inc" },
    { id: "cm4", highlightLines: [5], narration: "Valeur++ via this → 2. Puis return, frame dépilée.", stack: main([{ id: "slot-e", name: "e", value: "→ #C1", kind: "ref", targetId: "obj-c" }]), heap: [{ id: "obj-c", typeLabel: "Compteur", address: "#C1", fields: [{ label: "Valeur", value: "2", kind: "value" }] }], refs: [{ id: "ref-e", fromSlotId: "slot-e", toObjectId: "obj-c" }], focus: "obj-c" },
  ],
});

console.log("batch C done");
