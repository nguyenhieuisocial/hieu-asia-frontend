'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

/**
 * Global toast host. Mount once near the root of the app (inside <body>).
 *
 * Themed to match hieu.asia palette (ink + gold + cream). Consumers can
 * override any props by passing them through.
 *
 * Wave 60.26 — `theme="system"` (was `"dark"`) so Sonner's own chrome
 * (close icon colour, default border) adapts when the app is in light
 * mode. Our classNames overrides (toast/title/description/buttons) use
 * theme-aware tokens (`bg-card`, `text-foreground`) per Wave 60.22 so
 * the toast content always reads correctly in both modes.
 */
export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="system"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-card border border-gold/25 text-foreground shadow-2xl',
          title: 'text-foreground font-semibold',
          description: 'text-foreground/70',
          actionButton: 'bg-gold text-ink hover:bg-gold-400',
          cancelButton: 'bg-card border border-gold/25 text-foreground',
          closeButton: 'bg-card border border-gold/25 text-foreground',
        },
      }}
      {...props}
    />
  );
}
