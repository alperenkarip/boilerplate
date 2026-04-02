// Web root entry point
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initSentry } from './observability/sentry';
import { App } from './App';
import './styles/globals.css';

// Sentry init — en erken noktada
initSentry();

const root = document.getElementById('root');
if (!root) throw new Error('Root element bulunamadi');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
