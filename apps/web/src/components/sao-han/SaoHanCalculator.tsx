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
  cn,
} from '@hieu-asia/ui';
import {
  computeSaoHan,
  currentViewYear,
  TYPE_LABEL,
  type Gender,
  type SaoHanResult,
  type SaoType,
} from '@/lib/sao-han';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import { readBirthProfile, saveBirthProfile } from '@/lib/birth-profile';
import { SavedBirthInfoHint } from '@/components/tools/SavedBirthInfoHint';

const TYPE_STYLE: Record<SaoType, string> = {
  tot: 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30',
  trung: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30',
  xau: 'border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30',
};

const TYPE_TEXT: Record<SaoType, string> = {
  tot: 'text-emerald-700 dark:text-emerald-300',
  trung: 'text-amber-700 dark:text-amber-300',
  xau: 'text-rose-700 dark:text-rose-300',
};

export function SaoHanCalculator() {
  const thisYear = currentViewYear();
  const [birthYear, setBirthYear] = React.useState('');
  const [gender, setGender] = React.useState<Gender>('nam');
  const [viewYear, setViewYear] = React.useState(String(thisYear));
  const [result, setResult] = React.useState<SaoHanResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [prefilled, setPrefilled] = React.useState(false);

  // Tự điền từ hồ sơ ngày sinh dùng chung (nếu có) + hiện kết quả ngay. Đọc
  // localStorage trong effect (không phải lúc render) để tránh lệch hydrate.
  React.useEffect(() => {
    const p = readBirthProfile();
    if (p.gender) setGender(p.gender);
    if (p.year) {
      setBirthYear(String(p.year));
      const r = computeSaoHan(p.year, p.gender ?? 'nam', thisYear);
      if (r) {
        setResult(r);
        setPrefilled(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onCheck() {
    setError(null);
    setResult(null);
    const by = Number(birthYear);
    const vy = Number(viewYear) || thisYear;
    const r = computeSaoHan(by, gender, vy);
    if (!r) {
      setError('Vui lòng nhập năm sinh hợp lệ (từ 1900 trở lại đây, không lớn hơn năm xem).');
      return;
    }
    setResult(r);
    saveBirthProfile({ year: by, gender });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra sao hạn theo tuổi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="birthYear">Năm sinh (dương lịch)</Label>
            <Input
              id="birthYear"
              type="number"
              inputMode="numeric"
              placeholder="VD: 1990"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="gender">Giới tính</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nam">Nam</SelectItem>
                <SelectItem value="nu">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="viewYear">Năm xem</Label>
            <Input
              id="viewYear"
              type="number"
              inputMode="numeric"
              value={viewYear}
              onChange={(e) => setViewYear(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={onCheck} className="w-full md:w-auto">
          Xem sao hạn
        </Button>

        <SavedBirthInfoHint show={prefilled} onClear={() => setPrefilled(false)} />

        {error && (
          <div role="alert" className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className={cn('rounded-lg border p-4', TYPE_STYLE[result.sao.type])}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-lg font-semibold">
                  Sao <span className={TYPE_TEXT[result.sao.type]}>{result.sao.name}</span>
                </div>
                <div className={cn('text-sm font-medium', TYPE_TEXT[result.sao.type])}>
                  {TYPE_LABEL[result.sao.type]}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.gender === 'nam' ? 'Nam' : 'Nữ'} · tuổi mụ {result.tuoiMu} · năm {result.viewYear}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{result.sao.summary}</p>
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="rounded-md border bg-card/40 p-3">
                <div className="font-medium">Lời khuyên</div>
                <p className="mt-1 text-muted-foreground">{result.sao.advice}</p>
              </div>
              <div className="rounded-md border bg-card/40 p-3">
                <div className="font-medium">Tháng cần lưu ý</div>
                <p className="mt-1 text-muted-foreground">{result.sao.thang}</p>
              </div>
            </div>

            <div className="rounded-md border bg-card/40 p-3 text-sm">
              <div className="font-medium">Sao hạn các năm tới</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                {[1, 2, 3, 4].map((d) => {
                  const yr = result.viewYear + d;
                  const by = result.viewYear - result.tuoiMu + 1;
                  const next = computeSaoHan(by, result.gender, yr);
                  if (!next) return null;
                  return (
                    <span key={yr} className="tabular-nums">
                      <span className="text-muted-foreground">{yr}:</span>{' '}
                      <span className={TYPE_TEXT[next.sao.type]}>{next.sao.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là cách tra cứu theo phong tục dân gian, mang tính <strong>tham khảo</strong> — không
              phải lời phán số mệnh. Sao tốt hay xấu không quyết định cuộc đời bạn; sống cẩn trọng, tử
              tế và chủ động vẫn là điều quan trọng nhất.
            </p>

            <DownloadToolPdfButton
              source="pdf-sao-han"
              payload={() => {
                if (!result) return null;
                const birthYear = result.viewYear - result.tuoiMu + 1;
                const sections: ToolPdfPayload['sections'] = [
                  {
                    heading: `Sao chiếu mệnh năm ${result.viewYear}`,
                    rows: [
                      {
                        label: 'Tuổi / giới tính / năm xem',
                        value: `${result.gender === 'nam' ? 'Nam' : 'Nữ'} · tuổi mụ ${result.tuoiMu} · năm ${result.viewYear} (sinh ${birthYear})`,
                      },
                      { label: 'Sao chiếu mệnh', value: result.sao.name },
                      { label: 'Hạn', value: TYPE_LABEL[result.sao.type] },
                      { label: 'Bản chất thiên văn', value: result.sao.origin },
                    ],
                  },
                  {
                    heading: 'Ý nghĩa theo phong tục',
                    text: `${result.sao.summary}\n\nLời khuyên: ${result.sao.advice}\n\nTháng cần lưu ý: ${result.sao.thang}`,
                  },
                ];

                const nextRows = [1, 2, 3, 4]
                  .map((d) => {
                    const yr = result.viewYear + d;
                    const next = computeSaoHan(birthYear, result.gender, yr);
                    if (!next) return null;
                    return {
                      label: String(yr),
                      value: `${next.sao.name} — ${TYPE_LABEL[next.sao.type]}`,
                    };
                  })
                  .filter((r): r is { label: string; value: string } => r !== null);
                if (nextRows.length > 0) {
                  sections.push({ heading: 'Sao hạn các năm tới', rows: nextRows });
                }

                sections.push({
                  heading: 'Lưu ý',
                  text: 'Đây là cách tra cứu theo phong tục dân gian (Cửu Diệu), mang tính tham khảo — không phải lời phán số mệnh. Việc cúng sao / giải hạn là tập tục để cầu an, hoàn toàn không bắt buộc. Sao tốt hay xấu không quyết định cuộc đời bạn; sống cẩn trọng, tử tế và chủ động vẫn là điều quan trọng nhất.',
                });

                return {
                  title: 'Sao hạn theo tuổi — hieu.asia',
                  subtitle: `Năm ${result.viewYear} · ${result.gender === 'nam' ? 'Nam' : 'Nữ'} · tuổi mụ ${result.tuoiMu}`,
                  hero: {
                    big: `Sao ${result.sao.name}`,
                    small: `${TYPE_LABEL[result.sao.type]} · năm ${result.viewYear}`,
                  },
                  sections,
                };
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
