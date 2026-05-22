/**
 * LeaderboardList — public top-N affiliates by conversions.
 */

'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export interface LeaderboardEntry {
  rank: number;
  code: string;
  display_name: string;
  conversions: number;
  total_earned: number;
}

interface Props {
  entries: LeaderboardEntry[];
  period: 'monthly' | 'all_time';
}

const MEDAL = ['🥇', '🥈', '🥉'];

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export function LeaderboardList({ entries, period }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {period === 'monthly' ? 'Top affiliates 30 ngày qua' : 'Top affiliates mọi thời gian'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
        ) : (
          <ol className="space-y-2">
            {entries.map((e) => (
              <li
                key={e.code}
                className={`flex items-center justify-between rounded border border-border p-3 ${
                  e.rank <= 3 ? 'bg-gold/5' : 'bg-muted/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-lg font-bold">
                    {e.rank <= 3 ? MEDAL[e.rank - 1] : `#${e.rank}`}
                  </span>
                  <div>
                    <div className="font-medium">{e.display_name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{e.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{e.conversions} conversions</div>
                  <div className="text-xs text-gold">{vnd(e.total_earned)}</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
