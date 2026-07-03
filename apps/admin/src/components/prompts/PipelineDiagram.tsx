'use client';

import * as React from 'react';
import { ArrowRight, CornerDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

/**
 * Sơ đồ kết nối 9 system prompt (tĩnh, thuần Tailwind — không dependency mới).
 *
 * Pipeline đọc: [Ảnh bàn tay + Số liệu lá số tính sẵn] → Vision(1) + Logic(2)
 * → Psychology(3) → Alignment(4) → Report(5) → [Báo cáo user đọc] và → Mentor
 * ("Bộ não cố định") → Judge (chấm chất lượng). Decisions + Ops Copilot đứng
 * ngoài pipeline.
 *
 * Click node role → cuộn tới card tương ứng bên dưới (id={`role-card-<role>`}
 * do trang list gắn). Container cuộn ngang riêng nên không tràn trang khi hẹp.
 */
export function PipelineDiagram() {
  return (
    <Card className="border-gold/15">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Sơ đồ kết nối 9 prompt</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
        <div className="min-w-max space-y-4">
          {/* Hàng pipeline đọc chính */}
          <div className="flex items-center gap-2">
            <IoNode label="Ảnh bàn tay + Số liệu lá số tính sẵn" />
            <Arrow />
            <div className="flex flex-col gap-2">
              <RoleNode role="vision" stage={1} label="Vision" note="mắt đọc ảnh" />
              <RoleNode role="logic" stage={2} label="Logic" note="phân tích nhân quả" />
            </div>
            <Arrow />
            <RoleNode role="psychology" stage={3} label="Psychology" note="tâm lý & động lực" />
            <Arrow />
            <RoleNode role="alignment" stage={4} label="Alignment" note="đối chiếu mục tiêu" />
            <Arrow />
            <RoleNode role="report" stage={5} label="Report" note="tổng hợp báo cáo" />
            <Arrow />
            <div className="flex flex-col gap-2">
              <IoNode label="Báo cáo user đọc" />
              <div className="flex items-center gap-2">
                <RoleNode role="mentor" label="Mentor" note="Bộ não cố định" />
                <Arrow />
                <RoleNode role="judge" label="Judge" note="chấm chất lượng" />
              </div>
            </div>
          </div>

          {/* Khối ngoài pipeline */}
          <div className="flex items-center gap-2 border-t border-dashed border-gold/15 pt-3">
            <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="shrink-0 text-[11px] text-muted-foreground">Đứng ngoài pipeline:</span>
            <RoleNode role="decisions" label="Decisions" note="giả lập quyết định" />
            <RoleNode role="ops_copilot" label="Ops Copilot" note="trợ lý vận hành admin" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Arrow() {
  return <ArrowRight className="h-4 w-4 shrink-0 text-gold/60" aria-hidden />;
}

/** Node vào/ra của pipeline — không click được, viền đứt. */
function IoNode({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-[180px] items-center rounded-md border border-dashed border-border bg-muted/20 px-2.5 py-1.5 text-[11px] leading-4 text-muted-foreground">
      {label}
    </span>
  );
}

interface RoleNodeProps {
  role: string;
  label: string;
  note: string;
  stage?: number;
}

/** Node role — click cuộn tới card role tương ứng trên trang list. */
function RoleNode({ role, label, note, stage }: RoleNodeProps) {
  const handleClick = React.useCallback(() => {
    document
      .getElementById(`role-card-${role}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [role]);
  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Cuộn tới thẻ ${label}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1.5 text-left text-[11px] leading-4 text-foreground transition-all duration-300 ease-editorial hover:border-gold/60 hover:bg-gold/15 focus:outline-none focus-visible:border-gold/60"
    >
      {stage !== undefined && (
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-[9px] text-gold">
          {stage}
        </span>
      )}
      <span className="whitespace-nowrap">
        <span className="font-medium text-gold">{label}</span>
        <span className="ml-1 text-muted-foreground">{note}</span>
      </span>
    </button>
  );
}
