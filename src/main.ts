/**
 * ============================================
 * MAIN ENTRY POINT
 * ============================================
 *
 * Punto de entrada de la aplicacion Vue 3.
 * Configura plugins y monta la aplicacion.
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { router } from '@presentation/router/index.js';
import { i18n } from '@infrastructure/i18n/i18n.config.js';
import { initSentry } from '@infrastructure/sentry/sentry.config.js';

// Styles
import '@infrastructure/styles/main.css';

// Create app
const app = createApp(App);

// Pinia (state management)
const pinia = createPinia();
app.use(pinia);

// Router
app.use(router);

// i18n
app.use(i18n);

// Sentry (production only)
if (import.meta.env.PROD) {
  initSentry(app);
}

// Mount
app.mount('#app');

// Initialize theme after mount
import { useThemeStore } from '@presentation/stores/theme.store.js';
const themeStore = useThemeStore();
themeStore.initialize();
