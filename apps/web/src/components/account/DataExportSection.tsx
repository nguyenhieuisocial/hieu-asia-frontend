'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, toast } from '@hieu-asia/ui';

const LAST_EXPORT_KEY = 'hieu_last_export_at';

export interface DataExportSectionProps {
  userId: string | null;
}

interface ExportResponse {
  ok: boolean;
  export_url?: string;
  expires_in?: number;
  size?: number;
  error?: string;
}

function formatRelative(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function formatBytes(bytes: number | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DataExportSection({ userId }: DataExportSectionProps) {
  const [pending, setPending] = React.useState(false);
  const [lastExport, setLastExport] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    setLastExport(window.localStorage.getItem(LAST_EXPORT_KEY));
  }, []);

  async function handleExport() {
    if (!userId) {
      toast.error('Không xác định được tài khoản', {
        description: 'Vui lòng đăng nhập hoặc khởi tạo session trước.',
      });
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/account/export', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      // Guard against HTML error pages.
      const ct = res.headers.get('content-type') ?? '';
      if (!/\bjson\b/i.test(ct)) {
        toast.error('Không tạo được bản xuất', {
          description: `Phản hồi không phải JSON (HTTP ${res.status})`,
        });
        return;
      }
      const data: ExportResponse = await res.json();
      if (!res.ok || !data.ok || !data.export_url) {
        toast.error('Không tạo được bản xuất', {
          description: data.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      const now = new Date().toISOString();
      window.localStorage.setItem(LAST_EXPORT_KEY, now);
      setLastExport(now);
      toast.success('Bản xuất đã sẵn sàng', {
        description: `Kích thước: ${formatBytes(data.size)} · Link có hiệu lực 24 giờ.`,
      });
      window.open(data.export_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Lỗi mạng', { description: msg });
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Tải xuống dữ liệu cá nhân</CardTitle>
        <CardDescription>
          Bạn có quyền nhận bản sao tất cả dữ liệu hệ thống lưu về bạn (Nghị định
          13/2023/NĐ-CP). Bao gồm: phiên đọc, báo cáo, lịch sử chat, giao dịch
          và audit log.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-cream/85">
        <ul className="list-disc space-y-1 pl-5 text-cream/75">
          <li>Hồ sơ &amp; dữ liệu sinh trắc.</li>
          <li>Toàn bộ phiên đọc (Tử Vi, MBTI, tâm lý) ở định dạng JSON.</li>
          <li>Lịch sử giao dịch SePay.</li>
          <li>Audit log truy cập 12 tháng gần nhất.</li>
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream/55">
            {lastExport
              ? `Lần xuất gần nhất: ${formatRelative(lastExport)}`
              : 'Chưa có bản xuất nào trên thiết bị này.'}
          </p>
          <Button onClick={handleExport} disabled={pending || !userId}>
            {pending ? 'Đang chuẩn bị…' : 'Tải xuống (JSON)'}
          </Button>
        </div>
        <p className="text-xs text-cream/70">
          Link tải xuống chứa chữ ký HMAC và hết hạn sau 24 giờ. Vui lòng lưu file
          về máy nếu muốn giữ lại lâu dài.
        </p>
      </CardContent>
    </Card>
  );
}
