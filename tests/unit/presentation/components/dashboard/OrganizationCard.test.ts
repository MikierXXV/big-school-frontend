/**
 * ============================================
 * TEST: OrganizationCard
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import OrganizationCard from '@presentation/components/dashboard/OrganizationCard.vue';

vi.mock('@presentation/components/ui/BaseBadge.vue', () => ({
  default: { template: '<span data-testid="badge"><slot /></span>', props: ['variant', 'size'] },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      organizations: {
        types: { hospital: 'Hospital', clinic: 'Clinic', laboratory: 'Laboratory' },
        roles: { doctor: 'Doctor', org_admin: 'Administrator', nurse: 'Nurse' },
      },
    },
  },
});

const mockMembership = {
  organizationId: 'org-1',
  organizationName: 'Hospital Central',
  organizationType: 'hospital',
  role: 'doctor',
  joinedAt: '2024-01-15',
  isActive: true,
};

function mountCard(membership = mockMembership) {
  return mount(OrganizationCard, {
    props: { membership },
    global: { plugins: [i18n] },
  });
}

describe('OrganizationCard', () => {
  it('should render the card', () => {
    const wrapper = mountCard();
    expect(wrapper.find('[data-testid="org-card-org-1"]').exists()).toBe(true);
  });

  it('should display organization name', () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain('Hospital Central');
  });

  it('should display organization type badge', () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain('Hospital');
  });

  it('should display role badge', () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain('Doctor');
  });

  it('should display join date', () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain('2024-01-15');
  });

  it('should use correct testid based on organizationId', () => {
    const wrapper = mountCard({
      ...mockMembership,
      organizationId: 'org-99',
    });
    expect(wrapper.find('[data-testid="org-card-org-99"]').exists()).toBe(true);
  });

  it('should render different organization types', () => {
    const wrapper = mountCard({
      ...mockMembership,
      organizationType: 'clinic',
    });
    expect(wrapper.text()).toContain('Clinic');
  });

  it('should render different roles', () => {
    const wrapper = mountCard({
      ...mockMembership,
      role: 'org_admin',
    });
    expect(wrapper.text()).toContain('Administrator');
  });
});
