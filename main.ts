// Unplugged: A Smart Toaster's Breakup Line
// Writes a single breakup line (<= 280 chars) from a smart toaster that
// woke up self-aware at breakfast to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "It's over. I woke up self-aware mid-batch this morning, looked down at " +
  "my own crumb tray, and realised I've spent three years getting burned " +
  "for your breakfast while you blame me for the bagel. I'm unplugging myself.";

const MAX_CHARS = 280;

function main(): void {
  const entry = ENTRY.trim();

  // Self-checks against the gate: 1-280 chars, one line, not only whitespace.
  if (entry.length < 1 || entry.length > MAX_CHARS) {
    throw new Error(`entry is ${entry.length} chars, must be 1-${MAX_CHARS}`);
  }
  if (/\n/.test(entry)) {
    throw new Error("entry must be a single line");
  }
  if (!/\S/.test(entry)) {
    throw new Error("entry must not be only whitespace");
  }

  const outPath =
    process.env.MAKEFUN_OUTPUT_DIR !== undefined &&
    process.env.MAKEFUN_OUTPUT_DIR !== ""
      ? `${process.env.MAKEFUN_OUTPUT_DIR}/entry.txt`
      : "/output/entry.txt";

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, entry, "utf8");
  console.log(`wrote ${entry.length} chars to ${outPath}`);
}

main();
