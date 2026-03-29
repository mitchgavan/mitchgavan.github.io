const STORAGE_KEY = 'theme-preference';
const mediaQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    return storedTheme === 'dark' || storedTheme === 'light'
      ? storedTheme
      : null;
  } catch (error) {
    return null;
  }
};

const getSystemTheme = () => (mediaQuery && mediaQuery.matches ? 'dark' : 'light');

const setTheme = theme => {
  const root = document.documentElement;

  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
};

const updateToggles = theme => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
  const toggles = document.querySelectorAll('[data-theme-toggle]');

  toggles.forEach(toggle => {
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    toggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');

    const toggleLabel = toggle.querySelector('[data-theme-toggle-label]');

    if (toggleLabel) {
      toggleLabel.textContent = label;
    }
  });
};

const applyTheme = (theme, persist) => {
  setTheme(theme);
  updateToggles(theme);

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore localStorage failures and keep the theme applied for this page.
    }
  }
};

const initTheme = () => {
  const currentTheme =
    document.documentElement.getAttribute('data-theme') || getSystemTheme();

  updateToggles(currentTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const activeTheme =
        document.documentElement.getAttribute('data-theme') || getSystemTheme();
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme, true);
    });
  });

  if (mediaQuery) {
    const handleChange = () => {
      if (!getStoredTheme()) {
        applyTheme(getSystemTheme(), false);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }
  }
};

export default initTheme;
