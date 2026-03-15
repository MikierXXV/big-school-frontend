/**
 * ============================================
 * TEST: UserProfileView
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import UserProfileView from '@presentation/views/dashboard/UserProfileView.vue';

const { mockUser } = vi.hoisted(() => ({
  mockUser: {
    value: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      status: 'ACTIVE',
      systemRole: 'user',
      emailVerified: true,
    } as any,
    __v_isRef: true,
  },
}));

vi.mock('@presentation/composables/useAuth.js', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: { value: true, __v_isRef: true },
  }),
}));

vi.mock('@presentation/components/layout/index.js', () => ({
  DashboardLayout: { template: '<div data-testid="dashboard-layout"><slot /></div>' },
}));

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      profile: {
        title: 'My Profile',
        emailVerified: 'Email verified',
        emailNotVerified: 'Email not verified',
      },
      common: { active: 'Active', inactive: 'Inactive' },
      roles: { super_admin: 'Super Administrator', admin: 'Administrator', user: 'User' },
    },
  },
});

function mountView() {
  return mount(UserProfileView, {
    global: { plugins: [i18n] },
  });
}

describe('UserProfileView', () => {
  it('should render inside DashboardLayout', () => {
    const wrapper = mountView();
    expect(wrapper.find('[data-testid="dashboard-layout"]').exists()).toBe(true);
  });

  it('should show profile title', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('My Profile');
  });

  it('should show user full name', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('John');
    expect(wrapper.text()).toContain('Doe');
  });

  it('should show user email', () => {
    const wrapper = mountView();
    expect(wrapper.text()).toContain('test@example.com');
  });

  it('should show email verified indicator when verified', () => {
    mockUser.value.emailVerified = true;
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Email verified');
  });

  it('should show email not verified indicator when not verified', () => {
    mockUser.value.emailVerified = false;
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Email not verified');
    mockUser.value.emailVerified = true;
  });

  it('should show role badge', () => {
    mockUser.value.systemRole = 'user';
    const wrapper = mountView();
    expect(wrapper.text()).toContain('User');
  });

  it('should show active status badge', () => {
    mockUser.value.status = 'ACTIVE';
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Active');
  });

  it('should show inactive status badge when not active', () => {
    mockUser.value.status = 'INACTIVE';
    const wrapper = mountView();
    expect(wrapper.text()).toContain('Inactive');
    mockUser.value.status = 'ACTIVE';
  });

  it('should render initials badge', () => {
    mockUser.value.firstName = 'John';
    mockUser.value.lastName = 'Doe';
    const wrapper = mountView();
    expect(wrapper.text()).toContain('JD');
  });
});
