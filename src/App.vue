<!--
  ============================================
  ROOT COMPONENT
  ============================================

  Componente raíz de la aplicación.
  Renderiza el router-view principal con transiciones de página.
-->

<script setup lang="ts">
import { useRoute } from 'vue-router';
import NotificationContainer from '@presentation/components/NotificationContainer.vue';

const route = useRoute();
</script>

<template>
  <div id="app-container" class="min-h-screen flex flex-col">
    <!-- Page Transitions -->
    <router-view v-slot="{ Component }">
      <transition
        :name="route.meta.transition as string || 'fade'"
        mode="out-in"
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>

    <!-- Global Notification Container -->
    <NotificationContainer />
  </div>
</template>

<style>
/* Page Transition Animations */

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide Up Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
