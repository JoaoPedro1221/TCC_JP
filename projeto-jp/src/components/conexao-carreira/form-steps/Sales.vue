<script setup>
import { reactive, ref, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import { useConexaoStore } from '../../../stores/conexao'

const conexaoStore = useConexaoStore()
const submitted = ref(false)
const errors = reactive({})

const originOptions = ref([
  { label: 'Google', value: 'Google' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'E-mail', value: 'E-mail' },
  { label: 'Outro', value: 'Outro' }
])

// Verifica se um campo obrigatório possui algum valor preenchido.
function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

// Registra o estado de erro de um campo da etapa final.
function setError(field, isInvalid) {
  errors[field] = isInvalid
}

// Valida origem e aceite dos termos antes do envio da inscrição.
function validate(showMessage = true) {
  if (showMessage) {
    submitted.value = true
  }

  setError('origin', !isFilled(conexaoStore.registry.origin))
  setError('hasAcceptedTermsAndConditions', !conexaoStore.registry.hasAcceptedTermsAndConditions)

  return !Object.values(errors).some(Boolean)
}

// Indica se um campo deve ser exibido como inválido depois da tentativa de envio.
function isInvalid(field) {
  return submitted.value && errors[field]
}

// Revalida a etapa final enquanto o usuário corrige origem ou aceite dos termos.
watch(
  () => [conexaoStore.registry.origin, conexaoStore.registry.hasAcceptedTermsAndConditions],
  () => {
    if (submitted.value) {
      validate(false)
    }
  }
)

defineExpose({ validate })
</script>

<template>
  <section class="sales-form" aria-label="Origem da inscrição">
    <h2 class="sales-form__title">COMO VOCÊ FICOU SABENDO DO NOSSO EVENTO?</h2>

    <p v-if="submitted && Object.values(errors).some(Boolean)" class="sales-form__error-summary">
      Há campos incompletos. Revise os campos destacados.
    </p>

    <Select
      v-model="conexaoStore.registry.origin"
      :options="originOptions"
      :invalid="isInvalid('origin')"
      option-label="label"
      option-value="value"
      placeholder="Selecione*"
      class="sales-form__select"
    />

    <label class="sales-form__terms">
      <Checkbox
        v-model="conexaoStore.registry.hasAcceptedTermsAndConditions"
        :invalid="isInvalid('hasAcceptedTermsAndConditions')"
        binary
        class="sales-form__checkbox"
      />
      <span>Aceito os Termos de Uso e Privacidade</span>
    </label>
  </section>
</template>

<style scoped>
.sales-form {
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  width: min(100%, 52rem);
  margin: 0 auto;
  color: #171717;
  font-family: 'Raleway', Arial, sans-serif;
}

.sales-form__title {
  margin: 0 0 0.875rem;
  color: #111111;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.sales-form__error-summary {
  margin: -0.875rem 0 0;
  padding: 0.625rem 0.875rem;
  border: 1px solid #dc2626;
  border-radius: 0.375rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
}

:deep(.sales-form__select) {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 2.375rem;
  border: 1px solid #d6d6d6;
  border-radius: 0.375rem;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #eeeeee;
  color: #242424;
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 1rem;
}

:deep(.sales-form__select .p-select-label) {
  padding: 0.5rem 0.8125rem;
  color: #858585;
}

:deep(.sales-form__select .p-select-dropdown) {
  width: 2.5rem;
  color: #4f5661;
}

:deep(.sales-form__select.p-invalid) {
  border-color: #dc2626;
  box-shadow: inset 0 0 0 1px #dc2626;
}

.sales-form__terms {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  color: #1f1f1f;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
}

:deep(.sales-form__checkbox .p-checkbox-box) {
  width: 1rem;
  height: 1rem;
  border: 2px solid #000000;
  border-radius: 999px;
  background: #ffffff;
}

:deep(.sales-form__checkbox.p-invalid .p-checkbox-box),
:deep(.sales-form__checkbox[data-p-invalid='true'] .p-checkbox-box) {
  border-color: #dc2626;
  box-shadow: 0 0 0 1px #dc2626;
}

:deep(.sales-form__checkbox.p-checkbox-checked .p-checkbox-box),
:deep(.sales-form__checkbox[data-p-checked='true'] .p-checkbox-box) {
  border-color: #06255c;
  background: #06255c;
}

:deep(.sales-form__checkbox .p-checkbox-icon) {
  width: 0.625rem;
  height: 0.625rem;
  color: #ffffff;
}
</style>
