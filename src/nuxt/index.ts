import { generateScssTheme } from '../utils/index';
import { Module } from '@nuxt/types';
import * as path from 'path';

interface IOptions {
  scss: string;
  dist: string;
}

const pluginTheme: Module = function({ scss }: IOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, '../nuxt', 'plugin.ts'),
    ssr: false,
  });
  this.nuxt.hook('generate:done', async () => {
    await generateScssTheme(scss, path.resolve(this.options.generate.dir + '/theme.json'));
  });
};

export default pluginTheme;
