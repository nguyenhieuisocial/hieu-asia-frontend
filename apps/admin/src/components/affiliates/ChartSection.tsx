'use client';

/**
 * Affiliate-area chart wrapper. Wave 60.62 enrichment — gives every affiliate
 * chart a consistent Card + title + source/window caption (honesty contract:
 * the reader always sees WHICH fetched dataset and WHAT window the chart was
 * aggregated from) and a muted empty state when the source is sparse.
 *
 * No new fetches — every chart is fed list data the tab already loaded.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export function ChartSection({
  title,
  source,
  empty,
  children,
}: {
  title: string;
  /** e.g. "affiliate_commissions · các dòng đang hiển thị". Renders muted. */
  source: string;
  /** When true, render the muted "chưa có dữ liệu" state instead of the chart. */
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {title}
          <span className="ml-2 text-xs font-normal text-muted-foreground">({source})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {empty ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu để vẽ biểu đồ.
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
