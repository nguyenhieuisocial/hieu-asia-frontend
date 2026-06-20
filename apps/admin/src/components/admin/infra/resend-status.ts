/**
 * Shared tone helpers for Resend domain + DNS verification status pills, used by
 * the Resend page (domains table) and the ResendEmailDrawer (DNS drill-down).
 */

type Tone = 'good' | 'bad' | 'warn' | 'neutral';

/** Domain verification status → pill tone. */
export function domainStatusTone(status: string | null): Tone {
  switch ((status ?? '').toLowerCase()) {
    case 'verified':
      return 'good';
    case 'failed':
    case 'temporary_failure':
      return 'bad';
    case 'pending':
    case 'not_started':
      return 'warn';
    default:
      return 'neutral';
  }
}

/** Per-record DNS verification status → pill tone. */
export function dnsStatusTone(status: string | null): Tone {
  switch ((status ?? '').toLowerCase()) {
    case 'verified':
      return 'good';
    case 'failed':
      return 'bad';
    case 'pending':
    case 'not_started':
      return 'warn';
    default:
      return 'neutral';
  }
}
