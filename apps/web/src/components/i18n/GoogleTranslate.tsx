'use client';

import * as React from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';

/**
 * GoogleTranslate — a custom, searchable language switcher (designed like
 * ifan.asia's admLangDd) that drives Google Translate underneath.
 *
 * Design: a styled trigger (country-code badge + native name + chevron) opens a
 * panel with a search box and a list of languages (country-code badge + native
 * name, the active one highlighted). The raw Google `<select>` is loaded into a
 * visually-hidden container and driven programmatically on select.
 *
 * LAZY: the Google script is only injected the FIRST time the user opens the
 * dropdown — not at page load. This keeps Lighthouse/perf clean and avoids
 * sending the page to Google until the user actually asks to translate.
 *
 * React resilience: Google swaps text nodes for <font> wrappers, which makes
 * React's removeChild/insertBefore throw on later updates. We install the
 * well-known no-throw guard once (facebook/react#11538).
 */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (opts: Record<string, unknown>, elementId: string) => void } };
    __gtResiliencePatched?: boolean;
  }
}

type Lang = { code: string; cc: string; name: string };

// Curated "mọi quốc gia" list — native names + representative country code,
// arranged with Vietnamese first then nearby markets, then major world langs.
// Codes match Google Translate's language codes (goog-te-combo option values).
const LANGS: readonly Lang[] = [
  { code: 'vi', cc: 'VN', name: 'Tiếng Việt' },
  { code: 'en', cc: 'GB', name: 'English' },
  { code: 'zh-CN', cc: 'CN', name: '中文 (简体)' },
  { code: 'zh-TW', cc: 'TW', name: '中文 (繁體)' },
  { code: 'ja', cc: 'JP', name: '日本語' },
  { code: 'ko', cc: 'KR', name: '한국어' },
  { code: 'th', cc: 'TH', name: 'ไทย' },
  { code: 'lo', cc: 'LA', name: 'ລາວ' },
  { code: 'km', cc: 'KH', name: 'ភាសាខ្មែរ' },
  { code: 'my', cc: 'MM', name: 'မြန်မာ' },
  { code: 'ms', cc: 'MY', name: 'Bahasa Melayu' },
  { code: 'id', cc: 'ID', name: 'Bahasa Indonesia' },
  { code: 'tl', cc: 'PH', name: 'Filipino' },
  { code: 'hi', cc: 'IN', name: 'हिन्दी' },
  { code: 'bn', cc: 'BD', name: 'বাংলা' },
  { code: 'fr', cc: 'FR', name: 'Français' },
  { code: 'de', cc: 'DE', name: 'Deutsch' },
  { code: 'es', cc: 'ES', name: 'Español' },
  { code: 'pt', cc: 'PT', name: 'Português' },
  { code: 'it', cc: 'IT', name: 'Italiano' },
  { code: 'nl', cc: 'NL', name: 'Nederlands' },
  { code: 'ru', cc: 'RU', name: 'Русский' },
  { code: 'uk', cc: 'UA', name: 'Українська' },
  { code: 'pl', cc: 'PL', name: 'Polski' },
  { code: 'tr', cc: 'TR', name: 'Türkçe' },
  { code: 'ar', cc: 'SA', name: 'العربية' },
  { code: 'fa', cc: 'IR', name: 'فارسی' },
  { code: 'he', cc: 'IL', name: 'עברית' },
];

const ELEMENT_ID = 'google_translate_element';
const SCRIPT_ID = 'google-translate-script';

/** Make React tolerate Google Translate's DOM node swaps (no-throw guards). */
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

/** Inject the Google Translate script + init the hidden combo (idempotent). */
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

/** Drive the hidden goog-te-combo. Returns false if it isn't ready yet. */
function applyGoogleLang(code: string): boolean {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (!combo) return false;
  combo.value = code === 'vi' ? '' : code;
  combo.dispatchEvent(new Event('change'));
  return true;
}

/** Read the current translation target from the googtrans cookie. */
function readCurrentLang(): string {
  if (typeof document === 'undefined') return 'vi';
  const m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
  return m && m[1] ? m[1] : 'vi';
}

export function GoogleTranslate({ className = '' }: { className?: string }): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [current, setCurrent] = React.useState('vi');
  const loadedRef = React.useRef(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setCurrent(readCurrentLang());
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

  const ensureLoaded = React.useCallback((): void => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadGoogleTranslate();
  }, []);

  const toggle = (): void => {
    setOpen((o) => {
      const next = !o;
      if (next) ensureLoaded();
      return next;
    });
  };

  const select = (code: string): void => {
    setCurrent(code);
    setOpen(false);
    setQuery('');
    ensureLoaded();
    if (applyGoogleLang(code)) return;
    // Google not ready yet (first open) — retry briefly until the combo exists.
    let tries = 0;
    const iv = window.setInterval(() => {
      tries += 1;
      if (applyGoogleLang(code) || tries > 40) window.clearInterval(iv);
    }, 150);
  };

  const fallback: Lang = { code: 'vi', cc: 'VN', name: 'Tiếng Việt' };
  const currentLang = LANGS.find((l) => l.code === current) ?? fallback;
  const ql = query.trim().toLowerCase();
  const filtered = ql
    ? LANGS.filter((l) => l.name.toLowerCase().includes(ql) || l.cc.toLowerCase().includes(ql) || l.code.toLowerCase().includes(ql))
    : LANGS;

  return (
    <div ref={rootRef} translate="no" className={`gt-widget notranslate ${className}`}>
      {/* hidden Google engine */}
      <div id={ELEMENT_ID} aria-hidden="true" className="gt-hidden" />

      <button
        type="button"
        onClick={toggle}
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
