(() => {
  const STORAGE_KEY = 'ym_lang';
  const supported = ['en','it','fa'];

  function applyLanguage(l) {
    if (!supported.includes(l)) l = 'en';
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.dataset[l] !== undefined) el.textContent = el.dataset[l];
    });

    supported.forEach(code => {
      const btn = document.getElementById(code);
      if (btn) btn.classList.toggle('active', code === l);
    });
  }

  function bind() {
    supported.forEach(l => {
      const btn = document.getElementById(l);
      if (!btn) return;
      btn.removeAttribute('onclick');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const previous = localStorage.getItem(STORAGE_KEY) || 'en';
        localStorage.setItem(STORAGE_KEY, l);
        applyLanguage(l);
        // Dynamic sample-profile sections are generated from the language at page load.
        // Reload only when the language actually changes so every dynamic label is rebuilt consistently.
        if (previous !== l) window.location.reload();
      });
    });
  }

  function init() {
    const initial = localStorage.getItem(STORAGE_KEY) || document.documentElement.lang || 'en';
    applyLanguage(initial);
    bind();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
