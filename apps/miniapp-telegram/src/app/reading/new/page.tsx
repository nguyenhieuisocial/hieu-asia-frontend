'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Label, RadioGroup, RadioGroupItem, Time24 } from '@hieu-asia/ui';
import { TgMainButton } from '@/components/tg-main-button';
import { TgBackButton } from '@/components/tg-back-button';
import { createReading, getOrCreateAnonUserId, type BirthData } from '@hieu-asia/supabase';
import { getWebApp } from '@/lib/telegram-init';

type Gender = 'nam' | 'nữ' | 'khác' | 'không nói';

export default function NewReadingPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');
  const [birthTime, setBirthTime] = React.useState('');
  const [unknownTime, setUnknownTime] = React.useState(false);
  const [birthPlace, setBirthPlace] = React.useState('');
  const [gender, setGender] = React.useState<Gender | ''>('');
  const [concern, setConcern] = React.useState('');

  const valid =
    birthDate.length === 10 &&
    birthPlace.trim().length >= 2 &&
    !!gender &&
    (unknownTime || birthTime.length === 5);

  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    // Resolve the Telegram identity BEFORE creating the reading so it is stored under
    // tg_<id> (not anon_<uuid>) when inside Telegram. The provider sets it async, so we
    // await it here rather than racing it. Outside Telegram, fall back to the anon id.
    let userId = getOrCreateAnonUserId();
    try {
      const wa = await getWebApp();
      const tgId = wa?.initDataUnsafe?.user?.id;
      if (tgId) userId = `tg_${tgId}`;
    } catch {
      /* not inside Telegram — keep the anon id */
    }
    const birth: BirthData = {
      birth_date: birthDate,
      birth_time: unknownTime ? null : birthTime || null,
      birth_place: birthPlace,
      gender: gender || null,
      display_name: displayName || null,
      timezone: 'Asia/Ho_Chi_Minh',
      primary_concern: concern || null,
    };
    try {
      const res = await createReading(userId, birth);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          `hieu.birth.${res.session_id}`,
          JSON.stringify({ ...birth, task_id: res.task_id }),
        );
      }
      router.push(`/reading/${res.session_id}/upload`);
    } catch (e) {
      console.error('reading create failed:', e);
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton />

      <div className="mx-auto max-w-md pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Bước 2 / 4</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">Thông tin ngày sinh</h1>
        <p className="mt-2 text-sm text-cream/70">Để dựng lá số và mốc luận giải.</p>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="Tên / biệt danh" hint="Tùy chọn.">
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="VD: Anh Minh" maxLength={100} />
            </Field>

            <Field label="Ngày sinh" required>
              <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </Field>

            <Field label="Giờ sinh" hint="Càng chính xác càng tốt.">
              <Time24 value={birthTime} onChange={setBirthTime} disabled={unknownTime} />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-cream/80">
                <Checkbox checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setBirthTime(''); }} />
                Không nhớ giờ sinh
              </label>
            </Field>

            <Field label="Nơi sinh" required>
              <Input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="VD: Hà Nội" />
            </Field>

            <Field label="Giới tính" required>
              <RadioGroup
                name="gender"
                value={gender}
                onValueChange={(v) => setGender(v as Gender)}
                className="grid-cols-2"
              >
                {(['nam', 'nữ', 'khác', 'không nói'] as const).map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-gold/15 bg-ink/40 px-3 py-2 text-sm capitalize text-cream/90 has-[:checked]:border-gold has-[:checked]:bg-gold/10"
                  >
                    <RadioGroupItem value={g} />
                    <span>{g}</span>
                  </label>
                ))}
              </RadioGroup>
            </Field>

            <Field label="Mối quan tâm chính" hint="Một câu ngắn, ví dụ: 'Đang phân vân đổi việc'.">
              <Input value={concern} onChange={(e) => setConcern(e.target.value)} maxLength={200} />
            </Field>
          </CardContent>
        </Card>
      </div>

      <TgMainButton text={submitting ? 'Đang xử lý...' : 'Tiếp tục'} onClick={onSubmit} disabled={!valid || submitting} />
    </main>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-cream/55">{hint}</p>}
    </div>
  );
}
