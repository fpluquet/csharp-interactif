import type { Scenario } from "../../types/memory";
import { MAIN_DONE, link, main, obj, refSlot, step } from "./ooHelpers";

const logger = obj("obj-l", "ConsoleLogger : ILogger", "#L1", [
  { label: "(pas de champ)", value: "" },
]);

export const classDefaultInterfaceScenario: Scenario = {
  id: "class-default-interface",
  title: "Implémentation par défaut",
  subtitle: "ILogger.Log a un corps : ConsoleLogger peut ne rien redéfinir. L’appel passe par l’interface.",
  part: "oo-modern-interfaces",
  code: [
    "interface ILogger",
    "{",
    "    void Log(string msg) => Console.WriteLine(msg);",
    "}",
    "",
    "class ConsoleLogger : ILogger { }",
    "",
    "static void Main()",
    "{",
    "    ILogger l = new ConsoleLogger();",
    "    l.Log(\"ok\");",
    "}",
  ],
  steps: [
    step("di0", [7, 8], "Main démarre.", main([]), [], []),
    step(
      "di1",
      [9],
      "new ConsoleLogger : classe vide, mais elle satisfait ILogger.",
      main([refSlot("slot-l", "l", "#L1", "obj-l", "ILogger")]),
      [logger],
      [link("ref-l", "slot-l", "obj-l")],
      { focus: "obj-l" },
    ),
    step(
      "di2",
      [10, 2],
      "l.Log(\"ok\") exécute le corps par défaut de l’interface (pas une méthode de la classe).",
      main([refSlot("slot-l", "l", "#L1", "obj-l", "ILogger")]),
      [logger],
      [link("ref-l", "slot-l", "obj-l")],
      {
        consoleLines: ["ok"],
        dispatchFlow: {
          mode: "virtual",
          callExpr: "l.Log(\"ok\")",
          staticType: "ILogger",
          dynamicType: "ConsoleLogger",
          chosen: "ILogger.Log (défaut)",
          result: "ok",
        },
      },
    ),
    step(
      "class-default-interface-end",
      [11],
      MAIN_DONE,
      main([refSlot("slot-l", "l", "#L1", "obj-l", "ILogger")]),
      [logger],
      [link("ref-l", "slot-l", "obj-l")],
      { consoleLines: ["ok"] },
    ),
  ],
};
