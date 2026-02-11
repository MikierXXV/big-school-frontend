/**
 * ============================================
 * CONFIG: Vue i18n
 * ============================================
 *
 * Configuracion de internacionalizacion con vue-i18n.
 *
 * IDIOMAS SOPORTADOS:
 * - es: Espanol (default)
 * - en: Ingles
 *
 * TODO: Implementar configuracion completa
 */

import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    es,
    en,
  },
});
