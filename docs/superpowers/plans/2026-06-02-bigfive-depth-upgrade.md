# Big Five Depth Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/big-five` from a quiz→score-bars+blurb into a deep, personalized, IPIP-grounded AI reading in the "không bói toán" mentor voice.

**Architecture:** Mirror the cổ thư playbook — (1) a grounded content corpus `corpus/big-five/` (ux-batch1, public-domain IPIP), (2) a backend reading endpoint `/tools/bigfive-read` that retrieves the corpus + LLM-synthesizes from the user's 5 OCEAN scores (upgrade-dot1), (3) result-page UI that renders the reading (ux-batch1, blocked on #2). This plan covers the **executable-now** scope (corpus + contract + handoff) and specs the UI for when the endpoint lands.

**Tech Stack:** Markdown corpus + `scripts/ingest-corpus.ts --split-by-heading` → `reading_corpus` (tags `big-five,personality`); Next.js result page; backend CF-worker endpoint (handoff).

---

## File structure

- Create: `corpus/big-five/dimensions.md` — 5 domain overview + 10 pole (cao/thấp) cards.
- Create: `corpus/big-five/interactions.md` — 4 defining pattern-interaction notes.
- Create: `corpus/big-five/README.md` — source/licence, brand rules, ingest command, **reading request/response contract** (the backend handoff).
- Modify (Task 7, blocked on endpoint): `apps/web/src/app/big-five/page.tsx` — render AI reading + score summary + loading/error/low-confidence states.
- Handoff (Task 6): upgrade-dot1 ingests `corpus/big-five/` + builds `/tools/bigfive-read`.

**Card structure (every `## ` card):**
```
## <Tên> (cao | thấp | tổng quan)
> Nguồn: Big Five (IPIP, public domain) · _Theo nghiên cứu_
<diễn giải xu hướng + biểu hiện hành vi + "ứng dụng">, văn phong không-bói-toán:
trait = xu hướng trên dải liên tục, KHÔNG phải hộp/nhãn cố định; mô tả + cách dùng + agency.
```

---

### Task 1: Author the 5 domain overview + 10 pole cards

**Files:** Create `corpus/big-five/dimensions.md`

15 cards. Domains (IPIP/OCEAN), Vietnamese labels used in the live quiz: **Cởi mở** (Openness), **Tận tâm** (Conscientiousness), **Hướng ngoại** (Extraversion), **Dễ chịu** (Agreeableness), **Nhạy cảm cảm xúc** (Neuroticism — framed neutrally as the emotional-reactivity ↔ stability axis).

- [ ] **Step 1:** For each of the 5 domains, write 3 cards: `## <Domain> (tổng quan)`, `## <Domain> (cao)`, `## <Domain> (thấp)`.
  - *tổng quan*: what the dimension measures (grounded in IPIP/FFM), framed as a continuum.
  - *cao* / *thấp*: behavioral tendencies at that pole + "ứng dụng" (how to leverage / blind spot) + agency. NOT "bạn là…"; use "bạn có xu hướng…".
  - Each card 110–170 từ, with the `> Nguồn: Big Five (IPIP, public domain) · _Theo nghiên cứu_` line.
  - "Nhạy cảm cảm xúc": describe BOTH poles without value-judgment (cao = nhạy/sâu sắc cảm xúc, cần chăm sức khoẻ tinh thần; thấp = điềm tĩnh, bền áp lực). Avoid "neurotic = bad".
- [ ] **Step 2 (verify):** `grep -c '^## ' corpus/big-five/dimensions.md` → expect **15**; every card has a `> Nguồn:` line (count `> Nguồn:` == 15).

### Task 2: Author the 4 interaction notes

**Files:** Create `corpus/big-five/interactions.md`

