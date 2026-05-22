'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Sun, Focus, Hand, MoveDiagonal } from 'lucide-react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { PalmUpload } from '@/components/palm-upload';
import { SiteNav } from '@/components/home/SiteNav';
import { uploadHandImage } from '@/lib/upload-image';
import { track } from '@/lib/analytics';

const CHECKLIST = [
  { icon: Sun, text: 'Ánh sáng rõ, không tối' },
  { icon: Focus, text: 'Hình ảnh sắc nét, không mờ' },
  { icon: Hand, text: 'Lòng bàn tay mở rộng, không che các đường chính' },
  { icon: MoveDiagonal, text: 'Chụp thẳng, không nghiêng quá nhiều' },
];

export default function PalmUploadPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const readingId = params.id;

  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  async function handleContinue() {
    if (!file) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // user_id: phase 2 will plug Auth.js session. For now use draft id.
      const userId =
        (typeof window !== 'undefined' && window.sessionStorage.getItem('hieu.user_id')) ||
        `anon-${readingId}`;
      const result = await uploadHandImage(file, userId);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          `hieu.upload.${readingId}`,
          JSON.stringify(result),
        );
      }
      track('palm_uploaded', { reading_id: readingId, size_bytes: file.size, content_type: file.type });
      router.push(
        `/reading/${readingId}/survey?upload_object=${encodeURIComponent(result.object_name)}`,
      );
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Tải ảnh thất bại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink-radial pb-24 pt-16">
        <header className="container mx-auto max-w-2xl px-5 py-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/reading" className="hover:text-gold">Lá số</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Tải ảnh tay</span>
          </nav>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Bước 2 / 4
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">Tải ảnh</span>{' '}
            lòng bàn tay
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hệ thống phân tích các đường chỉ tay để cộng hưởng với dữ liệu sinh trắc.
          </p>
        </header>

      <section className="container mx-auto max-w-2xl space-y-6 px-5">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4 font-medium text-foreground">Hướng dẫn chụp</p>
            <ul className="space-y-3">
              {CHECKLIST.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="relative">
          {/* Decorative frame guide */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-gold/10" />
          <PalmUpload
            file={file}
            previewUrl={previewUrl}
            onSelect={(f, url) => {
              setFile(f);
              setPreviewUrl(url);
            }}
            onClear={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setFile(null);
              setPreviewUrl(null);
            }}
          />
        </div>

        {submitError && (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {submitError}
          </p>
        )}

        <Button
          size="lg"
          className="w-full"
          disabled={!file || submitting}
          onClick={handleContinue}
        >
          {submitting ? 'Đang tải ảnh…' : 'Tiếp tục'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Ảnh được mã hoá khi lưu trữ và chỉ dùng để phân tích cho phiên này.
        </p>
      </section>
      </main>
    </>
  );
}
