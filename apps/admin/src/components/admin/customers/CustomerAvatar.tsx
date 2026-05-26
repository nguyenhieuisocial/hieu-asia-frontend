'use client';

/**
 * CustomerAvatar — gravatar-backed circle with initials fallback.
 *
 * Extracted from /customers list + detail pages (Wave 60.71.T2.customers)
 * so both surfaces render the same chrome without duplicating the SHA-256
 * gravatar URL builder.
 */

import * as React from 'react';

async function gravatarUrl(email: string | null | undefined): Promise<string | null> {
  if (!email) return null;
  const hashBuf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(email.trim().toLowerCase()),
  );
  const hex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `https://www.gravatar.com/avatar/${hex.slice(0, 32)}?d=identicon&s=48`;
}

export interface CustomerAvatarProps {
  email?: string | null;
  name?: string | null;
  /** Tailwind size override (default `h-8 w-8`). */
  size?: string;
}

export function CustomerAvatar({ email, name, size = 'h-8 w-8' }: CustomerAvatarProps) {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    gravatarUrl(email).then((u) => {
      if (mounted) setSrc(u);
    });
    return () => {
      mounted = false;
    };
  }, [email]);

  const initials = (name ?? email ?? '?').slice(0, 2).toUpperCase();
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={`${size} rounded-full border border-gold/20`} />;
  }
  return (
    <div
      className={`${size} flex items-center justify-center rounded-full border border-gold/20 bg-card/60 text-xs font-medium text-muted-foreground`}
    >
      {initials}
    </div>
  );
}
