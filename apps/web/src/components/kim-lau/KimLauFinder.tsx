'use client';

/**
 * Tra Kim Lâu theo năm sinh cô dâu — tính NGAY trên client để "năm nay / các năm
 * tới" luôn đúng theo năm hiện tại (không làm trang SSG bị stale).
 * Grounded 100% trên engine qua kimLauYearsAhead → checkKimLau.
 */
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { kimLauYearsAhead, type KimLauYear } from '@/lib/kim-lau-data';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';

export function KimLauFinder() {
  const [value, setValue] = useState('');
  const [rows, setRows] = useState<KimLauYear[] | null>(null);
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const y = Number(value.trim());
    if (!Number.isInteger(y) || y < 1900 || y > 2100) {
      setError('Nhập năm sinh dương lịch hợp lệ (1900–2100).');
      setRows(null);
      return;
    }
    setError('');
    setRows(kimLauYearsAhead(y, new Date().getFullYear(), 8));
  }

  const firstClear = rows?.find((r) => !r.isKimLau);

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Cô dâu sinh năm nào — các năm tới năm nào phạm Kim Lâu?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Nhập năm sinh dương lịch của cô dâu. Kết quả tính theo phong tục để bạn tham khảo.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Năm sinh cô dâu (dương lịch)
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="VD: 1998"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min={1900}
            max={2100}
            aria-invalid={!!error}
            aria-describedby={error ? 'kimlau-err' : undefined}
            className="w-44 rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-gold/50"
          />
        </label>
        <Button type="submit" size="lg">
          Tra Kim Lâu
        </Button>
      </form>

      {error && <p id="kimlau-err" role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {rows && (
        <div className="mt-5 space-y-3">
          {firstClear && (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300">
              Năm gần nhất cô dâu <strong>không phạm Kim Lâu</strong> để cân nhắc cưới:{' '}
              <strong>{firstClear.year}</strong> (tuổi mụ {firstClear.ageMu}).
            </p>
          )}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/40 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Năm</th>
                  <th className="px-3 py-2 font-medium">Tuổi mụ</th>
                  <th className="px-3 py-2 font-medium">Kim Lâu?</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.year} className="border-b border-border/50 last:border-0">
                    <td className="px-3 py-2 tabular-nums text-foreground">{r.year}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{r.ageMu}</td>
                    <td className="px-3 py-2">
                      {r.isKimLau ? (
                        <span className="text-amber-700 dark:text-amber-300">
                          Phạm ({r.type})
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-300">Không — thuận</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Phạm Kim Lâu là lời nhắc cân nhắc theo phong tục, không phải điều cấm. Bạn có thể chọn một
            năm cô dâu không phạm ở trên, hoặc xem thêm Kim Lâu cùng Tam Tai &amp; xung năm ở{' '}
            <Link href="/xem-tuoi-cuoi" className="text-gold hover:underline">
              công cụ Xem tuổi cưới
            </Link>
            .
          </p>

          <DownloadToolPdfButton
            source="pdf-kim-lau"
            payload={() => {
              if (!rows || rows.length === 0) return null;
              const fc = rows.find((r) => !r.isKimLau);
              const first = rows[0];
              const fromYear = first?.year;
              const toYear = rows[rows.length - 1]?.year;
              const phamCount = rows.filter((r) => r.isKimLau).length;
              const clearCount = rows.length - phamCount;

              const hero = fc
                ? {
                    big: `Năm gần nhất KHÔNG phạm Kim Lâu: ${fc.year}`,
                    small: `Tuổi mụ ${fc.ageMu} — cân nhắc cưới theo phong tục.`,
                  }
                : {
                    big: `${rows.length} năm tới đều phạm Kim Lâu`,
                    small: 'Có thể xem thêm các năm xa hơn ở công cụ Xem tuổi cưới.',
                  };

              const sections: ToolPdfPayload['sections'] = [
                {
                  heading: 'Các năm tới — năm nào phạm Kim Lâu?',
                  rows: rows.map((r) => ({
                    label: `Năm ${r.year} (tuổi mụ ${r.ageMu})`,
                    value: r.isKimLau
                      ? `Phạm — ${r.type ?? 'Kim Lâu'}`
                      : 'Không phạm — thuận',
                  })),
                },
                {
                  heading: 'Cân nhắc theo phong tục',
                  text:
                    `Trong ${rows.length} năm tới (${fromYear ?? ''}–${toYear ?? ''}): ` +
                    `${clearCount} năm không phạm, ${phamCount} năm phạm Kim Lâu.\n` +
                    'Phạm Kim Lâu là lời nhắc cân nhắc theo phong tục cưới hỏi, KHÔNG phải điều cấm. ' +
                    (fc
                      ? `Cách nhẹ nhàng nhất là chọn một năm cô dâu không phạm — gần nhất là năm ${fc.year}.\n`
                      : 'Bạn có thể cân nhắc các năm xa hơn hoặc tham khảo thêm các yếu tố khác.\n') +
                    'Kim Lâu xét theo tuổi mụ của cô dâu (tuổi mụ chia 9 dư 1, 3, 6 hoặc 8 thì phạm). ' +
                    'Đây là thông tin tham khảo để bạn tự quyết, không phải lời phán số mệnh.',
                },
              ];

              return {
                title: 'Tra Kim Lâu theo năm sinh cô dâu',
                subtitle: 'Kết quả tính theo phong tục cưới hỏi — để bạn tham khảo.',
                hero,
                sections,
                cta: {
                  text: 'Xem Kim Lâu cùng Tam Tai & xung năm tại công cụ Xem tuổi cưới',
                  url: 'https://hieu.asia/xem-tuoi-cuoi',
                },
              };
            }}
          />
        </div>
      )}
    </div>
  );
}
