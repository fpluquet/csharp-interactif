import type { Scenario, StackFrame, StackSlot } from "../../types/memory";

function frame(ok: string, n: string): StackFrame[] {
  const slots: StackSlot[] = [
    { id: "slot-ok", name: "ok", value: ok, kind: "value" },
    { id: "slot-n", name: "n", value: n, kind: "value" },
  ];
  return [{ id: "frame-main", method: "Main", slots }];
}

export const tryParseScenario: Scenario = {
  id: "try-parse",
  title: "TryParse",
  subtitle: "TryParse renvoie false si ça échoue — pas d’exception, out vaut 0.",
  part: "conversions",
  code: [
    "static void Main()",
    "{",
    "    bool ok = int.TryParse(\"7\", out int n);",
    "    Console.WriteLine(ok);",
    "    Console.WriteLine(n);",
    "    ok = int.TryParse(\"abc\", out n);",
    "    Console.WriteLine(ok);",
    "    Console.WriteLine(n);",
    "}",
  ],
  steps: [
    {
      id: "tp0",
      highlightLines: [0, 1],
      narration: "Main va démarrer. On va voir un TryParse qui réussit, puis un qui échoue.",
      stack: [{ id: "frame-main", method: "Main", slots: [] }],
      heap: [],
      refs: [],
      consoleLines: [],
    },
    {
      id: "tp1",
      highlightLines: [2],
      highlightExpr: "int.TryParse(\"7\", out int n)",
      narration:
        "TryParse(\"7\") va réussir : ok va valoir true, n va valoir 7 via out. Pas d’exception.",
      stack: frame("true", "7"),
      heap: [],
      refs: [],
      focus: "slot-ok",
      consoleLines: [],
    },
    {
      id: "tp2",
      highlightLines: [3],
      narration: "On va afficher True.",
      stack: frame("true", "7"),
      heap: [],
      refs: [],
      consoleLines: ["True"],
    },
    {
      id: "tp3",
      highlightLines: [4],
      narration: "On va afficher 7.",
      stack: frame("true", "7"),
      heap: [],
      refs: [],
      consoleLines: ["True", "7"],
    },
    {
      id: "tp4",
      highlightLines: [5],
      highlightExpr: "int.TryParse(\"abc\", out n)",
      narration:
        "TryParse(\"abc\") va échouer : ok va passer à false, n va être remis à 0 (défaut de out). Toujours pas d’exception.",
      stack: frame("false", "0"),
      heap: [],
      refs: [],
      focus: "slot-ok",
      consoleLines: ["True", "7"],
    },
    {
      id: "tp5",
      highlightLines: [6],
      narration: "On va afficher False : le booléen dit que la conversion a échoué.",
      stack: frame("false", "0"),
      heap: [],
      refs: [],
      focus: "slot-ok",
      consoleLines: ["True", "7", "False"],
    },
    {
      id: "tp6",
      highlightLines: [7],
      narration: "On va afficher 0 : out a quand même écrit une valeur (le défaut), pas « rien ».",
      stack: frame("false", "0"),
      heap: [],
      refs: [],
      focus: "slot-n",
      consoleLines: ["True", "7", "False", "0"],
    },
    {
      id: "try-parse-end",
      highlightLines: [8],
      narration: "La fonction Main va se terminer, le programme va s'arrêter.",
      stack: frame("false", "0"),
      heap: [],
      refs: [],
      consoleLines: ["True", "7", "False", "0"],
    },
  ],
};
