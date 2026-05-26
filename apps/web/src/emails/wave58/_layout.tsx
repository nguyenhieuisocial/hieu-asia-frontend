/**
 * Wave 58 Phase B — Shared drip-email layout.
 *
 * One layout = identical header / footer / List-Unsubscribe disclaimer across
 * the 5 drip templates, so changing the brand line touches one file.
 *
 * Dark-mode handling: email clients vary wildly. Strategy is "light surface,
 * dark text" with explicit hex colors (no CSS variables) so Apple Mail dark
 * mode + Gmail dark mode keep the amber accent visible against either
 * background. Tested mental model only — verify in Litmus post-launch.
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
import type { ReactNode } from 'react';

export const BRAND_AMBER = '#B8923D';
export const BRAND_INK = '#1a1a1a';
export const BRAND_MUTED = '#6b6b6b';

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

          {/* Accent bar */}
          <Section style={{ borderTop: `3px solid ${BRAND_AMBER}`, margin: '0 0 24px' }} />

          {children}

          {/* Footer */}
          <Hr style={{ borderColor: '#e5e5e5', margin: '32px 0 16px' }} />
          <Section>
            <Text style={footerTextStyle}>
              Bạn nhận email này vì đã đăng ký hieu.asia. Tắt nhận email tại{' '}
              <Link href="https://hieu.asia/account/profile" style={footerLinkStyle}>
                /account/profile
              </Link>
              .
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

const bodyStyle = {
  backgroundColor: '#f6f5f1',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: '24px 0',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px 32px 24px',
  borderRadius: '8px',
};

const headerStyle = {
  marginBottom: '20px',
};

const footerTextStyle = {
  color: BRAND_MUTED,
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 6px',
};

const footerLinkStyle = {
  color: BRAND_AMBER,
  textDecoration: 'underline',
};

/* Re-usable inline styles for templates — keeps each template skinny. */

export const h1Style = {
  color: BRAND_INK,
  fontSize: '22px',
  fontWeight: 700,
  lineHeight: '30px',
  margin: '0 0 16px',
};

export const bodyTextStyle = {
  color: BRAND_INK,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

export const ctaWrapStyle = {
  margin: '24px 0 8px',
  textAlign: 'center' as const,
};

export const ctaButtonStyle = {
  backgroundColor: BRAND_AMBER,
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 28px',
  textDecoration: 'none',
};

export const subtleNoteStyle = {
  color: BRAND_MUTED,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
  fontStyle: 'italic' as const,
};
