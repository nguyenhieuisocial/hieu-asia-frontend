import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, BookOpen, Cpu, GitBranch, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Phương pháp luận: hieu.asia làm gì, AI làm gì, người dùng làm gì',
  description:
    'Trang Methodology — cách hieu.asia kết hợp Tử Vi, Bát Tự, Thần Số Học, MBTI và AI Mentor; AI làm phần nào, không làm phần nào, con người kiểm duyệt gì.',
  alternates: { canonical: 'https://hieu.asia/methodology' },
  openGraph: {
    title: 'Phương pháp luận · hieu.asia',
    description: 'Cách hieu.asia kết hợp cổ học + AI và lằn ranh không vượt qua.',
    url: 'https://hieu.asia/methodology',
    type: 'article',
  },
};

const SECTIONS: { id: string; title: string; body: string[] }[] = [
  {
    id: 'data',
    title: 'Dữ liệu hieu.asia dùng để luận lá số',
    body: [
      'Tử Vi Đẩu Số: ngày–tháng–năm–giờ–nơi sinh, theo trường phái Bắc phái 114 sao. Hệ thống an Mệnh, Thân, 12 cung, chính tinh, phụ tinh, tứ hóa, đại vận, lưu niên.',
      'Bát Tự Tứ Trụ (làm sau khi lõi Tử Vi ổn): Thiên Can – Địa Chi cho năm, tháng, ngày, giờ; ngũ hành nạp âm.',
      'Thần Số Học: ngày sinh + họ tên đầy đủ để tính số chủ đạo, số linh hồn, số sứ mệnh, năm cá nhân.',
      'MBTI: kết quả bài khảo sát ngắn (16 nhóm) nếu user chọn cung cấp.',
      'Palm Reading (tùy chọn): ảnh bàn tay user tự upload — phân tích đường chính, KHÔNG chẩn đoán bệnh, KHÔNG dự đoán nguy cơ.',
    ],
  },
  {
    id: 'ai-role',
    title: 'AI làm phần nào — không làm phần nào',
    body: [
      'AI LÀM: ghép số liệu lá số với khuôn khổ luận cổ truyền; sinh diễn giải bằng tiếng Việt; gợi ý câu hỏi tự phản tư; xếp lịch hành động 30-60-90 ngày dựa trên đại vận và lưu niên.',
      'AI KHÔNG LÀM: chẩn đoán y tế, kê thuốc, dự đoán cái chết hoặc tai nạn cụ thể; tư vấn đầu tư cá nhân hoặc giao dịch tài chính cụ thể; phán hôn nhân kiểu "nên chia tay ngay/nên cưới ngay"; phân tích bên thứ ba khi không có sự đồng ý.',
      'AI KHÔNG QUYẾT ĐỊNH THAY USER: mọi luận giải đều có 2–3 kịch bản, kèm điều kiện kiểm chứng. User chọn — hieu.asia chỉ là góc nhìn.',
    ],
  },
  {
    id: 'verification',
    title: 'Cách hệ thống kiểm chứng kết luận',
    body: [
      'Mỗi cung luận có nút "Vì sao kết luận này?" — hệ thống chỉ rõ cung, sao, tứ hóa, đại vận làm cơ sở.',
      'Lá số xuất từ engine deterministic (114 sao theo trường phái Bắc phái); không có ngẫu nhiên AI ở bước an sao.',
      'AI Mentor đọc structured chart, không đoán từ ngữ cảnh trống.',
      'Mỗi lần thay giờ sinh ±15 phút, hệ thống hiện cảnh báo nếu kết quả đổi đáng kể (gần ranh giờ Tý).',
      'Confidence score nội bộ giảm khi user không chắc giờ sinh — Mentor sẽ hỏi lại thay vì "đoán cứng".',
    ],
  },
  {
    id: 'human',
    title: 'Phần con người kiểm duyệt',
    body: [
      'Bộ quy tắc Safety Boundary Guard chặn các kết luận nguy hiểm: y tế, pháp lý, tài chính cá nhân, hôn nhân, dự đoán mất mát.',
      'Mẫu prompt được review trước khi đẩy production; mọi thay đổi prompt được log version để rollback được.',
      'Mọi report sai/khó hiểu có nút Báo lỗi — đội biên tập đọc và cập nhật template.',
      'Khi AI phát hiện mâu thuẫn (cung Quan tốt nhưng Tài căng), Contradiction Resolver sẽ giải thích thay vì che giấu.',
    ],
  },
  {
    id: 'limits',
    title: 'Giới hạn hieu.asia muốn nói rõ',
    body: [
      'Tử Vi không phải khoa học định mệnh. Nó là một bản đồ tham khảo về thiên hướng cá nhân, không phải lời tiên tri.',
      'AI không thay được chuyên gia y tế, luật sư hoặc cố vấn tài chính có chứng chỉ — nếu vấn đề nghiêm trọng, hãy gặp chuyên gia.',
      'Palm Reading có giới hạn — ảnh bàn tay không thể thay khám sức khỏe; ảnh bị blur hoặc thiếu ánh sáng có thể cho kết quả không đáng tin.',
      'Đại vận và lưu niên là khung tham chiếu, không phải đáp án — môi trường, lựa chọn cá nhân và rủi ro hệ thống vẫn quyết định kết quả thực tế.',
      'MBTI là công cụ tự phản tư, không phải phân loại tuyệt đối — kết quả thay đổi theo trạng thái sống.',
    ],
  },
  {
    id: 'versions',
    title: 'Lịch sử thay đổi thuật toán & prompt',
    body: [
      'Engine an sao Tử Vi: v2 (iztro) — 114 sao Bắc phái, có jiazi, jiansha, tianma, trường sinh 12, bác sĩ 12; bao gồm đại vận, lưu niên, lưu nguyệt.',
      'Lunar calendar: thuật toán Hồ Ngọc Đức (1900–2199) + cross-check qua @dqcai/vn-lunar (đã patch typo "Bính Ngọ" tại wrapper).',
      'AI model chính: Claude Opus cho Mentor; fallback OpenAI cho embedding/RAG.',
      'Prompt version được log với mỗi report — bạn có thể xem ở footer report.',
    ],
  },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Phương pháp luận', item: 'https://hieu.asia/methodology' },
  ],
};

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Phương pháp luận hieu.asia',
  description: 'Cách hieu.asia kết hợp Tử Vi + AI và lằn ranh trách nhiệm.',
  inLanguage: 'vi-VN',
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/70">Phương pháp luận</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Methodology
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-5xl">
            Cách hieu.asia luận, kiểm chứng và đặt giới hạn
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg">
            hieu.asia không phải web xem bói. Đây là bản đồ tham chiếu kết hợp Tử Vi, Bát
            Tự, Thần Số Học, MBTI và AI Mentor — để bạn hiểu mình rõ hơn trước khi tự ra
            quyết định. Trang này nói rõ AI làm gì, không làm gì, và phần nào con người
            kiểm duyệt.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold/90">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Privacy-first
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink/40 px-3 py-1 text-cream/75">
              <BookOpen className="h-3.5 w-3.5" aria-hidden /> Tử Vi Bắc phái 114 sao
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink/40 px-3 py-1 text-cream/75">
              <Cpu className="h-3.5 w-3.5" aria-hidden /> Claude + GPT + Gemini
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink/40 px-3 py-1 text-cream/75">
              <GitBranch className="h-3.5 w-3.5" aria-hidden /> Versioned prompts
            </span>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="space-y-6">
            {SECTIONS.map((s) => (
              <Card key={s.id} id={s.id} className="border-cream/10 bg-ink/40">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-10 border-amber-700/40 bg-amber-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg text-amber-200 sm:text-xl">
                <AlertTriangle className="h-5 w-5" aria-hidden /> Khi nào hieu.asia sẽ từ chối
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-amber-100/90">
              <p>Mentor sẽ KHÔNG trả lời các câu kiểu:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>"Tôi có nên bỏ thuốc/điều trị không?"</li>
                <li>"Tôi có nên all-in đầu tư vào X không?"</li>
                <li>"Người này có chắc phản bội tôi không?"</li>
                <li>"Tôi có chết năm nay không?"</li>
                <li>"Có nên ly hôn ngay không?"</li>
              </ul>
              <p>
                Trong các trường hợp này, Mentor sẽ hỏi lại bối cảnh, tách cảm xúc khỏi
                dữ kiện, và đề xuất bước kiểm chứng — không quyết định thay bạn.
              </p>
            </CardContent>
          </Card>

          <div className="mt-10 rounded-xl border border-cream/10 bg-ink/40 p-5 text-sm leading-relaxed text-cream/75">
            <p>
              Có thắc mắc về phương pháp?{' '}
              <a className="text-gold underline-offset-4 hover:underline" href="mailto:methodology@hieu.asia">
                methodology@hieu.asia
              </a>
              . Sample report công khai tại{' '}
              <Link href="/sample-report" className="text-gold underline-offset-4 hover:underline">
                /sample-report
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
