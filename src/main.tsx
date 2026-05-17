// Import polyfills first for older browser/WebView support
import './polyfills';
import './i18n';

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'
import '@fontsource/opendyslexic/400.css';
import './index.css'

// Fallback for older browsers without createRoot
const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
  } catch (error) {
    // Fallback render for very old browsers
    console.error('React 18 createRoot failed, app may not work on this browser:', error);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center; font-family: sans-serif;"><h2>Please update your browser</h2><p>This app requires a modern browser to function properly.</p></div>';
  }
}
