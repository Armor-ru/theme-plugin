type CSS = String;

interface GoogleFont {
  family: string;
  wght: string;
}

interface Font {
  family: string;
}

const kinds: Record<string, (key: string, obj: any) => CSS> = {
  font: (key: string, obj: Font): CSS => {
    return `--${key}: normal 1em ${obj.family};\n`;
  },
  'webfont/google': (key: string, obj: GoogleFont): CSS => {
    const googleFont = `https://fonts.googleapis.com/css?family=${obj.family}:${obj.wght}`;

    if (typeof document !== 'undefined') {
      const head = document.head || document.getElementsByTagName('head')[0];

      const googleFontLink = document.createElement('link');
      googleFontLink.href = googleFont;
      googleFontLink.className = 'theme-preload';
      googleFontLink.setAttribute('rel', 'stylesheet');
      googleFontLink.setAttribute('type', 'text/css');
      head.appendChild(googleFontLink);
    }

    let wght = obj.wght;
    let fontStyle = 'normal';
    if (wght.includes('italic')) {
      fontStyle = 'italic';
      wght = wght.replace('italic', '');
    }
    if (wght === 'regular') wght = 'normal';

    return `@import url('${googleFont}');
  --${key}: ${fontStyle} ${wght} 1em ${obj.family};\n`;
  },
  text: (key: string, obj: any): CSS => {
    return `--${key}: ${obj.text};\n`;
  },
};

export function getCssTheme(cssObject: Record<string, any>) {
  let css = `:root {\n`;
  const tab = '  '
  for (const key in cssObject) {
    const value = cssObject[key];
    if (typeof value === 'object') {
      css += tab + kinds[value.kind](key, value);
    } else css += tab + `--${key}: ${value};\n`;
  }
  css += `}\n`;
  return css;
}

export function initTheme(base: string) {
  window.addEventListener('message', event => {
    switch (event.data?.event) {
      case 'updateTheme':
        updateTheme(event.data.css);
        break;
      case 'historyEdit':
        historyEdit(event.data.method);
        break;
    }
  });

  function updateTheme(cssObject: Record<string, any>) {
    document.querySelectorAll('link.theme-preload').forEach(el => el.remove());
    const css = getCssTheme(cssObject);
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = head.getElementsByClassName('theme')[0] as any;
    if (!style) {
      const style = document.createElement('style');
      style.className = 'theme';
      head.appendChild(style);

      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
    } else {
      style.textContent = css;
    }
  }

  function historyEdit(method: string) {
    switch (method) {
      case 'back':
        if (window.location.pathname.replace(/index.html\/?/i, '') !== base)
          window.history.back();
        break;
      case 'forward':
        window.history.forward();
        break;
    }
  }
}
