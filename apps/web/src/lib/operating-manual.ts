/**
 * Personal Operating Manual (POM) — roadmap §8.3.
 *
 * Synthesizes a printable "user manual" from data the platform already has
 * about the user: saved birth profile (`hieu:profile:v1`), chart profile
 * (`hieu:chart:profile:v1`), Decision Briefs (`hieu:decisions:*`), and
 * Decision Journal entries / Weekly Reviews (`hieu:journal:entries:v1`,
 * `hieu:weekly:reviews:v1`).
 *
 * Pure frontend. No LLM calls — we only re-arrange the user's own words and
 * derive simple aggregates (top topics, repeated themes, value anchors from
 * topic mix). All synthesis is deterministic.
 *
 * Returns `null` until the user has enough data to build something meaningful
 * (≥3 entries total across decisions + journal + weekly reviews). The UI shows
 * a checklist of what's missing.
 */

import { readSavedProfile, type SavedProfile } from './saved-profile';
import {
  readJournalEntries,
  readWeeklyReviews,
  type JournalEntry,
  type JournalTopic,
  type WeeklyReview,
} from './journal-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ManualSection {
  /** Stable id for anchor links / progress counting. */
  id: string;
  /** Vietnamese title shown in UI + Markdown export. */
  title: string;
  /**
   * Lines of body content. Each line renders as a paragraph (or list item if
   * `kind: 'list'` is set on the section). Empty array = section is empty and
   * should show a placeholder.
   */
  lines: string[];
  /** Display hint. Defaults to 'prose'. */
  kind?: 'prose' | 'list' | 'quotes';
  /**
   * When the section is empty, link the user to a page that lets them add
   * data. The UI renders "Cần thêm dữ liệu — [link]".
   */
  emptyHref?: string;
  emptyLabel?: string;
}

export interface ManualIdentityCore {
  displayName?: string;
  gender?: SavedProfile['gender'];
  birthDate?: string;       // YYYY-MM-DD solar
  birthTime?: string;       // HH:MM
  birthPlace?: string;
  /** Stable short hash derived from birth inputs — UI shows + links to /methodology/tu-vi for verification. */
  chartHash?: string;
  /** Computed age in years; undefined if birthDate missing or invalid. */
  age?: number;
}

export interface OperatingManual {
  identity: ManualIdentityCore;
  sections: ManualSection[];
  /** Total sections (8) and how many have ≥1 line of content. */
  filledCount: number;
  totalCount: number;
  /** ISO timestamp when manual was assembled. */
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Internal: stored Decision Brief shape (mirrors decisions/new + [id]/page).
// ---------------------------------------------------------------------------

interface StoredDecisionOption {
  label: string;
  description: string;
  risks: string[];
  bestWhen: string;
}
interface StoredDecisionBrief {
  realProblem: string;
  chartSignal: string;
  options: StoredDecisionOption[];
  smallestNextStep: string[];
  caveats: string[];
  generatedAt: string;
}
interface StoredDecision {
  id: string;
  brief: StoredDecisionBrief;
  question: string;
  topic: string;
  createdAt: string;
}

function readStoredDecisions(): StoredDecision[] {
  if (typeof window === 'undefined') return [];
  const out: StoredDecision[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (!k.startsWith('hieu:decisions:') || k.endsWith(':checked')) continue;
      try {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const rec = JSON.parse(raw) as Partial<StoredDecision>;
        if (
          rec.id &&
          rec.question &&
          rec.createdAt &&
          rec.brief &&
          typeof rec.brief === 'object'
        ) {
          out.push(rec as StoredDecision);
        }
      } catch {
        /* skip bad entry */
      }
    }
  } catch {
    /* ignore */
  }
  // Newest first.
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out;
}

// ---------------------------------------------------------------------------
// Internal: synthesis helpers (deterministic, no LLM).
// ---------------------------------------------------------------------------

const TOPIC_LABEL: Record<string, string> = {
  career: 'Sự nghiệp',
  relationship: 'Tình cảm',
  finance: 'Tài chính',
  family: 'Gia đình',
  general: 'Tổng quát',
};

/**
 * Stable, short, non-cryptographic hash of birth inputs — used as a visible
 * "chart hash" the user can quote for support / verification. Two users with
 * the same exact birth data get the same hash; trivial collisions are fine
 * since this is not security-sensitive.
 */
