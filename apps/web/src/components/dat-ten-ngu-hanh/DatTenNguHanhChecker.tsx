'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hieu-asia/ui';
import {
  computeBanMenh,
  ELEMENTS,
  NAME_SUGGESTIONS,
  type Element,
  type BanMenhResult,
} from '@/lib/dat-ten-ngu-hanh';
import { track } from '@/lib/analytics';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';
import { useScrollToResult } from '@/lib/use-scroll-to-result';

type GenderFilter = 'ca' | 'nam' | 'nu';

function todayISO(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

function parseISO(value: string): { d: number; m: number; y: number } | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts as [number, number, number];
  return { d, m, y };
}

function matchGender(g: NameSuggestionGender, filter: GenderFilter): boolean {
  if (filter === 'ca') return true;
  return g === filter || g === 'ca';
}
type NameSuggestionGender = 'nam' | 'nu' | 'ca';

export function DatTenNguHanhChecker({ defaultGender = 'ca' }: { defaultGender?: GenderFilter } = {}) {
  const [value, setValue] = React.useState('');
  const [gender, setGender] = React.useState<GenderFilter>(defaultGender);
  const [reportInterest, setReportInterest] = React.useState(false);

  React.useEffect(() => {
    if (!value) setValue(todayISO());
  }, [value]);

  const parsed = React.useMemo(() => parseISO(value), [value]);
  const result = React.useMemo<BanMenhResult | null>(
    () => (parsed ? computeBanMenh(parsed.d, parsed.m, parsed.y) : null),
    [parsed],
  );
  const { resultRef, armScroll } = useScrollToResult(result);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra mệnh ngũ hành &amp; gợi ý tên</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="dtDate">Ngày sinh của bé (dương lịch)</Label>
            <Input
              id="dtDate"
              type="date"
              value={value}
              onChange={(e) => {
                armScroll();
                setValue(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dtGender">Giới tính</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as GenderFilter)}>
              <SelectTrigger id="dtGender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ca">Chưa rõ / cả hai</SelectItem>
                <SelectItem value="nam">Bé trai</SelectItem>
                <SelectItem value="nu">Bé gái</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                armScroll();
                setValue(todayISO());
              }}
            >
              Về hôm nay
            </Button>
          </div>
        </div>

        {result && (
          <div ref={resultRef} className="scroll-mt-24 space-y-4">
            <div className="rounded-lg border bg-card/40 p-4">
              <p className="text-sm text-muted-foreground">
                Bé sinh ngày{' '}
                <strong className="text-foreground">
                  {result.solar.day}/{result.solar.month}/{result.solar.year}
                </strong>{' '}
                — năm âm lịch <strong className="text-foreground">{result.canChi} ({result.lunarYear})</strong>.
              </p>
              <p className="mt-2 text-base">
                Mệnh:{' '}
                <strong className="text-gold">
                  {ELEMENTS[result.element].name} — {result.napAmName}
                </strong>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {ELEMENTS[result.element].blurb}
              </p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-emerald-300 bg-emerald-50/60 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
                <div className="font-medium text-foreground">Tên nên thuộc hành</div>
                <p className="mt-1 text-muted-foreground">
                  {result.hopElements.map((e) => ELEMENTS[e].name).join(', ')} — bổ trợ, hài hoà với mệnh bé.
                </p>
              </div>
              <div className="rounded-md border bg-card/40 p-3">
                <div className="font-medium text-foreground">Thường tránh hành</div>
                <p className="mt-1 text-muted-foreground">
                  {result.avoidElements.map((e) => ELEMENTS[e].name).join(', ')} — theo quan niệm tương khắc.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Gợi ý tên tham khảo (theo nghĩa chữ)</div>
              {result.hopElements.map((el: Element) => {
                const names = NAME_SUGGESTIONS[el].filter((n) => matchGender(n.gender, gender));
                if (names.length === 0) return null;
                return (
                  <div key={el} className="rounded-md border bg-card/40 p-3">
                    <div className="text-sm font-medium">
                      Hành {ELEMENTS[el].name}{' '}
                      <span className="font-normal text-muted-foreground">
                        ({el === result.element ? 'đồng mệnh' : 'sinh ra mệnh bé'})
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                      {names.map((n) => (
                        <span key={n.name}>
                          <span className="font-medium text-foreground">{n.name}</span>{' '}
                          <span className="text-muted-foreground">— {n.meaning}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là <strong>gợi ý tham khảo</strong> theo phong tục, giúp cha mẹ thêm một góc nhìn khi
              chọn tên — không phải lời định đoạt tương lai của con. Cách quy tên theo hành dựa trên nghĩa
              chữ Hán-Việt (phổ biến nhất, có thể khác các trường phái tính theo số nét). Một cái tên đẹp,
              ý nghĩa tốt và tâm ý của cha mẹ vẫn là điều quan trọng nhất.
            </p>

            {/* Hạt giống đo nhu cầu "danh sách tên đầy đủ" — không backend, chỉ ghi ý định qua analytics. */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:dat-ten-ngu-hanh"
                    capturedEvent="dat_ten_lead_captured"
                    capturedProps={{ element: result.element, gender }}
                    blurb="Bản đầy đủ sẽ có nhiều tên hơn cho mỗi hành, lọc theo họ của gia đình, kèm ý nghĩa Hán-Việt và một lời chúc. Để email, chúng tôi gửi bạn ngay khi ra mắt."
                    cta="Báo tôi khi có"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Cần thêm gợi ý tên?</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ có nhiều tên hơn cho mỗi hành, lọc theo{' '}
                      <strong>họ của gia đình</strong>, kèm ý nghĩa Hán-Việt và một lời chúc. Vẫn là gợi
                      ý tham khảo — không phán số mệnh.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('dat_ten_report_intent', { element: result.element, gender });
                    }}
                  >
                    Tôi quan tâm
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DownloadToolPdfButton
                source="pdf-dat-ten-ngu-hanh"
                payload={() => {
                  if (!result) return null;
                  const elInfo = ELEMENTS[result.element];
                  const sections: ToolPdfPayload['sections'] = [
                    {
                      heading: 'Thông tin bé',
                      rows: [
                        {
                          label: 'Ngày sinh (dương lịch)',
                          value: `${result.solar.day}/${result.solar.month}/${result.solar.year}`,
                        },
                        { label: 'Năm âm lịch', value: `${result.canChi} (${result.lunarYear})` },
                        { label: 'Mệnh ngũ hành', value: `${elInfo.name} — ${result.napAmName}` },
                        {
                          label: 'Tên nên thuộc hành',
                          value: result.hopElements.map((e) => ELEMENTS[e].name).join(', '),
                        },
                        {
                          label: 'Thường tránh hành',
                          value: result.avoidElements.map((e) => ELEMENTS[e].name).join(', '),
                        },
                      ],
                    },
                    { heading: `Về mệnh ${elInfo.name}`, text: elInfo.blurb },
                  ];

                  for (const el of result.hopElements) {
                    const names = NAME_SUGGESTIONS[el].filter((n) => matchGender(n.gender, gender));
                    if (names.length === 0) continue;
                    const relation = el === result.element ? 'đồng mệnh' : 'sinh ra mệnh bé';
                    sections.push({
                      heading: `Gợi ý tên hợp mệnh — hành ${ELEMENTS[el].name} (${relation})`,
                      text: names.map((n) => `${n.name} — ${n.meaning}`).join('\n'),
                    });
                  }

                  sections.push({
                    heading: 'Lưu ý',
                    text: 'Đây là gợi ý tham khảo theo phong tục, giúp cha mẹ thêm một góc nhìn khi chọn tên — không phải lời định đoạt tương lai của con. Cách quy tên theo hành dựa trên nghĩa chữ Hán-Việt (phổ biến nhất, có thể khác các trường phái tính theo số nét). Một cái tên đẹp, ý nghĩa tốt và tâm ý của cha mẹ vẫn là điều quan trọng nhất.',
                  });

                  return {
                    title: 'Đặt tên theo ngũ hành — hieu.asia',
                    subtitle: `Bé sinh ${result.solar.day}/${result.solar.month}/${result.solar.year} · Mệnh ${elInfo.name}`,
                    hero: {
                      big: `${elInfo.name} — ${result.napAmName}`,
                      small: `Năm âm lịch ${result.canChi} (${result.lunarYear})`,
                    },
                    sections,
                  };
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
