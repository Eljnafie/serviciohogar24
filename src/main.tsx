import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import App from './App';
import { TRANSLATIONS } from './constants';
import './index.css';

// Initialize Internationalization
i18n
  .use(initReactI18next)
  .init({
    resources: TRANSLATIONS,
    lng: 'es', 
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);