var STORAGE_KEY = 'theme-preference';
var mediaQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

var getStoredTheme = function () {
  try {
    var storedTheme = localStorage.getItem(STORAGE_KEY);
    return storedTheme === 'dark' || storedTheme === 'light'
      ? storedTheme
      : null;
  } catch (error) {
    return null;
  }
};

var getSystemTheme = function () {
  return mediaQuery && mediaQuery.matches ? 'dark' : 'light';
};

var setTheme = function (theme) {
  var root = document.documentElement;

  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
};

var updateToggles = function (theme) {
  var nextTheme = theme === 'dark' ? 'light' : 'dark';
  var label = nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
  var toggles = document.querySelectorAll('[data-theme-toggle]');

  toggles.forEach(function (toggle) {
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    toggle.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');

    var toggleLabel = toggle.querySelector('[data-theme-toggle-label]');

    if (toggleLabel) {
      toggleLabel.textContent = label;
    }
  });
};

var applyTheme = function (theme, persist) {
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

var initTheme = function () {
  var currentTheme =
    document.documentElement.getAttribute('data-theme') || getSystemTheme();

  updateToggles(currentTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var activeTheme =
        document.documentElement.getAttribute('data-theme') || getSystemTheme();
      var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme, true);
    });
  });

  if (mediaQuery) {
    var handleChange = function () {
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

module.exports = initTheme;
