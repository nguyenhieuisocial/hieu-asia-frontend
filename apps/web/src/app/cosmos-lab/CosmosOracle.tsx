'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

/**
 * CosmosOracle — DEMO Nhóm 2 (tương tác / oracle) cho hieu.asia.
 *
 * - Nền cosmos (InkCosmos, ambient → mandala 12 cung kết sẵn).
 * - 12 HOTSPOT bám đúng vị trí sao (InkCosmos.onProject báo toạ độ mỗi frame) →
 *   hover/chạm 1 cung → ping radar tại cung (InkCosmos.pulseCung) + bảng HUD hé nghĩa.
 * - "Hỏi vũ trụ": gõ câu hỏi → keyword khớp 1 cung → ping + HUD trả lời (DEMO, câu trả lời mẫu).
 *
 * Nội bộ /cosmos-lab (noindex). Câu trả lời là MẪU — chưa nối AI Mentor thật.
 */

const InkCosmos = dynamic(() => import('@/app/cosmos/InkCosmos').then((m) => m.InkCosmos), {
  ssr: false,
  loading: () => null,
});

const LIGHT = '#eaf1ff';
const CYAN = '#6fe0ef';

type Cung = { n: string; d: string; b: string };
// Thứ tự khớp InkCosmos: i=0 Mệnh ở đỉnh, tăng theo CHIỀU KIM ĐỒNG HỒ.
const CUNG: Cung[] = [
  { n: 'Mệnh', d: 'con người bạn', b: 'Cốt cách, cách bạn phản ứng trước áp lực, điều khiến bạn là chính mình.' },
  { n: 'Phụ Mẫu', d: 'cha mẹ · cội nguồn', b: 'Mối liên hệ với cha mẹ, nền tảng gia đình, phúc khí thừa hưởng.' },
  { n: 'Phúc Đức', d: 'phúc phần · an yên', b: 'Phúc khí tích luỹ, sự bình an trong tâm, điều nên vun trồng dài lâu.' },
  { n: 'Điền Trạch', d: 'nhà cửa · đất đai', b: 'Tài sản, nhà đất, không gian sống và tích sản của bạn.' },
  { n: 'Quan Lộc', d: 'sự nghiệp', b: 'Thiên hướng nghề nghiệp, môi trường bạn toả sáng, những ngã rẽ công danh.' },
  { n: 'Nô Bộc', d: 'bạn bè · đối tác', b: 'Quan hệ với đồng nghiệp, đối tác, cấp dưới — ai nâng bạn, ai cản bạn.' },
  { n: 'Thiên Di', d: 'di chuyển · cơ hội', b: 'Dịch chuyển, cơ hội xa nhà, những người bạn gặp trên đường.' },
  { n: 'Tật Ách', d: 'sức khoẻ', b: 'Thể trạng, điểm cần giữ gìn, những ách cần lưu tâm.' },
  { n: 'Tài Bạch', d: 'tiền bạc', b: 'Dòng chảy tài chính tự nhiên — khi nào nên liều, khi nào nên thủ.' },
  { n: 'Tử Tức', d: 'con cái', b: 'Đường con cái, thế hệ sau, điều bạn truyền lại.' },
  { n: 'Phu Thê', d: 'hôn nhân', b: 'Cách bạn yêu, điều bạn cần ở bạn đời, những điểm dễ va chạm.' },
  { n: 'Huynh Đệ', d: 'anh em · bằng hữu', b: 'Quan hệ anh chị em, bằng hữu thân thiết, người sát cánh.' },
];

const KW: Array<[RegExp, number]> = [
  [/sự nghiệp|công việc|nghề|thăng tiến|sếp|công ty|dự án|deal/i, 4],
  [/tiền|tài chính|vốn|đầu tư|kinh doanh|lương|giàu|nợ|mua/i, 8],
  [/tình|yêu|hôn nhân|người ấy|cưới|bạn đời|vợ|chồng|chia tay/i, 10],
  [/nhà|đất|bất động sản/i, 3],
  [/đi|chuyển|nước ngoài|du học|xuất ngoại|định cư/i, 6],
  [/sức khoẻ|bệnh|ốm|mệt|stress/i, 7],
  [/con cái|sinh con|mang thai/i, 9],
  [/cha mẹ|bố mẹ|ba má|gia đình/i, 1],
  [/đồng nghiệp|đối tác|hợp tác|bạn bè/i, 5],
  [/anh em|anh chị|chị em/i, 11],
  [/phúc|may mắn|bình an|an yên/i, 2],
  [/bản thân|chính mình|con người|tính cách|tôi là ai|mình là/i, 0],
];
function matchCung(q: string): number {
  for (const [re, i] of KW) if (re.test(q)) return i;
  return 0;
}

