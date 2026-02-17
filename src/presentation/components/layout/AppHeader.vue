<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Health Care Suite
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a
            v-if="isAuthenticated"
            href="/dashboard"
            class="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Dashboard
          </a>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- User Menu (Desktop) -->
          <div v-if="isAuthenticated" class="hidden md:block">
            <Menu as="div" class="relative">
              <MenuButton
                aria-label="User menu"
                class="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                  {{ userInitials }}
                </div>
              </MenuButton>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a
                        href="/profile"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-600' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                        ]"
                      >
                        Profile
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        href="/settings"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-600' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                        ]"
                      >
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="logoutAndRedirect"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-600' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
                        ]"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <!-- Login Link (when not authenticated) -->
          <a
            v-if="!isAuthenticated"
            href="/login"
            class="hidden md:inline-block text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Login
          </a>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
            class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          <nav class="flex flex-col space-y-2">
            <a
              v-if="isAuthenticated"
              href="/dashboard"
              class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Dashboard
            </a>
            <a
              v-if="isAuthenticated"
              href="/profile"
              class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Profile
            </a>
            <a
              v-if="isAuthenticated"
              href="/settings"
              class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Settings
            </a>
            <button
              v-if="isAuthenticated"
              @click="logoutAndRedirect"
              class="text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Logout
            </button>
            <a
              v-if="!isAuthenticated"
              href="/login"
              class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Login
            </a>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { useAuth } from '@presentation/composables/useAuth.js';
import ThemeToggle from '@presentation/components/ui/ThemeToggle.vue';

interface Props {
  isAuthenticated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isAuthenticated: undefined,
});

const auth = useAuth();
const mobileMenuOpen = ref(false);

// Use prop if provided, otherwise use auth store
const isAuthenticated = computed(() => {
  return props.isAuthenticated !== undefined ? props.isAuthenticated : auth.isAuthenticated.value;
});

const userInitials = computed(() => {
  if (!auth.user.value) return 'U';
  const firstName = auth.user.value.firstName || '';
  const lastName = auth.user.value.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
});

const logoutAndRedirect = () => {
  mobileMenuOpen.value = false;
  auth.logoutAndRedirect();
};
</script>
