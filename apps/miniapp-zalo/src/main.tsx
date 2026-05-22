import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { getPostHog } from './lib/posthog';
import './styles/globals.css';

const container = document.getElementById('app');
if (!container) {
  throw new Error('[miniapp-zalo] Missing #app root element.');
}

// Fire-and-forget PostHog init. Safe no-op when VITE_PUBLIC_POSTHOG_KEY is unset.
getPostHog();

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
