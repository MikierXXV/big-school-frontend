<!--
  ============================================
  COMPONENT: AdminLayout
  ============================================

  Layout for admin pages with header, sidebar, main content, and footer.
  On mobile: sidebar is a slide-in drawer controlled by a hamburger button.
  On desktop: sidebar is always visible (static).
-->

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import AdminSidebar from './AdminSidebar.vue';

const { t } = useI18n();
const sidebarOpen = ref(false);
</script>

<template>
  <div data-testid="admin-layout" class="flex flex-col min-h-screen bg-[#EEF2FF] dark:bg-gray-900">
    <AppHeader />

    <!-- Mobile nav bar — hamburger only (X is inside the drawer) -->
    <div class="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <button
        @click="sidebarOpen = true"
        aria-label="Open navigation"
        class="p-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ t('nav.adminPanel') }}</span>
    </div>

    <!-- Backdrop — closes drawer on click (z-40, below drawer z-50) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="sidebarOpen = false"
    />

    <div class="flex flex-1">
      <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>

    <AppFooter :minimal="true" />
  </div>
</template>
