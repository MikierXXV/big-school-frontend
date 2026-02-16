<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-3"
    >
      <BaseToast
        v-for="notification in notifications"
        :key="notification.id"
        :variant="notification.variant"
        :auto-dismiss="notification.autoDismiss"
        :duration="notification.duration"
        @close="handleClose(notification.id)"
      >
        {{ notification.message }}
      </BaseToast>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@presentation/stores/notification.store.js';
import BaseToast from '@presentation/components/ui/BaseToast.vue';

const store = useNotificationStore();
const { notifications } = storeToRefs(store);

function handleClose(id: string): void {
  store.removeNotification(id);
}
</script>

<style scoped>
/* Notification enter/leave transitions */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.2s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
