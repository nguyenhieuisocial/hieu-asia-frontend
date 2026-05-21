'use client';

/**
 * Client component xử lý 4 flow Hợp Tuổi:
 *   - wedding / business: 2 BirthInputPair + score
 *   - birth-child: parent1 + parent2 + year_planned + suggested years
 *   - xong-dat: household_owner + danh sách candidates → ranked list
 */

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@hieu-asia/ui';
import { BirthInputPair, isValidPerson, type PersonInput } from '@/components/hop-tuoi/BirthInputPair';
import { CompatibilityScore } from '@/components/hop-tuoi/CompatibilityScore';
import { safeJson } from '@/lib/safe-json';
import type { HopTuoiType } from './page';

// ----- shared API -----
function getApiBase(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://api.hieu.asia';
}

interface Factor {
  type: string;
  value: string;
  verdict: string;
  weight: number;
}

interface CompatibilityResult {
  score: number;
  rating: string;
  factors: Factor[];
  summary: string;
  warnings: string[];
  person1: { canChi: string; animal: string; napAm: string; element: string; cungPhi: string | null; name?: string };
  person2: { canChi: string; animal: string; napAm: string; element: string; cungPhi: string | null; name?: string };
}

interface BirthChildResult {
  combinedScore: number;
  rating: string;
  parent1WithChild: CompatibilityResult;
  parent2WithChild: CompatibilityResult;
  yearPlanned: number;
  childYear: { canChi: string; animal: string; napAm: string };
  suggestedYears: Array<{ year: number; canChi: string; animal: string; score: number }>;
}

interface XongDatResult {
  household: { canChi: string; animal: string };
  ranked: Array<{
    candidate: { canChi: string; animal: string; name?: string };
    score: number;
    rating: string;
    factors: Factor[];
    summary: string;
  }>;
}

