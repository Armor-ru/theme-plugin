import type { Plugin, ResolvedConfig } from 'vite';
import sum from 'hash-sum';
import * as path from 'path';
import { generateScssTheme, initTheme } from '../utils';

interface IOptions {
  scss: string;
}

 const themePlugin = (opts: IOptions): Plugin => {
  let config: ResolvedConfig;
  let script = ``;
  let name = ``;
  return {
    name: 'theme-plugin',
    apply: 'build',
    configResolved(_config) {
      config = _config;
      script = `(${initTheme.toString()})('${config.base}');`;
      name = `theme.${sum(script)}.js`;
    },
    generateBundle() {
      const fileName = `${config.build.assetsDir}/${name}`;
      this.emitFile({
        type: 'asset',
        fileName,
        source: script,
      });
    },
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: {
            src: `${config.base}${config.build.assetsDir}/${name}`,
          },
          injectTo: 'head',
        },
      ];
    },
    async writeBundle() {
      await generateScssTheme(opts.scss, path.resolve(config.build.outDir + '/theme.json'));
    },
  };
};
export default themePlugin;