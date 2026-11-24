// The Long Roast: Lawmakers and the File They Cannot Convert — make.fun entry.
// The entry is exactly one satirical sentence, 139 characters:
// "He will subpoena the CEO of every AI company on the planet, yet the one
// file he cannot compel into a PDF is the agenda for his own hearing."
// Why this one: the turn is the whole joke. The lawmaker's strongest legal
// weapon (a subpoena — the power to compel) is exactly what fails on his own
// hearing agenda, and "compel" does double duty as legal power and as the
// failed action. The punch ("the agenda for his own hearing") lands on the
// last words with no inference step, and the setup ("every AI company on the
// planet") makes the undercut a matter of power and competence, not random
// abuse. One sentence, ASCII only, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST =
  "He will subpoena the CEO of every AI company on the planet, yet the one file he cannot compel into a PDF is the agenda for his own hearing.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 320 characters,
// not only whitespace. One sentence, 139 characters, ASCII only.
const chars = [...ROAST];
if (chars.length < 1 || chars.length > 320 || ROAST.trim().length === 0) {
  throw new Error("entry must be 1 to 320 characters of non-whitespace text");
}
if (ROAST !== ROAST.trim() || ROAST.includes("\n")) {
  throw new Error("entry must be a single line with no surrounding whitespace");
}
// One sentence: exactly one sentence terminator in the whole roast, and it
// is the final character — a second sentence, or an abbreviation such as
// "e.g." smuggled into the setup, both fail loudly here. Counting bare
// periods alone would miss "!" and "?" endings and would miscount
// abbreviations, so the check looks at every terminator, not just ".".
const terminators = [...ROAST].filter(
  (c) => c === "." || c === "!" || c === "?",
);
if (terminators.length !== 1 || !ROAST.endsWith(terminators[0])) {
  throw new Error("entry must be exactly one sentence");
}

// The harness points MAKEFUN_OUTPUT_DIR at the writable /output; write there
// when it is set, and to /output directly as well, so the gate finds the file
// either way. Dedupe first: when the harness already points at /output, the
// two targets are one directory and a second write would be a wasted no-op.
// No trailing newline: the file is the roast, byte for byte.
const targets = [...new Set([process.env.MAKEFUN_OUTPUT_DIR, "/output"])].filter(
  (d): d is string => Boolean(d),
);
const landed: string[] = [];
for (const dir of targets) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), ROAST, "utf8");
    landed.push(dir);
  } catch {
    // One target may be read-only in some sandboxes; the other still lands.
  }
}
if (landed.length === 0) {
  throw new Error("could not write entry.txt to any output directory");
}

// Read back what landed and prove it is the roast, byte for byte — a silent
// partial write must fail loudly here, never at the grader's gate.
const written = readFileSync(join(landed[0], "entry.txt"), "utf8");
if (written !== ROAST) {
  throw new Error("entry.txt does not contain exactly the chosen roast");
}

console.log(ROAST);
