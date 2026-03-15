/**
 * ============================================
 * COMPOSABLE: useLocale
 * ============================================
 *
 * Manages the application locale (CA / ES / EN) with localStorage persistence.
 */

import { ref } from 'vue';
import { i18n } from '@infrastructure/i18n/i18n.config.js';

export const SUPPORTED_LOCALES = ['ca', 'es', 'en'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

const LOCALE_STORAGE_KEY = 'app-locale';

const currentLocale = ref<SupportedLocale>(
  (i18n.global.locale as any).value as SupportedLocale
);

function setLocale(locale: SupportedLocale): void {
  (i18n.global.locale as any).value = locale;
  currentLocale.value = locale;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function useLocale() {
  return { currentLocale, setLocale, SUPPORTED_LOCALES };
}
