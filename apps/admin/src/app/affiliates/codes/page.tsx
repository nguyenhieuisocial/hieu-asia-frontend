/**
 * /admin/affiliates/codes — Wave 43.2
 *
 * Affiliate-tied promo codes — reuse the coupons admin surface for v1, plus a
 * link with explanation. Heavier integration lives in /coupons.
 */

'use client';

import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export default function AdminAffiliateCodesPage() {
  return (
    <div className="space-y-4">
      <header>
        <Link href="/affiliates" className="text-sm text-muted-foreground hover:text-gold">
          ← Affiliates
        </Link>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Promo codes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Affiliate-tied promo codes dùng chung bảng <code>hieu_asia.coupons</code> với coupons khác.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mở trang Coupons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Promo code gắn affiliate (có <code>tier_filter</code> hoặc affiliate-specific
            discount) hiện được quản lý chung với coupons B2C. Trang Coupons hỗ trợ tạo / sửa
            / vô hiệu hoá / xem usage.
          </p>
          <p className="text-muted-foreground">
            Hướng mở rộng (Wave 44+): tạo riêng tab Affiliate-only ở trang Coupons, hoặc tách
            schema <code>affiliate_codes</code> nếu yêu cầu reporting riêng biệt.
          </p>
          <Link href="/coupons">
            <Button>Mở /coupons</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
