import { initTheme } from '../utils/client';

declare global {
  interface Window {
    initTheme: any;
  }
}

if (typeof window !== 'undefined') window.initTheme = initTheme;
