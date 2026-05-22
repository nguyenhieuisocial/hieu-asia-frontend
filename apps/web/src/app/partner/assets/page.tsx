'use client';

/**
 * /partner/assets — link card to the existing /affiliate/assets page.
 *
 * Wave 44. No content duplication; the existing marketing asset library
 * already serves both the legacy /affiliate dashboard and the new portal.
 */

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { PartnerShell } from '@/components/partner/PartnerShell';

export default function PartnerAssetsPage() {
  return (
    <PartnerShell>
      {() => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu marketing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">
                Thư viện hình ảnh, copy mẫu, banner và assets QR sẵn sàng để chia sẻ. Mở thư viện trong tab mới để tiện copy.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/affiliate/assets"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gold px-5 text-sm font-medium text-background hover:bg-gold/90"
                >
                  Mở thư viện tài liệu →
                </Link>
                <Link
                  href="/affiliate/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-foreground/15 px-5 text-sm hover:bg-foreground/5"
                >
                  Dashboard cũ (KV legacy)
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gợi ý nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-foreground/80">
              <p>
                • Dùng link <code className="rounded bg-foreground/5 px-1 font-mono text-xs">https://hieu.asia/?ref=&lt;mã&gt;</code> trên social.
              </p>
              <p>
                • Hoặc dùng landing path <code className="rounded bg-foreground/5 px-1 font-mono text-xs">/r/&lt;mã&gt;</code> ngắn gọn hơn cho SMS / Zalo.
              </p>
              <p>
                • QR code có sẵn trong thư viện tài liệu — phù hợp hội thảo, in name card.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </PartnerShell>
  );
}
