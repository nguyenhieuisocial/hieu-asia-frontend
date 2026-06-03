import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { InfographicMBTI } from '@/components/learn/InfographicMBTI';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';

export const metadata: Metadata = {
  title: 'MBTI 16 loại tính cách — Học huyền học',
  description:
    'MBTI dựa trên 4 trục: Hướng nội/ngoại (I/E), Trực giác/Cảm nhận (N/S), Lý trí/Cảm xúc (T/F), Nguyên tắc/Linh hoạt (J/P) — 16 nhóm tính cách.',
  alternates: { canonical: 'https://hieu.asia/learn/mbti' },
};

export default function LearnMBTIPage() {
  return (
    <LearnArticle
      eyebrow="Tây phương · Carl Jung"
      title={
        <>
          MBTI — <span className="bg-gold-gradient bg-clip-text text-transparent">16 loại tính cách</span>
        </>
      }
      standfirst={
        <>
          Myers–Briggs Type Indicator phát triển từ thuyết tâm lý của Carl Jung. 4 trục lưỡng
          cực tạo nên 16 nhóm tính cách — không phải "ô đóng", mà là thiên hướng tự nhiên.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'MBTI' },
      ]}
      relatedLenses={relatedLearnLenses('mbti')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Trả lời bộ câu hỏi MBTI khoảng 5 phút để xem 1 trong 16 nhóm tính cách phù hợp với thiên hướng tự nhiên của bạn.',
        href: '/reading/new?method=mbti',
        label: 'Làm trắc nghiệm MBTI',
      }}
      sections={[
        {
          id: 'so-do-4-truc',
          tocLabel: '4 trục & 16 nhóm',
          heading: 'Sơ đồ 4 trục',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicMBTI />
            </div>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="axes" className="rounded border border-border px-4">
                <AccordionTrigger>4 trục lưỡng cực là gì?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      <strong>I / E</strong> — Hướng nội (Introvert) vs Hướng ngoại (Extravert):
                      Nguồn năng lượng đến từ một mình hay từ tương tác?
                    </li>
                    <li>
                      <strong>N / S</strong> — Trực giác (iNtuition) vs Cảm nhận (Sensing): Chú ý
                      vào khả năng, mẫu hình, hay vào chi tiết, dữ kiện?
                    </li>
                    <li>
                      <strong>T / F</strong> — Lý trí (Thinking) vs Cảm xúc (Feeling): Quyết định
                      theo logic hay theo giá trị, cảm xúc?
                    </li>
                    <li>
                      <strong>J / P</strong> — Nguyên tắc (Judging) vs Linh hoạt (Perceiving):
                      Thích đóng kế hoạch hay để mở, ứng biến?
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="quadrant" className="rounded border border-border px-4">
                <AccordionTrigger>4 nhóm lớn?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      <strong>Analysts (NT)</strong> — INTJ, INTP, ENTJ, ENTP: tư duy hệ thống.
                    </li>
                    <li>
                      <strong>Diplomats (NF)</strong> — INFJ, INFP, ENFJ, ENFP: lý tưởng, đồng cảm.
                    </li>
                    <li>
                      <strong>Sentinels (SJ)</strong> — ISTJ, ISFJ, ESTJ, ESFJ: trật tự, trách nhiệm.
                    </li>
                    <li>
                      <strong>Explorers (SP)</strong> — ISTP, ISFP, ESTP, ESFP: thực tế, linh hoạt.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="caution" className="rounded border border-border px-4">
                <AccordionTrigger>Cần lưu ý gì?</AccordionTrigger>
                <AccordionContent>
                  MBTI là khung phân loại, không phải chẩn đoán. Kết quả có thể thay đổi theo
                  giai đoạn cuộc đời. Đừng dùng MBTI để dán nhãn hay phán xét người khác — dùng
                  để hiểu cách mình vận hành tự nhiên.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="science" className="rounded border border-border px-4">
                <AccordionTrigger>MBTI có khoa học không?</AccordionTrigger>
                <AccordionContent>
                  MBTI bị nhiều nhà tâm lý học phản biện về độ tin cậy (test-retest reliability).
                  Tuy nhiên với mục đích tự phản tỉnh và đối thoại, nó vẫn là khung hữu ích — đặc
                  biệt khi kết hợp với các góc nhìn khác.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ),
        },
      ]}
    />
  );
}
