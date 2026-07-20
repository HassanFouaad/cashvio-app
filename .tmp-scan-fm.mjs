import fs from "fs";
import path from "path";

const root = "content/docs";
const issues = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".mdx")) {
      const text = fs.readFileSync(p, "utf8");
      if (!text.startsWith("---")) continue;
      const end = text.indexOf("\n---", 3);
      if (end < 0) {
        issues.push({ file: p, reason: "no closing frontmatter" });
        continue;
      }
      const fm = text.slice(4, end);
      for (const line of fm.split(/\r?\n/)) {
        if (!line.trim() || line.trim().startsWith("#")) continue;
        const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!m) continue;
        const [, key, val] = m;
        if (val === "" || val === "|" || val === ">") continue;
        const isQuoted =
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"));
        if (isQuoted) continue;
        if (
          val.includes(": ") ||
          /^[!&*{}[\]|>%@`]/.test(val) ||
          val.includes(" #")
        ) {
          issues.push({ file: p, key, val: val.slice(0, 120) });
        }
      }
    }
  }
}

walk(root);
console.log(JSON.stringify(issues, null, 2));
console.log("TOTAL", issues.length);
