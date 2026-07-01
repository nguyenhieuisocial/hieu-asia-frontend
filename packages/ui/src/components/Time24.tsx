'use client';

import * as React from 'react';
import { Input } from './Input';
import { cn } from '../lib/utils';

/**
 * Time24 — ô nhập GIỜ:PHÚT dạng 24 giờ, KHÔNG phụ thuộc ngôn ngữ / locale.
 *
 * Vì sao KHÔNG dùng `<input type="time">`: control đó hiển thị AM/PM theo LOCALE
 * của trình duyệt → ở máy Việt hiện "SA"/"CH" (Sáng/Chiều). Đây là chrome của
 * trình duyệt, Google Translate KHÔNG dịch được → đổi ngôn ngữ vẫn ra "SA/CH"
 * (sai/lệch với trang đã dịch). Dùng 2 ô số 24 giờ → mọi ngôn ngữ đều đúng, hết
 * AM/PM, và giữ nguyên độ chính xác giờ:phút.
 *
 * Nguồn DUY NHẤT cho toàn monorepo (web + mini-app Zalo/Telegram) — import từ
 * `@hieu-asia/ui` để bug SA/CH không thể tái phát ở bất kỳ app nào.
 *
 * Hợp đồng dữ liệu GIỮ NGUYÊN như `<input type="time">`:
 *   value = "HH:MM" (24 giờ) hoặc "" ; onChange nhận STRING (không phải event).
 * → thay `onChange={(e) => setX(e.target.value)}` bằng `onChange={setX}`.
 */
export interface Time24Props {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  /** Áp lên 2 ô số (vd ngữ cảnh nền tối cần override màu). */
  inputClassName?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

const pad = (n: number): string => String(n).padStart(2, '0');

/** Giữ tối đa 2 chữ số, kẹp về [0, max]; rỗng vẫn rỗng. */
function clampStr(raw: string, max: number): string {
  const d = raw.replace(/\D/g, '').slice(0, 2);
  if (d === '') return '';
  return String(Math.min(max, Math.max(0, Number(d))));
}

export function Time24({
  value = '',
  onChange,
  id,
  disabled,
  className,
  inputClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
}: Time24Props): React.JSX.Element {
  const [hStr, setHStr] = React.useState('');
  const [mStr, setMStr] = React.useState('');
  const lastEmit = React.useRef<string | null>(null);

  // Đồng bộ từ prop `value` khi thay đổi TỪ BÊN NGOÀI (prefill / reset), bỏ qua
  // chính giá trị mình vừa phát ra (chống nhảy con trỏ khi gõ).
  React.useEffect(() => {
    if (value === lastEmit.current) return;
    const p = /^(\d{1,2}):(\d{1,2})$/.exec(value || '');
    setHStr(p ? p[1]! : '');
    setMStr(p ? p[2]! : '');
  }, [value]);

  const push = (rawH: string, rawM: string): void => {
    const h = clampStr(rawH, 23);
    const m = clampStr(rawM, 59);
    setHStr(h);
    setMStr(m);
    const out = h === '' && m === '' ? '' : `${pad(Number(h || '0'))}:${pad(Number(m || '0'))}`;
    lastEmit.current = out;
    onChange?.(out);
  };

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      role="group"
      aria-label={ariaLabelledby ? undefined : (ariaLabel ?? 'Giờ sinh (24 giờ)')}
      aria-labelledby={ariaLabelledby}
      aria-required={ariaRequired}
    >
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={23}
        step={1}
        placeholder="Giờ"
        aria-label="Giờ (0–23)"
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        value={hStr}
        onChange={(e) => push(e.target.value, mStr)}
        className={cn('w-20 text-center', inputClassName)}
      />
      <span aria-hidden="true" className="text-muted-foreground">
        :
      </span>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={59}
        step={1}
        placeholder="Phút"
        aria-label="Phút (0–59)"
        disabled={disabled}
        value={mStr}
        onChange={(e) => push(hStr, e.target.value)}
        className={cn('w-20 text-center', inputClassName)}
      />
    </div>
  );
}
