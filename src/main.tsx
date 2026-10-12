// Polyfill/guard to allow extensions to hook window.fetch without "has only a getter" TypeError
try {
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch;
    let activeFetch = origFetch ? origFetch.bind(window) : undefined;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set) {
      Object.defineProperty(window, 'fetch', {
        get: () => activeFetch,
        set: (fn) => {
          activeFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch (_) {}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
