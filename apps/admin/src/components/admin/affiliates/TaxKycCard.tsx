'use client';

/**
 * TaxKycCard — hồ sơ thuế/KYC của một promoter trên trang /affiliates/[id].
 *
 * Gap audit 2026-07-02: TaxProfileRow (MST, cam-kết 08, hợp đồng CTV, địa chỉ
 * thuế) được thu thập và nuôi bảng kê khấu trừ, nhưng KHÔNG có chỗ nào trong
 * admin xem được. Đọc route worker mới GET /admin/affiliates/:id/tax-profile
 * (admin-gated) — worker tái dùng handler self-read nên MST đã mask ***xxx;
 * admin thấy đúng những gì CTV thấy, không lộ thêm.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { FileCheck2 } from 'lucide-react';

interface TaxProfile {
  has_tax_code?: boolean;
  tax_code_masked?: string | null;
  legal_full_name?: string | null;
  tax_commitment_08?: boolean | null;
  contract_accepted_at?: string | null;
  contract_version?: string | null;
  address_province_name?: string | null;
  address_ward_name?: string | null;
  address_street?: string | null;
  complete?: boolean;
}

interface TaxProfileResponse {
  ok: boolean;
  contract_version?: string;
  profile?: TaxProfile | null;
  error?: string;
}

async function fetchTaxProfile(id: string): Promise<TaxProfileResponse> {
  try {
    const r = await fetch(`/api/admin/affiliates/${encodeURIComponent(id)}/tax-profile`, {
      cache: 'no-store',
    });
    return (await r.json()) as TaxProfileResponse;
  } catch {
    return { ok: false };
  }
}

function fmtDt(iso?: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span> {value}
    </div>
  );
}

export function TaxKycCard({ userId }: { userId: string }) {
  const q = useQuery({
    queryKey: ['admin', 'affiliate-tax', userId],
    queryFn: () => fetchTaxProfile(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const p = q.data?.ok ? (q.data.profile ?? null) : null;
  const address = p
    ? [p.address_street, p.address_ward_name, p.address_province_name].filter(Boolean).join(', ')
    : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileCheck2 className="h-4 w-4 text-gold/70" aria-hidden />
          Thuế &amp; KYC
        </CardTitle>
        <CardDescription>
          Hồ sơ khấu trừ TNCN của CTV — nguồn của bảng kê khấu trừ. MST đã che (***3 số cuối).
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        {q.isLoading ? (
          <div className="h-16 animate-pulse rounded bg-muted/30" aria-hidden />
        ) : !p ? (
          <p className="text-muted-foreground">
            CTV chưa khai hồ sơ thuế (chưa có MST / chưa ký hợp đồng). Payout tiền mặt sẽ bị khấu
            trừ theo mặc định an toàn cho tới khi khai.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <Row
              label="Trạng thái KYC"
              value={
                p.complete ? (
                  <b className="text-green-400">Hoàn tất</b>
                ) : (
                  <b className="text-amber-400">Chưa đủ</b>
                )
              }
            />
            <Row label="Họ tên pháp lý" value={<b>{p.legal_full_name ?? '—'}</b>} />
            <Row
              label="MST"
              value={
                p.has_tax_code ? (
                  <span className="font-mono">{p.tax_code_masked ?? '***'}</span>
                ) : (
                  <span className="text-muted-foreground">chưa có</span>
                )
              }
            />
            <Row
              label="Cam kết 08 (không khấu trừ)"
              value={p.tax_commitment_08 ? 'Đã nộp' : 'Chưa — khấu trừ 10%'}
            />
            <Row
              label="Hợp đồng CTV"
              value={
                p.contract_accepted_at
                  ? `Đã ký ${fmtDt(p.contract_accepted_at)}${p.contract_version ? ` (v${p.contract_version})` : ''}`
                  : 'Chưa ký'
              }
            />
            <Row label="Địa chỉ thuế" value={address || '—'} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
