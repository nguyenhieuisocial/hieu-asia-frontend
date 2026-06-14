/**
 * API types mirroring backend/core/schemas.py (Pydantic).
 *
 * Source of truth: `backend/core/schemas.py`. When backend schemas change,
 * update this file manually until `pydantic2ts` auto-gen is wired up
 * (see README in this package).
 */

// ---------- Consent / context ----------

export interface ConsentPayload {
  accepted: true;
  accepted_at?: string | null; // ISO datetime
  version?: string; // default "v1.0"
  purposes?: string[]; // default ["personalized_reading", "mentor_chat"]
}

export interface UserContext {
  birth_date: string; // YYYY-MM-DD
  birth_place?: string | null;
  gender?: 'nam' | 'nữ' | 'khác' | 'không nói' | string | null;
  timezone?: string | null; // default "Asia/Ho_Chi_Minh"
  current_job?: string | null;
  current_financial_status?: string | null;
  primary_concern?: string | null;
  personality_raw?: string | null;
}

// ---------- Reading lifecycle ----------

export interface InitialReadingRequest {
  user_id: string;
  user_context: UserContext;
  hand_image_url: string;
  consent: ConsentPayload;
}

export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface CreateReadingResponse {
  task_id: string;
  session_id: string;
  status: TaskStatus;
}

export interface ReadingStatusResponse {
  task_id: string;
  session_id: string;
  status: TaskStatus;
  error?: string | null;
  final_report_markdown?: string | null;
}

// ---------- Uploads ----------

export interface PresignedUploadRequest {
  user_id: string;
  file_ext?: 'jpg' | 'jpeg' | 'png' | 'webp';
  content_type?: string;
}

export interface PresignedUploadResponse {
  upload_url: string;
  object_name: string;
  expires_in_seconds: number;
  public_read_url?: string | null;
}

// ---------- Master report (9 tabs of StrategicActionPlan) ----------

export interface CoreInsightTheme {
  theme_name: string;
  evidence_from_disciplines: string[];
  synthesis_insight: string;
}

/**
 * Standard insight format used across all 9 tabs.
 * Format chuẩn theo spec 90:
 *   📌 Nhận định (assessment) → ⚠️ Rủi ro (risk) → 🎯 Hành động (action)
 */
export interface InsightItem {
  title?: string | null;
  assessment: string;
  risk?: string | null;
  action: string;
}

export interface ActionPlanByPeriod {
  days_30: string[];
  days_60: string[];
  days_90: string[];
}

/**
 * @deprecated Backend now returns a single Markdown blob via {@link Reading.report}.
 * Kept for legacy consumers (miniapp-telegram, `InsightCard`). New code on the web
 * app should parse `report.markdown` H2 sections directly.
 *
 * Master report. 9 tabs map 1:1 to fields here.
 *
 * Tab → Field:
 *   1. Tổng quan bản chất        → core_personality
 *   2. Điểm mạnh cốt lõi          → strengths
 *   3. Điểm mù cần chuyển hóa     → blind_spots
 *   4. Sự nghiệp / kinh doanh    → career_insights
 *   5. Tài chính / dòng tiền     → financial_insights
 *   6. Quan hệ / đội nhóm         → relationships_insights
 *   7. Dự báo năm hiện tại        → current_year_outlook + vulnerabilities + opportunities
 *   8. Kế hoạch 30-60-90 ngày     → action_plan
 *   9. Câu hỏi nên hỏi Mentor    → suggested_mentor_prompts
 */
export interface StrategicActionPlan {
  // Tab 1
  core_personality: CoreInsightTheme[];

  // Tab 2-3
  strengths: InsightItem[];
  blind_spots: InsightItem[];

  // Tab 4-6
  career_insights: InsightItem[];
  financial_insights: InsightItem[];
  relationships_insights: InsightItem[];

  // Tab 7
  current_year_outlook: string;
  current_year_vulnerabilities: InsightItem[];
  current_year_opportunities: string[];

  // Tab 8
  action_plan: ActionPlanByPeriod;

  // Tab 9
  suggested_mentor_prompts: string[];

  // Metadata + governance
  caution_flags: string[];
  deterministic_calculation_summary: Record<string, unknown>;
  retrieved_rag_snippets: Array<Record<string, unknown>>;
  confidence_notes: string[];

  // Backward-compat narrative fields (avoid using in new code).
  career_and_business_guidance: string;
  current_year_vulnerability_forecast: string;
  recommended_90_day_plan: string[];
}

// ---------- Mentor chat ----------

