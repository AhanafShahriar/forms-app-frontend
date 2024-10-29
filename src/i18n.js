// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
const resources = {
  ENGLISH: {
    translation: {
      welcome: "Welcome",
      yourTemplates: "Your Templates",
      yourFilledForms: "Your Filled Forms",
      language: "Language",
      theme: "Theme",
      savePreferences: "Save Preferences",
      english: "English",
      spanish: "Spanish",
      russian: "Russian",
      // Add more translations as needed
    },
  },
  SPANISH: {
    translation: {
      welcome: "Bienvenido",
      yourTemplates: "Tus Plantillas",
      yourFilledForms: "Tus Formularios Completos",
      language: "Idioma",
      theme: "Tema",
      savePreferences: "Guardar Preferencias",
      // Add more translations as needed
    },
  },
  RUSSIAN: {
    translation: {
      welcome: "Добро пожаловать",
      yourTemplates: "Ваши Шаблоны",
      yourFilledForms: "Ваши Заполненные Формы",
      language: "Язык",
      theme: "Тема",
      savePreferences: "Сохранить Предпочтения",
      // Add more translations as needed
    },
  },
};

i18n
  .use(HttpApi) // Load translations from backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    lng: "ENGLISH", // Default language
    fallbackLng: "ENGLISH",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
