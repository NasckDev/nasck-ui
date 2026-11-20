import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource-variable/dm-sans/wght.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import '../../src/styles/tokens.css';
import '../../src/styles/base.css';
import { App } from './App';
import './site.css';
import './templates.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
