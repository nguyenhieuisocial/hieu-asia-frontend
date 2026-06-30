'use client';

import * as React from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';

/**
 * GoogleTranslate — a custom, searchable language switcher (designed like
 * ifan.asia's admLangDd) that drives Google Translate underneath.
 *
 * Mechanism (the reliable, standard pattern): selecting a language sets the
 * `googtrans` cookie and reloads. Google's Translate Element — loaded ONLY on
 * pages that already carry a non-Vietnamese cookie, inside a post-hydration
 * effect — reads the cookie and translates. This avoids the combo-timing races
 * of driving the widget live, and (because the load is post-hydration) avoids
 * React hydration mismatches. For default Vietnamese visitors Google is never
 * loaded → clean Lighthouse + no third-party contact until the user opts in.
 *
 * React resilience: Google swaps text nodes for <font> wrappers; install the
 * well-known no-throw guard on removeChild/insertBefore (facebook/react#11538).
 */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (opts: Record<string, unknown>, elementId: string) => void } };
    __gtResiliencePatched?: boolean;
  }
}

type Lang = { code: string; cc: string; name: string; q: string };

// Curated list — native name + country code + ASCII search keywords (English +
// Vietnamese without diacritics) so search works whatever the user types.
// `code` = Google Translate language code.
const LANGS: readonly Lang[] = [
  { code: 'vi', cc: 'VN', name: 'Tiếng Việt', q: 'vietnamese tieng viet viet nam' },
  { code: 'en', cc: 'GB', name: 'English', q: 'english anh' },
  { code: 'zh-CN', cc: 'CN', name: '中文 (简体)', q: 'chinese simplified trung quoc gian the' },
  { code: 'zh-TW', cc: 'TW', name: '中文 (繁體)', q: 'chinese traditional trung phon the dai loan' },
  { code: 'ja', cc: 'JP', name: '日本語', q: 'japanese nhat ban' },
  { code: 'ko', cc: 'KR', name: '한국어', q: 'korean han quoc' },
  { code: 'th', cc: 'TH', name: 'ไทย', q: 'thai lan' },
  { code: 'lo', cc: 'LA', name: 'ລາວ', q: 'lao' },
  { code: 'km', cc: 'KH', name: 'ភាសាខ្មែរ', q: 'khmer campuchia cambodia' },
  { code: 'my', cc: 'MM', name: 'မြန်မာ', q: 'burmese myanmar mien dien' },
  { code: 'ms', cc: 'MY', name: 'Bahasa Melayu', q: 'malay malaysia ma lai' },
  { code: 'id', cc: 'ID', name: 'Bahasa Indonesia', q: 'indonesian indonesia' },
  { code: 'tl', cc: 'PH', name: 'Filipino', q: 'filipino tagalog philippines' },
  { code: 'hi', cc: 'IN', name: 'हिन्दी', q: 'hindi india an do' },
  { code: 'bn', cc: 'BD', name: 'বাংলা', q: 'bengali bangladesh' },
  { code: 'fr', cc: 'FR', name: 'Français', q: 'french phap' },
  { code: 'de', cc: 'DE', name: 'Deutsch', q: 'german duc' },
  { code: 'es', cc: 'ES', name: 'Español', q: 'spanish tay ban nha' },
  { code: 'pt', cc: 'PT', name: 'Português', q: 'portuguese bo dao nha' },
  { code: 'it', cc: 'IT', name: 'Italiano', q: 'italian y' },
  { code: 'nl', cc: 'NL', name: 'Nederlands', q: 'dutch ha lan' },
  { code: 'ru', cc: 'RU', name: 'Русский', q: 'russian nga' },
  { code: 'uk', cc: 'UA', name: 'Українська', q: 'ukrainian ukraine' },
  { code: 'pl', cc: 'PL', name: 'Polski', q: 'polish ba lan' },
  { code: 'tr', cc: 'TR', name: 'Türkçe', q: 'turkish tho nhi ky' },
  { code: 'ar', cc: 'SA', name: 'العربية', q: 'arabic a rap' },
  { code: 'fa', cc: 'IR', name: 'فارسی', q: 'persian farsi iran' },
  { code: 'he', cc: 'IL', name: 'עברית', q: 'hebrew israel do thai' },
];

