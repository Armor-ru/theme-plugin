import { parse } from 'scss-parser';
const createQueryWrapper = require('query-ast');
import { promises as fs } from "fs";

export async function generateScssTheme(filepath: string, distPath: string) {
  const file = await fs.readFile(filepath, { encoding: 'utf8' });
  const ast = parse(file);
  const $ = createQueryWrapper(ast);
  const theme: any = {};
  const regexr = new RegExp(
    '@FormField\\s*(.+?),\\s*(.+?)(?:,\\s*({.+}))?\r?$'
  );
  $('comment_singleline').filter((comment: any) => {
    const query = $(comment);
    const commentText = query.value();
    if (commentText.includes('@FormField')) {
      const declaration = query.next().next();
      const name = declaration.find('identifier').first().value();
      const valueElement = declaration.find('value');
      let value = valueElement.value().slice(1);
      if (valueElement.has('color_hex').length()) value = '#' + value;
      const match = regexr.exec(commentText);
      if (match) {
        theme[name] = {
          type: match[1],
          title: match[2],
          value,
          opts: match[3] ? JSON.parse(match[3]) : {},
        };
      }
    }
  });
  await fs.writeFile(distPath, JSON.stringify(theme, null, 2), {
    encoding: 'utf8',
  });
}
