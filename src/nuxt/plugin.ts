import { initTheme } from '@armor-ru/theme/src/utils/client';
import { Plugin } from '@nuxt/types';

const pluginTheme: Plugin = function({ base }) {
  if (process.client) {
    initTheme(base);
  }
};

export default pluginTheme;