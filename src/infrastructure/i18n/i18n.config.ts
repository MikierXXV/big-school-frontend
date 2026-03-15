/**
 * ============================================
 * CONFIG: Vue i18n
 * ============================================
 *
 * Configuracion de internacionalizacion con vue-i18n.
 *
 * IDIOMAS SOPORTADOS:
 * - ca: Catala
 * - es: Espanol (default)
 * - en: Ingles
 */

import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';
import ca from './locales/ca.json';

const savedLocale = localStorage.getItem('app-locale');
const initialLocale = (savedLocale === 'ca' || savedLocale === 'es' || savedLocale === 'en') ? savedLocale : 'es';

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'es',
  messages: {
    ca,
    es,
    en,
  },
});
