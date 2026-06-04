'use client';

import * as React from 'react';
import { claimReferral } from '@/lib/referral';

/**
 * Invisible one-shot: when a signed-in user carries a referral code (from the
 * `?ref=` param or the non-httpOnly `hieu_ref` attribution cookie), claim it
 * once so both they and the inviter get a voucher. De-duped per code in
 * localStorage so a distinct new code can still be claimed later. Silent —
 * the server is idempotent and any failure is swallowed.
 */
const ATTEMPT_KEY = 'hieu_ref_claimed';
const CODE_RE = /^[A-Z2-9]{6,16}$/;

function readRefCode(): string | null {
  try {
    const p = new URLSearchParams(window.location.search).get('ref');
    if (p && CODE_RE.test(p.toUpperCase())) return p.toUpperCase();
  } catch {
    /* ignore */
  }
  try {
    const m = document.cookie.match(/(?:^|;\s*)hieu_ref=([^;]+)/);
    if (m?.[1]) {
      const c = decodeURIComponent(m[1]).toUpperCase();
      if (CODE_RE.test(c)) return c;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function ReferralClaimOnce() {
  React.useEffect(() => {
    let alive = true;
    let attempted: string | null = null;
    try {
      attempted = localStorage.getItem(ATTEMPT_KEY);
    } catch {
      return; // no storage → don't risk repeated claims
    }
    const code = readRefCode();
    if (!code || attempted === code) return;

    void claimReferral(code).then((res) => {
      if (!alive || !res) return; // null = not signed in / network — retry later
      try {
        localStorage.setItem(ATTEMPT_KEY, code);
      } catch {
        /* ignore */
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return null;
}
