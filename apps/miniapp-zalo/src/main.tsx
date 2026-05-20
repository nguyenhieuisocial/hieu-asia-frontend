import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './styles/globals.css';

const container = document.getElementById('app');
if (!container) {
  throw new Error('[miniapp-zalo] Missing #app root element.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
