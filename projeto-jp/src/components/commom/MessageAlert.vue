<!-- Os temas possíves são "success", "danger" ou "warning". -->
<script setup>
import { computed } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { useErrorStore } from "../../stores/error";

const errorStore = useErrorStore();

// Escolhe o ícone do modal de mensagem conforme o tema atual da store de erros.
const iconClass = computed(() => {
  const icons = {
    success: "pi pi-check-circle",
    danger: "pi pi-times-circle",
    warning: "pi pi-exclamation-circle",
  };

  return icons[errorStore.theme] || icons.success;
});
</script>

<template>
  <Dialog
    v-model:visible="errorStore.isErrorModalOpen"
    modal
    :closable="false"
    :dismissable-mask="false"
    :close-on-escape="false"
    :show-header="false"
    class="message-alert-dialog"
    :pt="{ content: { style: { padding: '0' } } }"
    :style="{ width: 'min(500px, calc(100vw - 2rem))' }"
  >
    <div class="message-alert" :class="errorStore.theme || 'success'">
      <div class="message-alert__header">{{ errorStore.title }}</div>
      <div class="message-alert__body">
        <div class="message-alert__icon">
          <i
            :class="['message-alert__icon-symbol', iconClass]"
            aria-hidden="true"
          ></i>
        </div>
        <div class="message-alert__text" v-html="errorStore.message"></div>
      </div>
      <div class="message-alert__footer">
        <Button
          class="message-alert__button"
          label="Ok"
          @click="errorStore.isErrorModalOpen = false"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.message-alert-dialog) {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.message-alert-dialog .p-dialog-content) {
  border-radius: 10px;
  background: transparent;
}

.message-alert {
  border-radius: 10px;
  background-color: white;
  width: 100%;
}

.message-alert__header {
  font-size: 1.5rem;
  color: black;
  font-weight: 600;
  background-color: #f5f5f5;
  padding: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #dbdbdb;
  font-family: "Montserrat";
}

.message-alert__body {
  padding: 20px;
  display: flex;
  align-items: center;
}

.message-alert__icon-symbol {
  display: block;
  font-size: 3rem;
  line-height: 1;
}

.message-alert__text {
  margin-left: 20px;
  color: black;
  font-family: "Montserrat";
}

.message-alert__footer {
  background-color: #f5f5f5;
  padding: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 1px solid #dbdbdb;
}

.message-alert__button {
  margin-left: auto;
  display: block;
  font-weight: 700;
  border: transparent;
  padding: 0.5rem 1.25rem;
  font-family: "Montserrat";
}

/* THEME */

.success .message-alert__icon-symbol {
  color: #48c78e;
}

.success .message-alert__button {
  border-color: #48c78e;
  background-color: #48c78e;
  color: white;
}

.danger .message-alert__icon-symbol {
  color: #f14668;
}

.danger .message-alert__button {
  border-color: #f14668;
  background-color: #f14668;
  color: white;
}

.warning .message-alert__icon-symbol {
  color: #ffe08a;
}

.warning .message-alert__button {
  border-color: #ffe08a;
  background-color: #ffe08a;
  color: black;
}

@media (max-width: 1024px) {
  .message-alert {
    max-width: 100%;
  }
}
</style>
