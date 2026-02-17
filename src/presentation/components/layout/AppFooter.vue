<template>
  <footer class="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Links -->
        <nav class="flex flex-wrap gap-6 text-sm">
          <a
            href="/about"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            About
          </a>
          <a
            href="/privacy"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Contact
          </a>
        </nav>

        <!-- Copyright -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          © {{ currentYear }} Health Care Suite. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
