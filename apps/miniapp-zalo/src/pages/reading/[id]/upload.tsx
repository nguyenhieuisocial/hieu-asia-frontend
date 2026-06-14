import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@hieu-asia/ui';
import { Sun, Focus, Hand, MoveDiagonal, Camera } from 'lucide-react';
import { ZaloHeader } from '../../../components/zalo-header';
import { ZaloBottomCta } from '../../../components/zalo-bottom-cta';
import { apiClient } from '../../../lib/api-bridge';

const CHECKLIST = [
  { icon: Sun, text: 'Ánh sáng rõ, không tối' },
  { icon: Focus, text: 'Hình ảnh sắc nét, không mờ' },
  { icon: Hand, text: 'Lòng bàn tay mở rộng' },
  { icon: MoveDiagonal, text: 'Chụp thẳng, không nghiêng' },
];

async function uploadDirect(file: File, userId: string) {
  // Best-effort presigned upload; fall back to mock object name when API is unreachable.
  try {
    const presigned = await apiClient.getPresignedUpload({
      user_id: userId,
      content_type: file.type || 'image/jpeg',
    });
    const putRes = await fetch(presigned.upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'image/jpeg' },
      body: file,
    });
    // A failed PUT must NOT be treated as success — otherwise the reading is created
    // with a dead hand_image_url. Throw so the catch path falls back to the mock object.
    if (!putRes.ok) throw new Error(`presigned PUT failed: ${putRes.status}`);
    return { object_name: presigned.object_name, public_read_url: presigned.public_read_url, mock: false };
  } catch (err) {
    console.warn('[upload] falling back to mock object_name:', err);
    return { object_name: `mock/${userId}/${file.name}`, public_read_url: '', mock: true };
  }
}

export function UploadPage() {
  const navigate = useNavigate();
  const { id: readingId = '' } = useParams<{ id: string }>();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onContinue = async () => {
    if (!file) return;
    setSubmitting(true);
    setError(null);
    try {
      const userId = window.sessionStorage.getItem('hieu.user_id') ?? `anon-${readingId}`;
      const result = await uploadDirect(file, userId);
      window.sessionStorage.setItem(`hieu.upload.${readingId}`, JSON.stringify(result));
      navigate(`/reading/${readingId}/survey?upload_object=${encodeURIComponent(result.object_name)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tải ảnh thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-24">
      <ZaloHeader title="Tải ảnh lòng bàn tay" step="Bước 2 / 4" backTo="/reading/new" />

      <section className="space-y-4 px-4 pt-5">
        <Card>
          <CardContent className="pt-5">
            <p className="mb-3 font-medium text-cream">Hướng dẫn chụp</p>
            <ul className="space-y-2">
              {CHECKLIST.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-cream/85">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Ảnh bàn tay"
                  className="w-full rounded-md border border-gold/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-sm text-gold underline"
                >
                  Chụp lại
                </button>
              </div>
            ) : (
              <label
                htmlFor="palm-input"
                className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gold/30 text-cream/70"
              >
                <Camera className="h-8 w-8 text-gold" />
                <p className="mt-2 text-sm">Chạm để chụp / chọn ảnh</p>
                <input
                  id="palm-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onPick}
                />
              </label>
            )}
          </CardContent>
        </Card>

        {error ? (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <p className="px-1 text-center text-[11px] text-cream/40">
          Ảnh được mã hoá khi lưu trữ và chỉ dùng cho phiên này.
        </p>
      </section>

      <ZaloBottomCta onClick={onContinue} disabled={!file} loading={submitting}>
        Tiếp tục
      </ZaloBottomCta>
    </main>
  );
}
