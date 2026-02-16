/**
 * ============================================
 * COMPOSABLE: useTheme
 * ============================================
 *
 * Wrapper composable around theme store for easy access to theme functionality.
 */

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@presentation/stores/theme.store.js';

export function useTheme() {
  const themeStore = useThemeStore();
  const { theme, effectiveTheme } = storeToRefs(themeStore);

  const isDark = computed(() => effectiveTheme.value === 'dark');

  return {
    theme,
    effectiveTheme,
    setTheme: themeStore.setTheme,
    isDark,
  };
}
