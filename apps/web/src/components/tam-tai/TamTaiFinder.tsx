'use client';

/**
 * Tra Tam Tai theo năm sinh — tính NGAY trên client để câu hỏi "năm nay tôi có
 * phạm không" luôn đúng theo năm hiện tại (không làm trang SSG bị stale).
 * Grounded 100% trên engine: canChiOfYear / checkTamTai / TAM_TAI_YEARS.
 */
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import {
  canChiOfYear,
  checkTamTai,
  TAM_TAI_YEARS,
  ANIMAL_BY_CHI,
  type Chi,
} from '@/lib/xem-tuoi-cuoi';

const SLUG_BY_CHI = new Map<string, string>(ZODIAC.map((z) => [z.ten, z.slug]));

interface Result {
  birthYear: number;
  chi: Chi;
  animal: string;
  slug: string;
  tamTaiChis: Chi[];
  currentYear: number;
  isThisYear: boolean;
  upcoming: number[];
}

function compute(birthYear: number): Result {
  const chi = canChiOfYear(birthYear).chi;
  const currentYear = new Date().getFullYear();
  const { isTamTai } = checkTamTai(birthYear, currentYear);
  const tamTaiChis = TAM_TAI_YEARS[chi];
  const upcoming: number[] = [];
  for (let y = currentYear; y <= currentYear + 12 && upcoming.length < 3; y += 1) {
    if (tamTaiChis.includes(canChiOfYear(y).chi)) upcoming.push(y);
  }
  return {
    birthYear,
    chi,
    animal: ANIMAL_BY_CHI[chi],
    slug: SLUG_BY_CHI.get(chi) ?? '',
    tamTaiChis,
    currentYear,
    isThisYear: isTamTai,
    upcoming,
  };
}

export function TamTaiFinder() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const y = Number(value.trim());
    if (!Number.isInteger(y) || y < 1900 || y > 2100) {
      setError('Nhập năm sinh dương lịch hợp lệ (1900–2100).');
      setResult(null);
      return;
    }
    setError('');
    setResult(compute(y));
  }

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Tuổi tôi có phạm Tam Tai năm nay không?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Nhập năm sinh dương lịch — kết quả tính theo phong tục Can Chi để bạn tham khảo.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Năm sinh (dương lịch)
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="VD: 1990"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min={1900}
            max={2100}
            className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-gold/50"
          />
        </label>
        <Button type="submit" size="lg">
          Tra Tam Tai
        </Button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {result && (
        <div className="mt-5 space-y-3 rounded-xl border border-border bg-background/60 p-4 text-sm leading-relaxed">
          <p className="text-foreground">
            Sinh năm <strong>{result.birthYear}</strong> → tuổi{' '}
            <strong>
              {result.chi} (con {result.animal})
            </strong>
            , thuộc nhóm Tam Hợp gặp Tam Tai vào các năm{' '}
            <strong>{result.tamTaiChis.join(', ')}</strong>.
          </p>

          <p
            className={
              result.isThisYear
                ? 'rounded-lg bg-amber-500/10 px-3 py-2 text-amber-800 dark:text-amber-300'
                : 'rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-800 dark:text-emerald-300'
            }
          >
            {result.isThisYear ? (
              <>
                Năm nay ({result.currentYear}) <strong>nằm trong giai đoạn Tam Tai</strong> của tuổi{' '}
                {result.chi}. Đây chỉ là lời nhắc cân nhắc kỹ hơn với việc trọng đại, không phải
                điềm gở cố định — bạn vẫn có thể tiến hành sau khi chuẩn bị chu đáo.
              </>
            ) : (
              <>
                Năm nay ({result.currentYear}) tuổi {result.chi} <strong>không phạm Tam Tai</strong>.
              </>
            )}
          </p>

          {result.upcoming.length > 0 && (
            <p className="text-muted-foreground">
              Các năm Tam Tai sắp tới của tuổi {result.chi}:{' '}
              <strong className="text-foreground">{result.upcoming.join(', ')}</strong>.
            </p>
          )}

          <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {result.slug && (
              <Link href={`/tam-tai/${result.slug}`} className="text-gold hover:underline">
                Chi tiết Tam Tai tuổi {result.chi} →
              </Link>
            )}
            <Link href="/xem-tuoi-cuoi" className="text-gold hover:underline">
              Xem tuổi cưới
            </Link>
            <Link href="/xem-tuoi-lam-nha" className="text-gold hover:underline">
              Xem tuổi làm nhà
            </Link>
          </p>

          <DownloadToolPdfButton
            source="pdf-tam-tai"
            payload={() => {
              if (!result) return null;
              const verdict = result.isThisYear
                ? `Năm nay (${result.currentYear}) tuổi ${result.chi} đang trong giai đoạn Tam Tai.`
                : `Năm nay (${result.currentYear}) tuổi ${result.chi} không phạm Tam Tai.`;
              const sections: ToolPdfPayload['sections'] = [
                {
                  heading: 'Tuổi & nhóm Tam Hợp',
                  rows: [
                    { label: 'Năm sinh (dương lịch)', value: String(result.birthYear) },
                    { label: 'Tuổi (Địa Chi)', value: `${result.chi} (con ${result.animal})` },
                    { label: 'Nhóm Tam Hợp phạm Tam Tai', value: result.tamTaiChis.join(', ') },
                  ],
                },
                {
                  heading: `Tình trạng năm ${result.currentYear}`,
                  text: result.isThisYear
                    ? `${verdict}\n\nĐây chỉ là lời nhắc cân nhắc kỹ hơn với việc trọng đại (cưới hỏi, làm nhà, khai trương), không phải điềm gở cố định — bạn vẫn có thể tiến hành sau khi chuẩn bị chu đáo.`
                    : `${verdict}\n\nXét theo phong tục Can Chi, năm nay không rơi vào nhóm năm Tam Tai của tuổi bạn.`,
                },
              ];

              if (result.upcoming.length > 0) {
                sections.push({
                  heading: 'Các năm Tam Tai sắp tới',
                  rows: result.upcoming.map((y) => ({
                    label: `Năm ${y}`,
                    value: `${canChiOfYear(y).chi} — Tam Tai của tuổi ${result.chi}`,
                  })),
                });
              }

              sections.push({
                heading: 'Lưu ý phong tục',
                text: 'Tam Tai là quan niệm dân gian Can Chi: mỗi nhóm Tam Hợp gặp 3 năm Tam Tai liên tiếp trong mỗi 12 năm. Đây là nội dung tham khảo để bạn cân nhắc, không phải lời phán xui rủi và không thay thế quyết định của chính bạn.',
              });

              const payload: ToolPdfPayload = {
                title: 'Tra Tam Tai theo năm sinh — hieu.asia',
                subtitle: `Tuổi ${result.chi} (con ${result.animal}) · sinh năm ${result.birthYear}`,
                hero: {
                  big: result.isThisYear ? 'Năm nay đang trong Tam Tai' : 'Năm nay không phạm Tam Tai',
                  small: verdict,
                },
                sections,
              };
              return payload;
            }}
          />
        </div>
      )}
    </div>
  );
}
