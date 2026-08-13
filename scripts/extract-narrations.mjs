import fs from "fs";
import path from "path";

const dir = "src/data/scenarios";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));

const items = [];
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  const re = /narration:\s*(?:"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`)/g;
  let m;
  while ((m = re.exec(t))) {
    items.push({ file: f, text: (m[1] ?? m[2]).replace(/\\n/g, " ").replace(/\\"/g, '"') });
  }
  const stepRe =
    /step\(\s*"[^"]+"\s*,\s*\[[^\]]*\]\s*,\s*(?:MAIN_DONE|"((?:\\.|[^"\\])*)")/g;
  while ((m = stepRe.exec(t))) {
    if (m[1]) items.push({ file: f, text: m[1].replace(/\\"/g, '"') });
    else items.push({ file: f, text: "MAIN_DONE" });
  }
}

console.log(`COUNT ${items.length}`);
for (const it of items) {
  console.log(`--- ${it.file}`);
  console.log(it.text);
}
