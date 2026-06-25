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
            className="w-44 rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-gold/50"
          />
        </label>
        <Button type="submit" size="lg">
          Tra Kim Lâu
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

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
        </div>
      )}
    </div>
  );
}
