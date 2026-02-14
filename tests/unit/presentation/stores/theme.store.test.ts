/**
 * ============================================
 * UNIT TEST: Theme Store
 * ============================================
 *
 * Tests para el store de temas (dark/light mode).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useThemeStore } from '@presentation/stores/theme.store.js';

describe('ThemeStore', () => {
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
    // Clear localStorage
    localStorage.clear();
    // Reset document class
    document.documentElement.classList.remove('dark');
    // Mock matchMedia by default (light mode)
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with system theme by default', () => {
      const store = useThemeStore();
      expect(store.theme).toBe('system');
    });

    it('should load theme from localStorage if available', () => {
      localStorage.setItem('theme', 'dark');
      const store = useThemeStore();
      store.initialize();
      expect(store.theme).toBe('dark');
    });

    it('should detect system dark mode preference', () => {
      // Mock matchMedia to return dark mode
      mockMatchMedia(true);

      const store = useThemeStore();
      store.initialize();
      expect(store.effectiveTheme).toBe('dark');
    });

    it('should detect system light mode preference', () => {
      // Mock matchMedia to return light mode
      mockMatchMedia(false);

      const store = useThemeStore();
      store.initialize();
      expect(store.effectiveTheme).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('should set theme to light and apply it', () => {
      const store = useThemeStore();
      store.initialize();

      store.setTheme('light');

      expect(store.theme).toBe('light');
      expect(store.effectiveTheme).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should set theme to dark and apply it', () => {
      const store = useThemeStore();
      store.initialize();

      store.setTheme('dark');

      expect(store.theme).toBe('dark');
      expect(store.effectiveTheme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should set theme to system and use system preference', () => {
      // Mock matchMedia to return dark mode
      mockMatchMedia(true);

      const store = useThemeStore();
      store.initialize();

      store.setTheme('system');

      expect(store.theme).toBe('system');
      expect(store.effectiveTheme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('system');
    });
  });

  describe('persistence', () => {
    it('should persist theme in localStorage', () => {
      const store = useThemeStore();
      store.initialize();

      store.setTheme('dark');

      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should restore theme from localStorage on new instance', () => {
      const store1 = useThemeStore();
      store1.initialize();
      store1.setTheme('dark');

      // Create new pinia instance (simulate page reload)
      setActivePinia(createPinia());
      const store2 = useThemeStore();
      store2.initialize();

      expect(store2.theme).toBe('dark');
      expect(store2.effectiveTheme).toBe('dark');
    });
  });

  describe('DOM manipulation', () => {
    it('should add dark class to document when dark theme', () => {
      const store = useThemeStore();
      store.initialize();

      store.setTheme('dark');

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class from document when light theme', () => {
      // Set dark first
      document.documentElement.classList.add('dark');

      const store = useThemeStore();
      store.initialize();
      store.setTheme('light');

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
