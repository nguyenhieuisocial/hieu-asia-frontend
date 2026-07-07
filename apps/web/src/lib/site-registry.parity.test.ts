// S9 / T10 parity gate — the four views DERIVED from site-registry.ts must stay
// byte-identical to the four legacy hand-lists they replaced. If a future edit to
// the registry drifts any surface (mobile drawer · homepage marquee · /cong-cu
// catalog · related-tools), this test fails. Kept alongside the legacy lists; when
// those are deleted (≥1 release after S9 ships live), delete this test too.
import { describe, it, expect } from 'vitest';
import {
  QUICK_LOOKUP,
  TOOLKIT_GROUPS,
  CATALOG_TOOLS,
  RELATED_TOOLS,
} from './site-registry';
import { QUICK_LOOKUP as LEGACY_QUICK, TOOLKIT_GROUPS as LEGACY_TOOLKIT } from './catalog/tools';
import { RELATED_TOOLS as LEGACY_RELATED } from './related-tools';
import { CATALOG_TOOLS_LEGACY } from './catalog-tools';

describe('site-registry parity — derived views === legacy lists', () => {
  it('QUICK_LOOKUP (mobile drawer)', () => {
    expect(QUICK_LOOKUP).toEqual(LEGACY_QUICK);
  });
  it('TOOLKIT_GROUPS (homepage marquee)', () => {
    expect(TOOLKIT_GROUPS).toEqual(LEGACY_TOOLKIT);
  });
  it('CATALOG_TOOLS (/cong-cu catalog)', () => {
    expect(CATALOG_TOOLS).toEqual(CATALOG_TOOLS_LEGACY);
  });
  it('RELATED_TOOLS (công cụ liên quan)', () => {
    expect(RELATED_TOOLS).toEqual(LEGACY_RELATED);
  });
});
