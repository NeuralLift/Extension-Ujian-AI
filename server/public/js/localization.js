document.addEventListener('DOMContentLoaded', function () {
  const languageSwitcher = document.getElementById('languageSwitcher');
  const elementsToTranslate = document.querySelectorAll('[data-key]');

  // Simpan bahasa terakhir di localStorage
  const savedLang = localStorage.getItem('lang') || 'en';

  function loadLanguage(lang) {
    fetch(`locales/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => {
        elementsToTranslate.forEach((element) => {
          const key = element.getAttribute('data-key');
          if (translations[key]) {
            element.textContent = translations[key];
          }
        });
        localStorage.setItem('lang', lang);
      })
      .catch((error) => console.error('Error loading language file:', error));
  }

  // Load bahasa yang terakhir dipilih
  loadLanguage(savedLang);
  languageSwitcher.value = savedLang;

  // Ganti bahasa ketika dropdown berubah
  languageSwitcher.addEventListener('change', function () {
    loadLanguage(this.value);
  });
});
