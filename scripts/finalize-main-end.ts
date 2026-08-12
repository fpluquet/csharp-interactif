import fs from "fs";
import path from "path";
import { scenarios } from "../src/data/index";
import type { Scenario, Step } from "../src/types/memory";

const END_NARRATION =
  "La fonction Main est terminée, le programme s'arrête.";

function findMainCloseLine(code: string[]): number {
  const mainIdx = code.findIndex((line) => /\bMain\s*\(/.test(line));
  if (mainIdx < 0) {
    for (let i = code.length - 1; i >= 0; i--) {
      if (code[i].trim() === "}") return i;
    }
    return Math.max(0, code.length - 1);
  }

  let i = mainIdx;
  while (i < code.length && !code[i].includes("{")) i++;

  let depth = 0;
  for (; i < code.length; i++) {
    for (const ch of code[i]) {
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
  }

  return Math.max(0, code.length - 1);
}

function ensureFinalStep(scenario: Scenario): Scenario {
  const closeLine = findMainCloseLine(scenario.code);
  const steps: Step[] = scenario.steps.map((s) => structuredClone(s));
  const last = steps[steps.length - 1];

  const isAlreadyFinal =
    last.highlightLines.length === 1 && last.highlightLines[0] === closeLine;

  if (isAlreadyFinal) {
    last.narration = END_NARRATION;
    last.highlightLines = [closeLine];
    delete last.returnFlow;
    delete last.exceptionFlow;
    delete last.focus;
    return { ...scenario, steps };
  }

  const finalStep: Step = {
    id: `${scenario.id}-end`,
    highlightLines: [closeLine],
    narration: END_NARRATION,
    stack: structuredClone(last.stack),
    heap: structuredClone(last.heap),
    refs: structuredClone(last.refs),
  };

  if (last.consoleLines !== undefined) {
    finalStep.consoleLines = structuredClone(last.consoleLines);
  }
  if (last.files !== undefined) {
    finalStep.files = structuredClone(last.files);
  }

  steps.push(finalStep);
  return { ...scenario, steps };
}

function toTs(exportName: string, scenario: Scenario): string {
  const json = JSON.stringify(scenario, null, 2).replace(
    /^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":/gm,
    "$1$2:",
  );
  return `import type { Scenario } from "../../types/memory";\n\nexport const ${exportName}: Scenario = ${json};\n`;
}

const indexPath = path.resolve("src/data/index.ts");
const indexSrc = fs.readFileSync(indexPath, "utf8");
const exportById = new Map<string, string>();
for (const m of indexSrc.matchAll(
  /import \{ (\w+) \} from "\.\/scenarios\/([^"]+)";/g,
)) {
  exportById.set(m[2], m[1]);
}

for (const scenario of scenarios) {
  const exportName = exportById.get(scenario.id);
  if (!exportName) {
    console.warn("skip", scenario.id);
    continue;
  }
  const next = ensureFinalStep(scenario);
  const file = path.resolve("src/data/scenarios", `${scenario.id}.ts`);
  fs.writeFileSync(file, toTs(exportName, next));
  console.log(
    "ok",
    scenario.id,
    scenario.steps.length,
    "→",
    next.steps.length,
  );
}
