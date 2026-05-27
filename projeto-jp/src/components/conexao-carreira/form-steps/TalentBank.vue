<script setup>
import { reactive, ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { useConexaoStore } from '../../../stores/conexao'

const conexaoStore = useConexaoStore()
const submitted = ref(false)
const errors = reactive({})

const languageOptions = ref([
  { label: 'Não possuo', value: 'Não possuo' },
  { label: 'Básico', value: 'Básico' },
  { label: 'Intermediário', value: 'Intermediário' },
  { label: 'Avançado', value: 'Avançado' },
  { label: 'Fluente', value: 'Fluente' }
])

const toolOptions = ref([
  { label: 'Não possuo', value: 'Não possuo' },
  { label: 'Básico', value: 'Básico' },
  { label: 'Intermediário', value: 'Intermediário' },
  { label: 'Avançado', value: 'Avançado' },
  { label: 'Expert', value: 'Expert' }
])

// Verifica se um campo obrigatório possui algum valor preenchido.
function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

// Registra o estado de erro de uma competência do banco de talentos.
function setError(field, isInvalid) {
  errors[field] = isInvalid
}

// Valida as competências obrigatórias antes de avançar para a etapa final.
function validate(showMessage = true) {
  if (showMessage) {
    submitted.value = true
  }

  const talents = conexaoStore.registry.talents

  setError('english', !isFilled(talents.english))
  setError('spanish', !isFilled(talents.spanish))
  setError('excel', !isFilled(talents.excel))
  setError('powerBI', !isFilled(talents.powerBI))

  return !Object.values(errors).some(Boolean)
}

// Indica se uma competência deve ser exibida como inválida depois da tentativa de avanço.
function isInvalid(field) {
  return submitted.value && errors[field]
}

// Revalida as competências enquanto o usuário corrige campos após uma tentativa de avanço.
watch(
  () => conexaoStore.registry.talents,
  () => {
    if (submitted.value) {
      validate(false)
    }
  },
  { deep: true }
)

defineExpose({ validate })
</script>

<template>
  <section class="talent-form" aria-label="Seu currículo">
    <h2 class="talent-form__title">SEU CURRÍCULO</h2>
    <p class="talent-form__description">
      O currículo será compartilhado com as empresas. Aproveite para destacar seus diferenciais.
    </p>

    <p v-if="submitted && Object.values(errors).some(Boolean)" class="talent-form__error-summary">
      Há campos incompletos. Revise os campos destacados.
    </p>

    <div class="talent-form__rows">
      <label class="talent-form__row">
        <span class="talent-form__prefix">Inglês</span>
        <Select
          v-model="conexaoStore.registry.talents.english"
          :options="languageOptions"
          :invalid="isInvalid('english')"
          option-label="label"
          option-value="value"
          placeholder="Nível"
          class="talent-form__select"
        />
      </label>

      <label class="talent-form__row">
        <span class="talent-form__prefix">Espanhol</span>
        <Select
          v-model="conexaoStore.registry.talents.spanish"
          :options="languageOptions"
          :invalid="isInvalid('spanish')"
          option-label="label"
          option-value="value"
          placeholder="Nível"
          class="talent-form__select"
        />
      </label>

      <label class="talent-form__row">
        <span class="talent-form__prefix">Excel</span>
        <Select
          v-model="conexaoStore.registry.talents.excel"
          :options="toolOptions"
          :invalid="isInvalid('excel')"
          option-label="label"
          option-value="value"
          placeholder="Nível"
          class="talent-form__select"
        />
      </label>

      <label class="talent-form__row">
        <span class="talent-form__prefix">Power BI</span>
        <Select
          v-model="conexaoStore.registry.talents.powerBI"
          :options="toolOptions"
          :invalid="isInvalid('powerBI')"
          option-label="label"
          option-value="value"
          placeholder="Nível"
          class="talent-form__select"
        />
      </label>

      <label class="talent-form__row">
        <span class="talent-form__prefix talent-form__prefix--url">linkedin.com/</span>
        <InputText
          v-model="conexaoStore.registry.linkedin"
          class="talent-form__field"
          placeholder="Link do Perfil"
        />
      </label>
    </div>
  </section>
</template>

<style scoped>
.talent-form {
  display: flex;
  flex-direction: column;
  width: min(100%, 52rem);
  margin: 0 auto;
  color: #171717;
  font-family: 'Raleway', Arial, sans-serif;
}

.talent-form__title {
  margin: 0 0 0.75rem;
  color: #111111;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.talent-form__description {
  margin: 0 0 1.375rem;
  color: #1f1f1f;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
}

.talent-form__error-summary {
  margin: -0.75rem 0 1rem;
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

.talent-form__rows {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.talent-form__row {
  display: grid;
  grid-template-columns: 6.625rem minmax(0, 1fr);
  width: 100%;
}

.talent-form__prefix {
  display: flex;
  align-items: center;
  min-height: 2.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.375rem 0 0 0.375rem;
  background: #f6f6f6;
  color: #6b6f78;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
}

.talent-form__prefix--url {
  justify-content: center;
}

:deep(.talent-form__select),
:deep(.talent-form__field) {
  width: 100%;
  min-height: 2.375rem;
  border: 1px solid #d6d6d6;
  border-radius: 0 0.375rem 0.375rem 0;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #eeeeee;
  color: #242424;
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 1rem;
}

:deep(.talent-form__field) {
  padding: 0.5rem 0.8125rem;
}

:deep(.talent-form__field::placeholder),
:deep(.p-select-label.p-placeholder) {
  color: #858585;
}

:deep(.talent-form__select) {
  display: flex;
  align-items: center;
}

:deep(.talent-form__select .p-select-label) {
  padding: 0.5rem 0.8125rem;
  color: #858585;
}

:deep(.talent-form__select .p-select-dropdown) {
  width: 2.5rem;
  color: #4f5661;
}

:deep(.talent-form__select.p-invalid) {
  border-color: #dc2626;
  box-shadow: inset 0 0 0 1px #dc2626;
}

@media (max-width: 760px) {
  .talent-form__row {
    grid-template-columns: 1fr;
  }

  .talent-form__prefix {
    border-radius: 0.375rem 0.375rem 0 0;
  }

  :deep(.talent-form__select),
  :deep(.talent-form__field) {
    border-radius: 0 0 0.375rem 0.375rem;
  }
}
</style>
