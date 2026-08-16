import type { Scenario } from "../../types/memory";
import { MAIN_DONE, frame, main, step, val } from "./ooHelpers";

export const classStaticCtorScenario: Scenario = {
  id: "class-ctor-static",
  title: "Constructeur statique",
  subtitle: "Le ctor static s’exécute une seule fois, avant le premier usage de la classe.",
  part: "oo-static",
  code: [
    "class Config",
    "{",
    "    public static int Version;",
    "    static Config()",
    "    {",
    "        Version = 2;",
    "    }",
    "}",
    "",
    "int v = Config.Version;",
  ],
  steps: [
    step("sc0", [9], "Le programme va démarrer. Config n’est pas encore initialisée.", main([]), [], []),
    step(
      "sc1",
      [9, 3, 5],
      "Premier accès à Config.Version : le constructeur statique va s’exécuter (Version = 2).",
      [
        { id: "frame-static", method: "static Config", slots: [val("slot-ver", "Config.Version", "2")] },
        ...main([], [frame("frame-cctor", "Config.cctor", [])]),
      ],
      [],
      [],
      { focus: "slot-ver" },
    ),
    step(
      "sc2",
      [9],
      "Ensuite la lecture va donner v = 2. Le cctor ne se relancera plus.",
      [
        { id: "frame-static", method: "static", slots: [val("slot-ver", "Config.Version", "2")] },
        ...main([val("slot-v", "v", "2")]),
      ],
      [],
      [],
      { focus: "slot-v" },
    ),
    step(
      "class-ctor-static-end",
      [9],
      MAIN_DONE,
      [
        { id: "frame-static", method: "static", slots: [val("slot-ver", "Config.Version", "2")] },
        ...main([val("slot-v", "v", "2")]),
      ],
      [],
      [],
    ),
  ],
};