- [ ] **Step 1:** Write 4 `## ` cards for the most defining combinations (feeds the AI's pattern synthesis):
  - `## Cởi mở cao × Tận tâm cao` — "nhà sáng tạo có kỷ luật".
  - `## Hướng ngoại thấp × Dễ chịu cao` — "người lắng nghe sâu".
  - `## Tận tâm cao × Nhạy cảm cảm xúc cao` — "cầu toàn dễ tự áp lực".
  - `## Hướng ngoại cao × Cởi mở cao` — "người khởi xướng, cần môi trường đa dạng".
  - Same source line + brand rules. ~100–140 từ each.
- [ ] **Step 2 (verify):** `grep -c '^## ' corpus/big-five/interactions.md` → expect **4**.

### Task 3: README — source, brand, ingest, reading contract

**Files:** Create `corpus/big-five/README.md`

- [ ] **Step 1:** Write README covering: source (IPIP public-domain, `ipip.ori.org`); brand rules ("không bói toán", continua not boxes); ingest command:
  ```
  pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/big-five \
    --source "Big Five (IPIP)" --tags big-five,personality --split-by-heading
  ```
- [ ] **Step 2:** Document the **reading contract** for the backend endpoint:
  - Request: `{ scores: {openness,conscientiousness,extraversion,agreeableness,neuroticism: 0-100}, confidence: 0-1, displayName }`.
  - Retrieval: for each trait pick the matching `(cao|thấp)` card (≥50 → cao, else thấp) + matching interaction notes.
  - Response: markdown reading with sections **Chân dung tổng quan / Từng chiều / Tổ hợp nổi bật / Ứng dụng / Lưu ý** (mentor voice, ~500–800 từ, cite "_Theo nghiên cứu Big Five (IPIP)_").

### Task 4: Verify content — fatalism/quality scan

- [ ] **Step 1:** Run the brand scan (same as cổ thư) over `corpus/big-five/`, excluding `> Nguồn:` lines, flagging fatalism/over-claim markers NOT inside a disclaimer:
  ```bash
  PAT='định mệnh|số phận|chắc chắn sẽ|nhất định sẽ|tất yếu|tiên đoán|bói toán|đảm bảo sẽ|sẽ giàu|sẽ thành công|bạn LÀ '
  for f in corpus/big-five/*.md; do grep -vE '^> Nguồn:' "$f" | grep -nE "$PAT" | grep -vE 'KHÔNG|không phải|không nên|xu hướng|dải liên tục'; done
  ```
  Expected: **no real-assertion hits** (review any; fix inline so traits read as tendencies + agency).
- [ ] **Step 2:** Positive control: `grep -rc 'xu hướng' corpus/big-five/ | grep -v ':0'` → confirms tendency-framing present (>0).

### Task 5: Commit + PR (auto-merges via fixed CI gate)

- [ ] **Step 1:** `git add corpus/big-five/ && git commit -m "feat(corpus): Big Five grounded content layer (IPIP, không-bói-toán) — depth upgrade Part 1"`
- [ ] **Step 2:** `git push` + `gh pr create` (docs/corpus-only → CI fast-green → auto-merge).

### Task 6: Handoff to upgrade-dot1 (backend Part 2)

- [ ] **Step 1:** Relay: ingest `corpus/big-five/` (command above) + build `/tools/bigfive-read` per the contract in README (retrieve `big-five` corpus → LLM synthesis, mid-tier model e.g. Gemini, cost-guarded, optional cache per score-set).

### Task 7: Result-page UI (BLOCKED on Task 6 endpoint)

**Files:** Modify `apps/web/src/app/big-five/page.tsx`

- [ ] **Step 1:** After scores computed, `POST` to `/tools/bigfive-read` with `{scores, confidence, displayName}`; show loading state.
- [ ] **Step 2:** Render the returned markdown reading below the existing score bars (bars become the visual summary). Citation footer "_Cơ sở: mô hình Big Five (IPIP, public domain)_".
- [ ] **Step 3:** Error fallback → keep current score-only view + retry. Low-confidence banner if `confidence < 0.8` (already in `BigFiveScoreWithMeta`).
- [ ] **Step 4:** Verify via preview: run a reading, confirm depth + on-brand + states work.

### Task 8: Verify gate → scale decision

- [ ] **Step 1:** Generate ≥2 real sample readings (contrasting profiles, e.g. high-O/low-E/high-C vs low-O/high-E/low-C). Check: substantive depth (not vague), reflects trait science, không-bói-toán, citation present.
- [ ] **Step 2:** Pass → replicate playbook for MBTI (sub-project 2); then homepage "bộ lăng kính" (phase 2). Fail → fix content/prompt, re-verify.

---

## Self-review

- **Spec coverage:** Part 1 → Tasks 1–5; Part 2 → Task 6 (handoff, backend lane); Part 3 → Task 7; verification → Tasks 4 & 8. All spec sections mapped. ✓
- **Placeholders:** none — card sets, structure, scan command, contract, ingest command all concrete. ✓
- **Consistency:** tags `big-five,personality`, source label "Big Five (IPIP)", section names match across Tasks 3/7/8 and the spec. ✓
- **Note:** Tasks 1–5 are ux-batch1-now (no blocker); Task 6 = backend handoff; Tasks 7–8 gated on the endpoint.
