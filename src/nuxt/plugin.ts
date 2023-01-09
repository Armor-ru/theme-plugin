import { initTheme } from '@armor-ru/theme-utils/src/client';
import { Plugin } from '@nuxt/types';

const pluginTheme: Plugin = function({ base }) {
  if (process.client) {
    initTheme(base);
  }
};

export default pluginTheme;