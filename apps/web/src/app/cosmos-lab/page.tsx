import type { Metadata } from 'next';
import { CosmosOracle } from './CosmosOracle';
import { ThemeWorlds } from './ThemeWorlds';
import { ConstellationDivider } from './ConstellationDivider';

/**
 * /cosmos-lab — DEMO NỘI BỘ (noindex) cho 2 nhóm ý tưởng:
 *   Nhóm 2 (tương tác/oracle): bản đồ sao chạm-được + "Hỏi vũ trụ".
 *   Nhóm 4 (lan toả cả site): vạch ngăn chòm sao + "hai thế giới" light/dark.
 * Câu trả lời oracle là MẪU — chưa nối AI Mentor thật.
 */
export const metadata: Metadata = {
  title: 'Cosmos Lab — demo Nhóm 2 & 4 (nội bộ)',
  robots: { index: false, follow: false },
};

const SERIF = "'Newsreader', Georgia, serif";

export default function CosmosLabPage() {
  return (
    <main style={{ background: '#F3ECDD', color: '#171411' }}>
      {/* ───────── Nhóm 2 ───────── */}
      <CosmosOracle />

      {/* ───────── Nhóm 4 ───────── */}
      <section className="mx-auto max-w-3xl px-6 pt-20">
        <p className="font-mono uppercase" style={{ color: '#A47532', fontSize: 12, letterSpacing: '0.26em' }}>
          Nhóm 4 · Lan toả cả site
        </p>
        <h2 className="mt-3 font-light" style={{ fontFamily: SERIF, fontSize: 'clamp(26px,4.5vw,44px)', lineHeight: 1.1 }}>
          Sợi vũ trụ xuyên suốt trang —{' '}
          <span style={{ color: '#A47532', fontStyle: 'italic' }}>và hai thế giới</span>.
        </h2>
        <p className="mt-4" style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif", fontSize: 16.5, lineHeight: 1.65, color: '#4d463d' }}>
          Một chỉ dấu chòm sao mảnh đặt giữa các khối nội dung giúp tông &ldquo;vũ trụ&rdquo;
          chạy xuyên suốt trang giấy ấm — khâu liền cảm giác giữa hero tối và phần editorial.
          Cuộn xuống để thấy vạch ngăn tự vẽ.
        </p>
      </section>

      {/* Mock section A → divider → mock section B (để thấy vạch ngăn trong ngữ cảnh) */}
      <section className="mx-auto max-w-3xl px-6 pt-16">
        <h3 className="font-light" style={{ fontFamily: SERIF, fontSize: 26 }}>Bốn ống kính, một bức tranh</h3>
        <p className="mt-3" style={{ fontSize: 16, lineHeight: 1.65, color: '#4d463d' }}>
          Tử Vi, Bát Tự, Thần Số Học và MBTI — bốn góc nhìn cổ-kim được AI tổng hợp thành một
          bản đồ duy nhất về bạn.
        </p>
      </section>

      <ConstellationDivider tone="light" />

      <section className="mx-auto max-w-3xl px-6 pb-4">
        <h3 className="font-light" style={{ fontFamily: SERIF, fontSize: 26 }}>Bạn đọc, bạn hiểu, bạn quyết</h3>
        <p className="mt-3" style={{ fontSize: 16, lineHeight: 1.65, color: '#4d463d' }}>
          Không phán xét, không bói toán. hieu.asia trình bày rõ ràng để bạn tự ra quyết định
          có trách nhiệm.
        </p>
      </section>

      {/* Hai thế giới light/dark */}
      <ThemeWorlds />

      <div className="px-6 pb-24 pt-4 text-center">
        <a href="/cosmos" className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.16em', color: '#A47532' }}>
          ← Về hero Vũ trụ (/cosmos)
        </a>
      </div>
    </main>
  );
}
