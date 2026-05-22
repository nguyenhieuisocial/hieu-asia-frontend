'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export interface SettingsSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({ id, title, description, children }: SettingsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-5 text-sm text-foreground/85">{children}</CardContent>
      </Card>
    </section>
  );
}

export interface PrefRowProps {
  label: string;
  description?: React.ReactNode;
  control: React.ReactNode;
}

export function PrefRow({ label, description, control }: PrefRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 pr-4">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
      </div>
      <div className="flex shrink-0 items-center">{control}</div>
    </div>
  );
}
