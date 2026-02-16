/**
 * ============================================
 * STORE: Theme (Pinia)
 * ============================================
 *
 * Manages dark/light/system theme mode with persistence.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Theme = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  // State
  const theme = ref<Theme>('system');
  const effectiveTheme = ref<EffectiveTheme>('light');

  /**
   * Initialize theme from localStorage and apply system preference
   */
  function initialize() {
    // Load from localStorage
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      theme.value = stored;
    }

    // Update effective theme based on selection
    updateEffectiveTheme();

    // Listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemPreferenceChange);
  }

  /**
   * Update effective theme based on current theme selection
   */
  function updateEffectiveTheme() {
    if (theme.value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme.value = prefersDark ? 'dark' : 'light';
    } else {
      effectiveTheme.value = theme.value;
    }

    applyTheme();
  }

  /**
   * Apply theme to document (add/remove 'dark' class)
   */
  function applyTheme() {
    if (effectiveTheme.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Handle system preference changes
   */
  function handleSystemPreferenceChange() {
    if (theme.value === 'system') {
      updateEffectiveTheme();
    }
  }

  /**
   * Set theme and persist to localStorage
   */
  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    updateEffectiveTheme();
  }

  return {
    theme,
    effectiveTheme,
    initialize,
    setTheme,
  };
});
