import type { Scenario, StackSlot } from "../../types/memory";
import { MAIN_DONE, main, step, val } from "./ooHelpers";

const CODE = [
  "int a = 0;",
  "int b = 5;",
  "bool inf = a < b;",
  "bool ge = b >= 5;",
  "bool et = b > 0 && a < 10;",
  "bool ou = a == 0 || 10 / a > 1;",
  "bool non = !inf;",
  "bool ok = a != 0 && 10 / a > 1;",
  "Console.WriteLine(ok);",
];

const a = val("slot-a", "a", "0");
const b = val("slot-b", "b", "5");
const inf = val("slot-inf", "inf", "true");
const ge = val("slot-ge", "ge", "true");
const et = val("slot-et", "et", "true");
const ou = val("slot-ou", "ou", "true");
const non = val("slot-non", "non", "false");
const ok = val("slot-ok", "ok", "false");

function stk(...slots: StackSlot[]) {
  return main(slots);
}

function rl(
  id: string,
  line: number,
  narration: string,
  slots: StackSlot[],
  extra: Partial<Scenario["steps"][number]> = {},
) {
  return step(id, [line], narration, stk(...slots), [], [], extra);
}

export const relationalLogicalScenario: Scenario = {
  id: "relational-logical",
  title: "Relationnels & logiques",
  subtitle: "< >= && || ! : comparaisons, puis court-circuit qui évite 10 / a.",
  part: "operators",
  code: CODE,
  steps: [
    rl("rl0", 0, "Le programme va démarrer. On va comparer, combiner avec && et ||, puis inverser.", []),
    rl("rl1", 0, "a va valoir 0.", [a], { focus: "slot-a" }),
    rl("rl2", 1, "b va valoir 5.", [a, b], { focus: "slot-b" }),
    rl("rl3", 2, "a < b → 0 < 5 est true. inf va valoir true.", [a, b, inf], {
      highlightExpr: "a < b",
      focus: "slot-inf",
    }),
    rl("rl4", 3, "b >= 5 → 5 >= 5 est true. ge va valoir true (égal compte pour >=).", [a, b, inf, ge], {
      highlightExpr: "b >= 5",
      focus: "slot-ge",
    }),
    rl("rl5", 4, "b > 0 → 5 > 0 est true. && va aussi évaluer a < 10.", [a, b, inf, ge], {
      highlightExpr: "b > 0",
      focus: "slot-b",
    }),
    rl(
      "rl6",
      4,
      "a < 10 est true. Les deux côtés sont vrais : et va valoir true.",
      [a, b, inf, ge, et],
      { highlightExpr: "a < 10", focus: "slot-et" },
    ),
    rl(
      "rl7",
      5,
      "a == 0 → true. || va s’arrêter : 10 / a ne sera pas évalué. Pas de division par zéro.",
      [a, b, inf, ge, et],
      { highlightExpr: "a == 0", focus: "slot-a" },
    ),
    rl(
      "rl8",
      5,
      "ou va valoir true, uniquement grâce au premier opérande. 10 / a n’a pas été touché.",
      [a, b, inf, ge, et, ou],
      { highlightExpr: "||", focus: "slot-ou" },
    ),
    rl("rl9", 6, "!inf → !true est false. non va valoir false.", [a, b, inf, ge, et, ou, non], {
      highlightExpr: "!inf",
      focus: "slot-non",
    }),
    rl(
      "rl10",
      7,
      "a != 0 → 0 != 0 est false. && va s’arrêter : 10 / a ne sera pas évalué non plus.",
      [a, b, inf, ge, et, ou, non],
      { highlightExpr: "a != 0", focus: "slot-a" },
    ),
    rl(
      "rl11",
      7,
      "ok va valoir false. Même protection qu’avec ||, mais && court-circuite sur false.",
      [a, b, inf, ge, et, ou, non, ok],
      { highlightExpr: "&&", focus: "slot-ok" },
    ),
    step(
      "rl12",
      [8],
      "Console va afficher False.",
      stk(a, b, inf, ge, et, ou, non, ok),
      [],
      [],
      { consoleLines: ["False"], focus: "slot-ok" },
    ),
    step(
      "relational-logical-end",
      [8],
      MAIN_DONE,
      stk(a, b, inf, ge, et, ou, non, ok),
      [],
      [],
      { consoleLines: ["False"] },
    ),
  ],
};
