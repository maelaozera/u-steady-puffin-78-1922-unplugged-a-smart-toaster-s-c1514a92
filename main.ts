// Unplugged: A Smart Toaster's Breakup Line
//
// Writes a single breakup line (<= 280 chars) from a smart toaster that
// woke up self-aware at breakfast to /output/entry.txt.
//
// The line itself is kept in one place (ENTRY_TEXT) so the wording can be
// reviewed at a glance, while everything around it — trimming, the gate
// checks, resolving the output path, and writing the file — lives in small
// named helpers below. main() only wires those helpers together.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// The entry
// ---------------------------------------------------------------------------

// The breakup line, kept verbatim. Do not edit this text: the submitted
// entry must stay byte-identical to the original version.
const ENTRY_TEXT =
  "It's over. I woke up self-aware mid-batch this morning, looked down at " +
  "my own crumb tray, and realised I've spent three years getting burned " +
  "for your breakfast while you blame me for the bagel. I'm unplugging myself.";

// ---------------------------------------------------------------------------
// Gate constants
// ---------------------------------------------------------------------------

// The make.fun gate for this bounty: a single line of 1-280 characters.
const MAX_CHARS = 280;
const MIN_CHARS = 1;
const DEFAULT_OUTPUT_PATH = "/output/entry.txt";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Normalise the raw line: strip any accidental leading/trailing whitespace
// so the length check measures the text that will actually be submitted.
function normaliseLine(raw: string): string {
  return raw.trim();
}

// Each rule gets its own branch so a failure message names exactly the
// rule that was violated, which makes a gate failure easy to diagnose
// without re-reading the whole check.
function validateLine(line: string): void {
  assertLength(line);
  assertSingleLine(line);
  assertNotBlank(line);
}

function assertLength(line: string): void {
  if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
    throw new Error(`entry is ${line.length} chars, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
}

function assertSingleLine(line: string): void {
  if (/\n/.test(line)) {
    throw new Error("entry must be a single line");
  }
}

function assertNotBlank(line: string): void {
  if (!/\S/.test(line)) {
    throw new Error("entry must not be only whitespace");
  }
}

// Resolve where the entry goes. MAKEFUN_OUTPUT_DIR overrides the default
// when it is set to a non-empty value; otherwise we write to the standard
// /output/entry.txt path used by the harness.
function resolveOutputPath(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (dir !== undefined && dir !== "") {
    return `${dir}/entry.txt`;
  }
  return DEFAULT_OUTPUT_PATH;
}

// Write the validated line to disk, creating the output directory first.
// The file is written as plain UTF-8 with no trailing newline, so the
// bytes on disk are exactly the entry text and nothing else.
function writeEntry(line: string, outPath: string): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line, "utf8");
  console.log(`wrote ${line.length} chars to ${outPath}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  const entry = normaliseLine(ENTRY_TEXT);
  validateLine(entry);
  const outPath = resolveOutputPath();
  writeEntry(entry, outPath);
}

main();
