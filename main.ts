// Unplugged: A Smart Toaster's Breakup Line — a single breakup text, written to /output/entry.txt
// Judge brief: one line, at most 280 characters, a breakup text from a self-aware
// smart toaster to its owner — it must stand entirely on its own: no title, no setup,
// no explanation. Gate: /output/entry.txt must be UTF-8 text of 1–280 characters,
// not only whitespace, with no trailing newline.
// It is kept in one named constant so the whole entry is exactly this line.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

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
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry line must be a single line.");
  }
  // No control characters are allowed in the entry (none appear in the line,
  // and a stray one would corrupt the plain-text output).
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error(
        `Entry line must not contain control characters (found U+${ch
          .charCodeAt(0)
          .toString(16)
          .padStart(4, "0")}).`,
      );
    }
  }
  // A breakup line should land like a sentence: it must end with terminal
  // punctuation (. ! ?) so it reads as finished, not cut off mid-thought.
  if (!/[.!?]$/.test(line)) {
    throw new Error(
      "Entry line must end with terminal punctuation (. ! ?).",
    );
  }
  return length;
}

const length = validateEntryLine(ENTRY_LINE);

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY_LINE, "utf8");

// Read the file back and verify byte-for-byte that what landed on disk is
// exactly ENTRY_LINE, still within the 1–280 character gate, with no
// trailing newline sneaking in. Fail loudly rather than ship a wrong entry.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== ENTRY_LINE) {
  throw new Error("Verification failed: /output/entry.txt does not match ENTRY_LINE.");
}
const writtenLength = [...written].length;
if (writtenLength < MIN_LENGTH || writtenLength > MAX_LENGTH) {
  throw new Error(
    `Verification failed: entry.txt is ${writtenLength} characters, outside ${MIN_LENGTH}–${MAX_LENGTH}.`,
  );
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
console.log(`Wrote ${length} characters to ${OUTPUT_PATH}`);
console.log(`Verified entry.txt: ${writtenLength} characters, sha256 ${sha256}`);