function shortHash(parts: ReadonlyArray<string | undefined>): string {
  const s = parts.filter((p): p is string => !!p).join('|');
  if (!s) return '';
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  // Convert to unsigned + base36, take 8 chars.
  const u = h >>> 0;
  return u.toString(36).slice(0, 8).toUpperCase().padStart(8, '0');
}

function computeAge(birthDate?: string): number | undefined {
  if (!birthDate) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!m) return undefined;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || !mo || !d) return undefined;
  const now = new Date();
  let age = now.getFullYear() - y;
  const hadBday =
    now.getMonth() + 1 > mo || (now.getMonth() + 1 === mo && now.getDate() >= d);
  if (!hadBday) age -= 1;
  return age >= 0 && age < 130 ? age : undefined;
}

interface TopicCount {
  topic: JournalTopic | 'general';
  count: number;
}

function tallyTopics(entries: { topic: string }[]): TopicCount[] {
  const m = new Map<string, number>();
  for (const e of entries) {
    const t = e.topic || 'general';
    m.set(t, (m.get(t) ?? 0) + 1);
  }
  return Array.from(m.entries())
    .map(([topic, count]) => ({ topic: topic as JournalTopic, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Truncate a sentence at a reasonable boundary for inline use in lists.
 * Keeps the user's exact wording; just trims trailing whitespace/punctuation.
 */
function trimSentence(s: string, max = 180): string {
  const t = s.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  // Cut at the last word boundary before `max`.
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '') + '…';
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildIdentityCore(
  profile: SavedProfile | null,
  chartProfile: { full_name?: string; gender?: string; birth_date?: string; birth_time?: string; birth_place?: string } | null,
): ManualIdentityCore {
  // Prefer the saved-profile (canonical), fall back to chart-profile fields.
  const displayName =
    profile?.displayName ?? chartProfile?.full_name ?? undefined;
  const gender =
    profile?.gender ??
    (chartProfile?.gender === 'nam'
      ? 'male'
      : chartProfile?.gender === 'nữ'
        ? 'female'
        : undefined);
  const birthDate = profile?.birthDate ?? chartProfile?.birth_date ?? undefined;
  const birthTime = profile?.birthTime ?? chartProfile?.birth_time ?? undefined;
  const birthPlace = profile?.birthPlace ?? chartProfile?.birth_place ?? undefined;

  return {
    displayName,
    gender,
    birthDate,
    birthTime,
    birthPlace,
    chartHash: shortHash([birthDate, birthTime, birthPlace, gender]),
    age: computeAge(birthDate),
  };
}

function buildIdentitySection(id: ManualIdentityCore): ManualSection {
  const lines: string[] = [];
  if (id.displayName || id.gender || id.age != null) {
    const bits: string[] = [];
    if (id.displayName) bits.push(id.displayName);
    if (id.gender) bits.push(id.gender === 'male' ? 'Nam' : 'Nữ');
    if (id.age != null) bits.push(`${id.age} tuổi`);
    lines.push(bits.join(' · '));
  }
  if (id.birthDate) {
    const t = id.birthTime ? `lúc ${id.birthTime}` : '(giờ chưa rõ)';
    const place = id.birthPlace ? `, ${id.birthPlace}` : '';
    lines.push(`Sinh ${formatDateVN(id.birthDate)} ${t}${place}.`);
  }
  if (id.chartHash) {
    lines.push(`Mã lá số: ${id.chartHash} — dùng để đối chiếu khi cần hỗ trợ.`);
  }
  return {
    id: 'identity-core',
    title: 'Định danh cốt lõi',
    lines,
    kind: 'prose',
    emptyHref: '/account/chart',
    emptyLabel: 'Bổ sung thông tin sinh',
  };
}

function buildStrengthsSection(
  topicCounts: TopicCount[],
  weekly: WeeklyReview[],
): ManualSection {
  const lines: string[] = [];

  // Strength 1: dominant decision topic — what they invest in.
  const top = topicCounts[0];
  if (top && top.count >= 2) {
    lines.push(
      `Bạn dành nhiều suy nghĩ cho **${TOPIC_LABEL[top.topic] ?? top.topic}** ` +
        `(${top.count} bản ghi) — đây là vùng bạn nghiêm túc.`,
    );
  }

  // Strength 2-3: from weekly highlights — user's own words about what went well.
  const highlights = weekly
    .map((w) => w.highlights?.trim())
    .filter((s): s is string => !!s && s.length >= 10)
    .slice(0, 3);
  for (const h of highlights) {
    lines.push(`Điểm mạnh ghi nhận: "${trimSentence(h, 160)}"`);
  }

  return {
    id: 'strengths',
    title: 'Điểm mạnh',
    lines,
    kind: 'list',
    emptyHref: '/weekly-review',
    emptyLabel: 'Viết Weekly Review đầu tiên',
  };
}

function buildGrowthEdgesSection(weekly: WeeklyReview[]): ManualSection {
  const lines: string[] = [];

  const drains = weekly
    .map((w) => w.energyDrain?.trim())
    .filter((s): s is string => !!s && s.length >= 10)
    .slice(0, 3);
  for (const d of drains) {
    lines.push(`Điều rút năng lượng: "${trimSentence(d, 160)}"`);
  }

  const changes = weekly
    .map((w) => w.oneChange?.trim())
    .filter((s): s is string => !!s && s.length >= 10)
    .slice(0, 2);
  for (const c of changes) {
    lines.push(`Đang muốn thay đổi: "${trimSentence(c, 160)}"`);
  }

  return {
    id: 'growth-edges',
    title: 'Vùng cần phát triển',
    lines,
    kind: 'list',
    emptyHref: '/weekly-review',
    emptyLabel: 'Ghi Weekly Review',
  };
}

function buildDecisionPatternsSection(
  decisionTopics: TopicCount[],
  journal: JournalEntry[],
  decisionsCount: number,
): ManualSection {
  const lines: string[] = [];

  if (decisionTopics.length === 0) {
    return {
      id: 'decision-patterns',
      title: 'Mẫu hình ra quyết định',
      lines,
      kind: 'list',
      emptyHref: '/decisions/new',
      emptyLabel: 'Tạo Decision Brief',
    };
  }

  lines.push(
    `Đã ghi ${decisionsCount} Decision Brief và ${journal.length} nhật ký quyết định.`,
  );

  const top3 = decisionTopics.slice(0, 3);
  const dist = top3
    .map((t) => `${TOPIC_LABEL[t.topic] ?? t.topic} (${t.count})`)
    .join(' · ');
  lines.push(`Chủ đề thường gặp: ${dist}.`);

  // Reflections: from journal entries with `lesson` filled in after review.
  const lessons = journal
    .map((j) => j.lesson?.trim())
    .filter((s): s is string => !!s && s.length >= 10)
    .slice(0, 2);
  for (const l of lessons) {
    lines.push(`Bài học rút ra: "${trimSentence(l, 160)}"`);
  }

  return {
    id: 'decision-patterns',
    title: 'Mẫu hình ra quyết định',
    lines,
    kind: 'list',
    emptyHref: '/decisions/new',
    emptyLabel: 'Tạo Decision Brief',
  };
}

function buildValueAnchorsSection(topicCounts: TopicCount[]): ManualSection {
  const lines: string[] = [];

  // Map topic dominance → value anchor statements.
  // We emit 4 anchors when possible, prioritizing the user's most-touched
  // topics. These are not LLM-generated; they're stable phrasings tied to
  // each topic.
  const ANCHOR_FOR: Record<string, string> = {
    career:
      'Sự nghiệp — bạn đo bản thân qua giá trị tạo ra, không chỉ qua chức danh.',
    relationship:
      'Tình cảm — bạn coi trọng kết nối sâu hơn việc giữ vẻ ngoài hoà hợp.',
    finance:
      'Tài chính — bạn cần cảm giác kiểm soát và an toàn dài hạn hơn lợi nhuận nhanh.',
    family:
      'Gia đình — quyết định lớn của bạn thường tính đến người thân, không chỉ cá nhân.',
    general:
      'Tự chủ — bạn ưu tiên hiểu rõ vì sao mình chọn, hơn là chạy theo số đông.',
  };

  const seen = new Set<string>();
  for (const t of topicCounts) {
    if (lines.length >= 4) break;
    const anchor = ANCHOR_FOR[t.topic];
    if (anchor && !seen.has(t.topic)) {
      lines.push(anchor);
      seen.add(t.topic);
    }
  }

  return {
    id: 'value-anchors',
    title: 'Giá trị neo',
    lines,
    kind: 'list',
    emptyHref: '/decisions/new',
    emptyLabel: 'Tạo Decision Brief để xác định giá trị',
  };
}

function buildLifeOperatingPrinciplesSection(
  decisions: StoredDecision[],
  journal: JournalEntry[],
): ManualSection {
  const lines: string[] = [];

  // Pull "realProblem" reframings from Decision Briefs — these are the closest
  // thing to durable operating principles the system already has about the user.
  const principles = decisions
    .map((d) => d.brief.realProblem?.trim())
    .filter((s): s is string => !!s && s.length >= 20)
    .slice(0, 3);
  for (const p of principles) {
    lines.push(`"${trimSentence(p, 200)}"`);
  }

  // Augment with explicit lessons the user wrote.
  if (lines.length < 5) {
    const extra = journal
      .map((j) => j.lesson?.trim())
      .filter((s): s is string => !!s && s.length >= 20)
      .slice(0, Math.max(0, 5 - lines.length));
    for (const l of extra) {
      lines.push(`"${trimSentence(l, 200)}"`);
    }
  }

  return {
    id: 'operating-principles',
    title: 'Nguyên tắc vận hành',
    lines,
    kind: 'quotes',
    emptyHref: '/decisions/new',
    emptyLabel: 'Tạo Decision Brief',
  };
}

function buildOpenQuestionsSection(
  journal: JournalEntry[],
  decisions: StoredDecision[],
): ManualSection {
  const lines: string[] = [];

  // Journal entries without a review yet = open loops.
  const unreviewed = journal
    .filter((j) => !j.reviewedAt && j.question?.trim())
    .slice(0, 3);
  for (const j of unreviewed) {
    lines.push(`"${trimSentence(j.question, 140)}" — ${TOPIC_LABEL[j.topic] ?? j.topic}`);
  }

  // Newest decision brief question, if not already in unreviewed.
  if (lines.length < 4 && decisions[0]) {
    lines.push(
      `"${trimSentence(decisions[0].question, 140)}" — ${TOPIC_LABEL[decisions[0].topic] ?? decisions[0].topic}`,
    );
  }

  return {
    id: 'open-questions',
    title: 'Câu hỏi đang mở',
    lines,
    kind: 'list',
    emptyHref: '/journal/new',
    emptyLabel: 'Ghi câu hỏi đang phân vân',
  };
}

function buildReviewCadenceSection(weekly: WeeklyReview[]): ManualSection {
  const lines: string[] = [];
  if (weekly.length > 0) {
    const newest = weekly[0]!;
    lines.push(`Weekly Review gần nhất: tuần bắt đầu ${formatDateVN(newest.weekStart)}.`);
    if (weekly.length >= 4) {
      lines.push(`Đã có ${weekly.length} tuần được review — cadence đang ổn định.`);
    } else {
      lines.push(`Đã review ${weekly.length} tuần. Mục tiêu: 4 tuần liên tiếp để có pattern rõ.`);
    }
    const learning = newest.oneLearning?.trim();
    if (learning && learning.length >= 10) {
      lines.push(`Bài học tuần gần nhất: "${trimSentence(learning, 180)}"`);
    }
  }

  return {
    id: 'review-cadence',
    title: 'Nhịp review bản thân',
    lines,
    kind: 'prose',
    emptyHref: '/weekly-review',
    emptyLabel: 'Bắt đầu Weekly Review',
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Read the chart-profile localStorage entry (separate from saved-profile). */
function readChartProfile(): {
  full_name?: string;
  gender?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('hieu:chart:profile:v1');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      full_name: typeof parsed.full_name === 'string' ? parsed.full_name : undefined,
      gender: typeof parsed.gender === 'string' ? parsed.gender : undefined,
      birth_date: typeof parsed.birth_date === 'string' ? parsed.birth_date : undefined,
      birth_time: typeof parsed.birth_time === 'string' ? parsed.birth_time : undefined,
      birth_place: typeof parsed.birth_place === 'string' ? parsed.birth_place : undefined,
    };
  } catch {
    return null;
  }
}

/** Total user-contributed entries (used for gating + progress display). */
export function countManualInputs(): {
  decisions: number;
  journal: number;
  weekly: number;
  profileComplete: boolean;
  total: number;
} {
  const profile = readSavedProfile();
  const chart = readChartProfile();
  const decisions = readStoredDecisions().length;
  const journal = readJournalEntries().length;
  const weekly = readWeeklyReviews().length;
  const profileComplete = Boolean(
    (profile?.birthDate || chart?.birth_date) &&
      (profile?.gender || chart?.gender),
  );
  return {
    decisions,
    journal,
    weekly,
    profileComplete,
    total: decisions + journal + weekly,
  };
}

/**
 * Assemble the Operating Manual from local data. Returns `null` when the
 * user has fewer than 3 entries (decisions + journal + weekly reviews
 * combined) — the UI then shows an empty-state checklist.
 */
export function buildOperatingManual(): OperatingManual | null {
  if (typeof window === 'undefined') return null;

  const profile = readSavedProfile();
  const chartProfile = readChartProfile();
  const decisions = readStoredDecisions();
  const journal = readJournalEntries();
  const weekly = readWeeklyReviews();

  const totalEntries = decisions.length + journal.length + weekly.length;
  if (totalEntries < 3) return null;

  const identity = buildIdentityCore(profile, chartProfile);

  // Topic tally pulled from BOTH decisions + journal so the patterns reflect
  // the full surface area of what the user has been thinking about.
  const allTopics = [
    ...decisions.map((d) => ({ topic: d.topic })),
    ...journal.map((j) => ({ topic: j.topic })),
  ];
  const topicCounts = tallyTopics(allTopics);

  const sections: ManualSection[] = [
    buildIdentitySection(identity),
    buildStrengthsSection(topicCounts, weekly),
    buildGrowthEdgesSection(weekly),
    buildDecisionPatternsSection(topicCounts, journal, decisions.length),
    buildValueAnchorsSection(topicCounts),
    buildLifeOperatingPrinciplesSection(decisions, journal),
    buildOpenQuestionsSection(journal, decisions),
    buildReviewCadenceSection(weekly),
  ];

  const filledCount = sections.filter((s) => s.lines.length > 0).length;

  return {
    identity,
    sections,
    filledCount,
    totalCount: sections.length,
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Markdown serialization (for "Xuất Markdown" download)
// ---------------------------------------------------------------------------

export function serializeManualMarkdown(manual: OperatingManual): string {
  const lines: string[] = [];
  const id = manual.identity;
  const heading = id.displayName
    ? `Sổ tay cá nhân — ${id.displayName}`
    : 'Sổ tay cá nhân';
  lines.push(`# ${heading}`);
  lines.push('');

  const metaParts: string[] = [];
  if (id.birthDate) metaParts.push(`Sinh: ${formatDateVN(id.birthDate)}`);
  if (id.birthTime) metaParts.push(`Giờ: ${id.birthTime}`);
  if (id.birthPlace) metaParts.push(`Nơi: ${id.birthPlace}`);
  if (id.chartHash) metaParts.push(`Mã lá số: ${id.chartHash}`);
  if (metaParts.length) {
    lines.push(`> ${metaParts.join(' · ')}`);
    lines.push('');
  }
  lines.push(`_Tạo ngày ${formatDateTimeVN(manual.generatedAt)} · ${manual.filledCount}/${manual.totalCount} mục có dữ liệu_`);
  lines.push('');

  for (const s of manual.sections) {
    lines.push(`## ${s.title}`);
    lines.push('');
    if (s.lines.length === 0) {
      lines.push('_(Chưa đủ dữ liệu — mục này sẽ được điền khi bạn dùng thêm.)_');
    } else if (s.kind === 'list' || s.kind === 'quotes') {
      for (const ln of s.lines) {
        lines.push(`- ${ln}`);
      }
    } else {
      for (const ln of s.lines) {
        lines.push(ln);
        lines.push('');
      }
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('Sổ tay này được tổng hợp từ dữ liệu chính bạn nhập trên hieu.asia.');
  lines.push('Không có AI sinh nội dung — đây là chính lời của bạn được sắp xếp lại.');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Date formatting helpers (kept local; we don't pull from vn-date to avoid
// dragging server-only deps into client bundles).
// ---------------------------------------------------------------------------

function formatDateVN(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function formatDateTimeVN(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}
