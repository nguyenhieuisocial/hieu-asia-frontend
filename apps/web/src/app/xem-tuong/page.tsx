'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Skeleton,
} from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { ReferralCard } from '@/components/account/ReferralCard';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { aiReadingToSections } from '@/lib/pdf/ai-reading-sections';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { markVisionDone } from '@/lib/personality-store';
import { getSupabaseAuth } from '@/lib/auth-client';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';
import { describeApiError } from '@/lib/api-error';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

const FAQS = [
  {
    q: 'Xem chỉ tay, tướng mặt ở đây dựa trên gì?',
    a: 'Trên nhân tướng học — bộ môn quan sát đặc điểm khuôn mặt, bàn tay có truyền thống lâu đời ở Đông Á. AI mô tả các đặc điểm nhìn thấy được trong ảnh bạn gửi (đường nét bàn tay, tỉ lệ và nét chính của khuôn mặt) rồi đối chiếu với cách diễn giải truyền thống để đưa ra góc nhìn về xu hướng tính cách, ứng xử. Tất cả mang tính tham khảo.',
  },
  {
    q: 'Ảnh của tôi có bị lưu lại không?',
    a: 'Không — ảnh được xử lý để phân tích xong là bỏ, không lưu trữ. Ảnh cũng được nén ngay trên máy bạn trước khi gửi. Lưu ý nhỏ: chỉ gửi ảnh của chính bạn, hoặc ảnh người khác khi đã được họ đồng ý.',
  },
  {
    q: 'Kết quả có khoa học không?',
    a: 'Nói thẳng: nhân tướng học là quan sát kinh nghiệm dân gian, không phải khoa học được kiểm chứng. Giá trị thật của nó nằm ở chỗ cho bạn một tấm gương để tự ngẫm về mình — không phải ở việc "đoán đúng". Nếu thấy kết quả nào cũng "đúng ghê", hãy đọc thêm bài Tự kiểm về hiệu ứng Forer trên trang này — đó là một thiên kiến tâm lý rất phổ biến.',
  },
  {
    q: 'Tướng "xấu" có nghĩa là số khổ không?',
    a: 'Không. Người xưa có câu "tướng tự tâm sinh" — nét mặt, dáng vẻ phần nhiều phản ánh nếp sống và tâm thế hiện tại, và chúng thay đổi theo thời gian. Không một đường nét nào trên ảnh phán định được cuộc đời bạn. Kết quả ở đây không bao giờ "phán số khổ" — nếu nơi nào đó làm vậy để bán bùa giải, hãy cảnh giác.',
  },
  {
    q: 'Chụp ảnh thế nào để kết quả tốt nhất?',
    a: 'Ảnh đủ sáng, rõ nét, không bị che. Với chỉ tay: mở lòng bàn tay thẳng, chụp chính diện cả bàn tay. Với tướng mặt: khuôn mặt chính diện, không đeo kính râm hay khẩu trang. Ảnh càng rõ, phần mô tả đặc điểm càng sát.',
  },
];

type Kind = 'palm' | 'face';
type Gender = 'nam' | 'nữ';

interface VisionReadResult {
  ok: true;
  kind: Kind;
  reading: string;
  model: string;
}

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

/** Resize + compress an image File client-side to avoid large payloads. */
async function resizeToDataUrl(file: File, maxPx = 1024, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không đọc được ảnh'));
    };
    img.src = url;
  });
}

