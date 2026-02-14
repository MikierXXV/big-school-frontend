<!--
  ============================================
  VIEW: Dashboard
  ============================================

  Página principal del dashboard.
-->

<script setup lang="ts">
import { DashboardLayout } from '@presentation/components/layout/index.js';
import { useAuth } from '@presentation/composables/useAuth.js';

const { user } = useAuth();
</script>

<template>
  <DashboardLayout>
    <div class="dashboard-content">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

      <!-- Welcome Message -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back{{ user ? `, ${user.fullName}` : '' }}!
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          You're logged in and viewing your dashboard.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Stat Card 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">0</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">0</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">0</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.dashboard-content {
  /* Additional styles if needed */
}
</style>
