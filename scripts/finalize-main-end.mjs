import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const END_NARRATION =
  "La fonction Main est terminée, le programme s'arrête.";

function findMainCloseLine(code) {
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

function ensureFinalStep(scenario) {
  const closeLine = findMainCloseLine(scenario.code);
  const steps = scenario.steps.map((s) => structuredClone(s));
  const last = steps[steps.length - 1];

  const isAlreadyFinal =
    Array.isArray(last.highlightLines) &&
    last.highlightLines.length === 1 &&
    last.highlightLines[0] === closeLine;

  if (isAlreadyFinal) {
    last.narration = END_NARRATION;
    last.highlightLines = [closeLine];
    delete last.returnFlow;
    delete last.exceptionFlow;
    delete last.focus;
    return { ...scenario, steps };
  }

  const finalStep = {
    id: `${scenario.id}-end`,
    highlightLines: [closeLine],
    narration: END_NARRATION,
    stack: structuredClone(last.stack ?? []),
    heap: structuredClone(last.heap ?? []),
    refs: structuredClone(last.refs ?? []),
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

function toTs(exportName, scenario) {
  const json = JSON.stringify(scenario, null, 2).replace(
    /^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":/gm,
    "$1$2:",
  );
  return `import type { Scenario } from "../../types/memory";\n\nexport const ${exportName}: Scenario = ${json};\n`;
}

// Map id -> export name from index.ts
const indexPath = path.resolve("src/data/index.ts");
const indexSrc = fs.readFileSync(indexPath, "utf8");
const exportById = new Map();
for (const m of indexSrc.matchAll(
  /import \{ (\w+) \} from "\.\/scenarios\/([^"]+)";/g,
)) {
  exportById.set(m[2], m[1]);
}

const scenariosDir = path.resolve("src/data/scenarios");
const files = fs.readdirSync(scenariosDir).filter((f) => f.endsWith(".ts"));

let updated = 0;
for (const file of files) {
  const id = file.replace(/\.ts$/, "");
  const exportName = exportById.get(id);
  if (!exportName) {
    console.warn("skip (not in index):", id);
    continue;
  }

  const full = path.join(scenariosDir, file);
  const mod = await import(pathToFileURL(full).href + `?t=${Date.now()}`);
  const scenario = mod[exportName];
  if (!scenario) {
    console.warn("skip (export missing):", file, exportName);
    continue;
  }

  const next = ensureFinalStep(scenario);
  fs.writeFileSync(full, toTs(exportName, next));
  updated++;
  console.log(
    "ok",
    id,
    "steps",
    scenario.steps.length,
    "→",
    next.steps.length,
    "close@",
    findMainCloseLine(scenario.code),
  );
}

console.log("updated", updated);
