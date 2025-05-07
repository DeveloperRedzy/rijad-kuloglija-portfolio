import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import prevoda
import translationEN from './locales/en/translation.json';
import translationBS from './locales/bs/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  bs: {
    translation: translationBS,
  },
};

// Učitaj sačuvani jezik iz localStorage ili koristi default
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Čuvaj jezik u localStorage kada se promijeni
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n; 