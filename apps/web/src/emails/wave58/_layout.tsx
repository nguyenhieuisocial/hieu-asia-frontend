/**
 * Wave 58 Phase B — Shared drip-email layout.
 * Wave 60.60.c — Option D-light brand voice (italic verb + gold-dot + warm palette).
 *
 * One layout = identical header / footer / List-Unsubscribe disclaimer across
 * the 5 drip templates, so changing the brand line touches one file.
 *
 * Dark-mode handling: email clients vary wildly. Strategy is "light surface,
 * dark text" with explicit hex colors (no CSS variables) so Apple Mail dark
 * mode + Gmail dark mode keep the gold accent visible against either
 * background. Tested mental model only — verify in Litmus post-launch.
 *
 * Email client constraints:
 * - Inline styles only (no Tailwind className, no CSS vars)
 * - Web-safe fonts (Georgia serif for headings, system sans for body)
 * - Hex colors inline (gold #B8923D, cream #F5F0E6, dark warm #2E2620)
 * - text-shadow on gold-dot degrades gracefully in older clients
 */

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { CSSProperties, ReactNode } from 'react';

// Wave 60.60.c — Option D-light palette (warm-light variant for email default light bg)
export const BRAND_GOLD = '#B8923D';
export const BRAND_GOLD_LIGHT = '#D4B373';
export const BRAND_GOLD_HALO = '#E5C68A';
export const BRAND_INK = '#2E2620'; // dark warm sepia
export const BRAND_MUTED = '#8A8275';
export const BRAND_CREAM = '#F5F0E6'; // warm-light body bg
export const BRAND_SURFACE = '#FFFFFF';

// Backwards compat — kept so other files don't break if they import BRAND_AMBER
export const BRAND_AMBER = BRAND_GOLD;

// Web-safe serif stack — Instrument Serif (used on web) won't load in email,
// Georgia/Cambria are universal fallbacks that preserve editorial feel.
const SERIF_STACK = 'Georgia, Cambria, "Times New Roman", Times, serif';
const SANS_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/**
 * Italic verb span — brand voice signature.
 * Use inline: <ItalicVerb>quan sát</ItalicVerb>
 */
export function ItalicVerb({ children }: { children: ReactNode }) {
  return (
    <em
      style={{
        fontFamily: SERIF_STACK,
        fontStyle: 'italic',
        color: BRAND_GOLD_LIGHT,
        fontWeight: 400,
      }}
    >
      {children}
    </em>
  );
}

/**
 * Gold-dot period — used at end of hero phrases.
 * text-shadow halo degrades gracefully in clients that strip it.
 */
export function GoldDot() {
  return (
    <span
      style={{
        color: BRAND_GOLD_HALO,
        textShadow: '0 0 4px rgba(229,198,138,0.18)',
        fontWeight: 700,
      }}
    >
      .
    </span>
  );
}

interface LayoutProps {
  /** Pre-header text shown in inbox preview pane (max ~90 chars). */
  preview: string;
  /** Unsubscribe URL (HMAC-signed token already baked in). */
  unsubscribeUrl: string;
  /** Email body — React Email blocks. */
  children: ReactNode;
}

export function DripLayout({ preview, unsubscribeUrl, children }: LayoutProps) {
  return (
    <Html lang="vi">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Brand header */}
          <Section style={headerStyle}>
            <Img
              src="https://hieu.asia/brand/logo-amber.png"
              alt="hieu.asia"
              width="120"
              height="32"
              style={{ display: 'block' }}
            />
          </Section>

          {/* Accent bar — gold gradient feel via solid (linear-gradient unreliable in email) */}
          <Section style={{ borderTop: `2px solid ${BRAND_GOLD}`, margin: '0 0 24px' }} />

          {children}

          {/* Footer */}
          <Hr style={{ borderColor: '#E8E0D0', margin: '32px 0 16px' }} />
          <Section>
            <Text style={footerTextStyle}>
              Bạn nhận email này vì đã đăng ký hieu.asia. Quản lý email tại{' '}
              <Link href="https://hieu.asia/account/privacy" style={footerLinkStyle}>
                /account/privacy
              </Link>
              <GoldDot />
            </Text>
            <Text style={footerTextStyle}>
              Hoặc{' '}
              <Link href={unsubscribeUrl} style={footerLinkStyle}>
                hủy đăng ký một lần
              </Link>{' '}
              · hieu.asia · TP.HCM, Việt Nam
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: CSSProperties = {
  backgroundColor: BRAND_CREAM,
  fontFamily: SANS_STACK,
  margin: 0,
  padding: '24px 0',
};

const containerStyle: CSSProperties = {
  backgroundColor: BRAND_SURFACE,
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px 32px 24px',
  borderRadius: '8px',
};

const headerStyle: CSSProperties = {
  marginBottom: '20px',
};

const footerTextStyle: CSSProperties = {
  color: BRAND_MUTED,
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 6px',
};

const footerLinkStyle: CSSProperties = {
  color: BRAND_GOLD,
  textDecoration: 'underline',
};

/* Re-usable inline styles for templates — keeps each template skinny. */

// Heading — serif (Georgia/Cambria fallback for Instrument Serif).
export const h1Style: CSSProperties = {
  color: BRAND_INK,
  fontFamily: SERIF_STACK,
  fontSize: '26px',
  fontWeight: 500,
  lineHeight: '34px',
  letterSpacing: '-0.01em',
  margin: '0 0 18px',
};

export const bodyTextStyle: CSSProperties = {
  color: BRAND_INK,
  fontFamily: SANS_STACK,
  fontSize: '16px',
  lineHeight: '25px',
  margin: '0 0 16px',
};

export const ctaWrapStyle: CSSProperties = {
  margin: '28px 0 8px',
  textAlign: 'center',
};

// Pill CTA — rounded-pill via border-radius 9999px (works in all modern email clients).
export const ctaButtonStyle: CSSProperties = {
  backgroundColor: BRAND_GOLD,
  borderRadius: '9999px',
  color: '#2E2620',
  display: 'inline-block',
  fontFamily: SANS_STACK,
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.01em',
  padding: '12px 24px',
  textDecoration: 'none',
};

export const subtleNoteStyle: CSSProperties = {
  color: BRAND_MUTED,
  fontFamily: SANS_STACK,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
  fontStyle: 'italic',
};

/**
 * Refund jade badge — "14 ngày hoàn tiền" reassurance chip for payment/upsell emails.
 * Jade hue (#2D7A6B) reads as "safe / verified" cross-culture.
 */
export const refundBadgeStyle: CSSProperties = {
  backgroundColor: '#E8F4F1',
  border: '1px solid #2D7A6B',
  borderRadius: '9999px',
  color: '#1F5A4F',
  display: 'inline-block',
  fontFamily: SANS_STACK,
  fontSize: '12px',
  fontWeight: 600,
  padding: '4px 10px',
  textDecoration: 'none',
};
