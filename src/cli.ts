#!/usr/bin/env node

import { getCssTheme } from './utils/client';
import fs from 'fs';

const args = process.argv.slice(2);

const account = JSON.parse(args[0]);
const filepath = args[1];

if (account.options?.themeOptions?.options) {
  const file = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const css = getCssTheme(account.options.themeOptions?.options);
  const theme = file.replace(/:root {.+?}/s, css);
  fs.writeFileSync(filepath, theme, { encoding: 'utf-8' });
} else {
  console.error('Error not found themeOptions');
}
