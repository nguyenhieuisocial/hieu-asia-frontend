/**
 * PriceTier — reusable pricing card.
 *
 * Dark theme + gold accent. Highlighted variant adds a subtle badge area
 * (badge text supplied by caller, e.g. "Tiết kiệm 17%").
 */

'use client';

import * as React from 'react';
import { Button, Card, CardContent, cn } from '@hieu-asia/ui';

export interface PriceTierProps {
  name: string;
  price: string;
  /** Suffix shown after the price, e.g. "/ tháng" or "một lần". */
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  /** Badge text shown when highlighted, defaults to "Phổ biến". */
  badge?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function PriceTier({
  name,
  price,
  period,
  features,
  cta,
  highlighted = false,
  badge,
  disabled = false,
  onClick,
}: PriceTierProps) {
  return (
    <Card
      className={cn(
        'relative flex h-full flex-col border bg-card/40 transition-colors',
        highlighted
          ? 'border-gold/60 shadow-[0_0_0_1px_rgba(212,175,55,0.15)]'
          : 'border-gold/15',
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
          {badge ?? 'Phổ biến'}
        </span>
      )}
      <CardContent className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h3 className="font-heading text-xl text-foreground">{name}</h3>
          <p className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-3xl text-gold">{price}</span>
            {period && (
              <span className="text-sm text-muted-foreground">{period}</span>
            )}
          </p>
        </div>

        <ul className="flex-1 space-y-2 text-sm text-foreground/80">
          {features.map((feat) => (
            <li key={feat} className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5 text-gold">
                ✓
              </span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'w-full',
            highlighted ? '' : 'bg-gold/90 hover:bg-gold',
          )}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
