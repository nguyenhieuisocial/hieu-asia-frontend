'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CalendarClock,
  Compass,
  Cat,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { useScrollToResult } from '@/lib/use-scroll-to-result';
import { track } from '@/lib/analytics';
import { yearProfile } from '@/lib/sinh-con';
import { checkKimLau, checkTamTai, checkXungNam } from '@/lib/xem-tuoi-cuoi';
import { checkHoangOc } from '@/lib/xem-tuoi-lam-nha';
import { computeHuongNha, groupLabel, STAR_INFO } from '@/lib/huong-nha';
import { computeSaoHan, TYPE_LABEL } from '@/lib/sao-han';
import { buildConGiap } from '@/lib/con-giap-data';
import { buildBanMenh, COLOR_HEX, BIRTH_YEARS as BAN_MENH_YEARS } from '@/lib/ban-menh-data';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { BIRTH_YEARS as HUONG_NHA_YEARS, slugOf as huongNhaSlug } from '@/app/huong-nha/years';
import { BIRTH_YEARS as CUOI_YEARS, slugOf as cuoiSlug } from '@/app/xem-tuoi-cuoi/years';
import { BIRTH_YEARS as LAM_NHA_YEARS, slugOf as lamNhaSlug } from '@/app/xem-tuoi-lam-nha/years';

/**
 * TraCuuTuoi — công cụ tra cứu tuổi trọn đời (client-side 100%).
 *
 * Khách nhập NĂM sinh + giới tính → bấm "Tra cứu" → hiện ngay mọi lát cắt của
 * tuổi đó: Can Chi / nạp âm / mệnh · các hạn theo năm hiện tại (Kim Lâu, Tam
 * Tai, xung năm, Hoang Ốc, sao hạn) · hướng & cung phi · con giáp · màu/nghề,
 * rồi dẫn OUT sang từng trang chuyên sâu. Tất cả tính từ các hàm THUẦN có sẵn
 * (không gọi máy chủ, không bịa số).
 *
 * Brand voice: phong tục dân gian được tính minh bạch để THAM KHẢO — không
 * phán, không bói, không bán "giải hạn".
 */

type Gender = 'nam' | 'nu';

const MIN_YEAR = 1930;
const MAX_YEAR = 2030;

type BadgeTone = 'good' | 'warn' | 'neutral';

const BADGE_CLASS: Record<BadgeTone, string> = {
  good: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  neutral: 'border-border bg-card/40 text-foreground/70',
};

function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gold/15 bg-card/40 p-4 sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
        <Icon className="h-5 w-5 text-gold" aria-hidden />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({
  label,
  badge,
  detail,
}: {
  label: string;
  badge: React.ReactNode;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        {badge}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function ColorChips({ colors }: { colors: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-2.5 py-1 text-sm text-foreground/85"
        >
          <span
            aria-hidden
            className="h-3.5 w-3.5 rounded-full border border-border"
            style={{ backgroundColor: COLOR_HEX[c] ?? '#888' }}
          />
          {c}
        </span>
      ))}
    </div>
  );
}

/** Gom toàn bộ kết quả cho một năm sinh + giới tính, so với NĂM HIỆN TẠI. */
function buildResult(year: number, gender: Gender, currentYear: number) {
  const profile = yearProfile(year);
  if (!profile) return null;

  const element = ELEMENTS[profile.element];
  const tuoiDuong = currentYear - year;
  const tuoiMu = tuoiDuong + 1;
  const bornYet = year <= currentYear;

  const kimLau = bornYet ? checkKimLau(year, currentYear) : null;
  const tamTai = bornYet ? checkTamTai(year, currentYear) : null;
  const xung = bornYet ? checkXungNam(year, currentYear) : null;
  const hoangOc = bornYet ? checkHoangOc(year, currentYear) : null;
  const saoHan = computeSaoHan(year, gender, currentYear); // null nếu năm sinh > năm xem

  const huong = computeHuongNha(year, gender);
  const conGiap = buildConGiap(profile.zodiac.slug);
  const banMenh = BAN_MENH_YEARS.includes(year) ? buildBanMenh(year) : null;

  const genderLabel = gender === 'nam' ? 'nam' : 'nữ';

  // Link OUT sang các trang sâu — chỉ phát khi năm sinh có route tồn tại (guard
  // .includes) để không bao giờ trỏ tới trang 404.
  const deepLinks: { href: string; label: string }[] = [];
  if (BAN_MENH_YEARS.includes(year)) {
    deepLinks.push({ href: `/ban-menh/${year}`, label: `Ngũ hành bản mệnh — sinh năm ${year}` });
  }
  deepLinks.push({
    href: `/learn/con-giap/${profile.zodiac.slug}`,
    label: `Tính cách & hợp tuổi con giáp ${profile.zodiac.ten}`,
  });
  if (HUONG_NHA_YEARS.includes(year)) {
    deepLinks.push({ href: `/huong-nha/${huongNhaSlug(year)}`, label: `Hướng nhà hợp tuổi ${profile.canChi}` });
  }
  if (CUOI_YEARS.includes(year)) {
    deepLinks.push({ href: `/xem-tuoi-cuoi/${cuoiSlug(year)}`, label: `Xem tuổi cưới cho tuổi ${profile.canChi}` });
  }
  if (LAM_NHA_YEARS.includes(year)) {
    deepLinks.push({ href: `/xem-tuoi-lam-nha/${lamNhaSlug(year)}`, label: `Xem tuổi làm nhà cho tuổi ${profile.canChi}` });
  }

  return {
    profile,
    element,
    tuoiDuong,
    tuoiMu,
    bornYet,
    genderLabel,
    kimLau,
    tamTai,
    xung,
    hoangOc,
    saoHan,
    huong,
    conGiap,
    banMenh,
    deepLinks,
  };
}

