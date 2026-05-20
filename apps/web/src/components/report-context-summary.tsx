import * as React from 'react';
import { Card, CardContent } from '@hieu-asia/ui';

export interface ReportContextSummaryProps {
  displayName: string;
  role: string;
  primaryConcern: string;
  generatedAt?: string;
}

export function ReportContextSummary({
  displayName,
  role,
  primaryConcern,
  generatedAt,
}: ReportContextSummaryProps) {
  return (
    <Card className="border-gold/20">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-gold/70">
            Báo cáo cá nhân hóa
          </p>
          <h2 className="font-heading text-2xl text-cream sm:text-3xl">
            {displayName}
          </h2>
          <p className="text-sm text-cream/70">
            <span className="text-cream/90">{role}</span>
            <span className="mx-2 text-cream/30">·</span>
            <span>{primaryConcern}</span>
          </p>
        </div>
        {generatedAt && (
          <p className="font-mono text-xs text-cream/50">
            Tạo lúc: {generatedAt}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
