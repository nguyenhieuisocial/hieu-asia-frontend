/**
 * Architecture model for the in-admin "Sơ đồ hệ thống sống" page.
 *
 * Single source of truth for the system topology, the key data flows, and the
 * operating runbooks — grounded in vault `94 - Master Infrastructure Reference`.
 * Pure data (no JSX) so it stays testable + the page renders it. Each node that
 * maps to an admin page links there (click-through to its LIVE detail); nodes
 * with an `infraSlug` also get a live status dot fetched from /admin/infra/<slug>.
 */

export type NodeKind = 'frontend' | 'gateway' | 'data' | 'ai' | 'money' | 'observ';

export interface ArchNode {
  id: string;
  label: string;
  role: string; // one-line, plain Vietnamese
  /** Admin page to open (internal href). */
  adminHref?: string;
  /** Vendor dashboard (new tab). */
  externalHref?: string;
  /** If set, a live status dot is fetched from this infra tool's endpoint. */
  infraSlug?: string;
  /** Core node = drawn emphasized (the central gateway). */
  core?: boolean;
}

export interface ArchLayer {
  id: string;
  title: string;
  subtitle: string;
  nodes: ArchNode[];
}

/** Top→down request flow: people → gateway → data/ai → money/channels → telemetry. */
export const ARCH_LAYERS: ArchLayer[] = [
  {
    id: 'frontend',
    title: 'Giao diện (người dùng thấy)',
    subtitle: 'Next.js / Vite trên Vercel',
    nodes: [
      { id: 'web', label: 'Web khách', role: 'hieu.asia — nơi khách xem & mua lá số', externalHref: 'https://hieu.asia' },
      { id: 'admin', label: 'Admin', role: 'admin.hieu.asia — bảng điều khiển vận hành', adminHref: '/' },
      { id: 'mini-tg', label: 'Miniapp Telegram', role: 'WebApp trong Telegram', externalHref: 'https://t.me/hieuasiabot' },
      { id: 'mini-zalo', label: 'Miniapp Zalo', role: 'WebApp trong Zalo' },
    ],
  },
  {
    id: 'gateway',
    title: 'Cổng & Định tuyến (bộ não)',
    subtitle: 'Cloudflare Workers',
    nodes: [
      {
        id: 'worker',
        label: 'Worker API · api.hieu.asia',
        role: 'Cổng trung tâm: mọi /admin /reading /payment /tools /content /ai đi qua đây',
        adminHref: '/system',
        infraSlug: 'cloudflare',
        core: true,
      },
      { id: 'iztro', label: 'Sub-worker Iztro', role: 'Tính Tử Vi 114 sao (gọi nội bộ qua service binding)' },
      { id: 'proxy', label: '3 Proxy workers', role: 'Định tuyến admin / miniapp / www' },
    ],
  },
  {
    id: 'data',
    title: 'Dữ liệu',
    subtitle: 'Supabase + Cloudflare storage',
    nodes: [
      { id: 'pg', label: 'Postgres (hieu_asia)', role: 'Lá số, người dùng, giao dịch, affiliate, audit…', adminHref: '/infra/supabase', infraSlug: 'supabase' },
      { id: 'kv', label: 'KV (SESSIONS/CACHE/AFFILIATES)', role: 'Phiên đọc, idempotency, hàng đợi, affiliate', adminHref: '/infra/kv', infraSlug: 'kv' },
      { id: 'r2', label: 'R2 (uploads)', role: 'Ảnh tay/mặt (TTL 7 ngày) + PDF Cẩm Nang' },
      { id: 'edge', label: 'Edge Functions (Deno)', role: 'reading-orchestrate · telegram-webhook · export/erase · notify…', externalHref: 'https://supabase.com/dashboard' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Tri thức',
    subtitle: 'Nơi "đọc" lá số',
    nodes: [
      { id: 'llm', label: 'Cổng LLM (đa nhà-cung-cấp)', role: 'Anthropic / OpenAI / Google / Workers-AI (dự phòng)', adminHref: '/llm-spend', infraSlug: 'ai-gateway' },
      { id: 'langfuse', label: 'Langfuse', role: 'Theo dõi chi phí + chất lượng từng lần gọi LLM', adminHref: '/infra/langfuse', infraSlug: 'langfuse' },
      { id: 'rag', label: 'RAG (cổ thư)', role: 'Kho tri thức tử vi/bát tự để dẫn chứng', adminHref: '/rag' },
      { id: 'browser', label: 'Browser Rendering', role: 'Dựng PDF Cẩm Nang (Cloudflare)' },
    ],
  },
  {
    id: 'money',
    title: 'Tiền & Kênh',
    subtitle: 'Thu tiền + nói chuyện với khách',
    nodes: [
      { id: 'sepay', label: 'SePay (QR ngân hàng)', role: 'Thu tiền qua QR + webhook báo "đã trả"', adminHref: '/sepay' },
      { id: 'tg', label: '3 Bot Telegram', role: 'public @hieuasiabot · báo @Thongbaotuvi_bot · admin @ad_hieuasia_bot', adminHref: '/infra/telegram', infraSlug: 'telegram' },
      { id: 'resend', label: 'Resend (email)', role: 'Gửi email giao dịch + newsletter', adminHref: '/infra/resend', infraSlug: 'resend' },
    ],
  },
  {
    id: 'observ',
    title: 'Đo lường & Vận hành',
    subtitle: 'Biết chuyện gì đang xảy ra',
    nodes: [
      { id: 'posthog', label: 'PostHog', role: 'Lưu lượng, hành vi, phễu, replay, heatmap', adminHref: '/posthog' },
      { id: 'sentry', label: 'Sentry', role: 'Lỗi chưa xử lý', adminHref: '/infra/sentry', infraSlug: 'sentry' },
      { id: 'uptime', label: 'Uptime', role: 'Giám sát sống/chết FE + API (BetterStack)', adminHref: '/infra/uptime', infraSlug: 'uptime' },
      { id: 'gh', label: 'GitHub Actions', role: 'CI + tự deploy worker', adminHref: '/infra/github', infraSlug: 'github' },
      { id: 'vercel', label: 'Vercel', role: 'Deploy web + admin', adminHref: '/infra/vercel', infraSlug: 'vercel' },
    ],
  },
];

export interface ArchFlow {
  id: string;
  title: string;
  subtitle: string;
  steps: string[];
}

export const ARCH_FLOWS: ArchFlow[] = [
  {
    id: 'reading',
    title: 'Một lá số ra đời',
    subtitle: 'từ lúc nhập ngày sinh đến khi khách đọc',
    steps: [
      'Khách nhập ngày/giờ sinh trên web hoặc miniapp',
      'reading-create (Edge Function) tạo phiên đọc',
      'reading-orchestrate (Edge Function, 2 pha) điều phối',
      'Worker /ai gọi Cổng LLM (qua Iztro nếu là Tử Vi)',
      'Chấm "không bói mù" — chặn ảo-tưởng/Barnum trước khi trả',
      'Lưu phiên vào Postgres + KV',
      '(Trả phí) Dựng PDF Cẩm Nang qua Browser Rendering → R2',
      'Khách xem kết quả',
    ],
  },
  {
    id: 'payment',
    title: 'Một đồng tiền vào',
    subtitle: 'từ QR đến mở khoá + hoa hồng',
    steps: [
      'Khách bấm mua → Worker /payment/intent tạo yêu cầu',
      'Hiện QR SePay (ngân hàng VN)',
      'Khách quét & chuyển khoản',
      'SePay bắn webhook "đã trả" về Worker',
      'Worker mở khoá tính năng + ghi transaction',
      'Tính hoa hồng affiliate (nếu có người giới thiệu)',
    ],
  },
  {
    id: 'daily',
    title: 'Tử Vi hằng ngày tự chạy',
    subtitle: 'cron, không cần ai bấm',
    steps: [
      'Cron 06:00 (VN) trong Worker kích hoạt',
      'Sinh lá số ngày + nội dung',
      'Đẩy ra web + bot Telegram cho người theo dõi',
    ],
  },
];

export interface Runbook {
  id: string;
  title: string;
  when: string;
  steps: string[];
}

export const RUNBOOKS: Runbook[] = [
  {
    id: 'stuck-reading',
    title: 'Lá số khách bị kẹt (đã trả tiền nhưng chưa ra)',
    when: 'Khi có cảnh báo hàng đợi, hoặc khách báo chờ lâu',
    steps: [
      'Mở Phiên phân tích (/sessions) hoặc Chất lượng AI → mục báo-cáo-kẹt',
      'Xem phiên kẹt: do model lỗi, hàng đợi đầy, hay SePay chậm?',
      'Bấm "Chạy lại pipeline" cho phiên đó',
      'Nếu model lỗi: kiểm /llm-spend + AI Gateway (có thể hết tiền)',
      'Nếu vẫn kẹt: cân nhắc hoàn tiền + nhắn khách',
    ],
  },
  {
    id: 'refund',
    title: 'Hoàn tiền cho khách',
    when: 'Khách yêu cầu, hoặc lá số lỗi không sửa được',
    steps: [
      'Mở SePay đối soát (/sepay) hoặc Thanh toán (/payments)',
      'Tìm giao dịch theo mã / email / số tiền',
      'Bấm duyệt hoàn — luôn cần xác nhận (việc đụng tiền)',
      'Xác nhận đã chuyển khoản hoàn ở phía ngân hàng/SePay',
    ],
  },
  {
    id: 'ai-out-of-funds',
    title: 'Cổng AI hết tiền (báo cáo bị nông/sáo rỗng)',
    when: 'Có cảnh báo số dư AI < ngưỡng, hoặc văn báo cáo kém',
    steps: [
      'Dấu hiệu: cảnh báo Telegram số-dư-AI, hoặc /llm-spend cho thấy toàn model free',
      'NẠP TIỀN Vercel AI Gateway (việc của founder — không phải code)',
      'Kiểm lại /llm-spend + /infra/ai-gateway xem balance đã dương',
      'Báo cáo flagship sẽ tự dùng lại model mạnh',
    ],
  },
  {
    id: 'deploy',
    title: 'Quy trình deploy (đưa code lên mạng)',
    when: 'Sau khi gộp PR vào nhánh main',
    steps: [
      'Gộp PR → CI chạy (tsc + lint + build)',
      'Web + Admin: Vercel tự deploy (~3-5 phút) — kiểm /infra/vercel',
      'Worker: GitHub Action tự deploy lên Cloudflare — kiểm /infra/github',
      'Xác nhận trang thật + /system "đang kết nối"',
    ],
  },
  {
    id: 'affiliate-fraud',
    title: 'Nghi gian lận affiliate',
    when: 'Có cảnh báo chargeback cao / payout lệch / đăng ký bất thường',
    steps: [
      'Mở Affiliate → mục Fraud (/affiliates/fraud)',
      'Xem tỉ lệ hoàn tiền, độ lệch payout, IP đăng ký',
      'Đóng băng payout đang chờ để soát',
      'Nếu gian lận: thu hồi (clawback) — mọi thao tác đụng tiền cần xác nhận',
    ],
  },
  {
    id: 'outage',
    title: 'Sự cố mất kết nối / hệ thống chậm',
    when: 'Cảnh báo uptime, hoặc trang không tải',
    steps: [
      'Mở Trạng thái hệ thống (/system) — xem nút nào đỏ',
      'Kiểm Worker /infra/cloudflare (tỉ lệ lỗi) + Sentry (/infra/sentry)',
      'Nếu Worker chết: xem GitHub Action deploy gần nhất có hỏng không',
      'Nếu Supabase/SePay: kiểm trang gốc của họ (link "mở trang gốc")',
    ],
  },
];

/**
 * Directed connections between nodes for the interactive (React Flow) map.
 * Worker-centric — the gateway is the hub almost everything flows through.
 * kind: flow = request/data path · deploy = CI ships code · monitor = telemetry.
 */
export interface ArchEdge {
  source: string;
  target: string;
  label?: string;
  kind?: 'flow' | 'deploy' | 'monitor';
}

export const ARCH_EDGES: ArchEdge[] = [
  // Giao diện → Worker (mọi request đi qua cổng)
  { source: 'web', target: 'worker', kind: 'flow' },
  { source: 'admin', target: 'worker', kind: 'flow' },
  { source: 'mini-tg', target: 'worker', kind: 'flow' },
  { source: 'mini-zalo', target: 'worker', kind: 'flow' },
  // Worker → nội bộ + dữ liệu
  { source: 'worker', target: 'iztro', label: 'Tử Vi', kind: 'flow' },
  { source: 'worker', target: 'pg', kind: 'flow' },
  { source: 'worker', target: 'kv', kind: 'flow' },
  { source: 'worker', target: 'r2', kind: 'flow' },
  { source: 'worker', target: 'edge', kind: 'flow' },
  // Worker → AI
  { source: 'worker', target: 'llm', kind: 'flow' },
  { source: 'worker', target: 'rag', kind: 'flow' },
  { source: 'worker', target: 'browser', label: 'PDF', kind: 'flow' },
  { source: 'llm', target: 'langfuse', label: 'traces', kind: 'monitor' },
  // Worker → tiền & kênh
  { source: 'worker', target: 'sepay', label: 'QR + webhook', kind: 'flow' },
  { source: 'worker', target: 'tg', kind: 'flow' },
  { source: 'worker', target: 'resend', kind: 'flow' },
  // Đo lường & deploy (đứt nét)
  { source: 'worker', target: 'sentry', label: 'lỗi', kind: 'monitor' },
  { source: 'web', target: 'posthog', label: 'hành vi', kind: 'monitor' },
  { source: 'uptime', target: 'worker', label: 'ping', kind: 'monitor' },
  { source: 'vercel', target: 'admin', label: 'deploy', kind: 'deploy' },
  { source: 'gh', target: 'worker', label: 'deploy', kind: 'deploy' },
];

/**
 * Scheduled operations — the worker cron jobs (the system's "autopilot").
 * Grounded in api-gateway `scheduled()` + telegram-digest.ts. Admin previously
 * had zero visibility into these — this is the legibility layer (what runs, when,
 * what it does, which Telegram topic it alerts). Run-history (did each fire OK)
 * is a future layer once the worker records per-run state.
 */
export interface ScheduledOp {
  name: string;
  fn: string; // worker function name (grounding reference)
  does: string;
  topic?: string; // Telegram topic the alert posts to
}
export interface ScheduleGroup {
  id: string;
  schedule: string; // human-readable
  cron: string; // cron expression
  ops: ScheduledOp[];
}

export const SCHEDULED_OPS: ScheduleGroup[] = [
  {
    id: 'q15',
    schedule: 'Mỗi 15 phút',
    cron: '*/15 * * * *',
    ops: [
      {
        name: 'Đối soát mở-khóa trả-phí',
        fn: 'reconcileUnlockedSessions',
        does: 'Phiên đã trả tiền (KV) nhưng cờ is_paid chưa ghi kịp → tự đồng-bộ lại trong ≤15 phút, không để khách bị khóa oan.',
      },
    ],
  },
  {
    id: 'hourly',
    schedule: 'Mỗi giờ',
    cron: '0 * * * *',
    ops: [
      { name: 'Dò bất thường', fn: 'checkAnomalies', does: 'Lỗi / đăng-ký / chi-phí-AI tăng đột-biến so với nền.' },
      { name: 'Khách mới', fn: 'notifyNewUsers', does: 'Báo có người dùng mới đăng-ký.', topic: 'user' },
      { name: 'Lỗi mới', fn: 'notifyNewErrors', does: 'Lỗi Sentry mới phát-sinh.', topic: 'bug' },
      { name: 'Bản ship mới', fn: 'notifyShips', does: 'Có deploy / tính-năng mới lên mạng.', topic: 'update' },
      { name: 'Góp ý mới', fn: 'notifyNewFeedback', does: 'Khách gửi góp-ý / phản-hồi mới.', topic: 'feedback' },
      { name: 'Thao tác admin mới', fn: 'notifyNewAudit', does: 'Có thao-tác admin mới ghi vào nhật-ký.', topic: 'security' },
      { name: 'Thanh toán bỏ dở', fn: 'notifyAbandonedPayments', does: 'Đơn còn treo chưa trả → nhắc để thu-hồi doanh-thu.', topic: 'revenue' },
      { name: 'CTV mới', fn: 'notifyNewAffiliates', does: 'Cộng-tác-viên affiliate mới đăng-ký.', topic: 'affiliate' },
      { name: 'Yêu cầu rút hoa-hồng', fn: 'notifyPayoutRequests', does: 'Có yêu-cầu rút hoa-hồng đang chờ duyệt.', topic: 'affiliate' },
      { name: 'Nội dung mới đăng', fn: 'notifyContentPublished', does: 'Bài/nội-dung vừa được publish.', topic: 'marketing' },
      { name: 'Gói sắp hết hạn', fn: 'notifyExpiringSubscriptions', does: 'Gói thuê-bao hết hạn trong 3 ngày hoặc vừa hết.', topic: 'revenue' },
      { name: 'Lá số bị kẹt', fn: 'notifyStuckReadings', does: 'Lá-số khách (đã trả tiền) chờ quá lâu — cảnh-báo SLA lõi sản-phẩm.', topic: 'health' },
      { name: 'Công-tắc người-chết', fn: 'monitorAlertHealth', does: 'Kiểm chính các cảnh-báo trên có còn chạy không (chống "im-lặng giả").', topic: 'health' },
      { name: 'Số dư cổng AI', fn: 'monitorAiBalance', does: 'Cảnh-báo TRƯỚC khi cổng AI hết tiền.', topic: 'ai' },
      { name: 'Uptime FE + API', fn: 'monitorUptime', does: 'Ping web + API, báo khi sập / khi hồi.', topic: 'health' },
      { name: 'Dung lượng KV + R2', fn: 'monitorStorage', does: 'Cảnh-báo khi KV/R2 dùng ≥80% hạn-mức free.', topic: 'resource' },
      { name: 'Sức khỏe nhà-cung-cấp AI', fn: 'monitorProviderHealth', does: 'Báo nếu một vendor AI mất credential cuối-cùng.', topic: 'ai' },
    ],
  },
  {
    id: 'morning',
    schedule: 'Hằng ngày · 10h sáng',
    cron: '0 3 * * *',
    ops: [
      { name: 'Bản tin sáng', fn: 'sendDigest("morning")', does: 'Tổng-hợp đêm qua: user / doanh-thu / lỗi / lá-số.' },
      { name: 'Tóm tắt AI cho founder', fn: 'sendAiBriefing', does: 'Tóm-tắt bằng ngôn-ngữ thường, AI viết.' },
      { name: 'Bản tin tài chính SePay', fn: 'sendSepayDigest', does: 'Đối-soát thu-chi SePay → nhóm tài-chính.', topic: 'revenue' },
    ],
  },
  {
    id: 'evening',
    schedule: 'Hằng ngày · 20h tối',
    cron: '0 13 * * *',
    ops: [{ name: 'Bản tin chiều', fn: 'sendDigest("evening")', does: 'Tổng-hợp trong ngày.' }],
  },
  {
    id: 'nightly',
    schedule: 'Hằng đêm · 1h sáng',
    cron: '0 18 * * *',
    ops: [
      {
        name: 'Chấm điểm Mentor (eval đêm)',
        fn: 'runNightlyEval',
        does: '100 persona × 3 giám-khảo đa-LLM → lưu eval_runs; báo nếu điểm TB < 8.5 hoặc > 10 lỗi (canh "không bói mù").',
        topic: 'ai',
      },
    ],
  },
  {
    id: 'weekly',
    schedule: 'Hằng tuần · Thứ 2, 9h sáng',
    cron: '0 2 * * 1',
    ops: [{ name: 'Bản tin tuần (cockpit)', fn: 'sendWeeklyDigest', does: 'Tổng-kết tuần cho founder.' }],
  },
];

/**
 * RBAC / safety model — grounded in admin-proxy `requiredRank()` + ROLE_RANK.
 * The permission ladder is enforced in code but had no admin-visible reference;
 * this documents who-can-do-what + the owner-only sensitive actions, so the
 * safety posture is legible (and onboarding a teammate is safe).
 * Keep in sync with apps/admin/src/app/api/admin-proxy/[...path]/route.ts.
 */
export interface RbacRole {
  role: 'viewer' | 'admin' | 'owner';
  rank: number;
  can: string;
}
export const RBAC_ROLES: RbacRole[] = [
  { role: 'viewer', rank: 0, can: 'Xem mọi dashboard (chỉ-đọc — mọi GET).' },
  { role: 'admin', rank: 1, can: 'Như viewer + mọi thao-tác sửa (thêm/sửa/xoá).' },
  { role: 'owner', rank: 2, can: 'Như admin + các hành-động nhạy-cảm bên dưới.' },
];

export interface SensitiveAction {
  name: string;
  path: string; // admin-proxy path the gate matches
  why: string;
}
/** Owner-only surfaces (requiredRank → owner): secrets, money, raw PII, comped access. */
export const OWNER_ONLY_ACTIONS: SensitiveAction[] = [
  { name: 'Bí mật production', path: 'admin/secrets', why: 'Đọc/sửa key + token thật của hệ-thống.' },
  { name: 'Hoàn tiền SePay', path: 'admin/sepay/refund', why: 'Chuyển tiền cho khách — không thể hoàn-tác.' },
  { name: 'Đối soát SePay', path: 'admin/sepay/reconcile', why: 'Ghi-đè trạng-thái thanh-toán theo ngân-hàng.' },
  { name: 'Sửa lệch SePay', path: 'admin/sepay/drift/fix', why: 'Sửa số tiền lệch giữa hệ-thống và SePay.' },
  { name: 'Xem hàng thô Supabase', path: 'admin/infra/supabase/rows', why: 'Dữ-liệu thật chưa che (PII), kể cả khi cột đã mask.' },
  { name: 'Cấp quyền trả-phí (comp)', path: 'admin/sessions/…/access', why: 'Mở khoá lá-số trả-phí miễn-phí cho một phiên.' },
];
