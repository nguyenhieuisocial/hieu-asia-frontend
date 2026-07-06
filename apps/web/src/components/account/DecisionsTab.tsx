'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { readJournalEntries, type JournalEntry } from '@/lib/journal-storage';

interface DecisionRecord {
  id: string;
  question: string;
  topic: string;
  createdAt: string;
}

function loadDecisions(): DecisionRecord[] {
  if (typeof window === 'undefined') return [];
  const out: DecisionRecord[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('hieu:decisions:') && !k.endsWith(':checked')) {
        try {
          const raw = window.localStorage.getItem(k);
          if (!raw) continue;
          const rec = JSON.parse(raw) as Partial<DecisionRecord>;
          if (rec.id && rec.question && rec.createdAt) {
            out.push({
              id: rec.id,
              question: rec.question,
              topic: rec.topic ?? 'general',
              createdAt: rec.createdAt,
            });
          }
        } catch {
          /* ignore one bad entry */
        }
      }
    }
  } catch {
    /* ignore */
  }
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out.slice(0, 5);
}

const TOPIC_LABEL: Record<string, string> = {
  career: 'Sự nghiệp',
  relationship: 'Tình cảm',
  finance: 'Tài chính',
  family: 'Gia đình',
  general: 'Khác',
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function DecisionsTab() {
  const [decisions, setDecisions] = React.useState<DecisionRecord[]>([]);
  const [journal, setJournal] = React.useState<JournalEntry[]>([]);

  React.useEffect(() => {
    setDecisions(loadDecisions());
    setJournal(readJournalEntries().slice(0, 5));
  }, []);

  return (
    <div
      role="tabpanel"
      id="panel-decisions"
      aria-labelledby="tab-decisions"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Quyết định &amp; Journal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Decision Brief và nhật ký quyết định của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Decision Brief</CardTitle>
                <CardDescription>5 brief gần nhất.</CardDescription>
              </div>
              <Button variant="outline" asChild={false}>
                <Link href="/decisions/new">Tạo mới</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {decisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có decision brief nào.</p>
            ) : (
              <ul className="divide-y divide-border">
                {decisions.map((d) => (
                  <li key={d.id} className="py-3">
                    <Link
                      href={`/decisions/${d.id}`}
                      className="flex items-center gap-3 hover:text-gold"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground/90">{d.question}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {TOPIC_LABEL[d.topic] ?? d.topic} · {fmtDate(d.createdAt)}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Decision Journal</CardTitle>
                <CardDescription>5 nhật ký gần nhất.</CardDescription>
              </div>
              <Button variant="outline" asChild={false}>
                <Link href="/journal/new">Tạo mới</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {journal.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có nhật ký nào.</p>
            ) : (
              <ul className="divide-y divide-border">
                {journal.map((j) => (
                  <li key={j.id} className="py-3">
                    <Link
                      href={`/journal/${j.id}`}
                      className="flex items-center gap-3 hover:text-gold"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground/90">{j.question}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {TOPIC_LABEL[j.topic] ?? j.topic} · {fmtDate(j.createdAt)}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
