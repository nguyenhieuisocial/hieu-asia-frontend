'use client';

import * as React from 'react';
import Link from 'next/link';
import type { BaziChart, Element } from '@/lib/bazi';
import {
  computeChart,
  chartBalance,
  ELEMENT_TENDENCY,
  type NatalChart,
  type ZodiacElement,
} from '@/lib/western-astrology';
import { getSoChuDao, type SoChuDao } from '@/lib/than-so-hoc-numbers';
import {
  castTuViChart,
  findPalaceByName,
  type TuViChart,
} from '@/lib/tuvi-client';

/**
 * Hồ Sơ Con Người — chân dung HỢP NHẤT từ MỘT ngày–giờ–giới tính khách đã nhập
 * ở cửa trước. Bốn hệ thống THẬT (Bát Tự · Tử Vi · Chiêm tinh Tây · Thần số) hội
 * về một chỗ: "đây là TOÀN BỘ bạn trong một khung nhìn". Khác hẳn "chuyên gia AI"
 * giả của đối thủ — mọi con số ở đây đều TÍNH ĐƯỢC, kiểm chứng được.
 *
 * Trung thực là hào nước:
 *  - Chỉ kéo những gì engine THẬT tính ra; KHÔNG bịa giá trị.
 *  - Chỉ nêu "điểm chung" khi nó THẬT xuất hiện trong dữ liệu (cùng-hệ Mặt
 *    Trời∩Mặt Trăng) — KHÔNG ép 4 hệ "đồng ý". Giá trị nằm ở SỰ ĐẦY ĐỦ +
 *    trung thực, không phải sự đồng thuận giả.
 *  - Khung không bao giờ rời: "mô tả khuynh hướng từ tính toán thật — không phán số phận".
 *
 * Engine dùng lại (KHÔNG tự tính lại toán):
 *  - Bát Tự: `BaziChart` đã tính sẵn ở trên (Nhật Chủ + hành vượng).
 *  - Chiêm tinh Tây: `computeChart` (Mặt Trời/Mặt Trăng) + `chartBalance` (nguyên tố)
 *    — thuần client-side (Meeus). KHÔNG có nơi sinh → bỏ cung Mọc (không bịa).
 *  - Thần số: rút gọn Số Chủ Đạo (digit-sum chuẩn, giữ master 11/22/33) → nghĩa
 *    `SO_CHU_DAO` qua `getSoChuDao('so-N')`.
 *  - Tử Vi: cung Mệnh + chính tinh cần engine iztro (chạy ở worker, deterministic +
 *    cache localStorage). Nạp LƯỜI 1 lần khi mục này hiện; thiếu giờ → ghi rõ "tạm
 *    tính" vì cung Mệnh phụ thuộc giờ sinh.
 */

// Bát Tự ngũ hành → màu chữ (đồng bộ với BatTuChecker để giao diện liền mạch).
const EL_TEXT: Record<Element, string> = {
  Mộc: 'text-emerald-800 dark:text-emerald-400',
  Hỏa: 'text-rose-800 dark:text-rose-400',
  Thổ: 'text-amber-800 dark:text-amber-400',
  Kim: 'text-slate-600 dark:text-slate-200',
  Thủy: 'text-sky-800 dark:text-sky-400',
};

// Nguyên tố chiêm tinh Tây → màu chữ.
const ZEL_TEXT: Record<ZodiacElement, string> = {
  Lửa: 'text-rose-800 dark:text-rose-400',
  Đất: 'text-amber-800 dark:text-amber-400',
  Khí: 'text-sky-800 dark:text-sky-400',
  Nước: 'text-indigo-800 dark:text-indigo-400',
};

/** Một dòng "khuynh hướng" cho hành ngũ hành vượng nhất (Bát Tự) — văn phản tư. */
const EL_TENDENCY_BAZI: Record<Element, string> = {
  Mộc: 'thiên hướng vươn lên, khởi sự và phát triển — như cây tìm ánh sáng.',
  Hỏa: 'thiên hướng nhiệt thành, biểu đạt và lan toả — sống bằng cảm hứng.',
  Thổ: 'thiên hướng vững chãi, bao dung và đáng tin — chỗ dựa cho người khác.',
  Kim: 'thiên hướng nguyên tắc, quyết đoán và sắc bén — coi trọng chuẩn mực.',
  Thủy: 'thiên hướng linh hoạt, sâu lắng và thích nghi — chảy theo hoàn cảnh.',
};

/** Rút gọn đệ quy về 1 chữ số, GIỮ master 11/22/33 (chuẩn thần số Pythagoras). */
function reduceKeepMaster(n: number): number {
  let x = n;
  while (x > 9 && x !== 11 && x !== 22 && x !== 33) {
    x = String(x)
      .split('')
      .reduce((s, d) => s + Number(d), 0);
  }
  return x;
}

