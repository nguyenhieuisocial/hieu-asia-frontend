'use client';

/**
 * /partner/profile — KYC profile + payout method + payout rail (Wave 45).
 *
 * Wave 44: payout_method (bank|momo|zalo) + payout_details.
 * Wave 45: preferred_rail (manual_csv|wise|stripe_connect) + rail_account_external_id.
 *   - manual_csv     → founder bank transfer (default; uses payout_details above).
 *   - wise           → user pastes Wise recipient_id, status='pending' until Wave 51 KYC.
 *   - stripe_connect → Stripe Express OAuth coming in Wave 51 (stubbed here).
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

type Rail = 'manual_csv' | 'wise' | 'stripe_connect';

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

  // Wave 45 — rail picker state.
  const [rail, setRail] = React.useState<Rail>(
    (aff?.preferred_rail as Rail | undefined) ?? 'manual_csv',
  );
  const [externalId, setExternalId] = React.useState<string>(
    aff?.rail_account_external_id ?? '',
  );
  const [railStatus, setRailStatus] = React.useState<string>(
    aff?.rail_account_status ?? 'manual_only',
  );
  const [savingRail, setSavingRail] = React.useState(false);

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

  async function saveRail() {
    if (rail === 'stripe_connect' && !externalId) {
      toast.info('Stripe Connect Express OAuth sẽ available trong Wave 51 — coming soon.');
      return;
    }
    setSavingRail(true);
    try {
      const jwt = await getPartnerJwt();
      if (!jwt) throw new Error('not_signed_in');
      const r = await fetch('/api/partner/rail/switch', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          rail,
          account_external_id: rail === 'manual_csv' ? null : externalId || null,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      toast.success(`Đã chuyển sang rail ${rail}. Trạng thái: ${d.affiliate?.rail_account_status ?? 'pending'}`);
      setRailStatus(d.affiliate?.rail_account_status ?? railStatus);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingRail(false);
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
          </div>
        </CardContent>
      </Card>

      {/* Wave 45 — Payout rail picker */}
      <Card>
        <CardHeader>
          <CardTitle>Payout rail (Wave 45)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground/70">
            Chọn cách bạn muốn nhận payout. <strong>Manual CSV</strong> là mặc định
            — founder chuyển khoản thủ công 1×/tháng. <strong>Wise</strong> /
            <strong> Stripe Connect</strong> sẽ chuyển tự động khi batch được duyệt
            (yêu cầu KYC).
          </p>

          <div>
            <Label className="mb-2 block text-sm">Rail</Label>
            <div className="flex flex-wrap gap-2">
              {(['manual_csv', 'wise', 'stripe_connect'] as Rail[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRail(r)}
                  className={
                    'rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ' +
                    (rail === r
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-foreground/15 text-foreground/70 hover:bg-foreground/5')
                  }
                >
                  {r === 'manual_csv'
                    ? 'Manual CSV'
                    : r === 'wise'
                      ? 'Wise'
                      : 'Stripe Connect'}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-foreground/60">
              Trạng thái hiện tại: <strong>{railStatus}</strong>
            </p>
          </div>

          {rail === 'wise' && (
            <div>
              <Label htmlFor="wise_recipient">Wise recipient ID</Label>
              <Input
                id="wise_recipient"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                placeholder="VD: 1234567890"
                className="mt-1"
              />
              <p className="mt-1 text-xs text-foreground/60">
                Tạo recipient tại{' '}
                <a
                  href="https://wise.com/help/articles/2932457/how-do-i-add-or-remove-recipients"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Wise → Recipients
                </a>{' '}
                rồi copy ID vào đây. Trạng thái sẽ ở &quot;pending&quot; cho đến khi
                team verify (Wave 51).
              </p>
            </div>
          )}

          {rail === 'stripe_connect' && (
            <div className="rounded-md border border-dashed border-foreground/20 bg-foreground/5 p-3 text-sm">
              <p className="font-medium text-foreground/80">Stripe Connect Express — coming Wave 51</p>
              <p className="mt-1 text-xs text-foreground/60">
                Sẽ có nút &quot;Connect Stripe Express&quot; → redirect sang OAuth flow
                của Stripe. Hiện tại bạn vẫn có thể switch sang manual_csv hoặc wise.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={saveRail} disabled={savingRail}>
              {savingRail ? 'Đang lưu…' : 'Lưu rail'}
            </Button>
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
