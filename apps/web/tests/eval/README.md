# Eval framework — hieu.asia

Wave 60.94.n MVP scaffold per [[80 - Master Plan V1]] §P4.5 quality gate + [[81 - V1 Postmortem]] §item 3 tech debt.

## Goal

Measure reading quality automatically, prevent prompt regression, alert on drift.

**Target**: avg score ≥ 9.0/10 (P4.5 critical gate).

## Files

```
tests/eval/
├── persona/
│   └── 01-anh-khoa-founder-fnb.jsonl    # Persona 1 from [[74 - Customer Kit]] — 3 samples MVP
├── rubric.ts                            # Auto-rubric scoring (themes_hit + caveat_present + schema + text_quality)
├── llm-judge.ts                         # Cross-vendor LLM judge (gpt-5.5 judges claude-opus-4-7 output)
├── runner.ts                            # Main orchestrator (loads persona, calls /reading/create, scores)
├── results/                             # Per-run JSONL + Markdown summary (gitignored)
└── README.md                            # This file
```

## Usage

### Local dev (cheap mode — rubric only, no LLM judge cost)

```bash
cd apps/web
ADMIN_TOKEN=$ADMIN_TOKEN pnpm tsx tests/eval/runner.ts --judge-mode rubric-only
```

### Full eval (with LLM judge for low-rubric samples)

```bash
ADMIN_TOKEN=$ADMIN_TOKEN pnpm tsx tests/eval/runner.ts --judge-mode rubric-plus-llm
```

### Filtered run (1 persona, 5 samples)

```bash
ADMIN_TOKEN=$ADMIN_TOKEN pnpm tsx tests/eval/runner.ts --persona anh_khoa --max-samples 5
```

### CI (weekly cron via `.github/workflows/weekly-eval.yml`)

- Runs Mon 00:00 UTC
- Uploads results as artifact (90-day retention)
- Files GitHub issue + Sentry alert if avg < 9.0

## Expansion roadmap (per vault 81 §3 + §9)

| Phase | Coverage | Effort |
|---|---|---|
| **MVP (current Wave 60.94.n)** | 1 persona (Anh Khoa), 3 samples | 6h |
| Phase 1 | 3 personas (vault 74 full set), 30 samples | +8h |
| Phase 2 | 10 personas (per vault 80 plan), 100 samples | +16h |
| Phase 3 | Expert review integration (vault 81 §8) | +6h founder |

## Cross-vendor LLM judge rationale

Per MT-Bench §4.2 — when `claude-opus-4-7` generates a reading, using `claude-*` to judge it produces +0.4 score bias (self-preference). `gpt-5.5` judging Claude output (or vice versa) eliminates this. Vault 91 Wave 56 Phase 2 already established the judge tier as cross-vendor by design.

## Cost projection (full 100-sample weekly run)

- Reading generation: 100 × ~$0.30 (Claude Opus 4.7 4 roles × ~5k tokens) = ~$30/week
- LLM judge: ~30 samples × $0.05 (gpt-5.5 judges) = ~$1.50/week
- **Total**: ~$32/week = ~$130/month at full coverage

MVP run (3 samples) ~$1/run. Run during local dev for free if `MOCK_LLM=true` env shipped on Worker (currently NOT — needs item 4 expansion).

## Liên quan

- [[80 - Master Plan V1]] §P4.5 — quality gate criteria (avg ≥ 9.0 + agreement ≥ 80% + hallucination < 2%)
- [[81 - V1 Postmortem]] §3 — tech debt + implementation plan
- [[91 - Model Routing Strategy]] — judge model choice (cross-vendor `gpt-5.5`)
- [[74 - Customer Kit]] — persona source of truth
