'use client';

/**
 * /partner/profile — KYC profile (read-only fields + payout method editor).
 *
 * Wave 44. Editable: payout_method (bank|momo|zalo), payout_details.
 * KYC document upload deferred to Wave 45 when payout rails ship.
 */

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  toast,
} from '@hieu-asia/ui';
import { PartnerShell } from '@/components/partner/PartnerShell';
import { getPartnerJwt, type PartnerMe } from '@/lib/use-partner-guard';

interface PayoutDetails {
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  phone?: string;
}

export default function PartnerProfilePage() {
  return <PartnerShell>{({ me }) => <ProfileView me={me} />}</PartnerShell>;
}

function ProfileView({ me }: { me: PartnerMe }) {
  const aff = me.affiliate;
  const [method, setMethod] = React.useState<'bank' | 'momo' | 'zalo'>(
    (aff?.payout_method as 'bank' | 'momo' | 'zalo') ?? 'bank',
  );
  const initialDetails = (aff?.payout_details as PayoutDetails | null) ?? {};
  const [bankName, setBankName] = React.useState<string>(initialDetails.bank_name ?? '');
  const [accountNumber, setAccountNumber] = React.useState<string>(
    initialDetails.account_number ?? '',
  );
  const [accountHolder, setAccountHolder] = React.useState<string>(
    initialDetails.account_holder ?? '',
  );
  const [phone, setPhone] = React.useState<string>(initialDetails.phone ?? '');
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    try {
      const jwt = await getPartnerJwt();
      if (!jwt) throw new Error('not_signed_in');
      const details: PayoutDetails =
        method === 'bank'
          ? { bank_name: bankName, account_number: accountNumber, account_holder: accountHolder }
          : { phone, account_holder: accountHolder };
      const r = await fetch('/api/partner/profile', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ payout_method: method, payout_details: details }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      toast.success('Đã lưu phương thức thanh toán');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ affiliate</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Field label="Mã affiliate" value={aff?.affiliate_code ?? '—'} mono />
          <Field label="Email" value={me.email ?? '—'} />
          <Field label="Tier" value={aff?.tier ?? '—'} />
          <Field label="Trạng thái" value={aff?.status ?? '—'} />
          <Field label="Cấp (depth)" value={aff?.depth?.toString() ?? '—'} />
          <Field label="Ngày tham gia" value={aff?.created_at ? new Date(aff.created_at).toLocaleDateString('vi-VN') : '—'} />
          <div className="sm:col-span-2">
            <Field label="Path (ltree)" value={aff?.path ?? '—'} mono />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm">Phương thức</Label>
            <div className="flex gap-2">
              {(['bank', 'momo', 'zalo'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={
                    'rounded-md border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ' +
                    (method === m
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-foreground/15 text-foreground/70 hover:bg-foreground/5')
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {method === 'bank' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="bank_name">Ngân hàng</Label>
                <Input
                  id="bank_name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="VD: Vietcombank"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="account_number">Số tài khoản</Label>
                <Input
                  id="account_number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="VD: 0123456789"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="account_holder">Chủ tài khoản (in hoa, không dấu)</Label>
                <Input
                  id="account_holder"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="NGUYEN VAN A"
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Số điện thoại {method === 'momo' ? 'MoMo' : 'ZaloPay'}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="holder">Chủ tài khoản</Label>
                <Input
                  id="holder"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="NGUYEN VAN A"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save} disabled={saving}>
              {saving ? 'Đang lưu…' : 'Lưu phương thức thanh toán'}
            </Button>
            <p className="text-xs text-foreground/60">
              KYC document upload sẽ available trong Wave 45.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-foreground/60">{label}</div>
      <div
        className={
          'mt-0.5 ' + (mono ? 'break-all font-mono text-xs text-foreground/90' : 'text-foreground/90')
        }
      >
        {value}
      </div>
    </div>
  );
}
