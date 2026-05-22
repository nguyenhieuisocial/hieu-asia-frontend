'use client';

import * as React from 'react';
import { OperatingManualView } from './OperatingManualView';

/**
 * Embedded preview of the Personal Operating Manual on the /account hub.
 * For the full-page printable view, link out to /account/operating-manual.
 */
export function OperatingManualTab() {
  return (
    <div
      role="tabpanel"
      id="panel-manual"
      aria-labelledby="tab-manual"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-cream sm:text-3xl">
          Sổ tay cá nhân
        </h2>
        <p className="mt-1 text-sm text-cream/65">
          Tổng hợp một trang về bạn — điểm mạnh, mẫu hình quyết định, nguyên tắc
          vận hành. Lưu trên trình duyệt, không gửi server.
        </p>
      </div>
      <OperatingManualView embedded />
    </div>
  );
}