const STATIC_LINKS: { href: string; label: string }[] = [
  { href: '/tam-tai', label: 'Tam Tai là gì? Tra theo con giáp' },
  { href: '/sao-han', label: 'Sao hạn Cửu Diệu theo tuổi' },
  { href: '/kim-lau', label: 'Kim Lâu — tính tuổi cưới / làm nhà' },
  { href: '/can-xuong', label: 'Cân xương tính số' },
  { href: '/hop-tuoi', label: 'Xem hợp tuổi (đôi lứa, làm ăn)' },
];

export function TraCuuTuoi({
  initialYear,
  initialGender,
}: {
  initialYear?: string;
  initialGender?: Gender;
} = {}): React.JSX.Element {
  // Prefill từ ?year=/?gender= (link nội bộ, vd từ /ban-menh/1990): nếu năm hợp
  // lệ → hiện kết quả NGAY, khỏi bấm lại. KHÔNG armScroll ở mount → không giật
  // khi mở trực tiếp; compute deterministic + cùng năm hiện tại server/client →
  // không lệch hydrate.
  const validInit =
    !!initialYear &&
    Number.isInteger(Number(initialYear)) &&
    Number(initialYear) >= MIN_YEAR &&
    Number(initialYear) <= MAX_YEAR &&
    !!yearProfile(Number(initialYear));
  const [year, setYear] = React.useState(initialYear ?? '');
  const [gender, setGender] = React.useState<Gender>(initialGender ?? 'nam');
  const [revealed, setRevealed] = React.useState(validInit);
  const [error, setError] = React.useState<string | null>(null);
  // Tính năm hiện tại 1 lần phía client. Chỉ dùng trong khối kết quả (hiện sau
  // khi bấm) nên không gây lệch hydrate.
  const [currentYear] = React.useState(() => new Date().getFullYear());
  const { resultRef, armScroll } = useScrollToResult(revealed);

  const onChangeAny = React.useCallback(() => {
    if (revealed) setRevealed(false);
  }, [revealed]);

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const y = Number(year);
      if (!year.trim() || !Number.isInteger(y) || y < MIN_YEAR || y > MAX_YEAR) {
        setError(`Hãy nhập năm sinh dương lịch từ ${MIN_YEAR} đến ${MAX_YEAR}.`);
        setRevealed(false);
        return;
      }
      if (!yearProfile(y)) {
        setError('Năm này ngoài phạm vi tra cứu (1900–2100). Hãy thử năm khác.');
        setRevealed(false);
        return;
      }
      setError(null);
      track('tool_used', { tool: 'tra-cuu-tuoi', result: 'ok' });
      track('form_submitted', {
        form_id: 'tra-cuu-tuoi',
        page: '/tra-cuu-tuoi',
        time_to_submit_ms: null,
      });
      armScroll();
      setRevealed(true);
    },
    [year, armScroll],
  );

  const data = revealed ? buildResult(Number(year), gender, currentYear) : null;

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-gold/25 bg-card/60 p-5 backdrop-blur-sm sm:p-6"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="tct-year"
              className="block font-mono text-[13px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              Năm sinh (dương lịch)
            </label>
            <input
              id="tct-year"
              type="number"
              inputMode="numeric"
              min={MIN_YEAR}
              max={MAX_YEAR}
              placeholder="VD: 1990"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                onChangeAny();
              }}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-gold"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="tct-gender"
              className="block font-mono text-[13px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              Giới tính
            </label>
            <select
              id="tct-gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as Gender);
                onChangeAny();
              }}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-md bg-gold px-6 text-sm font-medium text-ink transition hover:bg-gold-400 hover:shadow-lg hover:shadow-gold/30 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-auto"
        >
          ✦ Tra cứu
        </button>
        {error && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        <p className="mt-3 font-mono text-[13px] leading-relaxed text-muted-foreground">
          Tính ngay trong trình duyệt · phong tục dân gian tính minh bạch để tham khảo, không phán số mệnh.
        </p>
      </form>

      {/* Kết quả — hiện ngay bên dưới khi bấm Tra cứu */}
      <div
        ref={resultRef}
        className={`scroll-mt-24 grid grid-cols-1 transition-all duration-500 ${
          revealed ? 'mt-8 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {revealed && data && (
            <div className="space-y-4">
              {/* 1. Cốt lõi */}
              <SectionCard icon={Sparkles} title={`Cốt lõi tuổi ${data.profile.canChi}`}>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Can Chi</dt>
                    <dd className="font-medium text-foreground">{data.profile.canChi}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Con giáp</dt>
                    <dd className="font-medium text-foreground">
                      <span aria-hidden>{data.profile.zodiac.emoji}</span> {data.profile.zodiac.ten}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Nạp âm</dt>
                    <dd className="font-medium text-foreground">{data.profile.napAmName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Mệnh ngũ hành</dt>
                    <dd className="font-medium text-gold">{data.element.name}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {data.bornYet ? (
                    <>
                      Năm nay ({currentYear}): tuổi mụ <strong className="text-foreground/90">{data.tuoiMu}</strong> · tuổi
                      dương <strong className="text-foreground/90">{data.tuoiDuong}</strong>. Hành {data.element.name} —{' '}
                      {data.element.blurb}
                    </>
                  ) : (
                    <>
                      Năm sinh {data.profile.year} ở tương lai — năm nay ({currentYear}) chưa tới nên chưa tính tuổi. Hành{' '}
                      {data.element.name} — {data.element.blurb}
                    </>
                  )}
                </p>
              </SectionCard>

              {/* 2. Năm nay với tuổi này */}
              <SectionCard icon={CalendarClock} title={`Năm nay (${currentYear}) với tuổi này`}>
                {data.bornYet && data.kimLau && data.tamTai && data.xung && data.hoangOc ? (
                  <div className="space-y-2">
                    <Row
                      label="Kim Lâu"
                      badge={
                        data.kimLau.type ? (
                          <Badge tone="warn">Phạm {data.kimLau.type}</Badge>
                        ) : (
                          <Badge tone="good">Không phạm</Badge>
                        )
                      }
                      detail={`Tuổi mụ ${data.kimLau.ageMu} chia 9 dư ${data.kimLau.remainder}${
                        data.kimLau.type ? ` — ${data.kimLau.note}` : ' — không rơi 1/3/6/8'
                      }.`}
                    />
                    <Row
                      label="Tam Tai"
                      badge={
                        data.tamTai.isTamTai ? (
                          <Badge tone="warn">Phạm Tam Tai</Badge>
                        ) : (
                          <Badge tone="good">Không phạm</Badge>
                        )
                      }
                      detail={`Nhóm tuổi ${data.tamTai.birthChi} gặp Tam Tai vào 3 năm ${data.tamTai.tamTaiChis.join(
                        ', ',
                      )}. Năm nay là năm ${data.tamTai.yearChi}.`}
                    />
                    <Row
                      label="Xung năm / năm tuổi"
                      badge={
                        data.xung.isXung ? (
                          <Badge tone="warn">Xung Thái Tuế</Badge>
                        ) : data.xung.isNamTuoi ? (
                          <Badge tone="neutral">Năm tuổi</Badge>
                        ) : (
                          <Badge tone="good">Không xung</Badge>
                        )
                      }
                      detail={
                        data.xung.isXung
                          ? `Chi năm ${data.xung.yearChi} xung với chi tuổi ${data.xung.birthChi} — nhiều nhà xem là điểm trừ.`
                          : data.xung.isNamTuoi
                            ? `Năm nay trùng chi tuổi (${data.xung.birthChi}) — chỉ là lưu ý nhẹ, không phải hạn.`
                            : `Chi năm ${data.xung.yearChi} không xung với chi tuổi ${data.xung.birthChi}.`
                      }
                    />
                    <Row
                      label="Hoang Ốc"
                      badge={
                        data.hoangOc.isPham ? (
                          <Badge tone="warn">Phạm {data.hoangOc.cung}</Badge>
                        ) : (
                          <Badge tone="good">{data.hoangOc.cung}</Badge>
                        )
                      }
                      detail={`Tuổi mụ ${data.hoangOc.ageMu} đếm vòng Hoang Ốc rơi cung ${data.hoangOc.cung} (bước ${data.hoangOc.step}/6) — ${data.hoangOc.note}.`}
                    />
                    {data.saoHan && (
                      <Row
                        label={`Sao hạn: ${data.saoHan.sao.name}`}
                        badge={
                          <Badge
                            tone={
                              data.saoHan.sao.type === 'tot'
                                ? 'good'
                                : data.saoHan.sao.type === 'xau'
                                  ? 'warn'
                                  : 'neutral'
                            }
                          >
                            {TYPE_LABEL[data.saoHan.sao.type]}
                          </Badge>
                        }
                        detail={data.saoHan.sao.advice}
                      />
                    )}
                    <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                      Đây là các hạn theo phong tục xét theo <strong>năm hiện tại</strong> nói chung (không riêng cưới
                      hỏi hay làm nhà). Muốn xét cho một việc cụ thể, dùng các trang chuyên sâu bên dưới.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Năm sinh này ở tương lai, các mục hạn theo năm chỉ áp dụng khi đã tới hoặc qua năm sinh.
                  </p>
                )}
              </SectionCard>

              {/* 3. Hướng & cung phi */}
              <SectionCard icon={Compass} title="Hướng nhà & cung phi">
                <p className="mb-3 text-sm text-foreground/85">
                  Cung phi <strong className="text-gold">{data.huong.cungPhi}</strong> —{' '}
                  {groupLabel(data.huong.group)} ({data.genderLabel}).
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-emerald-300">Hướng tốt nên ưu tiên</p>
                    <div className="flex flex-wrap gap-2">
                      {data.huong.good.slice(0, 3).map((d) => (
                        <span
                          key={d.direction}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200"
                        >
                          {d.direction} · {STAR_INFO[d.star].name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-amber-300">Hướng nên tránh</p>
                    <div className="flex flex-wrap gap-2">
                      {data.huong.bad.slice(0, 2).map((d) => (
                        <span
                          key={d.direction}
                          className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200"
                        >
                          {d.direction} · {STAR_INFO[d.star].name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* 4. Con giáp */}
              {data.conGiap && (
                <SectionCard icon={Cat} title={`Con giáp ${data.profile.zodiac.ten}`}>
                  <p className="mb-3 text-sm leading-relaxed text-foreground/85">
                    {data.conGiap.extra.tagline}
                  </p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="text-xs text-muted-foreground">Tam Hợp:</dt>
                      <dd className="text-foreground/90">
                        {data.conGiap.tamHop.map((t) => `${t.emoji} ${t.ten}`).join(', ')}
                      </dd>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="text-xs text-muted-foreground">Lục Xung:</dt>
                      <dd className="text-foreground/90">
                        {data.conGiap.tuHanhXung.emoji} {data.conGiap.tuHanhXung.ten}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    &quot;Xung&quot; chỉ là hai nếp sống khác nhịp, cần dung hoà — không phải điều xấu.
                  </p>
                </SectionCard>
              )}

              {/* 5. Màu & nghề hợp — chỉ khi có dữ liệu bản mệnh (1950–2026) */}
              {data.banMenh && (
                <SectionCard icon={Palette} title="Màu & nghề hợp mệnh">
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-emerald-300">
                        Màu hợp (bản mệnh {data.banMenh.elementName} & tương sinh {data.banMenh.sinhElementName})
                      </p>
                      <ColorChips colors={[...data.banMenh.banMenhColors, ...data.banMenh.hopColors]} />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-amber-300">
                        Màu nên hạn chế (hành {data.banMenh.khacElementName} khắc)
                      </p>
                      <ColorChips colors={data.banMenh.avoidColors} />
                    </div>
                    {data.banMenh.careers.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-medium text-foreground/80">Nhóm nghề hợp (tham khảo)</p>
                        <p className="text-sm leading-relaxed text-foreground/85">
                          {data.banMenh.careers.join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* 6. Xem sâu hơn */}
              <SectionCard icon={ArrowRight} title="Xem sâu hơn">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[...data.deepLinks, ...STATIC_LINKS].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="flex items-start gap-2 rounded-lg border border-border bg-card/40 p-3 text-sm leading-relaxed text-foreground/85 transition hover:border-gold/40 hover:text-gold"
                      >
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
