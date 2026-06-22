import { describe, it, expect } from 'vitest';
import { resolveReadingOwnerIds } from './session-auth';

/**
 * Wave 65 IDOR guard — resolveReadingOwnerIds decides which owner id(s) a
 * caller may read readings for. The security-critical property: the
 * client-supplied `x-anon-id` is accepted ONLY in `anon_<uuid v4>` shape, so an
 * attacker can never pass a VICTIM's bare auth uid to read their reading.
 *
 * These cases send no Authorization header, so getSessionFromRequest() returns
 * null without any GoTrue round-trip — the anon-guard path is exercised in
 * isolation.
 */
function reqWith(headers: Record<string, string>): Request {
  return new Request('https://x.test/api/reading/session_abc', { headers });
}

// A well-formed anon id (uuid v4: 3rd group starts with 4, 4th with 8/9/a/b).
const VALID_ANON = 'anon_12345678-1234-4123-8abc-1234567890ab';

describe('resolveReadingOwnerIds (Wave 65 IDOR guard)', () => {
  it('accepts a valid anon_<uuid> from x-anon-id', async () => {
    expect(await resolveReadingOwnerIds(reqWith({ 'x-anon-id': VALID_ANON }))).toEqual([
      VALID_ANON,
    ]);
  });

  it('REJECTS a bare auth uuid in x-anon-id (no anon_ prefix → cannot impersonate a victim)', async () => {
    const victimAuthUid = '12345678-1234-4123-8abc-1234567890ab';
    expect(await resolveReadingOwnerIds(reqWith({ 'x-anon-id': victimAuthUid }))).toEqual([]);
  });

  it('rejects a malformed anon id', async () => {
    expect(await resolveReadingOwnerIds(reqWith({ 'x-anon-id': 'anon_not-a-uuid' }))).toEqual(
      [],
    );
  });

  it('rejects an anon-prefixed value with a tampered (non-v4) uuid body', async () => {
    // 3rd group must start with "4"; here it starts with "9" → not v4 → dropped.
    const bad = 'anon_12345678-1234-9123-8abc-1234567890ab';
    expect(await resolveReadingOwnerIds(reqWith({ 'x-anon-id': bad }))).toEqual([]);
  });

  it('returns [] when no identity is presented (proxy will 401)', async () => {
    expect(await resolveReadingOwnerIds(reqWith({}))).toEqual([]);
  });

  it('trims surrounding whitespace before validating', async () => {
    expect(await resolveReadingOwnerIds(reqWith({ 'x-anon-id': `  ${VALID_ANON}  ` }))).toEqual([
      VALID_ANON,
    ]);
  });
});
