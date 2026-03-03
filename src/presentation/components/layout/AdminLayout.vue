<!--
  ============================================
  COMPONENT: AdminLayout
  ============================================

  Layout for admin pages with header, sidebar, main content, and footer.
-->

<script setup lang="ts">
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import AdminSidebar from './AdminSidebar.vue';
</script>

<template>
  <div data-testid="admin-layout" class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <div class="flex flex-1">
      <AdminSidebar />
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>
