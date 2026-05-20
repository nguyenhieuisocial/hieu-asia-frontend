'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, InsightCard, cn } from '@hieu-asia/ui';
import type { StrategicActionPlan } from '@hieu-asia/types';

const TABS = [
  { id: 'core', label: 'Tổng quan bản chất', short: 'Tổng quan' },
  { id: 'strengths', label: 'Điểm mạnh cốt lõi', short: 'Điểm mạnh' },
  { id: 'blind', label: 'Điểm mù cần chuyển hóa', short: 'Điểm mù' },
  { id: 'career', label: 'Sự nghiệp / Kinh doanh', short: 'Sự nghiệp' },
  { id: 'finance', label: 'Tài chính / Dòng tiền', short: 'Tài chính' },
  { id: 'relationships', label: 'Quan hệ / Đội nhóm', short: 'Quan hệ' },
  { id: 'year', label: 'Dự báo năm hiện tại', short: 'Năm nay' },
  { id: 'action', label: 'Kế hoạch 30-60-90 ngày', short: '30/60/90' },
  { id: 'prompts', label: 'Câu hỏi nên hỏi Mentor', short: 'Câu hỏi' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export interface ReportTabsProps {
  plan: StrategicActionPlan;
  readingId: string;
}

export function ReportTabs({ plan, readingId }: ReportTabsProps) {
  const [active, setActive] = React.useState<TabId>('core');

  return (
    <div className="space-y-6">
      {/* Tab nav — desktop */}
      <nav
        role="tablist"
        aria-label="Mục lục báo cáo"
        className="hidden flex-wrap gap-2 border-b border-gold/15 pb-3 md:flex"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active === t.id
                ? 'bg-gold/15 text-gold'
                : 'text-cream/70 hover:bg-gold/5 hover:text-cream',
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Mobile accordion */}
      <div className="space-y-2 md:hidden">
        {TABS.map((t) => {
          const open = active === t.id;
          return (
            <div
              key={t.id}
              className="rounded-md border border-gold/15 bg-ink/40"
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(open ? ('none' as TabId) : t.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    open ? 'text-gold' : 'text-cream/80',
                  )}
                >
                  {t.label}
                </span>
                <span aria-hidden className="text-gold/60">
                  {open ? '▾' : '▸'}
                </span>
              </button>
              {open && (
                <div className="border-t border-gold/10 p-4">
                  <TabBody id={t.id} plan={plan} readingId={readingId} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop body */}
      <div className="hidden md:block" role="tabpanel">
        <TabBody id={active} plan={plan} readingId={readingId} />
      </div>
    </div>
  );
}

function TabBody({
  id,
  plan,
  readingId,
}: {
  id: TabId;
  plan: StrategicActionPlan;
  readingId: string;
}) {
  switch (id) {
    case 'core':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.core_personality.map((theme, i) => (
            <article
              key={i}
              className="rounded-lg border border-purple/30 bg-purple/10 p-5"
            >
              <h3 className="mb-3 font-heading text-lg text-cream">
                {theme.theme_name}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-cream/90">
                {theme.synthesis_insight}
              </p>
              <p className="mb-1 font-mono text-xs uppercase tracking-wider text-gold/70">
                Căn cứ
              </p>
              <ul className="space-y-1 text-sm text-cream/70">
                {theme.evidence_from_disciplines.map((ev, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-gold/60">·</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      );
    case 'strengths':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.strengths.map((it, i) => (
            <InsightCard key={i} insight={it} />
          ))}
        </div>
      );
    case 'blind':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.blind_spots.map((it, i) => (
            <InsightCard
              key={i}
              insight={it}
              className="border-gold/40 bg-gold/5"
            />
          ))}
        </div>
      );
    case 'career':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.career_insights.map((it, i) => (
            <InsightCard key={i} insight={it} />
          ))}
        </div>
      );
    case 'finance':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.financial_insights.map((it, i) => (
            <InsightCard
              key={i}
              insight={it}
              className="border-gold/40 bg-gradient-to-br from-gold/10 to-transparent"
            />
          ))}
        </div>
      );
    case 'relationships':
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {plan.relationships_insights.map((it, i) => (
            <InsightCard
              key={i}
              insight={it}
              className="border-purple/40 bg-purple/10"
            />
          ))}
        </div>
      );
    case 'year':
      return <YearOutlook plan={plan} />;
    case 'action':
      return <ActionPlan plan={plan} />;
    case 'prompts':
      return <MentorPrompts plan={plan} readingId={readingId} />;
    default:
      return null;
  }
}

function YearOutlook({ plan }: { plan: StrategicActionPlan }) {
  return (
    <div className="space-y-6">
      <article className="rounded-lg border border-gold/20 bg-ink/50 p-5">
        <h3 className="mb-3 font-heading text-lg text-gold">Tổng quan năm</h3>
        <p className="text-sm leading-relaxed text-cream/90">
          {plan.current_year_outlook}
        </p>
      </article>

      {plan.current_year_vulnerabilities.length > 0 && (
        <section>
          <h3 className="mb-3 font-heading text-base text-cream/90">
            Điểm yếu cần phòng
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {plan.current_year_vulnerabilities.map((it, i) => (
              <InsightCard
                key={i}
                insight={it}
                className="border-gold/40 bg-gold/5"
              />
            ))}
          </div>
        </section>
      )}

      {plan.current_year_opportunities.length > 0 && (
        <section className="rounded-lg border border-jade/40 bg-jade/10 p-5">
          <h3 className="mb-3 font-heading text-base text-jade-50">
            Cơ hội nên nắm
          </h3>
          <ul className="space-y-2 text-sm text-cream/90">
            {plan.current_year_opportunities.map((op, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-gold">{i + 1}.</span>
                <span>{op}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ActionPlan({ plan }: { plan: StrategicActionPlan }) {
  const [period, setPeriod] = React.useState<'30' | '60' | '90'>('30');
  const items =
    period === '30'
      ? plan.action_plan.days_30
      : period === '60'
        ? plan.action_plan.days_60
        : plan.action_plan.days_90;

  return (
    <div className="space-y-4">
      <div className="relative h-2 rounded-full bg-ink/60">
        <div
          className="absolute left-0 top-0 h-2 rounded-full bg-gold-gradient transition-all"
          style={{
            width: period === '30' ? '33%' : period === '60' ? '66%' : '100%',
          }}
        />
      </div>
      <div className="flex gap-2">
        {(['30', '60', '90'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={cn(
              'flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
              period === p
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-gold/20 text-cream/70 hover:border-gold/40',
            )}
          >
            {p} ngày
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-md border border-gold/15 bg-ink/40 p-4 text-sm text-cream/90"
          >
            <span className="font-mono text-gold">{String(i + 1).padStart(2, '0')}</span>
            <span className="leading-relaxed">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MentorPrompts({
  plan,
  readingId,
}: {
  plan: StrategicActionPlan;
  readingId: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-cream/70">
        Những câu hỏi này được gợi ý dựa trên điểm mù và điểm mạnh của bạn. Bấm
        vào câu hỏi để hỏi Mentor ngay.
      </p>
      <div className="flex flex-wrap gap-2">
        {plan.suggested_mentor_prompts.map((q, i) => (
          <Link
            key={i}
            href={`/reading/${readingId}/mentor?q=${encodeURIComponent(q)}`}
            className="rounded-full border border-gold/30 bg-ink/60 px-4 py-2 text-sm text-cream hover:border-gold hover:bg-gold/10"
          >
            {q}
          </Link>
        ))}
      </div>
      <div className="pt-4">
        <Button asChild={false}>
          <Link href={`/reading/${readingId}/mentor`}>
            Mở chat với Mentor →
          </Link>
        </Button>
      </div>
    </div>
  );
}
