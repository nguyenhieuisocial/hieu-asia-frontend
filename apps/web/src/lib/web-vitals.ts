/**
 * Web Vitals reporter — listens to LCP / FID / CLS / INP / TTFB / FCP via
 * the `web-vitals` package and forwards them to PostHog as `$web_vitals`
 * events. PostHog's own `capture_performance` also collects basic timing,
 * but firing typed events gives us a queryable dimension for the funnel
 * (e.g. "convert rate when LCP > 4s" cohort).
 *
 * Safe to import client-side only — caller is responsible for guarding.
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { track } from './analytics';

let _wired = false;

function report(metric: Metric): void {
  try {
    track('$web_vitals', {
      metric: metric.name as 'LCP' | 'CLS' | 'INP' | 'TTFB' | 'FCP' | 'FID',
      value: metric.value,
      rating: metric.rating,
      page: window.location.pathname,
    });
  } catch {
    /* ignore */
  }
}

export function wireWebVitals(): void {
  if (_wired) return;
  if (typeof window === 'undefined') return;
  _wired = true;

  try {
    onLCP(report);
    onCLS(report);
    onINP(report);
    onTTFB(report);
    onFCP(report);
  } catch {
    /* ignore */
  }
}