// ============================================================================
// Wedding / Business — same UI, different endpoint + copy
// ============================================================================
function TwoPersonFlow({ type }: { type: 'wedding' | 'business' }) {
  const [pair, setPair] = React.useState<[PersonInput, PersonInput]>([
    { name: '', year: '', gender: 'M' },
    { name: '', year: '', gender: 'F' },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<CompatibilityResult | null>(null);

  const labels: [string, string] =
    type === 'wedding' ? ['Nam', 'Nữ'] : ['Người 1', 'Người 2'];

  async function onSubmit() {
    setError(null);
    setResult(null);
    if (!isValidPerson(pair[0]) || !isValidPerson(pair[1])) {
      setError('Vui lòng nhập đầy đủ năm sinh và giới tính cho cả hai người.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/tools/hop-tuoi/${type}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          person1: { year: parseInt(pair[0].year, 10), gender: pair[0].gender, name: pair[0].name || undefined },
          person2: { year: parseInt(pair[1].year, 10), gender: pair[1].gender, name: pair[1].name || undefined },
        }),
      });
      const parsed = await safeJson<{ ok?: boolean; error?: string; result?: CompatibilityResult }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const data = parsed.data;
      if (!data.ok) throw new Error(data.error || 'Lỗi không xác định');
      setResult(data.result as CompatibilityResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function onShare() {
    if (typeof navigator === 'undefined' || !result) return;
    const url = new URL(window.location.href);
    url.searchParams.set('p1y', pair[0].year);
    url.searchParams.set('p1g', pair[0].gender);
    url.searchParams.set('p2y', pair[1].year);
    url.searchParams.set('p2g', pair[1].gender);
    navigator.clipboard?.writeText(url.toString());
    alert('Đã sao chép link kết quả');
  }

  return (
    <div className="space-y-6">
      <BirthInputPair value={pair} onChange={setPair} labels={labels} />

      <div className="flex justify-center">
        <Button onClick={onSubmit} disabled={loading} size="lg">
          {loading ? 'Đang phân tích...' : 'Phân tích hợp tuổi'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && <ResultView result={result} onShare={onShare} />}
    </div>
  );
}

// ============================================================================
// Birth-child flow
// ============================================================================
function BirthChildFlow() {
  const [pair, setPair] = React.useState<[PersonInput, PersonInput]>([
    { name: '', year: '', gender: 'M' },
    { name: '', year: '', gender: 'F' },
  ]);
  const [yearPlanned, setYearPlanned] = React.useState<string>(String(new Date().getFullYear() + 1));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<BirthChildResult | null>(null);

  async function onSubmit() {
    setError(null);
    setResult(null);
    if (!isValidPerson(pair[0]) || !isValidPerson(pair[1])) {
      setError('Vui lòng nhập đầy đủ năm sinh + giới tính của cha mẹ.');
      return;
    }
    const yp = parseInt(yearPlanned, 10);
    if (!Number.isInteger(yp) || yp < 1900 || yp > 2100) {
      setError('Năm dự định sinh con không hợp lệ.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/tools/hop-tuoi/birth-child`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          parent1: { year: parseInt(pair[0].year, 10), gender: pair[0].gender },
          parent2: { year: parseInt(pair[1].year, 10), gender: pair[1].gender },
          year_planned: yp,
        }),
      });
      const parsed = await safeJson<{ ok?: boolean; error?: string; result?: BirthChildResult }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const data = parsed.data;
      if (!data.ok) throw new Error(data.error || 'Lỗi');
      setResult(data.result as BirthChildResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <BirthInputPair value={pair} onChange={setPair} labels={['Cha', 'Mẹ']} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Năm dự định sinh con</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            inputMode="numeric"
            min={1900}
            max={2100}
            value={yearPlanned}
            onChange={(e) => setYearPlanned(e.target.value)}
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onSubmit} disabled={loading} size="lg">
          {loading ? 'Đang phân tích...' : 'Xem hợp tuổi sinh con'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <CompatibilityScore score={result.combinedScore} rating={result.rating} />
            <p className="max-w-2xl text-center text-cream/80">
              Năm {result.yearPlanned} ({result.childYear.canChi} — {result.childYear.animal}, nạp âm{' '}
              {result.childYear.napAm}).
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Năm tốt nhất (gợi ý)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {result.suggestedYears.map((y) => (
                  <div
                    key={y.year}
                    className="flex items-center justify-between rounded-md border border-cream/10 bg-cream/5 px-3 py-2"
                  >
                    <span className="text-sm">
                      {y.year} — {y.canChi} ({y.animal})
                    </span>
                    <span className="font-mono text-sm font-semibold text-gold">{y.score}/100</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết với cha</CardTitle>
            </CardHeader>
            <CardContent>
              <FactorList factors={result.parent1WithChild.factors} />
              <p className="mt-3 text-sm text-cream/70">{result.parent1WithChild.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết với mẹ</CardTitle>
            </CardHeader>
            <CardContent>
              <FactorList factors={result.parent2WithChild.factors} />
              <p className="mt-3 text-sm text-cream/70">{result.parent2WithChild.summary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Xong-dat flow
// ============================================================================
function XongDatFlow() {
  const [ownerYear, setOwnerYear] = React.useState<string>('');
  const [ownerGender, setOwnerGender] = React.useState<'M' | 'F'>('M');
  const [candidates, setCandidates] = React.useState<PersonInput[]>([
    { name: '', year: '', gender: 'M' },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<XongDatResult | null>(null);

  function addCandidate() {
    setCandidates((c) => [...c, { name: '', year: '', gender: 'M' }]);
  }
  function removeCandidate(idx: number) {
    setCandidates((c) => c.filter((_, i) => i !== idx));
  }
  function updateCandidate(idx: number, patch: Partial<PersonInput>) {
    setCandidates((c) => c.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function onSubmit() {
    setError(null);
    setResult(null);
    const y = parseInt(ownerYear, 10);
    if (!Number.isInteger(y) || y < 1900) {
      setError('Năm sinh gia chủ không hợp lệ.');
      return;
    }
    const validCands = candidates.filter((c) => isValidPerson(c));
    if (!validCands.length) {
      setError('Vui lòng nhập ít nhất 1 ứng viên hợp lệ.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/tools/hop-tuoi/xong-dat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          household_owner_birth_year: y,
          household_owner_gender: ownerGender,
          candidates: validCands.map((c) => ({
            year: parseInt(c.year, 10),
            gender: c.gender,
            name: c.name || undefined,
          })),
        }),
      });
      const parsed = await safeJson<{ ok?: boolean; error?: string; result?: XongDatResult }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const data = parsed.data;
      if (!data.ok) throw new Error(data.error || 'Lỗi');
      setResult(data.result as XongDatResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gold">Gia chủ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="owner-year">Năm sinh gia chủ</Label>
              <Input
                id="owner-year"
                type="number"
                inputMode="numeric"
                min={1900}
                max={new Date().getFullYear()}
                placeholder="VD: 1975"
                value={ownerYear}
                onChange={(e) => setOwnerYear(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Giới tính</Label>
              <RadioGroup
                name="owner-gender"
                value={ownerGender}
                onValueChange={(g) => setOwnerGender(g as 'M' | 'F')}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="M" id="owner-m" />
                  <Label htmlFor="owner-m">Nam</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="F" id="owner-f" />
                  <Label htmlFor="owner-f">Nữ</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gold">Ứng viên xông đất</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {candidates.map((c, idx) => (
            <div key={idx} className="grid items-end gap-2 md:grid-cols-[1fr_120px_140px_auto]">
              <Input
                placeholder="Tên (tuỳ chọn)"
                value={c.name}
                onChange={(e) => updateCandidate(idx, { name: e.target.value })}
              />
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Năm sinh"
                value={c.year}
                onChange={(e) => updateCandidate(idx, { year: e.target.value })}
              />
              <RadioGroup
                name={`cand-${idx}-gender`}
                value={c.gender}
                onValueChange={(g) => updateCandidate(idx, { gender: g as 'M' | 'F' })}
                className="flex gap-3"
              >
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="M" id={`cand-${idx}-m`} />
                  <Label htmlFor={`cand-${idx}-m`} className="text-xs">
                    Nam
                  </Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem value="F" id={`cand-${idx}-f`} />
                  <Label htmlFor={`cand-${idx}-f`} className="text-xs">
                    Nữ
                  </Label>
                </div>
              </RadioGroup>
              {candidates.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeCandidate(idx)}>
                  ✕
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCandidate}>
            + Thêm ứng viên
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onSubmit} disabled={loading} size="lg">
          {loading ? 'Đang xếp hạng...' : 'Xếp hạng ứng viên'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Có lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>
              Bảng xếp hạng (gia chủ: {result.household.canChi} — {result.household.animal})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.ranked.map((r, i) => (
                <div key={i} className="rounded-lg border border-cream/10 bg-cream/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        #{i + 1} — {r.candidate.name || `Ứng viên ${i + 1}`} ({r.candidate.canChi},{' '}
                        {r.candidate.animal})
                      </div>
                      <div className="text-sm text-cream/60">{r.rating}</div>
                    </div>
                    <div className="font-mono text-2xl font-bold text-gold">{r.score}</div>
                  </div>
                  <p className="mt-2 text-sm text-cream/70">{r.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// Shared result view (wedding/business)
// ============================================================================
function ResultView({ result, onShare }: { result: CompatibilityResult; onShare: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <CompatibilityScore score={result.score} rating={result.rating} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <PersonInfo p={result.person1} />
            <PersonInfo p={result.person2} />
          </div>
          <p className="text-cream/80">{result.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Các yếu tố phân tích</CardTitle>
        </CardHeader>
        <CardContent>
          <FactorList factors={result.factors} />
        </CardContent>
      </Card>

      {result.warnings.length > 0 && (
        <Alert>
          <AlertTitle>Lưu ý</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onShare}>
          Sao chép link kết quả
        </Button>
      </div>
    </div>
  );
}

function PersonInfo({ p }: { p: CompatibilityResult['person1'] }) {
  return (
    <div className="rounded-md border border-cream/10 bg-cream/5 p-3">
      <div className="font-medium text-gold">{p.name || 'Người'}</div>
      <div className="mt-1 text-cream/80">
        {p.canChi} — {p.animal}
      </div>
      <div className="text-xs text-cream/60">
        Nạp âm: {p.napAm} ({p.element})
      </div>
      {p.cungPhi && <div className="text-xs text-cream/60">Cung Phi: {p.cungPhi}</div>}
    </div>
  );
}

function FactorList({ factors }: { factors: Factor[] }) {
  return (
    <ul className="space-y-2">
      {factors.map((f, i) => (
        <li key={i} className="flex items-start justify-between gap-3 rounded-md border border-cream/10 px-3 py-2">
          <div>
            <div className="text-sm font-medium">{f.type}</div>
            <div className="text-xs text-cream/60">
              {f.value} — {f.verdict}
            </div>
          </div>
          <span
            className={
              f.weight > 0
                ? 'font-mono text-sm text-emerald-400'
                : f.weight < 0
                  ? 'font-mono text-sm text-rose-400'
                  : 'font-mono text-sm text-cream/40'
            }
          >
            {f.weight > 0 ? `+${f.weight}` : f.weight}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ============================================================================
// Entry — switch by type
// ============================================================================
export function HopTuoiClient({ type }: { type: HopTuoiType }) {
  if (type === 'wedding' || type === 'business') return <TwoPersonFlow type={type} />;
  if (type === 'birth-child') return <BirthChildFlow />;
  if (type === 'xong-dat') return <XongDatFlow />;
  return null;
}
