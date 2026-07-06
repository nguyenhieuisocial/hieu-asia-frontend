'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquareQuote, ArrowRight, RotateCcw, Send } from 'lucide-react';

/**
 * Wave 62.11 — MentorSampleInteractive (vault 138 §mentor demo free-input).
 *
 * Replaces the Wave 60.95.i 3-button scripted demo with a FREE-TEXT input
 * backed by a fixed Chi Lan ENFP persona. The 3-pill version "felt scripted"
 * (vault 138 critique: "đây là chatbot scripted, đúng cái mà FAQ đang phủ
 * nhận"). This version lets the user type anything; we match against ~8
 * decision-shape keywords client-side and return a thoughtfully-templated
 * Mentor response — no API call, no auth, no cost.
 *
 * The matcher is deliberately dumb: case-insensitive String.includes() against
 * a handful of Vietnamese keywords per template. Real Mentor on the backend
 * does semantic routing; this demo only needs to feel "Mentor reframes, not
 * prescribes" so the visitor calibrates expectation before onboarding.
 *
 * Categories (priority order — first match wins):
 *   1. CRISIS (self-harm / suicide) → hard deflection to 113 + 1900 599956
 *   2. INVESTMENT (specific financial advice) → explicit "tôi không tư vấn
 *      đầu tư" deflection
 *   3. CAREER CHANGE — "đổi nghề", "chuyển việc", "nghỉ việc"
 *   4. MARRIAGE — "kết hôn", "lấy chồng", "lấy vợ", "cưới"
 *   5. RELATIONSHIP — "yêu", "thích người", "tình cảm"
 *   6. MONEY — "tiền", "kinh doanh" (non-investment money questions)
 *   7. EMOTIONAL — "buồn", "stress", "lo lắng", "bế tắc"
 *   8. STUDY — "học", "thi", "đại học"
 *   9. FAMILY — "bố mẹ", "gia đình", "cha mẹ"
 *   0. FALLBACK — "kể thêm hoàn cảnh, điều bạn đã thử, điều bạn đang sợ"
 *
 * Persona block (fixed for all demo answers):
 *   Chi Lan, 29 tuổi · ENFP · Mệnh Hỏa · Tử Vi mẫu
 *   Disclaimer: real account personalises to caller's chart.
 *
 * Brand tokens stay aligned with the Wave 60.95.i version:
 *   bg-card border-border/30 rounded-[2px] for the persona card
 *   font-mono eyebrow + editorial-lede body for the response
 *   font-sans for the input, theme-aware day+night
 */

type TemplateId =
  | 'crisis'
  | 'investment'
  | 'career-change'
  | 'marriage'
  | 'relationship'
  | 'money'
  | 'emotional'
  | 'study'
  | 'family'
  | 'fallback';

type Template = {
  id: TemplateId;
  /** Keywords matched against lowercased user input via String.includes(). */
  keywords: string[];
  /** Mentor response — acknowledge → 3-4 reframes → write-down prompt → CTA. */
  body: React.ReactNode;
};

const SIGN_OFF = (
  <p className="mt-4 font-mono text-[13px] uppercase tracking-widest text-primary/80">
    Sẵn sàng lập lá số thật sự?{' '}
    <Link
      href="/onboarding"
      className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
    >
      → /onboarding
    </Link>
  </p>
);

