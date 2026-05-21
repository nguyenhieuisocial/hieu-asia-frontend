/**
 * Saved user birth profile — persists across visits.
 *
 * Phase 1: localStorage only (key `hieu:profile:v1`).
 * Phase 2 (queued): when user is logged in, sync to Supabase via /api/user/profile.
 *
 * Form components auto-fill from this when present. Users see a small
 * "Dùng thông tin đã lưu" banner above forms.
 *
 * Example usage:
 *   const { profile, save } = useSavedProfile();
 *   useEffect(() => {
 *     if (profile?.birthDate) setBirthDate(profile.birthDate);
 *   }, [profile]);
 *   // onSubmit: save({ displayName, gender, birthDate, birthTime, birthPlace });
 */

export interface SavedProfile {
  displayName?: string;
  gender?: 'male' | 'female';
  birthDate?: string; // YYYY-MM-DD solar
  birthTime?: string; // HH:MM, optional
  birthPlace?: string; // free text
  birthTimeConfidence?: 'known' | 'approximate' | 'unknown';
  /**
   * Chế độ Chuyên gia (roadmap §3.5). When true, reading pages render technical
   * Tử Vi terminology (cung, sao, đại vận, tiểu hạn). When false/undefined,
   * accessible Vietnamese is shown. Default false.
   * Note: also persisted standalone under `hieu:expert-mode:v1` via
   * `useExpertMode()` so anonymous visitors can toggle without a saved profile.
   */
  expertMode?: boolean;
  updatedAt?: string; // ISO
}

const STORAGE_KEY = 'hieu:profile:v1';

export function readSavedProfile(): SavedProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProfile;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(p: SavedProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const next: SavedProfile = { ...p, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / disabled storage — best-effort */
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* best-effort */
  }
}

/** Computed: does the saved profile contain enough for a chart cast (date + time + gender)? */
export function isProfileComplete(p: SavedProfile | null): boolean {
  if (!p) return false;
  return Boolean(p.birthDate && p.birthTime && p.gender);
}

/** Format birthDate (YYYY-MM-DD) as DD/MM/YYYY. Returns input on parse failure. */
function formatVnDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** Format the profile as a human-readable one-line summary for the banner. */
export function describeProfile(p: SavedProfile): string {
  const parts: string[] = [];
  if (p.displayName) parts.push(p.displayName);
  if (p.gender) parts.push(p.gender === 'male' ? 'Nam' : 'Nữ');

  const dateBits: string[] = [];
  if (p.birthTime) dateBits.push(p.birthTime);
  if (p.birthDate) dateBits.push(formatVnDate(p.birthDate));
  if (dateBits.length) parts.push(dateBits.join(' '));

  if (p.birthPlace) parts.push(p.birthPlace);
  return parts.join(' · ');
}
