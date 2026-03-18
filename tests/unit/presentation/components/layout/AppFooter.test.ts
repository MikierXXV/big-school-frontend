/**
 * ============================================
 * TEST: AppFooter Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from 'vue-router';
import AppFooter from '@presentation/components/layout/AppFooter.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      footer: {
        tagline: 'Comprehensive hospital management platform',
        description: 'Digital solutions for your healthcare organization.',
        sections: { platform: 'Platform', company: 'Company', contact: 'Contact' },
        platform: {
          surgicalBlock: 'Surgical Block',
          emergency: 'Emergency',
          dataAnalytics: 'Analytics',
          wristbandPrinting: 'Wristband Printing',
          labelPrinting: 'Label Printing',
        },
        company: { about: 'About us', contact: 'Contact', privacy: 'Privacy policy', terms: 'Terms of service' },
        contact: { email: 'contact@healthcaresuite.com', phone: '+34 900 000 000', address: 'Innovation Street, 42' },
        copyright: '© {year} Health Care Suite. All rights reserved.',
      },
    },
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/surgical-block', component: { template: '<div/>' } },
    { path: '/emergency', component: { template: '<div/>' } },
    { path: '/data-analytics', component: { template: '<div/>' } },
    { path: '/wristband-printing', component: { template: '<div/>' } },
    { path: '/label-printing', component: { template: '<div/>' } },
  ],
});

const globalPlugins = { plugins: [i18n, router] };
const mountFooter = (minimal = false) =>
  mount(AppFooter, { props: { minimal }, global: globalPlugins });

describe('AppFooter', () => {
  describe('Full mode (default)', () => {
    it('should render footer element', () => {
      const wrapper = mountFooter();

      expect(wrapper.find('footer').exists()).toBe(true);
    });

    it('should render copyright text with current year', () => {
      const wrapper = mountFooter();
      const currentYear = new Date().getFullYear();

      expect(wrapper.text()).toContain(`© ${currentYear}`);
      expect(wrapper.text()).toContain('Health Care Suite');
    });

    it('should have dark mode classes', () => {
      const wrapper = mountFooter();

      expect(wrapper.find('footer').classes()).toContain('dark:bg-gray-900');
    });

    it('should render company buttons that open modals', () => {
      const wrapper = mountFooter();

      // Company links are now buttons (open modals), not <a> tags
      const buttons = wrapper.findAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });

    it('should render platform links', () => {
      const wrapper = mountFooter();

      const links = wrapper.findAll('a');
      expect(links.length).toBeGreaterThan(4);
    });
  });

  describe('Minimal mode', () => {
    it('should render copyright text', () => {
      const wrapper = mountFooter(true);
      const currentYear = new Date().getFullYear();

      expect(wrapper.text()).toContain(`© ${currentYear}`);
      expect(wrapper.text()).toContain('Health Care Suite');
    });

    it('should not render company buttons', () => {
      const wrapper = mountFooter(true);

      // In minimal mode no company buttons are rendered
      expect(wrapper.findAll('button').length).toBe(0);
    });
  });
});
