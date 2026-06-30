'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';

/**
 * GoogleTranslate — the "all languages" selector (như ifan.asia): Google's
 * website-translation widget. Renders ONE <select> of ~100+ languages and
 * Google machine-translates the page client-side.
 *
 * React resilience: Google Translate swaps text nodes for <font> wrappers, which
 * later makes React's removeChild / insertBefore throw ("node is not a child").
 * We install the well-known no-throw guard on those two Node methods once
 * (facebook/react#11538) so the app never crashes while a page is translated.
 *
 * CSP: the Google hosts are whitelisted in next.config.ts (script/style/connect/
 * frame-src). Google's injected top banner is hidden via globals.css (.gt-widget).
 */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (opts: Record<string, unknown>, elementId: string) => void;
      };
    };
    __gtResiliencePatched?: boolean;
  }
}

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
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export function GoogleTranslate({ className = '' }: { className?: string }): React.JSX.Element {
  React.useEffect(() => {
    patchDomForTranslate();

    window.googleTranslateElementInit = (): void => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      const host = document.getElementById(ELEMENT_ID);
      // Re-init guard: on client nav the container remounts empty — only build
      // if Google hasn't already injected its <select> into it.
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
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div translate="no" className={`gt-widget notranslate inline-flex items-center gap-1.5 ${className}`}>
      <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div id={ELEMENT_ID} />
    </div>
  );
}
