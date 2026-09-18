#!/usr/bin/env node
/**
 * check-okf — validates OKF v0.2 frontmatter conformance across a wiki bundle.
 *
 * Checks (per .github/skills/llmwiki-audit/SKILL.md and OKF v0.2 §11):
 *   - Every concept file (any .md that isn't index.md/log.md) has a parseable
 *     YAML frontmatter block with a non-empty `type`.
 *   - `log.md` files carry no frontmatter at all.
 *   - `index.md` files carry no frontmatter, except an optional bundle-root
 *     `okf_version` key.
 *
 * First run in this folder: `npm install` (installs js-yaml, the only dependency).
 *
 * Usage:
 *   node .github/skills/llmwiki-audit/tools/check-okf.mjs [--root <wiki-dir>]
 *
 * Defaults --root to the `wiki/` folder at the vault root (four levels up
 * from this script's own location). Exits 1 if any issue was found, 0 otherwise.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = argv.slice(2);
  // tools/check-okf.mjs -> llmwiki-audit -> skills -> .github -> vault root
  let root = resolve(__dirname, "../../../../wiki");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--root" && args[i + 1]) {
      root = resolve(args[++i]);
    }
  }
  return { root };
}

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(p));
    else if (entry.name.endsWith(".md")) files.push(p);
  }
  return files;
}

/**
 * @param {string} filePath
 * @returns {string[]} issue descriptions, empty if the file is conformant
 */
function checkFile(filePath) {
  const issues = [];
  const text = readFileSync(filePath, "utf-8");
  const base = basename(filePath);
  const isReserved = base === "index.md" || base === "log.md";

  const hasFrontmatter = text.startsWith("---");

  if (base === "log.md" && hasFrontmatter) {
    issues.push("log.md must carry no frontmatter at all (OKF §9)");
    return issues;
  }

  if (!hasFrontmatter) {
    if (!isReserved) {
      issues.push("missing frontmatter block (every concept page needs one)");
    }
    return issues; // index.md/log.md with no frontmatter is fine
  }

  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    issues.push("frontmatter block is never closed with a second '---'");
    return issues;
  }

  const fm = text.slice(3, end);
  let doc;
  try {
    doc = yaml.load(fm);
  } catch (e) {
    issues.push(`YAML parse error: ${e.message}`);
    return issues;
  }

  if (isReserved) {
    const keys = doc ? Object.keys(doc) : [];
    const stray = keys.filter((k) => k !== "okf_version");
    if (stray.length > 0) {
      issues.push(
        `index.md may only carry 'okf_version' frontmatter, found extra key(s): ${stray.join(", ")}`,
      );
    }
  } else if (!doc || !doc.type) {
    issues.push("missing or empty required 'type' field");
  }

  return issues;
}

// ─── CLI entrypoint ───────────────────────────────────────────────────────────

const { root } = parseArgs(process.argv);
const files = walk(root);
let issueCount = 0;

for (const f of files) {
  const issues = checkFile(f);
  for (const issue of issues) {
    issueCount++;
    console.log(`${f}: ${issue}`);
  }
}

if (issueCount === 0) {
  console.log(`OK — ${files.length} files checked under ${root}, no issues found.`);
  process.exit(0);
} else {
  console.log(`${issueCount} issue(s) found across ${files.length} files under ${root}.`);
  process.exit(1);
}
