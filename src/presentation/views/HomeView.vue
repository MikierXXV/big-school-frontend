<!--
  ============================================
  VIEW: Home
  ============================================

  Página de inicio.
-->

<script setup lang="ts">
import { useAuth } from '@presentation/composables/useAuth.js';
import { BaseButton } from '@presentation/components/ui/index.js';

const { isAuthenticated } = useAuth();
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Welcome to Big School</h1>
        <p class="text-xl md:text-2xl mb-8 text-primary-100">
          Learn, grow, and achieve your goals with our comprehensive learning platform
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <router-link v-if="!isAuthenticated" to="/register">
            <BaseButton variant="secondary" size="lg">Get Started</BaseButton>
          </router-link>
          <router-link v-if="!isAuthenticated" to="/login">
            <BaseButton variant="outline" size="lg" class="text-white border-white hover:bg-white hover:text-primary-600">
              Sign In
            </BaseButton>
          </router-link>
          <router-link v-if="isAuthenticated" to="/dashboard">
            <BaseButton variant="secondary" size="lg">Go to Dashboard</BaseButton>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Why Choose Big School?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Expert Courses</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Access a wide range of courses taught by industry experts and experienced educators.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Track Progress</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Monitor your learning journey with detailed analytics and progress tracking.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="feature-card bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Learn at Your Pace</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Flexible learning schedules that fit your lifestyle and commitments.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Ready to Start Learning?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Join thousands of students already learning with Big School
        </p>
        <router-link v-if="!isAuthenticated" to="/register">
          <BaseButton variant="primary" size="lg">Create Free Account</BaseButton>
        </router-link>
        <router-link v-if="isAuthenticated" to="/dashboard">
          <BaseButton variant="primary" size="lg">Continue Learning</BaseButton>
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
