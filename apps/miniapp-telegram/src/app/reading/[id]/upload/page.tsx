'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Sun, Focus, Hand, Camera, X } from 'lucide-react';
import { TgMainButton } from '@/components/tg-main-button';
import { TgBackButton } from '@/components/tg-back-button';
import { haptic } from '@/lib/telegram-haptic';

const CHECKLIST = [
  { Icon: Sun, text: 'Đủ ánh sáng, không ngược sáng' },
  { Icon: Focus, text: 'Lấy nét sắc nét, không rung' },
  { Icon: Hand, text: 'Mở rộng lòng bàn tay, không co' },
];

export default function MiniAppUploadPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const readingId = params.id;

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onPick = (f: File) => {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
    void haptic('success');
  };

  const onClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onContinue = () => {
    if (!file) return;
    // V1 mock — real upload to MinIO/S3 happens via presigned URL in api-client.
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        `hieu.upload.${readingId}`,
        JSON.stringify({ public_read_url: previewUrl ?? '', mock: true }),
      );
    }
    router.push(`/reading/${readingId}/survey`);
  };

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton />

      <div className="mx-auto max-w-md pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Bước 3 / 4</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">Chụp ảnh lòng bàn tay</h1>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base">Hướng dẫn nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm text-cream/85">
              {CHECKLIST.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="mt-5">
          {previewUrl ? (
            <div className="relative overflow-hidden rounded-lg border border-gold/25 bg-ink/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview ảnh bàn tay" className="w-full object-contain" />
              <button
                type="button"
                onClick={onClear}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/80 text-cream hover:bg-ink"
                aria-label="Xoá ảnh"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gold/30 bg-ink/30 px-4 py-12 text-cream/80 transition-colors hover:border-gold/60"
            >
              <Camera className="h-8 w-8 text-gold" aria-hidden="true" />
              <span className="text-sm">Chạm để chụp / chọn ảnh</span>
              <span className="text-xs text-cream/55">JPG / PNG · tối đa 10MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
            }}
          />
        </div>

        <p className="mt-4 text-center text-xs text-cream/50">Ảnh được mã hoá khi lưu, chỉ dùng cho phiên này.</p>
      </div>

      <TgMainButton text="Tiếp tục" onClick={onContinue} disabled={!file} />
    </main>
  );
}