/**
 * Số Chủ Đạo (Life Path) từ ngày sinh dương lịch: rút gọn ngày, tháng, năm RIÊNG
 * rồi cộng lại (phương pháp giữ master số chuẩn). Trả về 1–9 hoặc 11/22/33.
 */
function lifePathFromDate(dateStr: string): number | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec((dateStr ?? '').trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || !mo || !d) return null;
  const parts = [reduceKeepMaster(d), reduceKeepMaster(mo), reduceKeepMaster(y)];
  return reduceKeepMaster(parts.reduce((s, p) => s + p, 0));
}

interface WesternView {
  sunSign: string;
  sunSymbol: string;
  sunElement: ZodiacElement;
  sunNearCusp: boolean;
  moonSign: string;
  moonSymbol: string;
  moonElement: ZodiacElement;
  dominantElement: ZodiacElement;
}

function buildWestern(date: string, time: string): WesternView | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec((date ?? '').trim());
  if (!m) return null;
  const parts = (time || '12:00').split(':');
  const hh = Number(parts[0]);
  const mm = Number(parts[1]);
  const chart: NatalChart = computeChart({
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: Number.isFinite(hh) ? hh : 12,
    minute: Number.isFinite(mm) ? mm : 0,
    // KHÔNG truyền latitude/longitude → engine BỎ cung Mọc (không bịa nơi sinh).
  });
  const bal = chartBalance(chart);
  return {
    sunSign: chart.sun.sign.name,
    sunSymbol: chart.sun.sign.symbol,
    sunElement: chart.sun.sign.element,
    sunNearCusp: chart.sun.nearCusp,
    moonSign: chart.moon.sign.name,
    moonSymbol: chart.moon.sign.symbol,
    moonElement: chart.moon.sign.element,
    dominantElement: bal.dominantElement,
  };
}

/** Trạng thái nạp Tử Vi (cần engine worker). */
type TuViState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; menhStem: string; menhBranch: string; mainStars: string[] };

