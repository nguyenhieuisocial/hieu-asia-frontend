#!/usr/bin/env node
/**
 * UI regression guard — note 167 §C.6.
 *
 * Runs on the lines a PR ADDS (git diff) and fails ONLY on NEW anti-patterns, so
 * it never trips on pre-existing code. Advisory by design (its own workflow, not a
 * required check) until promoted. Patterns (1-5; the §D route-registry guard #6
 * lands with T10):
 *   1. <input type="time">            → use the Time24 component (CLAUDE.md)
 *   2. new `group-hover:` in a file with no `group-focus-within:` (hover→focus a11y)
 *   3. `text-sm`/`text-xs` on an input/select/textarea (iOS zoom / legibility)
 *   4. new `fixed bottom-` with no `safe-area-inset-bottom` in the file
 *   5. raw `bg-white`/`text-black` (no `dark:`) — breaks dark mode (QR/print exempt)
 *
 * Usage: node apps/web/scripts/ui-guard.mjs [baseRef]   (default: origin/main)
 */
import { execSync } from 'node:child_process';

const base = process.argv[2] || 'origin/main';
const SRC = 'apps/web/src';

function git(cmd) {
  return execSync(cmd, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

let diff = '';
for (const range of [`${base}...HEAD`, `${base}`, 'HEAD~1']) {
  try {
    diff = git(`git diff --unified=0 ${range} -- ${SRC}`);
    if (diff) break;
  } catch {
    /* try next range (shallow clone / no base) */
  }
}

// Collect added lines with their file.
const added = [];
let file = null;
for (const line of diff.split('\n')) {
  if (line.startsWith('+++ b/')) { file = line.slice(6); continue; }
  if (line.startsWith('+++ ')) { file = null; continue; }
  if (line.startsWith('+') && !line.startsWith('+++') && file && /\.(tsx?|jsx?)$/.test(file)) {
    added.push({ file, text: line.slice(1) });
  }
}

const QR_PRINT_EXEMPT = /(qr|poster|print|opengraph|og-image|email|receipt|invoice)/i;
const violations = [];
const push = (f, why, t) => violations.push({ f, why, t: String(t).trim().slice(0, 130) });

for (const { file: f, text } of added) {
  // 1. <input type="time">
  if (/<\s*input\b/i.test(text) && /type\s*=\s*["']time["']/.test(text)) {
    push(f, 'input type="time" → dùng component Time24 (CLAUDE.md, chưa enforce máy)', text);
  }
  // 3. text-sm / text-xs directly on a form control (same line)
  if (/<\s*(input|Input|select|Select|textarea|Textarea)\b/.test(text) && /\btext-(sm|xs)\b/.test(text)) {
    push(f, 'text-sm/xs trên input/select/textarea → iOS zoom + khó đọc', text);
  }
  // 5. raw bg-white / text-black (drop dark: variants first), except QR/print files
  if (!QR_PRINT_EXEMPT.test(f)) {
    const raw = text.replace(/dark:(?:bg-white|text-black)[\w/-]*/g, '');
    if (/(?<![\w:/-])bg-white\b/.test(raw) || /(?<![\w:/-])text-black\b/.test(raw)) {
      push(f, 'bg-white/text-black trần → hỏng dark-mode (chỉ QR/print được whitelist)', text);
    }
  }
}

// File-level checks (patterns 2 & 4): only for files that ADDED the trigger.
const changed = [...new Set(added.map((a) => a.file))];
for (const f of changed) {
  let content = '';
  try { content = git(`git show HEAD:${f}`); } catch { continue; }
  const addedIn = added.filter((a) => a.file === f).map((a) => a.text).join('\n');

  // 2. new group-hover: but file has no group-focus-within:
  if (/\bgroup-hover:/.test(addedIn) && !/group-focus-within:/.test(content)) {
    push(f, 'group-hover: mới nhưng file thiếu group-focus-within (hover-only ẩn khỏi bàn phím)', 'group-hover:');
  }
  // 4. new `fixed bottom-` but no safe-area handling in the file
  if (/\bfixed\b[^"'`]*\bbottom-/.test(addedIn) &&
      !/(safe-area-inset-bottom|env\(safe-area|pb-safe|safe-bottom|safe-area-pb)/.test(content)) {
    push(f, 'fixed bottom- mới không kèm safe-area-inset-bottom (che nội dung trên iPhone notch)', 'fixed bottom-');
  }
}

if (violations.length === 0) {
  console.log('✓ ui-guard: không có anti-pattern UI mới trong file thay đổi.');
  process.exit(0);
}

console.error(`\n✗ ui-guard: phát hiện ${violations.length} anti-pattern UI MỚI (note 167 §C.6):\n`);
for (const v of violations) {
  console.error(`  ${v.f}\n    ⚠ ${v.why}\n      ${v.t}\n`);
}
console.error('Sửa theo §C.6, hoặc nếu cố ý (vd QR/print) thì đặt file vào nhánh được whitelist.\n');
process.exit(1);
