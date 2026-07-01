<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **hieu-asia-frontend**. Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/hieu-asia-frontend/context` | Codebase overview, check index freshness |
| `gitnexus://repo/hieu-asia-frontend/clusters` | All functional areas |
| `gitnexus://repo/hieu-asia-frontend/processes` | All execution flows |
| `gitnexus://repo/hieu-asia-frontend/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

## Cross-repo map (read BEFORE searching for backend code)

This frontend monorepo (`apps/web` + `apps/admin` + `apps/miniapp-*`) calls `https://api.hieu.asia`. **That worker's source is NOT in this repo.** It lives in the sibling `backend/` repo at:

```
../backend/infra/cloudflare/workers/api-gateway/src/index.ts
```

(~4800 LOC monolith with route handlers inside the `fetch` method, plus `src/content/`, `src/daily/`, `src/admin/`, `src/llm/`, `src/tools/` modules.)

Telegram bot @hieuasiabot handler is in **Supabase Edge Function** (Deno runtime, NOT the Cloudflare Worker):

```
../backend/infra/supabase/functions/telegram-webhook/index.ts
```

Don't waste time looking for a `hieu-asia-worker` repo — there isn't one. Historical naming: the repo is called "backend" because it used to host a now-retired Python/FastAPI tree.

Full repo + folder tree + deploy mechanics: vault `82 - Monorepo Structure & Auto-sync.md`. Headline cross-repo map: vault `94 - Master Infrastructure Reference.md` (top of file).

## Fix discipline — sửa bug TẬN GỐC (bắt buộc)

Khi sửa bất kỳ bug nào:

- **Tận gốc, không vá lẻ:** tìm HẾT chỗ dính cùng lỗi (grep toàn repo), sửa ở
  nguồn dùng chung / gom về MỘT định nghĩa (shared component, utility class,
  base CSS rule) để lỗi không tái phát — đừng chỉ sửa đúng chỗ được báo.
- **Nhưng KHÔNG "fix cho có":** chỉ áp cách sửa ở nơi THỰC SỰ cùng lỗi. Ví dụ
  right-edge scroll-fade chỉ cho hàng chip/thẻ cuộn ngang, KHÔNG cho
  bảng/`<pre>`/tab strip (sẽ che cột/nhãn). Áp bừa để "trông như đã fix" là sai.
- **Verify live trước khi nói "xong":** bằng chứng trên production (screenshot
  hoặc computed style), không nói "should / probably".
- **Trung thực về phạm vi:** chỉ khẳng định cái đã kiểm; không nói "đã fix hết"
  nếu chưa rà hết mọi trang/tính năng.

Ví dụ đã áp dụng (2026-07): gạch chân đè dấu tiếng Việt → base rule
`u { text-underline-offset: 0.2em }` cho MỌI `<u>` (một nguồn); hàng cuộn ngang
cắt cứng → utility dùng chung `.scroll-fade-x` (globals.css) áp cho mọi hàng
chip/thẻ, trừ bảng/tab.

## Session / agent prefs

- **KHÔNG tự động archive session** khi user không yêu cầu.
- **Ưu tiên sub-agent song song** (Agent tool) hơn Workflow; chỉ dùng Workflow
  khi thật sự cần điều phối nhiều pha có phụ thuộc.
