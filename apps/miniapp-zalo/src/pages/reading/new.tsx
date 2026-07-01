import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Input, Label, Time24 } from '@hieu-asia/ui';
import { ZaloHeader } from '../../components/zalo-header';
import { ZaloBottomCta } from '../../components/zalo-bottom-cta';

interface BirthDraft {
  display_name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  gender: 'male' | 'female' | 'other' | 'unspecified';
  calendar: 'solar' | 'lunar';
  certainty: number;
}

const DEFAULT_DRAFT: BirthDraft = {
  display_name: '',
  birth_date: '',
  birth_time: '',
  birth_place: '',
  gender: 'unspecified',
  calendar: 'solar',
  certainty: 3,
};

function makeReadingId() {
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function NewReadingPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<BirthDraft>(DEFAULT_DRAFT);
  const valid = !!draft.birth_date;

  const onContinue = () => {
    const readingId = makeReadingId();
    window.sessionStorage.setItem(`hieu.birth.${readingId}`, JSON.stringify(draft));
    navigate(`/reading/${readingId}/upload`);
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-24">
      <ZaloHeader title="Thông tin ngày sinh" step="Bước 2 / 4" backTo="/consent" />
      <section className="px-4 pt-5">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="name">Họ tên / biệt danh</Label>
              <Input
                id="name"
                placeholder="Tùy chọn"
                value={draft.display_name}
                onChange={(e) => setDraft({ ...draft, display_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="bdate">Ngày sinh *</Label>
              <Input
                id="bdate"
                type="date"
                value={draft.birth_date}
                onChange={(e) => setDraft({ ...draft, birth_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="btime">Giờ sinh</Label>
              <Time24
                id="btime"
                value={draft.birth_time}
                onChange={(v) => setDraft({ ...draft, birth_time: v })}
              />
              <p className="mt-1 text-[11px] text-cream/50">
                Nếu không nhớ, hệ thống sẽ giảm độ tin cậy phần vận hạn.
              </p>
            </div>
            <div>
              <Label htmlFor="bplace">Nơi sinh</Label>
              <Input
                id="bplace"
                placeholder="VD: Hà Nội, Việt Nam"
                value={draft.birth_place}
                onChange={(e) => setDraft({ ...draft, birth_place: e.target.value })}
              />
            </div>
            <div>
              <Label>Giới tính</Label>
              <select
                value={draft.gender}
                onChange={(e) =>
                  setDraft({ ...draft, gender: e.target.value as BirthDraft['gender'] })
                }
                className="mt-1 w-full rounded-md border border-gold/25 bg-ink/40 px-3 py-2 text-sm text-cream"
              >
                <option value="unspecified">Không nói</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <Label>Lịch</Label>
              <div className="mt-1 flex gap-2">
                {(['solar', 'lunar'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraft({ ...draft, calendar: c })}
                    className={
                      'flex-1 rounded-md border px-3 py-2 text-sm ' +
                      (draft.calendar === c
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gold/20 text-cream/70')
                    }
                  >
                    {c === 'solar' ? 'Dương lịch' : 'Âm lịch'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="cert">Độ chắc chắn giờ sinh: {draft.certainty}/5</Label>
              <input
                id="cert"
                type="range"
                min={1}
                max={5}
                value={draft.certainty}
                onChange={(e) => setDraft({ ...draft, certainty: Number(e.target.value) })}
                className="mt-2 w-full accent-gold"
              />
            </div>
          </CardContent>
        </Card>
      </section>
      <ZaloBottomCta onClick={onContinue} disabled={!valid}>
        Tiếp tục
      </ZaloBottomCta>
    </main>
  );
}
