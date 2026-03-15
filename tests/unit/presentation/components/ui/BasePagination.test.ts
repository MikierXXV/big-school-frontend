/**
 * ============================================
 * TEST: BasePagination Component
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BasePagination from '@presentation/components/ui/BasePagination.vue';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      common: {
        showing: 'Showing {from}-{to} of {total}',
        previous: 'Previous',
        next: 'Next',
      },
    },
  },
});

function mountPagination(props: Record<string, any>) {
  return mount(BasePagination, {
    props,
    global: { plugins: [i18n] },
  });
}

describe('BasePagination', () => {
  it('should display showing info', () => {
    const wrapper = mountPagination({ page: 1, totalPages: 5, total: 50, limit: 10 });
    expect(wrapper.text()).toContain('Showing 1-10 of 50');
  });

  it('should disable previous button on first page', () => {
    const wrapper = mountPagination({ page: 1, totalPages: 5, total: 50, limit: 10 });
    const buttons = wrapper.findAll('button');
    expect(buttons[0].attributes('disabled')).toBeDefined();
  });

  it('should disable next button on last page', () => {
    const wrapper = mountPagination({ page: 5, totalPages: 5, total: 50, limit: 10 });
    const buttons = wrapper.findAll('button');
    expect(buttons[buttons.length - 1].attributes('disabled')).toBeDefined();
  });

  it('should emit page-change with previous page', async () => {
    const wrapper = mountPagination({ page: 3, totalPages: 5, total: 50, limit: 10 });
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('page-change')?.[0]).toEqual([2]);
  });

  it('should emit page-change with next page', async () => {
    const wrapper = mountPagination({ page: 3, totalPages: 5, total: 50, limit: 10 });
    const buttons = wrapper.findAll('button');
    await buttons[buttons.length - 1].trigger('click');
    expect(wrapper.emitted('page-change')?.[0]).toEqual([4]);
  });

  it('should not emit when clicking disabled previous', async () => {
    const wrapper = mountPagination({ page: 1, totalPages: 5, total: 50, limit: 10 });
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('page-change')).toBeUndefined();
  });

  it('should handle last page showing correctly', () => {
    const wrapper = mountPagination({ page: 5, totalPages: 5, total: 47, limit: 10 });
    expect(wrapper.text()).toContain('Showing 41-47 of 47');
  });
});
