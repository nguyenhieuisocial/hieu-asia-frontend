'use client';

/**
 * Affiliate tax/KYC form — lets a collaborator (CTV) submit their MST + accept
 * the collaborator contract so CASH payouts can be approved (the backend
 * withholds 10% TNCN at disbursement and blocks cash payout until this is
 * complete). Calls the BFF proxy /api/affiliate/tax-profile (cookie-authed →
 * worker /affiliate/tax-profile). In-product VOUCHER payout needs no KYC.
 */

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Checkbox,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  toast,
  ProvinceWardSelect,
  type ProvinceWardValue,
} from '@hieu-asia/ui';
import { safeJson } from '@/lib/safe-json';

interface TaxProfileStatus {
  has_tax_code: boolean;
  tax_code_masked: string | null;
  legal_full_name: string | null;
  tax_commitment_08: boolean;
  contract_accepted_at: string | null;
  contract_version: string | null;
  address_province_code: string | null;
  address_province_name: string | null;
  address_ward_code: string | null;
  address_ward_name: string | null;
  address_street: string | null;
  complete: boolean;
}

export function TaxProfileForm() {
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<TaxProfileStatus | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form fields.
  const [legalName, setLegalName] = React.useState('');
  const [taxCode, setTaxCode] = React.useState('');
  const [idNumber, setIdNumber] = React.useState('');
  const [commitment08, setCommitment08] = React.useState(false);
  const [acceptContract, setAcceptContract] = React.useState(false);
  const [address, setAddress] = React.useState<ProvinceWardValue>({});
  const [street, setStreet] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/affiliate/tax-profile', { cache: 'no-store' });
      const parsed = await safeJson<{ ok: boolean; profile: TaxProfileStatus | null }>(r);
      if (parsed.ok && parsed.data.ok) {
        setProfile(parsed.data.profile);
        if (parsed.data.profile) {
          setLegalName(parsed.data.profile.legal_full_name ?? '');
          setCommitment08(parsed.data.profile.tax_commitment_08);
          setStreet(parsed.data.profile.address_street ?? '');
          setAddress({
            provinceCode: parsed.data.profile.address_province_code ?? undefined,
            provinceName: parsed.data.profile.address_province_name ?? undefined,
            wardCode: parsed.data.profile.address_ward_code ?? undefined,
            wardName: parsed.data.profile.address_ward_name ?? undefined,
          });
        }
        setEditing(!parsed.data.profile?.complete);
      } else {
        setEditing(true);
      }
    } catch {
      setEditing(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function submit() {
    if (!legalName.trim()) {
      toast.error('Vui lòng nhập họ tên đầy đủ');
      return;
    }
    if (!taxCode.trim() && !profile?.has_tax_code) {
      toast.error('Vui lòng nhập mã số thuế');
      return;
    }
    if (!acceptContract && !profile?.contract_accepted_at) {
      toast.error('Vui lòng đồng ý hợp đồng cộng tác viên');
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        legal_full_name: legalName.trim(),
        tax_commitment_08: commitment08,
      };
      if (taxCode.trim()) body.tax_code = taxCode.trim();
      if (idNumber.trim()) body.id_number = idNumber.trim();
      if (acceptContract) body.accept_contract = true;
      if (address.provinceCode) {
        body.address_province_code = address.provinceCode;
        if (address.provinceName) body.address_province_name = address.provinceName;
      }
      if (address.wardCode) {
        body.address_ward_code = address.wardCode;
        if (address.wardName) body.address_ward_name = address.wardName;
      }
      if (street.trim()) body.address_street = street.trim();

      const r = await fetch('/api/affiliate/tax-profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const parsed = await safeJson<{ ok: boolean; error?: string }>(r);
      if (parsed.ok && parsed.data.ok) {
        toast.success('Đã lưu thông tin thuế');
        setTaxCode('');
        setIdNumber('');
        setEditing(false);
        await load();
      } else {
        toast.error(parsed.ok ? parsed.data.error ?? 'Lưu thất bại' : 'Lưu thất bại');
      }
    } catch {
      toast.error('Lỗi kết nối, thử lại sau');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khai báo thuế (cộng tác viên)</CardTitle>
        <CardDescription>
          Cần khai mã số thuế và đồng ý hợp đồng để rút hoa hồng bằng <strong>tiền mặt</strong>.
          Với khoản chi từ 2.000.000đ/lần, hệ thống khấu trừ 10% thuế TNCN theo quy định (trừ khi
          bạn có cam kết 08). Rút bằng <strong>voucher</strong> dùng trong sản phẩm thì không cần bước này.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile?.complete && !editing ? (
          <div className="space-y-3">
            <Alert>
              <AlertTitle>✓ Đã khai báo thuế</AlertTitle>
              <AlertDescription>
                {profile.legal_full_name ? <>Họ tên: <strong>{profile.legal_full_name}</strong>. </> : null}
                Mã số thuế: <strong>{profile.tax_code_masked ?? '—'}</strong>.{' '}
                {profile.tax_commitment_08 ? 'Có cam kết 08 (miễn khấu trừ).' : 'Khấu trừ 10% khi ≥ 2tr/lần.'}
                {profile.address_ward_name || profile.address_province_name ? (
                  <>
                    {' '}Địa chỉ:{' '}
                    <strong>
                      {[profile.address_street, profile.address_ward_name, profile.address_province_name]
                        .filter(Boolean)
                        .join(', ')}
                    </strong>
                    .
                  </>
                ) : null}
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => setEditing(true)}>
              Cập nhật thông tin
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tax-legal-name">Họ tên đầy đủ (theo CCCD)</Label>
              <Input
                id="tax-legal-name"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tax-code">
                Mã số thuế (MST){profile?.has_tax_code ? ' — đã có, để trống nếu giữ nguyên' : ''}
              </Label>
              <Input
                id="tax-code"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                placeholder="10 hoặc 13 chữ số"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tax-id-number">Số CCCD/CMND (không bắt buộc)</Label>
              <Input
                id="tax-id-number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="12 chữ số"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Địa chỉ liên hệ thuế (không bắt buộc)</Label>
              <ProvinceWardSelect value={address} onChange={setAddress} />
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Số nhà, tên đường (không bắt buộc)"
                autoComplete="street-address"
              />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox
                checked={commitment08}
                onChange={(e) => setCommitment08(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Tôi có <strong>cam kết 08/CK-TNCN</strong> (thu nhập một nơi, dưới mức nộp thuế) — miễn khấu trừ 10%.
              </span>
            </label>
            {!profile?.contract_accepted_at ? (
              <label className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={acceptContract}
                  onChange={(e) => setAcceptContract(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Tôi đồng ý <strong>hợp đồng cộng tác viên</strong> và cho phép hieu.asia khấu trừ/khai báo thuế thay khi chi tiền mặt.
                </span>
              </label>
            ) : null}
            <div className="flex gap-2">
              <Button onClick={submit} disabled={submitting}>
                {submitting ? 'Đang lưu…' : 'Lưu thông tin thuế'}
              </Button>
              {profile?.complete ? (
                <Button variant="ghost" onClick={() => setEditing(false)} disabled={submitting}>
                  Huỷ
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
