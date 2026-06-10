# Big Five — Depth Upgrade (sub-project 1 of "lăng kính big-upgrade")

**Date:** 2026-06-02
**Owner lane:** ux-batch1 (content + frontend) — backend reading endpoint coordinated with upgrade-dot1
**Status:** design approved (founder), pre-implementation

## Context & goal

Audit (2026-06-02) of the candidate "lăng kính" found the personality tools are **shallow**: `/big-five` is a 20-item IPIP quiz → 5 OCEAN score bars + a short canned blurb (scoring lib ≈ 330 words, **no AI reading, no grounded interpretation**). To honestly feature Big Five as a homepage "lăng kính đủ sâu + đủ tín", its output must become a **deep, personalized, credibly-grounded reading** — comparable in depth to the Tử Vi / palm readings.

Founder direction: "mạnh tay" (Big Five becomes a real lens) **but deepen first**, "chắc từng bước" (Big Five first, verify, then scale to MBTI, then homepage).

**Goal:** turn the Big Five result from "score bars + blurb" into a personalized AI reading that interprets the user's *specific score pattern*, grounded in public-domain trait science (IPIP), in the hieu.asia "không bói toán" mentor voice — reusing the proven cổ thư playbook (grounded content layer + AI reading).

## Non-goals (scope discipline)

- **Domain-level only** (O/C/E/A/N), not 30 facets — the live quiz is 4 items/trait (domain granularity). Facet depth = future (needs a longer quiz).
- **Standalone Big Five reading** — do NOT yet merge Big Five into the combined Tử Vi/Bát Tự report (that's a later synthesis phase).
- **No homepage changes** in this sub-project — homepage "bộ lăng kính" is the next phase, gated on this proving out.
- **No quiz expansion** — reuse the existing 20-item IPIP instrument + `scoreBigFive`.

## Design

Three parts, mirroring the cổ thư success (content layer = my lane; AI reading wiring = backend coordination; UI = my lane).

### Part 1 — Grounded Big Five content layer (ux-batch1 lane)

A corpus of credible, research-grounded interpretation cards, like the cổ thư layer but for trait psychology.

- **Source (public-domain):** IPIP-NEO (`ipip.ori.org`, explicitly public domain — already noted in `survey-schema-extended.ts`) + established Five-Factor trait descriptions. Each card embeds/derives from the public-domain item content so it is auditable and credible (the "đủ tín khoa học" boost). Citation label: **"_Theo Big Five (IPIP)_"** (analogous to cổ thư's "_Đối chiếu:_").
- **Granularity & structure:** per OCEAN domain × pole → ~15 cards:
  - 5 domains × {**cao** / **thấp**} = 10 pole cards (high/low tendencies + behaviour + "ứng dụng").
  - 5 domain "overview" cards (what the dimension measures, balanced/mid framing).
  - + a small set of **interaction notes** (3–5) for the most defining combinations (e.g. Cởi mở-cao × Tận-tâm-cao = "nhà sáng tạo có kỷ luật"; Hướng-ngoại-thấp × Dễ-chịu-cao = "lắng nghe sâu"). These feed the AI's pattern synthesis without pre-writing all 3^5 combos.
- **Brand rules ("không bói toán"):** traits = **xu hướng trên một dải liên tục, không phải hộp/nhãn cố định**; describe behaviour + how-to-apply + agency; NO deterministic "bạn LÀ…", NO destiny/fortune claims; honest about measurement (traits are continua; quiz is a snapshot). Run the same fatalism/quality scan used on the cổ thư corpus.
- **Storage:** corpus dir `corpus/big-five/` (markdown, per-`## ` card), tags `big-five,personality`. Ingestable via the existing `scripts/ingest-corpus.ts --split-by-heading` into `reading_corpus` so the reading retrieves it (same path as cổ thư).

### Part 2 — AI reading from scores (backend endpoint — coordinate upgrade-dot1)

- **Input:** the 5 OCEAN scores (0–100) + confidence (answered/total) + display name. (Scores already computed client-side by `scoreBigFive`; persisted to `personality_scores`.)
- **Process:** select the matching pole cards (each trait → its cao/thấp card) + relevant interaction notes → retrieve grounded content → LLM synthesis.
- **Output (structured, mentor voice, ~500–800 từ):**
  1. **Chân dung tổng quan** — the overall pattern in a short paragraph (synthesis, not a list).
  2. **Từng chiều** — per-dimension read of *their* score (grounded), 1–2 câu mỗi chiều.
  3. **Tổ hợp nổi bật** — the 1–2 most defining interactions for this person.
  4. **Ứng dụng** — how to leverage strengths / watch blind spots (actionable, không phán).
  5. **Lưu ý** — traits là xu hướng không phải định mệnh; confidence note if answered < 80%.
- **Model/cost:** a mid-tier model is sufficient (e.g. Gemini, per the daily/content routing) → low cost/lượt; cost-guarded like other readings.
- **Where it runs:** a backend worker endpoint (pattern of `/tools/vision-read`), e.g. `/tools/bigfive-read`. ux-batch1 supplies the content + the request/response contract; upgrade-dot1 wires the endpoint + retrieval + model. (Exactly the cổ thư handoff shape.)

### Part 3 — Result page upgrade (ux-batch1 lane)

- `/big-five` result: keep the 5 score bars as a **visual summary at top**, then render the **AI reading** below (the new depth).
- Loading state (reading takes a few seconds) + graceful error fallback to the current score-only view.
- Low-confidence banner if answered < 80% (data already in `BigFiveScoreWithMeta`).
- Citation/footer: "_Cơ sở: mô hình Big Five (IPIP, public domain)_" + the standing "không bói toán" disclaimer.

## Honesty & verification (the depth bar)

- The reading must reference the user's *actual scores* + grounded content — not generic LLM padding. Grounding + per-pattern synthesis is what makes it deep.
- **Verify gate (like cổ thư):** generate ≥2 real sample readings (contrasting profiles) and check: depth (substantive, not vague), grounded (reflects the trait science), on-brand (không bói toán, tendencies + agency), citation present. Only then scale to MBTI.
- Fatalism/quality scan of the `corpus/big-five/` content before ingest.

## Lane split

- **ux-batch1 (can start now, no blocker):** Part 1 content corpus + fatalism scan; Part 3 result-page UI; the reading request/response contract; verification.
- **upgrade-dot1 (coordinate):** Part 2 backend `/tools/bigfive-read` endpoint (retrieve `big-five` corpus → LLM synthesis), model choice, ingest of `corpus/big-five/`.

## Step plan (chắc từng bước, verify gates)

1. Build `corpus/big-five/` grounded content (IPIP-based) → **verify:** fatalism/quality scan clean + sources auditable.
2. Spec the reading contract (input scores → output sections) + result-page UI states.
3. Hand off to upgrade-dot1: ingest `big-five` corpus + wire `/tools/bigfive-read`.
4. Wire result page to the endpoint (UI).
5. **Verify gate:** ≥2 real sample readings pass depth/grounding/brand check.
6. Pass → replicate for MBTI (sub-project 2) → then homepage "bộ lăng kính" (phase 2).

## Coordination points (open, for upgrade-dot1)

- Endpoint name/shape (`/tools/bigfive-read`?), model choice, auth/cost-guard reuse.
- Whether the reading is cached per score-set (avoid re-billing identical scores).

## Future (out of scope here)

- MBTI depth upgrade (same playbook).
- Facet-level Big Five (longer quiz).
- Merge personality lenses into the combined Tử Vi/Bát Tự synthesis.
- Homepage "bộ lăng kính" big-upgrade (catalog-driven, the original trigger).