export default function XemTuongPage() {
  const [kind, setKind] = React.useState<Kind>('palm');
  const [gender, setGender] = React.useState<Gender>('nam');
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [paywallData, setPaywallData] = React.useState<FeatureLockedPayload | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setReading(null);
    setError(null);
    if (f) {
      const objectUrl = URL.createObjectURL(f);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // Clean up object URL on unmount or when preview changes
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setReading(null);
    setPaywallData(null);

    if (!file) {
      setError('Vui lòng chọn hoặc chụp ảnh để tiếp tục.');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await resizeToDataUrl(file);

      // Attach Supabase Bearer so the backend can identify the user when priced.
      const sb = getSupabaseAuth();
      let token: string | undefined;
      if (sb) {
        const { data } = await sb.auth.getSession();
        token = data.session?.access_token;
      }

      const res = await fetch(`${API_BASE}/tools/vision-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ image_url: imageUrl, kind, gender }),
      });

      if (res.status === 429) {
        throw new Error('Hệ thống đang bận — vui lòng thử lại sau ít phút.');
      }

      // 402 feature_locked → show paywall instead of error.
      if (res.status === 402) {
        const parsed = await safeJson<FeatureLockedPayload>(res);
        if (parsed.ok && parsed.data.error === 'feature_locked') {
          setPaywallData(parsed.data);
          return;
        }
        throw new Error('Tính năng chưa được mở khoá.');
      }

      const parsed = await safeJson<VisionReadResult | { ok: false; error: string }>(res);
      if (!parsed.ok) throw new Error(`Lỗi kết nối (HTTP ${parsed.status})`);

      const json = parsed.data as VisionReadResult | { ok: false; error: string };
      if (!json.ok) throw new Error((json as { ok: false; error: string }).error ?? 'Không phân tích được ảnh');

      setReading((json as VisionReadResult).reading);
      markVisionDone();
      track('tool_used', { tool: 'vision-read', kind, result: 'ok' });
    } catch (err) {
      setError(describeApiError(err));
      track('tool_used', { tool: 'vision-read', kind, result: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFile(null);
    setPreview(null);
    setReading(null);
    setError(null);
    setPaywallData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <ToolPageShell
        eyebrow="Tướng số học"
        relatedSlug="/xem-tuong"
        icon={<span aria-hidden="true">🖐️</span>}
        title={
          <>
            Xem Chỉ Tay <GoldAccent>&amp; Tướng Mặt</GoldAccent>
          </>
        }
        description="Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách và ứng xử theo tướng số học. Kết quả mang tính tham khảo, không phán định số phận."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem Chỉ Tay & Tướng Mặt' },
        ]}
      >
        <section className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Left: form */}
          <div className="lg:col-span-2">
            <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Chọn loại xem</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={onSubmit}>
                  {/* Kind picker */}
                  <div className="space-y-2">
                    <Label className="text-foreground/85">Loại xem</Label>
                    <RadioGroup
                      name="kind"
                      value={kind}
                      onValueChange={(v) => { setKind(v as Kind); onReset(); }}
                      className="grid grid-cols-2 gap-2"
                    >
                      <label
                        htmlFor="kind-palm"
                        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                          kind === 'palm'
                            ? 'border-gold/50 bg-gold/10 text-gold'
                            : 'border-border bg-card/40 text-muted-foreground hover:border-gold/30'
                        }`}
                      >
                        <RadioGroupItem value="palm" id="kind-palm" className="sr-only" />
                        <span aria-hidden className="text-2xl">🖐️</span>
                        <span className="text-sm font-medium">Xem chỉ tay</span>
                      </label>
                      <label
                        htmlFor="kind-face"
                        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                          kind === 'face'
                            ? 'border-gold/50 bg-gold/10 text-gold'
                            : 'border-border bg-card/40 text-muted-foreground hover:border-gold/30'
                        }`}
                      >
                        <RadioGroupItem value="face" id="kind-face" className="sr-only" />
                        <span aria-hidden className="text-2xl">🫡</span>
                        <span className="text-sm font-medium">Xem tướng mặt</span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Gender picker */}
                  <div className="space-y-2">
                    <Label className="text-foreground/85">Giới tính (không bắt buộc)</Label>
                    <RadioGroup
                      name="gender"
                      value={gender}
                      onValueChange={(v) => setGender(v as Gender)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nam" id="g-nam" />
                        <Label htmlFor="g-nam" className="font-normal text-foreground/85">
                          Nam
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nữ" id="g-nu" />
                        <Label htmlFor="g-nu" className="font-normal text-foreground/85">
                          Nữ
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* File upload */}
                  <div className="space-y-2">
                    <Label htmlFor="photo-upload" className="text-foreground/85">
                      {kind === 'palm' ? 'Ảnh lòng bàn tay' : 'Ảnh khuôn mặt'}
                    </Label>
                    <div
                      className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/30 px-4 py-6 text-center transition-colors hover:border-gold/40 hover:bg-gold/[0.04]"
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      aria-label={`Chọn ảnh ${kind === 'palm' ? 'lòng bàn tay' : 'khuôn mặt'}`}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                    >
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={preview}
                          alt="Ảnh đã chọn"
                          className="max-h-48 rounded-lg object-contain shadow"
                        />
                      ) : (
                        <>
                          <span aria-hidden className="text-3xl">📷</span>
                          <p className="text-sm text-muted-foreground">
                            Nhấn để chọn ảnh từ máy
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            hoặc chụp trực tiếp từ camera (trên điện thoại)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="sr-only"
                      onChange={onFileChange}
                    />
                    {preview && (
                      <button
                        type="button"
                        onClick={onReset}
                        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        Chọn ảnh khác
                      </button>
                    )}
                  </div>

                  {/* Privacy notice */}
                  <p className="rounded-lg border border-border bg-card/30 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                    🔒 Ảnh được gửi để phân tích và <strong className="text-foreground/70">không được lưu trữ</strong> trên máy chủ.
                  </p>

                  {/* Error */}
                  {error && (
                    <p
                      role="alert"
                      className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                    >
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={loading || !file} className="w-full">
                    {loading ? 'Đang phân tích...' : `Xem ${kind === 'palm' ? 'chỉ tay' : 'tướng mặt'} →`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: result */}
          <div className="lg:col-span-3">
            {loading && <XemTuongSkeleton />}

            {!loading && paywallData && (
              <FeaturePaywall
                slug={paywallData.slug}
                price={paywallData.price}
                label="Xem tướng"
                onUnlocked={() => {
                  setPaywallData(null);
                  // Re-submit is triggered by user clicking the form button again
                  // after unlock. Clear paywall so the form is re-enabled.
                }}
              />
            )}

            {!loading && !paywallData && !reading && (
              <Card className="border-dashed border-border bg-card/30">
                <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <div aria-hidden className="text-5xl">
                    {kind === 'palm' ? '🖐️' : '🫡'}
                  </div>
                  <h2 className="mt-4 font-heading text-lg text-foreground">Chưa có kết quả</h2>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    {kind === 'palm'
                      ? 'Tải ảnh lòng bàn tay (mở rộng, rõ đường chỉ tay) rồi nhấn phân tích.'
                      : 'Tải ảnh khuôn mặt nhìn thẳng, đủ sáng, không bị che khuất rồi nhấn phân tích.'}
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading && !paywallData && reading && (
              <div className="space-y-4">
                <Card className="relative overflow-hidden border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
                  />
                  <CardHeader className="relative pb-2">
                    <CardTitle className="text-base text-gold-700">
                      {kind === 'palm' ? '✋ Luận chỉ tay' : '🫡 Luận tướng mặt'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <article className="markdown-report space-y-3 text-sm leading-relaxed text-foreground/90">
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => (
                            <h2 className="mt-4 font-heading text-xl text-gold" {...props} />
                          ),
                          h2: ({ ...props }) => (
                            <h3 className="mt-3 font-heading text-lg text-foreground" {...props} />
                          ),
                          h3: ({ ...props }) => (
                            <h4 className="mt-3 font-heading text-base text-foreground" {...props} />
                          ),
                          p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
                          ul: ({ ...props }) => (
                            <ul className="ml-5 list-disc space-y-1" {...props} />
                          ),
                          ol: ({ ...props }) => (
                            <ol className="ml-5 list-decimal space-y-1" {...props} />
                          ),
                          strong: ({ ...props }) => (
                            <strong className="text-gold" {...props} />
                          ),
                        }}
                      >
                        {reading}
                      </ReactMarkdown>
                    </article>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-3">
                  <ShareResultButton
                    path="/xem-tuong"
                    title="Xem tướng bằng AI"
                    text="Mình vừa thử xem tướng trên hieu.asia — bạn thử xem!"
                    trackId="xem-tuong"
                  />
                  <DownloadToolPdfButton
                    source="pdf-xem-tuong"
                    payload={() => {
                      if (!reading) return null;
                      const loaiXem = kind === 'palm' ? 'Chỉ tay' : 'Tướng mặt';
                      const fallbackHeading =
                        kind === 'palm' ? 'Luận chỉ tay (AI)' : 'Luận tướng mặt (AI)';
                      return {
                        title: `Xem ${loaiXem} — hieu.asia`,
                        subtitle:
                          'Luận giải tướng số học bằng AI · Kết quả mang tính tham khảo, không phán định số phận.',
                        hero: {
                          big: kind === 'palm' ? 'Luận chỉ tay' : 'Luận tướng mặt',
                          small: `Nhân tướng học · ${gender === 'nam' ? 'Nam' : 'Nữ'}`,
                        },
                        sections: [
                          {
                            heading: 'Thông tin',
                            rows: [
                              { label: 'Loại xem', value: loaiXem },
                              { label: 'Giới tính', value: gender === 'nam' ? 'Nam' : 'Nữ' },
                            ],
                          },
                          ...aiReadingToSections(reading, fallbackHeading),
                          {
                            heading: 'Lưu ý',
                            text: 'Kết quả mang tính tham khảo — phản ánh xu hướng và ứng xử theo tướng số học, không phán định số phận hay kết quả cụ thể. Nhân tướng học là kinh nghiệm quan sát dân gian, không phải khoa học được kiểm chứng.',
                          },
                        ],
                      };
                    }}
                  />
                </div>
                {/* Lời mời bạn bè ngay tại lúc khách vừa thấy kết quả — trước đây
                    chỉ nằm ở /account nên gần như không ai thấy. Thẻ tự ẩn khi
                    khách chưa đăng nhập. */}
                <div className="pt-2">
                  <ReferralCard hideWhileLoading />
                </div>

                <p className="rounded-lg border border-border bg-card/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  Kết quả mang tính <strong className="text-foreground/70">tham khảo</strong> — phản ánh xu hướng và ứng xử theo tướng số học, không phán định số phận hay kết quả cụ thể. Ảnh đã được xử lý và không được lưu trữ.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onReset}
                  className="w-full"
                >
                  ↺ Xem ảnh khác
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Nhân tướng học là gì — lớp giáo dục (audit content-depth: flagship lens 0 editorial) */}
        <section className="mt-12" aria-label="Tìm hiểu nhân tướng học">
          <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
            Nhân tướng học — hiểu đúng trước khi xem
          </h2>
          <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Nhân tướng học là bộ môn quan sát đặc điểm khuôn mặt và bàn tay, có truyền thống lâu
              đời ở Đông Á; xem chỉ tay cũng xuất hiện trong nhiều nền văn hoá khác. Cốt lõi của nó
              là kinh nghiệm quan sát được tích luỹ qua nhiều thế hệ — không phải khoa học được kiểm
              chứng, và chúng tôi nói rõ điều đó thay vì khoác cho nó chiếc áo huyền bí.
            </p>
            <p>
              <strong className="text-foreground">AI ở đây làm gì:</strong> mô tả những đặc điểm
              nhìn thấy được trong ảnh — đường nét chính của bàn tay, tỉ lệ và nét nổi bật của khuôn
              mặt — rồi đối chiếu với cách diễn giải truyền thống để gợi một góc nhìn về xu hướng
              tính cách, ứng xử. Như soi vào một tấm gương lạ: thứ đáng giá không phải lời "phán",
              mà là khoảnh khắc bạn dừng lại tự ngẫm xem điều nào đúng, điều nào không.
            </p>
            <p>
              <strong className="text-foreground">Giới hạn — nói thẳng:</strong> công cụ này không
              chẩn đoán sức khoẻ hay tâm lý, không đoán tương lai, không quyết định thay bạn. Người
              xưa cũng nói &quot;tướng tự tâm sinh&quot; — nét mặt phản ánh nếp sống hiện tại và
              thay đổi theo thời gian, nên không có chuyện một bức ảnh định đoạt một đời người.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <Link href="/learn/palm" className="text-gold hover:underline">
                Học về xem chỉ tay →
              </Link>
              <Link href="/methodology" className="text-gold hover:underline">
                Phương pháp luận của hieu.asia →
              </Link>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-label="Câu hỏi thường gặp về xem tướng">
          <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
            Câu hỏi thường gặp
          </h2>
          <dl className="mt-5 max-w-3xl space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </ToolPageShell>
      <JsonLd data={faqPage(FAQS)} />
      <StickyMobileCta trackId="xem-tuong" />
    </>
  );
}

function XemTuongSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card/50">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-5/6" />
          <Skeleton className="mt-2 h-3 w-4/6" />
        </CardContent>
      </Card>
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}