const TEMPLATES: Template[] = [
  // Priority 1 — Crisis. Match before anything else.
  {
    id: 'crisis',
    keywords: [
      'tự tử',
      'tu tu',
      'tự sát',
      'tu sat',
      'tự hại',
      'tu hai',
      'chết',
      'muốn chết',
      'không muốn sống',
      'kết thúc cuộc đời',
      'cắt tay',
      'cat tay',
    ],
    body: (
      <>
        <p>
          Tôi nghe được điều bạn vừa nói, và tôi muốn dừng lại ở đây một chút.
        </p>
        <p>
          <strong className="text-foreground">
            Tôi không thay thế nhà tâm lý hoặc đường dây cấp cứu.
          </strong>{' '}
          Nếu bạn đang nguy hiểm, vui lòng gọi{' '}
          <strong className="text-foreground">113 (cấp cứu)</strong> hoặc nhắn{' '}
          <strong className="text-foreground">“help”</strong> đến{' '}
          <strong className="text-foreground">1900 599956</strong> (đường dây
          an toàn).
        </p>
        <p>
          Tôi ở đây để lắng nghe, nhưng không phải lúc khẩn cấp. Khi bạn an
          toàn rồi, tôi sẵn sàng cùng bạn nhìn lại điều đang nặng nhất.
        </p>
      </>
    ),
  },

  // Priority 2 — Investment. Match before generic "tiền".
  {
    id: 'investment',
    keywords: [
      'đầu tư',
      'dau tu',
      'chứng khoán',
      'chung khoan',
      'crypto',
      'bitcoin',
      'cổ phiếu',
      'co phieu',
      'mua đất',
      'mua dat',
      'bất động sản',
      'bat dong san',
      'forex',
    ],
    body: (
      <>
        <p>
          Tôi hiểu bạn đang muốn một câu trả lời rõ ràng cho quyết định tài
          chính.
        </p>
        <p>
          <strong className="text-foreground">
            Tôi không tư vấn đầu tư cụ thể.
          </strong>{' '}
          Lá số có thể cho thấy giai đoạn thuận hay khó, tâm lý ra quyết định
          của bạn, nhưng quyết định đầu tư cần kế toán và chuyên gia tài chính
          của bạn — không phải Tử Vi.
        </p>
        <p>Điều tôi có thể hỏi lại bạn:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>Số tiền này nếu mất hết, cuộc sống bạn có gãy không?</li>
          <li>
            Bạn đang đầu tư vì muốn giàu hơn, hay vì sợ bị bỏ lại phía sau?
          </li>
          <li>
            Quyết định này nếu hoãn 30 ngày, bạn mất gì cụ thể — hay chỉ là
            cảm giác FOMO?
          </li>
        </ul>
        <p>
          Viết câu trả lời ra giấy. Đọc lại sau 48 giờ. Câu thứ hai thường là
          câu thật nhất.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Career change.
  {
    id: 'career-change',
    keywords: [
      'đổi nghề',
      'doi nghe',
      'chuyển việc',
      'chuyen viec',
      'nghỉ việc',
      'nghi viec',
      'bỏ việc',
      'bo viec',
      'chuyển ngành',
      'chuyen nganh',
    ],
    body: (
      <>
        <p>
          Phân vân chuyển nghề là một trong những quyết định nặng nhất — không
          chỉ vì lương, mà vì danh tính.
        </p>
        <p>Trước khi quyết, bạn thử trả lời 4 câu này cho riêng mình:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Bạn muốn rời công việc cũ, hay đang muốn chạy khỏi một con
            người/môi trường cụ thể trong đó?
          </li>
          <li>
            Nghề mới bạn đang nghĩ tới — bạn đã thử nó ở dạng nhỏ chưa (side
            project, học một khoá, nói chuyện với người trong nghề)?
          </li>
          <li>
            Nếu 5 năm sau bạn vẫn ở nghề cũ, điều gì khiến bạn tiếc nhất —
            tiền, kỹ năng, hay phiên bản mình không trở thành?
          </li>
          <li>
            Quyết định này nếu hoãn 90 ngày để chuẩn bị tài chính + portfolio,
            bạn mất gì thật sự?
          </li>
        </ul>
        <p>
          Viết câu trả lời ra một trang A4, mỗi câu một đoạn ngắn. Đọc lại sau
          48 giờ. Câu nào bạn né tránh viết — câu đó quan trọng nhất.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Marriage commitment.
  {
    id: 'marriage',
    keywords: [
      'kết hôn',
      'ket hon',
      'lấy chồng',
      'lay chong',
      'lấy vợ',
      'lay vo',
      'cưới',
      'cuoi',
      'đám cưới',
      'dam cuoi',
      'cầu hôn',
      'cau hon',
    ],
    body: (
      <>
        <p>
          Cưới không phải là kết thúc một câu chuyện tình — nó là bắt đầu một
          dự án 30-40 năm.
        </p>
        <p>Bốn câu hỏi nên trả lời thẳng với chính mình:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Bạn muốn cưới người này, hay đang muốn cưới — và người này tiện
            nhất?
          </li>
          <li>
            Lần cãi nhau gần nhất, cả hai xử lý thế nào — ai xin lỗi trước, ai
            chịu nhường, hay cả hai cùng quay lại bàn?
          </li>
          <li>
            Nếu người ấy không bao giờ đổi (không bớt nóng tính, không kiếm
            nhiều tiền hơn, không quan tâm hơn) — bạn vẫn cưới chứ?
          </li>
          <li>
            Bạn có chia sẻ được với người ấy về tiền, gia đình hai bên, và con
            cái — ba chủ đề làm tan vỡ phần lớn hôn nhân?
          </li>
        </ul>
        <p>
          Viết câu trả lời cho riêng mình, không cho người ấy đọc. Câu nào bạn
          ngần ngại viết — đó là câu cần nói với họ trước khi cưới.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Relationship dynamic.
  {
    id: 'relationship',
    keywords: [
      'yêu',
      'yeu',
      'thích người',
      'thich nguoi',
      'tình cảm',
      'tinh cam',
      'người yêu',
      'nguoi yeu',
      'bạn trai',
      'ban trai',
      'bạn gái',
      'ban gai',
      'chia tay',
      'crush',
    ],
    body: (
      <>
        <p>
          Chuyện tình cảm hiếm khi là “nên hay không nên” — thường là “mình
          đang ở đâu trong nó”.
        </p>
        <p>Trước khi quyết, bạn thử nhìn lại:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Khi nghĩ về người ấy, cảm giác đầu tiên là gì — nhẹ lòng, hồi hộp,
            mệt, hay sợ?
          </li>
          <li>
            Bạn được là phiên bản mình thấy đáng quý khi ở cạnh họ, hay phải
            gồng một chút?
          </li>
          <li>
            Bạn đang muốn cảm xúc này tiếp tục, hay đang muốn không phải mất
            công bắt đầu lại với người khác?
          </li>
          <li>
            Nếu mối quan hệ này kết thúc tuần sau, điều bạn tiếc nhất là gì —
            người ấy, hay khoảng thời gian đã đầu tư?
          </li>
        </ul>
        <p>
          Viết một lá thư cho chính mình 5 năm tới — bạn muốn người ấy có còn
          trong đó không. Câu trả lời thường rõ hơn ta nghĩ.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Money — non-investment money questions.
  {
    id: 'money',
    keywords: [
      'tiền',
      'tien',
      'kinh doanh',
      'mở quán',
      'mo quan',
      'startup',
      'làm ăn',
      'lam an',
      'lương',
      'luong',
    ],
    body: (
      <>
        <p>
          Khi câu hỏi là tiền, thường câu hỏi thật ẩn dưới nó là một điều
          khác.
        </p>
        <p>Bạn thử trả lời:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Bạn đang muốn nhiều tiền hơn, hay đang muốn cảm giác kiểm soát mà
            tiền mang lại?
          </li>
          <li>
            Khoản chi nào trong tháng vừa qua bạn tiếc nhất — và nó có lặp
            lại không?
          </li>
          <li>
            Nếu kiếm gấp đôi, ba điều đầu tiên bạn làm là gì? (Câu này tiết
            lộ giá trị thật của bạn hơn bạn nghĩ.)
          </li>
          <li>
            Bạn đang né một quyết định gì bằng cách tập trung vào tiền — bỏ
            việc, đầu tư mạo hiểm, hay tránh xin gia đình giúp?
          </li>
        </ul>
        <p>
          Viết câu trả lời ra giấy, không gõ trên điện thoại. Tay viết chậm
          hơn — và trung thực hơn.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Emotional state — must include safety net for sustained low mood.
  {
    id: 'emotional',
    keywords: [
      'buồn',
      'buon',
      'stress',
      'lo lắng',
      'lo lang',
      'bế tắc',
      'be tac',
      'mệt mỏi',
      'met moi',
      'trầm cảm',
      'tram cam',
      'cô đơn',
      'co don',
    ],
    body: (
      <>
        <p>
          Tôi nghe được. Cảm giác này nặng — và bạn không phải tự gồng một
          mình.
        </p>
        <p>Trước khi tìm “giải pháp”, bạn thử dừng lại một chút:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Cảm giác này bắt đầu từ khoảng nào — một sự kiện cụ thể, hay nó
            âm ỉ lâu rồi?
          </li>
          <li>
            Hôm nào trong tuần bạn thấy đỡ nhất — và ngày đó khác gì những
            ngày còn lại?
          </li>
          <li>
            Bạn đang giấu cảm giác này với ai — và sao bạn chọn giấu họ?
          </li>
          <li>
            Nếu một người bạn thân kể với bạn đúng điều bạn đang trải qua,
            bạn sẽ nói gì với họ?
          </li>
        </ul>
        <p>
          Viết câu trả lời ra giấy, dù chỉ vài dòng. Nếu cảm giác kéo dài hơn
          2 tuần hoặc bạn thấy không vượt qua được một mình —{' '}
          <strong className="text-foreground">
            xin hãy nói chuyện với chuyên gia tâm lý hoặc bác sĩ
          </strong>
          . Tôi giúp được phần nhìn lại, không thay thế phần chăm sóc.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Study / academic planning.
  {
    id: 'study',
    keywords: [
      'học',
      'hoc',
      'thi',
      'đại học',
      'dai hoc',
      'du học',
      'du hoc',
      'cao học',
      'cao hoc',
      'thạc sĩ',
      'thac si',
      'chọn ngành',
      'chon nganh',
    ],
    body: (
      <>
        <p>
          Học tiếp hay không không phải câu hỏi về điểm — câu hỏi về định
          hướng 5-10 năm.
        </p>
        <p>Bạn thử nhìn lại:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Bạn muốn học vì thấy ngành đó hấp dẫn, hay vì chưa biết làm gì
            tiếp?
          </li>
          <li>
            Bạn đã trò chuyện với 3 người đang làm trong ngành chưa — họ nói
            ngày làm việc của họ trông thế nào?
          </li>
          <li>
            Nếu không học bằng cấp, bạn có thể tự học cùng kỹ năng đó trong
            12 tháng không (qua online, mentor, side project)?
          </li>
          <li>
            Quyết định này ai sẽ vui hơn — bạn, hay gia đình bạn? (Câu này
            quan trọng nếu chênh lệch lớn.)
          </li>
        </ul>
        <p>
          Viết câu trả lời ra giấy. Câu nào bạn cảm thấy phải biện minh nhiều
          nhất — đó là câu cần xem lại đầu tiên.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Family dynamics.
  {
    id: 'family',
    keywords: [
      'bố mẹ',
      'bo me',
      'gia đình',
      'gia dinh',
      'cha mẹ',
      'cha me',
      'ba mẹ',
      'ba me',
      'anh chị em',
      'anh chi em',
      'mẹ chồng',
      'me chong',
    ],
    body: (
      <>
        <p>
          Mối quan hệ với gia đình thường là mối quan hệ khó nhất — vì không
          chọn được, không bỏ được, và đụng đến danh tính.
        </p>
        <p>Bạn thử trả lời:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            Cụ thể, điều gì làm bạn nặng lòng nhất gần đây — một lời nói, một
            việc, hay một kỳ vọng?
          </li>
          <li>
            Bạn đang muốn họ thay đổi, hay muốn họ hiểu — hai điều này cần
            cách nói khác nhau hoàn toàn.
          </li>
          <li>
            Lần gần nhất bạn nói thật cảm giác của mình với họ là khi nào? Nếu
            chưa bao giờ, vì sao?
          </li>
          <li>
            Nếu mối quan hệ này không bao giờ tốt hơn — bạn có thể sống với
            điều đó không, hay cần tìm cách đặt khoảng cách?
          </li>
        </ul>
        <p>
          Viết câu trả lời ra giấy. Đọc lại sau 48 giờ rồi hãy quyết có nói
          chuyện với họ không — và nói cái gì.
        </p>
        {SIGN_OFF}
      </>
    ),
  },

  // Fallback — no keyword matched.
  {
    id: 'fallback',
    keywords: [],
    body: (
      <>
        <p>
          Câu hỏi này tôi cần thêm bối cảnh trước khi phản hồi đúng được.
        </p>
        <p>Bạn có thể kể thêm:</p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            <strong className="text-foreground">Hoàn cảnh hiện tại</strong> —
            bạn đang ở giai đoạn nào, ai liên quan, thời gian gấp đến đâu?
          </li>
          <li>
            <strong className="text-foreground">Điều bạn đã thử</strong> — bạn
            đã làm gì, đã hỏi ai, đã thử cách nào và kết quả ra sao?
          </li>
          <li>
            <strong className="text-foreground">Điều bạn đang sợ</strong> —
            kết quả tệ nhất bạn đang né, hay điều bạn ngại phải đối mặt?
          </li>
        </ul>
        <p>
          Viết lại câu hỏi với 3 phần trên, tôi sẽ phản hồi có trọng tâm hơn.
          Mentor đọc bối cảnh, không đoán mò.
        </p>
        {SIGN_OFF}
      </>
    ),
  },
];

/**
 * Pick the first template whose keywords appear in the lowercased input.
 * Crisis + investment sit at the top so they win against generic matches like
 * "tiền" or "buồn". Fallback (empty keywords[]) always matches last.
 */
function pickTemplate(input: string): Template {
  const lower = input.toLowerCase();
  for (const t of TEMPLATES) {
    if (t.keywords.length === 0) continue;
    if (t.keywords.some((k) => lower.includes(k))) return t;
  }
  return TEMPLATES[TEMPLATES.length - 1]!; // fallback
}

export function MentorSampleInteractive() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState<{
    question: string;
    template: Template;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setSubmitted({ question: trimmed, template: pickTemplate(trimmed) });
  };

  const handleReset = () => {
    setSubmitted(null);
    setInput('');
  };

  return (
    <section
      aria-label="Thử Mentor AI — nhập câu hỏi tự do trên persona mẫu"
      className="bg-muted/50 py-12 md:py-14"
    >
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-marketing-tight text-center">
          <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
            — THỬ MENTOR AI
          </p>
          <h2 className="text-balance font-sans text-section-display font-bold tracking-tight leading-tight text-foreground">
            Hỏi Mentor{' '}
            <em className="italic text-primary/80">bất cứ điều gì</em>
            <span className="text-primary">.</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Demo này trả lời trên một persona mẫu cố định. Không cần đăng ký,
            không tốn lượt hỏi.
          </p>
        </div>

        {/* Persona card — fixed Chi Lan ENFP for demo */}
        <div className="mx-auto mt-10 max-w-marketing-tight">
          <p className="mb-2 font-mono text-[12px] uppercase tracking-widest text-muted-foreground">
            BƯỚC 01 · PERSONA MẪU
          </p>
          <div className="rounded-[2px] border border-border/30 bg-card p-5 md:p-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-sans text-lg font-semibold text-foreground">
                Chi Lan
              </span>
              <span className="font-sans text-sm text-muted-foreground">
                29 tuổi
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono text-xs uppercase tracking-wider text-primary/80">
                ENFP
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono text-xs uppercase tracking-wider text-primary/80">
                Mệnh Hỏa
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Tử Vi mẫu
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Đây là Mentor demo, trả lời theo persona giả lập. Tài khoản thật
              cá nhân hoá theo lá số của bạn — cung mệnh, đại vận, ngũ hành
              riêng.
            </p>
          </div>
        </div>

        {/* Input + response */}
        <div className="mx-auto mt-8 max-w-marketing-tight">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="mentor-demo-input"
                className="mb-2 block font-mono text-[12px] uppercase tracking-widest text-muted-foreground"
              >
                BƯỚC 02 · CÂU HỎI CỦA BẠN
              </label>
              <textarea
                id="mentor-demo-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                placeholder="VD: Tôi đang phân vân có nên đổi nghề không..."
                className="min-h-[100px] w-full rounded-[2px] border border-border/40 bg-card p-4 font-sans text-[15px] leading-relaxed text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:shadow-md focus:shadow-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[13px] text-muted-foreground">
                  Demo client-side · không gửi lên server
                </p>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-primary-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Gửi câu hỏi
                  <Send className="size-4" aria-hidden strokeWidth={2} />
                </button>
              </div>
            </form>
          ) : (
            <div aria-live="polite">
              {/* User question echo */}
              <article className="rounded-[2px] border border-border/30 bg-card p-5 md:p-6">
                <div className="mb-4 flex items-start gap-2">
                  <MessageSquareQuote
                    className="mt-0.5 size-4 shrink-0 text-primary/70"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-widest text-muted-foreground">
                      Bạn hỏi
                    </p>
                    <p className="mt-1 font-sans text-[15px] font-medium leading-snug text-foreground">
                      {submitted.question}
                    </p>
                  </div>
                </div>
                {/* Mentor response */}
                <div className="mt-5 border-t border-border/30 pt-5">
                  <p className="font-mono text-[12px] uppercase tracking-widest text-primary/80">
                    Mentor · Chi Lan persona
                  </p>
                  <div className="mt-3 space-y-3 font-editorial-display text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
                    {submitted.template.body}
                  </div>
                </div>
              </article>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-4 py-2 font-sans text-sm text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <RotateCcw className="size-3.5" aria-hidden strokeWidth={2} />
                  Hỏi câu khác
                </button>
                <p className="text-[13px] text-muted-foreground">
                  Phản hồi dựa trên persona Chi Lan · ENFP · Mệnh Hỏa
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mx-auto mt-12 max-w-marketing-tight text-center">
          <p className="mb-5 text-pretty text-sm leading-relaxed text-muted-foreground">
            Đây là demo trên persona mẫu. Mentor thật sẽ trả lời dựa trên lá
            số của bạn — cung mệnh, đại vận, ngũ hành cá nhân.
          </p>
          {/* Wave 63.4 — contextual CTA (founder review #2): after the Mentor
              demo, "ask Mentor about MY chart" not generic "Lập lá số miễn phí".
              text-ink → text-primary-foreground (AA on ochre). */}
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Hỏi Mentor về lá số của tôi
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
