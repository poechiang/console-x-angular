const loadCss = (theme: string): Promise<Event> =>
  new Promise((resolve, reject) => {
    let link = document.querySelector('#theme-host') as HTMLLinkElement;

    if (!link) {
      link = document.createElement('link');
      link.id = 'theme-host';

      document.head.append(link);
    }

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.className = '';
    link.classList.add(theme);
    link.href = `${theme}.css`;
    link.onload = resolve;
    link.onerror = reject;
  });
const clear = (): void => {
  const root = document.querySelector(':root');
  if (root) {
    if (root.hasAttribute('theme-dark')) {
      root.removeAttribute('theme-dark');
    }

    if (root.hasAttribute('theme-light')) {
      root.removeAttribute('theme-light');
    }
  }
};

export const loadTheme = (theme: ThemeType, firstLoad = true): Promise<Event> => {
  if (firstLoad) {
    document.documentElement.classList.add(theme);
  }
  clear();
  return loadCss(theme).then(e => {
    if (!firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return e;
  });
};
