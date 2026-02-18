<!--
  ============================================
  VIEW: Home
  ============================================

  Página de inicio de Health Care Suite.
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuth } from '@presentation/composables/useAuth.js';
import { BaseButton } from '@presentation/components/ui/index.js';

const { t } = useI18n();
const { isAuthenticated } = useAuth();
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">{{ t('home.hero.title') }}</h1>
        <p class="text-xl md:text-2xl mb-8 text-primary-100">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <router-link v-if="!isAuthenticated" to="/register">
            <BaseButton variant="secondary" size="lg">{{ t('home.hero.getStarted') }}</BaseButton>
          </router-link>
          <router-link v-if="!isAuthenticated" to="/login">
            <BaseButton variant="outline" size="lg" class="text-white border-white hover:bg-white hover:text-primary-600">
              {{ t('home.hero.signIn') }}
            </BaseButton>
          </router-link>
          <router-link v-if="isAuthenticated" to="/dashboard">
            <BaseButton variant="secondary" size="lg">{{ t('home.hero.goToDashboard') }}</BaseButton>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          {{ t('home.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature: Surgical Block -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.features.surgicalBlock.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.surgicalBlock.description') }}</p>
          </div>

          <!-- Feature: Emergency -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.features.emergency.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.emergency.description') }}</p>
          </div>

          <!-- Feature: Data & Analytics -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.features.dataAnalytics.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.dataAnalytics.description') }}</p>
          </div>

          <!-- Feature: Wristband Printing -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.features.wristbandPrinting.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.wristbandPrinting.description') }}</p>
          </div>

          <!-- Feature: Label Printing -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('home.features.labelPrinting.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.labelPrinting.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {{ t('home.cta.subtitle') }}
        </p>
        <router-link v-if="!isAuthenticated" to="/register">
          <BaseButton variant="primary" size="lg">{{ t('home.cta.createAccount') }}</BaseButton>
        </router-link>
        <router-link v-if="isAuthenticated" to="/dashboard">
          <BaseButton variant="primary" size="lg">{{ t('home.cta.continueToDashboard') }}</BaseButton>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  /* Remove default padding */
}

.hero {
  min-height: 500px;
  display: flex;
  align-items: center;
}
</style>
