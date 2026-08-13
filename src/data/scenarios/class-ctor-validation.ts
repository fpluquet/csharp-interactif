import type { Scenario } from "../../types/memory";
import { frame, link, main, obj, refSlot, step, val } from "./ooHelpers";

export const classCtorValidationScenario: Scenario = {
  id: "class-ctor-validation",
  title: "Validation dans le constructeur",
  subtitle: "Un âge invalide lève une exception : l’objet n’est jamais observé comme valide.",
  part: "oo-constructors",
  code: [
    "class Personne",
    "{",
    "    public int Age;",
    "    public Personne(int age)",
    "    {",
    "        if (age < 0) throw new ArgumentException(\"âge\");",
    "        Age = age;",
    "    }",
    "}",
    "",
    "static void Main()",
    "{",
    "    try",
    "    {",
    "        Personne p = new Personne(-3);",
    "    }",
    "    catch (ArgumentException)",
    "    {",
    "        Console.WriteLine(\"refusé\");",
    "    }",
    "}",
  ],
  steps: [
    step("cv0", [10, 11], "Main va démarrer.", main([]), [], []),
    step("cv-try", [12, 13], "On va entrer dans le try. Le catch attend un ArgumentException.", main([]), [], []),
    step(
      "cv1",
      [14, 5],
      "new Personne(-3) : l’objet va être alloué, le ctor va recevoir age = -3.",
      main(
        [],
        [
          frame("frame-ctor", "Personne", [
            refSlot("slot-this", "this", "#P1", "obj-p"),
            val("slot-age", "age", "-3"),
          ]),
        ],
      ),
      [obj("obj-p", "Personne", "#P1", [{ label: "Age", value: "0", kind: "value" }])],
      [link("ref-this", "slot-this", "obj-p")],
      { focus: "frame-ctor", highlightExpr: "new Personne(-3)" },
    ),
    step(
      "cv2",
      [5],
      "age < 0 : throw va être levé. Age ne va jamais être assigné. L’objet n’aura pas de référence depuis Main.",
      main(
        [],
        [
          frame("frame-ctor", "Personne", [
            refSlot("slot-this", "this", "#P1", "obj-p"),
            val("slot-age", "age", "-3"),
          ]),
        ],
      ),
      [obj("obj-p", "Personne", "#P1", [{ label: "Age", value: "0", kind: "value" }])],
      [link("ref-this", "slot-this", "obj-p")],
      {
        focus: "frame-ctor",
        highlightExpr: "throw new ArgumentException(\"âge\")",
        exceptionFlow: {
          typeName: "ArgumentException",
          message: "âge",
          phase: "throwing",
        },
      },
    ),
    step(
      "cv3",
      [16, 18],
      "Le ctor va être dépilé ; catch dans Main. p n’existera pas. L’objet orphelin va être candidat au GC.",
      main([]),
      [
        {
          id: "obj-p",
          typeLabel: "Personne",
          address: "#P1",
          fields: [{ label: "Age", value: "0", kind: "value" }],
          orphan: true,
        },
      ],
      [],
      {
        exceptionFlow: {
          typeName: "ArgumentException",
          message: "âge",
          phase: "caught",
          catchMethod: "Main",
        },
        consoleLines: ["refusé"],
      },
    ),
    step(
      "class-ctor-validation-end",
      [20],
      "La fonction Main va se terminer, le programme va s'arrêter.",
      main([]),
      [],
      [],
      { consoleLines: ["refusé"] },
    ),
  ],
};
