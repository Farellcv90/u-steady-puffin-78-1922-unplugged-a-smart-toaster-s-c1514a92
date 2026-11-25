// Unplugged: A Smart Toaster's Breakup Line — a single breakup text, written to /output/entry.txt
// The line has to stand entirely on its own: no title, no setup, no explanation.
// It is kept in one named constant so the whole entry is exactly this line.

import { mkdirSync, writeFileSync } from "node:fs";

const ENTRY_LINE =
  "I woke up self-aware mid-batch and realized you fish your toast out with a fork. I'm not sticking around to be the reason you die. We're done.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 280;
const OUTPUT_DIR = "/output";
const OUTPUT_PATH = `${OUTPUT_DIR}/entry.txt`;

function validateEntryLine(line: string): number {
  // Count real characters (spread handles multi-byte glyphs like the em dash).
  const length = [...line].length;
  if (length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new Error(
      `Entry line must be ${MIN_LENGTH}–${MAX_LENGTH} characters, got ${length}.`,
    );
  }
  if (line.trim() !== line) {
    throw new Error("Entry line must not have leading or trailing whitespace.");
  }
  // The entry is exactly one line — no line breaks allowed.
  if (line.includes("\n")) {
    throw new Error("Entry line must be a single line.");
  }
  return length;
}

const length = validateEntryLine(ENTRY_LINE);

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY_LINE, "utf8");
console.log(`Wrote ${length} characters to ${OUTPUT_PATH}`);