export function CosmosOracle(): React.JSX.Element {
  const [active, setActive] = React.useState<number | null>(null); // cung được highlight (ping)
  const [panel, setPanel] = React.useState<{ cung: number; oracle?: string } | null>(null);
  const [q, setQ] = React.useState('');
  const hotspots = React.useRef<Array<HTMLButtonElement | null>>([]);

  const handleProject = React.useCallback((pts: Array<{ x: number; y: number; vis: boolean }>) => {
    for (let i = 0; i < pts.length; i++) {
      const el = hotspots.current[i];
      const p = pts[i];
      if (!el || !p) continue;
      el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -50%)`;
      el.style.opacity = p.vis ? '1' : '0';
    }
  }, []);

  const pickCung = (i: number) => { setPanel({ cung: i }); setActive(i); };
  const ask = () => {
    const text = q.trim();
    if (!text) return;
    const i = matchCung(text);
    setActive(i);
    setPanel({
      cung: i,
      oracle: `Câu hỏi của bạn nghiêng về cung ${CUNG[i]!.n} — ${CUNG[i]!.d}. ${CUNG[i]!.b}\n\n[Demo] Khi có lá số thật, AI Mentor sẽ luận giải chi tiết & gợi ý hướng đi — không phán, để bạn tự quyết.`,
    });
  };

  const cur = panel ? CUNG[panel.cung] : null;

  return (
    <section
      aria-label="Demo bản đồ sao tương tác"
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: '#04060d', color: LIGHT }}
    >
      {/* Nền cosmos */}
      <div className="absolute inset-0" aria-hidden="true">
        <InkCosmos ambient={0.92} pulseCung={active} onProject={handleProject} />
      </div>

      {/* Tiêu đề + hướng dẫn */}
      <div className="pointer-events-none relative z-10 px-6 pt-10 lg:px-12">
        <p className="font-mono uppercase" style={{ color: CYAN, letterSpacing: '0.28em', fontSize: 12 }}>
          Demo · Bản đồ sao tương tác
        </p>
        <h2 className="mt-3 font-light" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 'clamp(24px,4vw,40px)' }}>
          Chạm một cung — hoặc <span style={{ color: CYAN }}>hỏi vũ trụ</span>.
        </h2>
      </div>

      {/* 12 hotspot bám sao (vị trí do InkCosmos.onProject cập nhật) */}
      <div className="absolute inset-0 z-20">
        {CUNG.map((c, i) => (
          <button
            key={c.n}
            type="button"
            ref={(el) => { hotspots.current[i] = el; }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(panel ? panel.cung : null)}
            onFocus={() => setActive(i)}
            onClick={() => pickCung(i)}
            aria-label={`Cung ${c.n} — ${c.d}`}
            className="group absolute left-0 top-0 grid place-items-center rounded-full"
            style={{ width: 40, height: 40, opacity: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <span
              className="block rounded-full transition-all duration-300 group-hover:scale-150"
              style={{ width: 9, height: 9, background: i === 0 ? LIGHT : CYAN, boxShadow: `0 0 10px ${i === 0 ? LIGHT : CYAN}` }}
            />
            <span
              className="pointer-events-none absolute whitespace-nowrap rounded px-2 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ top: 26, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', color: LIGHT, background: 'rgba(4,6,13,0.7)', border: `1px solid ${CYAN}55` }}
            >
              {c.n}
            </span>
          </button>
        ))}
      </div>

      {/* Bảng HUD nghĩa cung / câu trả lời */}
      {cur && (
        <aside
          className="absolute right-4 top-24 z-30 max-w-[340px] rounded-[3px] p-5 backdrop-blur-md lg:right-12"
          style={{ background: 'rgba(6,12,26,0.72)', border: `1px solid ${CYAN}44`, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-light" style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 26, color: LIGHT }}>
              {cur.n}
            </h3>
            <button type="button" onClick={() => { setPanel(null); setActive(null); }} aria-label="Đóng" style={{ color: `${LIGHT}99`, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
          <p className="font-mono uppercase" style={{ color: CYAN, fontSize: 11, letterSpacing: '0.18em', marginTop: 2 }}>{cur.d}</p>
          <p className="mt-3 whitespace-pre-line" style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif", fontSize: 14.5, lineHeight: 1.62, color: `${LIGHT}d0` }}>
            {panel?.oracle ?? cur.b}
          </p>
        </aside>
      )}

      {/* "Hỏi vũ trụ" */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-6 pb-10 lg:px-12">
        <div
          className="mx-auto flex max-w-xl items-center gap-2 rounded-full px-2 py-2 backdrop-blur-md"
          style={{ background: 'rgba(6,12,26,0.6)', border: `1px solid ${CYAN}44` }}
        >
          <span className="pl-3" aria-hidden="true" style={{ color: CYAN }}>✦</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') ask(); }}
            placeholder="Hỏi vũ trụ… (vd: sự nghiệp nên rẽ hướng nào?)"
            aria-label="Hỏi vũ trụ"
            className="min-w-0 flex-1 bg-transparent outline-none"
            style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif", fontSize: 15, color: LIGHT }}
          />
          <button
            type="button"
            onClick={ask}
            className="shrink-0 rounded-full px-5 py-2 font-mono uppercase transition-all hover:brightness-110"
            style={{ fontSize: 12, letterSpacing: '0.12em', background: CYAN, color: '#04060d' }}
          >
            Hỏi
          </button>
        </div>
        <p className="mt-3 text-center font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: '0.2em', color: `${LIGHT}66` }}>
          Demo · câu trả lời là mẫu — chưa nối AI Mentor thật
        </p>
      </div>
    </section>
  );
}
