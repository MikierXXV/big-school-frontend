<!--
  ============================================
  COMPONENT: AppFooter
  ============================================

  Footer profesional multi-columna de Health Care Suite.
  Incluye branding, módulos de plataforma, enlaces de empresa e información de contacto.
-->

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AboutModal from '@presentation/components/footer/AboutModal.vue';
import ContactModal from '@presentation/components/footer/ContactModal.vue';
import PrivacyPolicyModal from '@presentation/components/footer/PrivacyPolicyModal.vue';
import TermsOfServiceModal from '@presentation/components/footer/TermsOfServiceModal.vue';

const props = withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false });

const { t } = useI18n();
const currentYear = computed(() => new Date().getFullYear());

const activeModal = ref<'about' | 'contact' | 'privacy' | 'terms' | null>(null);
</script>

<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <!-- Main footer content — only on full mode -->
    <div v-if="!props.minimal" class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <!-- Col 1: Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="font-bold text-gray-900 dark:text-white text-base">Health Care Suite</span>
          </div>
          <p class="text-primary-600 dark:text-primary-400 text-sm font-medium mb-3">
            {{ t('footer.tagline') }}
          </p>
          <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            {{ t('footer.description') }}
          </p>
        </div>

        <!-- Col 2: Platform modules -->
        <div>
          <h3 class="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {{ t('footer.sections.platform') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/surgical-block"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.platform.surgicalBlock') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/emergency"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.platform.emergency') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/data-analytics"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.platform.dataAnalytics') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/wristband-printing"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.platform.wristbandPrinting') }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/label-printing"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.platform.labelPrinting') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 3: Company -->
        <div>
          <h3 class="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {{ t('footer.sections.company') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm bg-transparent border-none p-0 text-left cursor-pointer"
                @click="activeModal = 'about'"
              >
                {{ t('footer.company.about') }}
              </button>
            </li>
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm bg-transparent border-none p-0 text-left cursor-pointer"
                @click="activeModal = 'contact'"
              >
                {{ t('footer.company.contact') }}
              </button>
            </li>
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm bg-transparent border-none p-0 text-left cursor-pointer"
                @click="activeModal = 'privacy'"
              >
                {{ t('footer.company.privacy') }}
              </button>
            </li>
            <li>
              <button
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm bg-transparent border-none p-0 text-left cursor-pointer"
                @click="activeModal = 'terms'"
              >
                {{ t('footer.company.terms') }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Col 4: Contact -->
        <div>
          <h3 class="text-gray-900 dark:text-gray-100 font-semibold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {{ t('footer.sections.contact') }}
          </h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-primary-500 dark:text-primary-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a
                :href="`mailto:${t('footer.contact.email')}`"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.contact.email') }}
              </a>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-primary-500 dark:text-primary-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a
                :href="`tel:${t('footer.contact.phone')}`"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
              >
                {{ t('footer.contact.phone') }}
              </a>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-primary-500 dark:text-primary-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-gray-600 dark:text-gray-400 text-sm">
                {{ t('footer.contact.address') }}
              </span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Company Modals -->
    <AboutModal :open="activeModal === 'about'" @close="activeModal = null" />
    <ContactModal :open="activeModal === 'contact'" @close="activeModal = null" />
    <PrivacyPolicyModal :open="activeModal === 'privacy'" @close="activeModal = null" />
    <TermsOfServiceModal :open="activeModal === 'terms'" @close="activeModal = null" />

    <!-- Bottom bar: copyright -->
    <div class="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          {{ t('footer.copyright', { year: currentYear }) }}
        </p>
      </div>
    </div>
  </footer>
</template>
