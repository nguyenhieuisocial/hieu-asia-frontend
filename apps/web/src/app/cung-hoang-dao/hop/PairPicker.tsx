'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@hieu-asia/ui';
import { CUNG_SLUGS, listCung } from '@/lib/cung-hoang-dao-data';
import { pairSlug } from '@/lib/cung-hoang-dao-hop-data';

/**
 * Chọn 2 cung → mở trang độ hợp tương ứng. Thuần client, điều hướng nội bộ.
 */
export function PairPicker() {
  const router = useRouter();
  const signs = listCung(); // thứ tự = idx
  const [a, setA] = useState(signs[0]!.slug);
  const [b, setB] = useState(signs[6]!.slug);

  function go() {
    const idxA = (CUNG_SLUGS as readonly string[]).indexOf(a);
    const idxB = (CUNG_SLUGS as readonly string[]).indexOf(b);
    if (idxA < 0 || idxB < 0) return;
    router.push(`/cung-hoang-dao/hop/${pairSlug(idxA, idxB)}`);
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-card/40 p-6">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Xem độ hợp giữa hai cung
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Chọn cung của bạn và cung của người kia để xem hai cung có hợp nhau không.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="pair-a" className="mb-1 block text-xs text-muted-foreground">
            Cung thứ nhất
          </label>
          <select
            id="pair-a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold/60"
          >
            {signs.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.symbol} {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="pair-b" className="mb-1 block text-xs text-muted-foreground">
            Cung thứ hai
          </label>
          <select
            id="pair-b"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold/60"
          >
            {signs.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.symbol} {s.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" onClick={go} size="lg">
          Xem độ hợp
        </Button>
      </div>
    </div>
  );
}
