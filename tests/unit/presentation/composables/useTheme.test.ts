/**
 * ============================================
 * UNIT TEST: useTheme Composable
 * ============================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTheme } from '@presentation/composables/useTheme.js';
import { useThemeStore } from '@presentation/stores/theme.store.js';

describe('useTheme', () => {
  // Mock matchMedia globally
  const mockMatchMedia = (matches: boolean = false) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockMatchMedia(false);
  });

  it('should return theme reactive refs from store', () => {
    const themeStore = useThemeStore();
    themeStore.initialize();

    const { theme, effectiveTheme } = useTheme();

    expect(theme.value).toBe('system');
    expect(effectiveTheme.value).toBe('light');
  });

  it('should return setTheme function', () => {
    const { setTheme } = useTheme();

    expect(typeof setTheme).toBe('function');
  });

  it('should call store setTheme when calling setTheme', () => {
    const themeStore = useThemeStore();
    themeStore.initialize();
    const spy = vi.spyOn(themeStore, 'setTheme');

    const { setTheme } = useTheme();
    setTheme('dark');

    expect(spy).toHaveBeenCalledWith('dark');
  });

  it('should return isDark computed property', () => {
    const themeStore = useThemeStore();
    themeStore.initialize();

    const { isDark, setTheme } = useTheme();

    expect(isDark.value).toBe(false);

    setTheme('dark');
    expect(isDark.value).toBe(true);

    setTheme('light');
    expect(isDark.value).toBe(false);
  });

  it('isDark should be reactive to effectiveTheme changes', () => {
    mockMatchMedia(true); // Dark mode
    const themeStore = useThemeStore();
    themeStore.initialize();

    const { isDark, setTheme } = useTheme();

    setTheme('system');
    expect(isDark.value).toBe(true);
  });
});