function CardShell({
  badge,
  title,
  children,
  gateway,
}: {
  badge: string;
  title: React.ReactNode;
  children: React.ReactNode;
  /** "Cửa vào" công cụ đầy đủ của lăng kính — mang sẵn ngày sinh, khỏi nhập lại. */
  gateway?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col rounded-xl border border-gold/20 bg-card/40 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">{badge}</p>
      <p className="mt-2 font-heading text-base font-semibold text-foreground">{title}</p>
      <div className="mt-2 space-y-1.5">{children}</div>
      {gateway && (
        <Link
          href={gateway.href}
          className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-gold-700 underline-offset-2 hover:underline"
        >
          {gateway.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

export function UnifiedProfile({
  chart,
  date,
  time,
  gender,
  hourKnown,
}: {
  chart: BaziChart;
  date: string;
  time: string;
  gender: 'M' | 'F';
  /** false = khách để giờ mặc định 12:00 (không nhớ giờ) → phần phụ-thuộc-giờ ghi "tạm tính". */
  hourKnown: boolean;
}) {
  // Chiêm tinh Tây + Thần số: thuần client-side, tính NGAY (không chờ mạng).
  const western = React.useMemo(() => buildWestern(date, time), [date, time]);
  const lifePath = React.useMemo(() => lifePathFromDate(date), [date]);
  const soChuDao: SoChuDao | undefined = lifePath ? getSoChuDao(`so-${lifePath}`) : undefined;

  // Mỗi lăng kính dẫn vào CÔNG CỤ ĐẦY ĐỦ của nó, mang sẵn ngày–giờ–giới tính qua
  // query (đúng contract ?d=&t=&g= mà các tool đã nhận) → khách khỏi nhập lại.
  const birthQ = `d=${encodeURIComponent(date)}&t=${encodeURIComponent(time || '12:00')}&g=${gender}`;

  // Tử Vi: cung Mệnh + chính tinh cần engine worker (iztro). Nạp lười 1 lần.
  const [tuvi, setTuvi] = React.useState<TuViState>({ status: 'loading' });
  React.useEffect(() => {
    let alive = true;
    setTuvi({ status: 'loading' });
    const input = {
      birthSolarDate: date,
      birthHour: parseHourSafe(time),
      gender: (gender === 'F' ? 'female' : 'male') as 'female' | 'male',
    };
    (async () => {
      // tuvi-v2 chạy ở worker và có thể tạm bị giới hạn nhịp (429) — thử lại MỘT lần
      // sau nhịp ngắn để khoảnh khắc "bốn lăng kính" giao đủ; vẫn degrade êm nếu vẫn hỏng.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const c: TuViChart = await castTuViChart(input);
          if (!alive) return;
          const menh = findPalaceByName(c, 'Mệnh');
          if (!menh) {
            setTuvi({ status: 'error' });
            return;
          }
          setTuvi({
            status: 'ready',
            menhStem: menh.heavenlyStem,
            menhBranch: menh.earthlyBranch,
            mainStars: menh.majorStars.map((s) => s.name).filter(Boolean),
          });
          return;
        } catch {
          if (!alive) return;
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 1300));
            if (!alive) return;
          }
        }
      }
      if (alive) setTuvi({ status: 'error' });
    })();
    return () => {
      alive = false;
    };
  }, [date, time, gender]);

  // ── Điểm chung TRUNG THỰC (chỉ nêu khi THẬT có) ────────────────────────────
  // An toàn nhất = cùng-hệ: Mặt Trời ∩ Mặt Trăng cùng nguyên tố (cùng vốn từ
  // chiêm tinh Tây) → một sự nhấn mạnh có thật, không phải ép 4 hệ "đồng ý".
  // KHÔNG cross-map ngũ hành Trung ↔ nguyên tố Tây (mapping không chặt = bịa).
  const sunMoonSameElement =
    western != null && western.sunElement === western.moonElement ? western.sunElement : null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold/80">
          Hồ sơ con người
        </p>
        <p className="mx-auto mt-1.5 max-w-xl font-heading text-xl text-foreground">
          Bốn hệ thống, một con người
        </p>
        <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
          Từ <strong>cùng một ngày–giờ sinh</strong> bạn vừa nhập, bốn cách nhìn cổ điển hội về một
          chỗ — chân dung của riêng bạn, mỗi con số đều <strong>tính được, kiểm chứng được</strong>.
          Đây là mô tả <strong>khuynh hướng</strong>, không phán số phận.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* 1 ─ Bát Tự (neo — đã tính sẵn ở trên) */}
        <CardShell
          badge="Bát Tự · Tứ Trụ"
          title={
            <>
              Nhật Chủ{' '}
              <span className={EL_TEXT[chart.dayMaster.element]}>
                {chart.dayMaster.can} ({chart.dayMaster.element}{' '}
                {chart.dayMaster.yang ? 'dương' : 'âm'})
              </span>{' '}
              · hành <span className={EL_TEXT[chart.strongest]}>{chart.strongest}</span> vượng
            </>
          }
        >
          <p className="text-sm leading-relaxed text-foreground/80">
            Cốt lõi của bạn theo Tứ Trụ: {EL_TENDENCY_BAZI[chart.strongest]}
            {chart.missing.length > 0 ? (
              <> Lá số thiếu hành {chart.missing.join(', ')} — chỗ cần bù.</>
            ) : (
              <> Ngũ hành đủ cả 5 — thế tương đối cân.</>
            )}
          </p>
        </CardShell>

        {/* 2 ─ Tử Vi (cung Mệnh + chính tinh — engine iztro) */}
        <CardShell
          badge="Tử Vi Đẩu Số"
          gateway={{ href: `/la-so-tu-vi?${birthQ}`, label: 'Lập lá số Tử Vi đầy đủ' }}
          title={
            tuvi.status === 'ready' ? (
              <>
                Cung Mệnh tại {tuvi.menhStem} {tuvi.menhBranch}
                {tuvi.mainStars.length > 0 ? (
                  <> · {tuvi.mainStars.join(', ')}</>
                ) : (
                  <> · vô chính diệu</>
                )}
              </>
            ) : tuvi.status === 'loading' ? (
              <span className="text-muted-foreground">Đang lập lá số Tử Vi…</span>
            ) : (
              <span className="text-muted-foreground">Tử Vi — tạm chưa lập được</span>
            )
          }
        >
          {tuvi.status === 'ready' ? (
            <p className="text-sm leading-relaxed text-foreground/80">
              {tuvi.mainStars.length > 0 ? (
                <>
                  Chính tinh thủ Mệnh định &ldquo;màu sắc&rdquo; con người bạn trong Tử Vi.
                </>
              ) : (
                <>
                  Mệnh vô chính diệu — mượn sao cung đối, một thế &ldquo;mềm&rdquo; cần soi kỹ hơn.
                </>
              )}
              {!hourKnown && (
                <>
                  {' '}
                  <em className="text-muted-foreground">
                    (Bạn chưa nhập giờ — cung Mệnh phụ thuộc giờ sinh nên đây là bản tạm tính.)
                  </em>
                </>
              )}
            </p>
          ) : tuvi.status === 'loading' ? (
            <p className="text-sm text-muted-foreground">An 12 cung &amp; 14 chính tinh…</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Phần Tử Vi cần kết nối để an sao — ba hệ còn lại vẫn đầy đủ ở trên/dưới.
            </p>
          )}
        </CardShell>

        {/* 3 ─ Chiêm tinh Tây (Mặt Trời + Mặt Trăng + nguyên tố) */}
        {western && (
          <CardShell
            badge="Chiêm tinh Tây"
            gateway={{ href: `/ban-do-sao?${birthQ}`, label: 'Xem bản đồ sao đầy đủ' }}
            title={
              <>
                <span className={ZEL_TEXT[western.sunElement]}>
                  {western.sunSymbol} Mặt Trời {western.sunSign}
                </span>{' '}
                ·{' '}
                <span className={ZEL_TEXT[western.moonElement]}>
                  ☾ Mặt Trăng {western.moonSign}
                </span>
              </>
            }
          >
            <p className="text-sm leading-relaxed text-foreground/80">
              Mặt Trời = bản chất bạn hướng tới ({western.sunElement.toLowerCase()});{' '}
              Mặt Trăng = đời sống cảm xúc bên trong ({western.moonElement.toLowerCase()}).
              Nguyên tố nổi trội toàn biểu đồ là{' '}
              <strong className={ZEL_TEXT[western.dominantElement]}>{western.dominantElement}</strong>{' '}
              — {ELEMENT_TENDENCY[western.dominantElement]}
            </p>
            <p className="text-xs text-muted-foreground">
              Cung Mọc cần <strong>nơi sinh</strong> — bổ sung ở bản đồ sao đầy đủ để mở khoá.
            </p>
          </CardShell>
        )}

        {/* 4 ─ Thần số (Số Chủ Đạo + 1 dòng nghĩa) */}
        {soChuDao && (
          <CardShell
            badge="Thần số học"
            gateway={{
              href: `/than-so-hoc/y-nghia/${soChuDao.slug}`,
              label: `Đọc sâu Số Chủ Đạo ${soChuDao.number}`,
            }}
            title={
              <>
                Số Chủ Đạo <span className="text-gold-700">{soChuDao.number}</span>
                {soChuDao.master && (
                  <span className="ml-1 text-xs text-gold-700/80">(số master)</span>
                )}{' '}
                · {soChuDao.archetype}
              </>
            }
          >
            <p className="text-sm leading-relaxed text-foreground/80">
              {firstSentence(soChuDao.overview)}
            </p>
            <p className="text-xs text-muted-foreground">
              {soChuDao.keyTags.join(' · ')}
            </p>
          </CardShell>
        )}
      </div>

      {/* Synthesis — TRUNG THỰC: chỉ nêu điểm chung khi THẬT có */}
      <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
          Đây là toàn bộ bạn — trong một khung nhìn
        </p>
        {sunMoonSameElement ? (
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            Một quan sát có thật trong dữ liệu: cả Mặt Trời và Mặt Trăng của bạn cùng thuộc nguyên
            tố{' '}
            <strong className={ZEL_TEXT[sunMoonSameElement]}>{sunMoonSameElement}</strong> — bản chất
            hướng ngoại và đời sống cảm xúc bên trong cùng một &ldquo;chất&rdquo;, một sự nhất quán
            đáng chú ý. Đây là <strong>nhận xét từ tính toán</strong>, không phải lời phán số mệnh.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            Bốn hệ thống mô tả bạn bằng bốn ngôn ngữ khác nhau — chúng tôi{' '}
            <strong>không ép chúng &ldquo;đồng ý&rdquo; với nhau</strong>. Giá trị nằm ở chỗ bạn thấy
            mình từ bốn góc cùng lúc: đầy đủ và trung thực, để TỰ hiểu mình — không phải một lời phán
            gói gọn.
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Mỗi con số ở trên đều được <strong>tính ra từ ngày–giờ sinh</strong> (vị trí Mặt Trời/Mặt
          Trăng, tiết khí, an sao, rút gọn số) — không phải lời đoán. Đây là khung nhìn để hiểu
          khuynh hướng, mọi lựa chọn vẫn là của bạn.
        </p>
      </div>
    </div>
  );
}

function parseHourSafe(t: string): number {
  const h = Number((t ?? '').split(':')[0]);
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 12;
}

/** Lấy câu đầu (tới dấu chấm) của đoạn overview để làm 1-dòng takeaway. */
function firstSentence(s: string): string {
  const i = s.indexOf('. ');
  return i > 0 ? s.slice(0, i + 1) : s;
}