export interface ChatRequest {
  message: string; // 1 .. 12000 chars
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  message_count: number;
}

// ---------- Reading session (Supabase reading-get / reading-create contract) ----------

/**
 * Backend reading lifecycle state.
 *
 * Phases: vision → logic → psychology → alignment → report.
 * Each phase emits a `_pending` and `_done` transition. Terminal states:
 *   - `report_ready`     — analysis succeeded
 *   - `vision_skipped`   — user opted out of palm upload
 *   - `error_at_<phase>` — phase-specific failure
 *   - `error_internal`   — non-phase failure (queue, infra…)
 */
export type ReadingState =
  | 'pending'
  | 'vision_pending'
  | 'vision_done'
  | 'logic_pending'
  | 'logic_done'
  | 'psychology_pending'
  | 'psychology_done'
  | 'alignment_pending'
  | 'alignment_done'
  | 'report_pending'
  | 'report_ready'
  | 'vision_skipped'
  | 'error_internal'
  | `error_at_${string}`;

export interface ReadingInputs {
  birth_date?: string;
  birth_time?: string | null;
  birth_place?: string;
  gender?: string;
  primary_concern?: string;
  /** Free-form survey/display fields the web client stores alongside required inputs. */
  [key: string]: unknown;
}

export interface ReadingInsights {
  vision?: string;
  logic?: string;
  psychology?: string;
  alignment?: string;
}

/** Final markdown report — full paid version. Backend returns a single Markdown blob with H2 sections. */
export interface ReadingReportMarkdown {
  markdown: string;
}

/**
 * Locked preview — returned by reading-get (PR #134) when the report has
 * not been purchased yet. Only contains a short preview summary.
 */
export interface ReadingReportPreview {
  preview: string;
}

export interface TuviChart {
  year: string;
  month: string;
  day: string;
  hour: string;
}

/**
 * Canonical reading row as returned by `GET /api/reading/{id}` proxy
 * (Supabase Edge Function `reading-get`).
 *
 * When the report is locked (not yet purchased):
 *   - `report`   = `{ preview: "…" }` (ReadingReportPreview)
 *   - `locked`   = true
 *   - `summary`  = true
 *   - `insights` = null / undefined
 *
 * When the report is unlocked (paid):
 *   - `report`   = `{ markdown: "…" }` (ReadingReportMarkdown) — same as before
 *   - `locked`   = absent / false
 */
export interface Reading {
  id: string;
  user_id: string;
  state: ReadingState;
  inputs: ReadingInputs;
  palm_image_url?: string;
  survey_answers?: Record<string, unknown>;
  tuvi_chart?: TuviChart;
  insights?: ReadingInsights | null;
  report?: ReadingReportMarkdown | ReadingReportPreview | null;
  /** true when report has not been purchased — report contains only a preview. */
  locked?: boolean;
  /** true when the backend intentionally returns a summary/preview shape. */
  summary?: boolean;
  errors?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// ---------- Mentor chat (api.hieu.asia /ai/role/mentor contract) ----------

export type MentorRole = 'system' | 'user' | 'assistant';

export interface MentorMessage {
  role: MentorRole;
  content: string;
}

export interface MentorRequest {
  messages: MentorMessage[];
  session_id?: string;
}

export interface MentorResponse {
  ok: boolean;
  vendor?: string;
  model?: string;
  response?: string;
  error?: string;
}

// ---------- RAG ----------

export interface RagIngestRequest {
  source_id: string;
  source_title: string;
  discipline?: string; // default "general"
  chunks: string[];
  license_status?: string; // default "owned_or_licensed"
}

export interface RagSearchRequest {
  query: string;
  limit?: number; // 1..20, default 5
}

export interface RagSearchResult {
  text: string;
  score: number;
  source_id?: string;
  source_title?: string;
  discipline?: string;
  metadata?: Record<string, unknown>;
}

export interface RagSearchResponse {
  results: RagSearchResult[];
}

// ---------- Socket.IO event payloads ----------

export type ReadingProcessingEventName =
  | 'reading.running'
  | 'step:vision_started'
  | 'step:logic_started'
  | 'step:psychology_started'
  | 'step:alignment_started'
  | 'step:report_started'
  | 'reading.completed'
  | 'reading.failed'
  | 'mentor.completed'
  | 'typing';

export interface ReadingEventBase {
  task_id?: string;
  session_id: string;
}

export interface ReadingCompletedEvent extends ReadingEventBase {
  final_report_markdown?: string | null;
}

export interface ReadingFailedEvent extends ReadingEventBase {
  error: string;
}
