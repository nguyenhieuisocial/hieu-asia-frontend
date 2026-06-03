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

        {error && (
          <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
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

            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là cách tra cứu theo phong tục dân gian, mang tính <strong>tham khảo</strong> — không
              phải lời phán số mệnh. Sao tốt hay xấu không quyết định cuộc đời bạn; sống cẩn trọng, tử
              tế và chủ động vẫn là điều quan trọng nhất.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
