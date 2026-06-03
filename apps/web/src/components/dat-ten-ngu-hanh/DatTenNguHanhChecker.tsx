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

export function DatTenNguHanhChecker() {
  const [value, setValue] = React.useState('');
  const [gender, setGender] = React.useState<GenderFilter>('ca');

  React.useEffect(() => {
    if (!value) setValue(todayISO());
  }, [value]);

  const parsed = React.useMemo(() => parseISO(value), [value]);
  const result = React.useMemo<BanMenhResult | null>(
    () => (parsed ? computeBanMenh(parsed.d, parsed.m, parsed.y) : null),
    [parsed],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra mệnh ngũ hành &amp; gợi ý tên</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="dtDate">Ngày sinh của bé (dương lịch)</Label>
            <Input id="dtDate" type="date" value={value} onChange={(e) => setValue(e.target.value)} />
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
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setValue(todayISO())}>
              Về hôm nay
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