const ELEMENT_ID = 'google_translate_element';
const SCRIPT_ID = 'google-translate-script';

/** Strip diacritics + đ so search matches with or without Vietnamese tones. */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function patchDomForTranslate(): void {
  if (typeof window === 'undefined' || window.__gtResiliencePatched) return;
  window.__gtResiliencePatched = true;
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  };
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

/** Inject the Google Translate script + init the hidden element (idempotent). */
function loadGoogleTranslate(): void {
  patchDomForTranslate();
  window.googleTranslateElementInit = (): void => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    const host = document.getElementById(ELEMENT_ID);
    if (TranslateElement && host && host.childElementCount === 0) {
      new TranslateElement({ pageLanguage: 'vi', autoDisplay: false }, ELEMENT_ID);
    }
  };
  if (document.getElementById(SCRIPT_ID)) {
    if (window.google?.translate) window.googleTranslateElementInit();
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
}

/** Current translation target from the googtrans cookie ('vi' = original). */
function readCurrentLang(): string {
  if (typeof document === 'undefined') return 'vi';
  const m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
  return m && m[1] ? decodeURIComponent(m[1]) : 'vi';
}

/** Persist the chosen language via the googtrans cookie (Google reads it). */
function setLangCookie(code: string): void {
  const host = window.location.hostname;
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  if (code === 'vi') {
    // Clear on every domain scope Google might have written.
    document.cookie = `googtrans=; path=/; ${expire}`;
    document.cookie = `googtrans=; path=/; domain=${host}; ${expire}`;
    document.cookie = `googtrans=; path=/; domain=.${host}; ${expire}`;
    return;
  }
  const val = `/vi/${code}`;
  document.cookie = `googtrans=${val}; path=/`;
  document.cookie = `googtrans=${val}; path=/; domain=.${host}`;
}

export function GoogleTranslate({ className = '' }: { className?: string }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [current, setCurrent] = React.useState('vi');
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // Post-hydration: sync the displayed language from the cookie and, if the page
  // is meant to be translated, load Google now (after hydration → no mismatch).
  React.useEffect(() => {
    const cur = readCurrentLang();
    setCurrent(cur);
    if (cur !== 'vi') loadGoogleTranslate();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (code: string): void => {
    setOpen(false);
    setQuery('');
    if (code === current) return;
    setLangCookie(code);
    window.location.reload();
  };

  const fallback: Lang = { code: 'vi', cc: 'VN', name: 'Tiếng Việt', q: '' };
  const currentLang = LANGS.find((l) => l.code === current) ?? fallback;
  const nq = norm(query.trim());
  const filtered = nq
    ? LANGS.filter((l) => norm(`${l.name} ${l.q} ${l.cc} ${l.code}`).includes(nq))
    : LANGS;

  return (
    <div ref={rootRef} translate="no" className={`gt-widget notranslate ${className}`}>
      <div id={ELEMENT_ID} aria-hidden="true" className="gt-hidden" />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Chọn ngôn ngữ"
        className="gt-trigger"
      >
        <span className="gt-cc">{currentLang.cc}</span>
        <span className="gt-name">{currentLang.name}</span>
        <ChevronDown className={`gt-chev${open ? ' gt-chev-open' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="gt-panel" role="dialog" aria-label="Ngôn ngữ">
          <div className="gt-search">
            <Search className="gt-search-icon" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm ngôn ngữ…"
              aria-label="Tìm ngôn ngữ"
              className="gt-search-input"
            />
          </div>
          <ul className="gt-list" role="listbox">
            {filtered.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => select(l.code)}
                  role="option"
                  aria-selected={l.code === current}
                  className={`gt-item${l.code === current ? ' gt-item-active' : ''}`}
                >
                  <span className="gt-cc">{l.cc}</span>
                  <span className="gt-name">{l.name}</span>
                  {l.code === current && <Check className="gt-check" aria-hidden="true" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="gt-empty">Không tìm thấy ngôn ngữ</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
