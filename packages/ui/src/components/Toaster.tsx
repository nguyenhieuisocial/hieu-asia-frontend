'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

/**
 * Global toast host. Mount once near the root of the app (inside <body>).
 *
 * Themed to match hieu.asia dark palette (ink + gold + cream). Consumers
 * can override any props by passing them through.
 */
export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
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
