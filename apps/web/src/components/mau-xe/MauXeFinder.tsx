'use client';

/**
 * Tra màu xe hợp mệnh theo năm sinh — tính NGAY trên client từ engine buildMauXe
 * (grounded: nạp âm → hành → luật ngũ hành). Không phụ thuộc thời gian nên trang
 * SSG không bị stale.
 */
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { buildMauXe, type MauXeData, type CarColor } from '@/lib/mau-xe-data';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';

function Swatches({ colors }: { colors: CarColor[] }) {
  if (colors.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="flex flex-wrap items-center gap-2">
      {colors.map((c) => (
        <span key={c.name} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: c.hex }}
          />
          <span className="text-sm text-foreground/85">{c.name}</span>
        </span>
      ))}
    </span>
  );
}

export function MauXeFinder() {
  const [value, setValue] = useState('');
  const [data, setData] = useState<MauXeData | null>(null);
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const y = Number(value.trim());
    const result = buildMauXe(y);
    if (!result) {
      setError('Nhập năm sinh dương lịch trong khoảng 1950–2025.');
      setData(null);
      return;
    }
    setError('');
    setData(result);
  }

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Bạn sinh năm nào — hợp màu xe gì?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Nhập năm sinh dương lịch. Kết quả suy theo ngũ hành bản mệnh để bạn tham khảo khi chọn màu
        xe.
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
            min={1950}
            max={2025}
            className="w-44 rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-gold/50"
          />
        </label>
        <Button type="submit" size="lg">
          Tra màu xe hợp mệnh
        </Button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {data && (
        <div className="mt-5 space-y-4">
          <p className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-foreground/85">
            Sinh năm <strong>{data.year}</strong> — tuổi <strong>{data.canChi}</strong> (
            {data.zodiac.emoji} {data.zodiac.ten}), nạp âm <strong>{data.napAmName}</strong>, mệnh{' '}
            <strong>{data.elementName}</strong>.
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Màu xe hợp nhất
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Thuộc hành bản mệnh ({data.elementName}) và hành tương sinh ({data.sinhElementName}).
              </p>
              <div className="mt-2">
                <Swatches colors={data.hopCarColors} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Màu xe trung tính (dùng tốt)
              </p>
              <div className="mt-2">
                <Swatches colors={data.neutralCarColors} />
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Màu xe nên cân nhắc
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Thuộc hành {data.khacElementName} (khắc mệnh {data.elementName}). Không phải điều
                cấm — nếu bạn thích thì vẫn dùng được.
              </p>
              <div className="mt-2">
                <Swatches colors={data.avoidCarColors} />
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Đây là gợi ý theo phong thủy ngũ hành để tham khảo, không phải lời phán số mệnh. Khi mua
            xe, an toàn và sở thích của bạn nên đặt trên màu &ldquo;hợp mệnh&rdquo;. Muốn xem mệnh
            đầy đủ (màu sắc, nghề, vật phẩm), ghé{' '}
            <Link href="/ban-menh" className="text-gold hover:underline">
              Ngũ hành bản mệnh
            </Link>
            .
          </p>

          <DownloadToolPdfButton
            source="pdf-mau-xe"
            payload={(): ToolPdfPayload | null => {
              if (!data) return null;
              return {
                title: 'Màu xe hợp mệnh theo năm sinh',
                subtitle: 'Gợi ý theo ngũ hành bản mệnh — để bạn tham khảo khi chọn màu xe.',
                hero: {
                  big: `Mệnh ${data.elementName} — hợp màu xe: ${data.hopCarColors
                    .map((c) => c.name)
                    .join(', ')}`,
                  small: `Sinh năm ${data.year}, tuổi ${data.canChi} (${data.zodiac.ten}), nạp âm ${data.napAmName}.`,
                },
                sections: [
                  {
                    heading: 'Gợi ý màu xe theo mệnh',
                    rows: [
                      {
                        label: 'Màu hợp nhất (bản mệnh + tương sinh)',
                        value: data.hopCarColors.map((c) => c.name).join(', ') || '—',
                      },
                      {
                        label: 'Màu trung tính (dùng tốt)',
                        value: data.neutralCarColors.map((c) => c.name).join(', ') || '—',
                      },
                      {
                        label: 'Màu nên cân nhắc (khắc mệnh)',
                        value: data.avoidCarColors.map((c) => c.name).join(', ') || '—',
                      },
                    ],
                  },
                  {
                    heading: 'Lưu ý',
                    text:
                      `Mệnh ${data.elementName} hợp màu thuộc hành bản mệnh và hành tương sinh (${data.sinhElementName}), ` +
                      `nên cân nhắc màu thuộc hành ${data.khacElementName} vì khắc mệnh.\n` +
                      'Đây là quan niệm phong thủy ngũ hành mang tính tham khảo, KHÔNG phải lời phán số mệnh — ' +
                      'nếu bạn thích một màu "kỵ" thì vẫn dùng được. Khi mua xe, hãy ưu tiên an toàn (xe màu ' +
                      'sáng dễ nhận biết khi thiếu sáng) và sở thích cá nhân trước yếu tố phong thủy.',
                  },
                ],
                cta: {
                  text: 'Xem ngũ hành bản mệnh đầy đủ (màu sắc, nghề, vật phẩm)',
                  url: 'https://hieu.asia/ban-menh',
                },
              };
            }}
          />
        </div>
      )}
    </div>
  );
}
