<script setup>
import { reactive, ref, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import { useConexaoStore } from '../../../stores/conexao'
import { courses } from './data-field/Courses'
import { university } from './data-field/University'

const conexaoStore = useConexaoStore()
const submitted = ref(false)
const errors = reactive({})

const educationOptions = ref([
  { label: 'Curso Técnico', value: 'Curso Técnico' },
  { label: 'Graduação', value: 'Graduação' },
  { label: 'Mestrado', value: 'Mestrado' },
  { label: 'Doutorado', value: 'Doutorado' },
  { label: 'MBA', value: 'MBA' }
])

const progressOptions = ref([
  { label: 'Cursando', value: 'Cursando' },
  { label: 'Completo', value: 'Completo' }
])

const graduationOptions = ref([
  { label: 'Já me formei', value: 'Já me formei' },
  { label: '2026.1', value: '2026.1' },
  { label: '2026.2', value: '2026.2' },
  { label: '2027.1', value: '2027.1' },
  { label: '2027.2', value: '2027.2' },
  { label: '2028.1', value: '2028.1' },
  { label: '2028.2', value: '2028.2' },
  { label: '2029.1', value: '2029.1' },
  { label: '2029.2', value: '2029.2' },
  { label: '2030.1', value: '2030.1' },
  { label: '2030.2', value: '2030.2' },
  { label: '2031+', value: '2031+' }
])

const filteredUniversities = ref([])
const filteredCourses = ref([])

// Normaliza textos para pesquisar cursos e universidades sem depender de acentos ou caixa.
function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Filtra uma lista de opções e limita as sugestões exibidas no autocomplete.
function filterOptions(items, query) {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) {
    return items.slice(0, 20)
  }

  return items
    .filter((item) => normalizeText(item).includes(normalizedQuery))
    .slice(0, 20)
}

// Atualiza as sugestões de universidades conforme a busca do usuário.
function searchUniversities(event) {
  filteredUniversities.value = filterOptions(university.universidades, event.query)
}

// Atualiza as sugestões de cursos conforme a busca do usuário.
function searchCourses(event) {
  filteredCourses.value = filterOptions(courses.cursos, event.query)
}

// Verifica se um campo obrigatório possui algum valor preenchido.
function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

// Registra o estado de erro de um campo da etapa acadêmica.
function setError(field, isInvalid) {
  errors[field] = isInvalid
}

// Valida todos os campos acadêmicos e informa se o usuário pode avançar.
function validate(showMessage = true) {
  if (showMessage) {
    submitted.value = true
  }

  const registry = conexaoStore.registry

  setError('education', !isFilled(registry.education))
  setError('progress', !isFilled(registry.progress))
  setError('university', !isFilled(registry.university))
  setError('course', !isFilled(registry.course))
  setError('graduationDate', !isFilled(registry.graduationDate))

  return !Object.values(errors).some(Boolean)
}

// Indica se um campo deve ser exibido como inválido depois da tentativa de avanço.
function isInvalid(field) {
  return submitted.value && errors[field]
}

// Revalida a etapa enquanto o usuário corrige campos após uma tentativa de avanço.
watch(
  () => conexaoStore.registry,
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
  <section class="academic-form" aria-label="Informações acadêmicas">
    <h2 class="academic-form__title">INFORMAÇÕES ACADÊMICAS</h2>

    <p v-if="submitted && Object.values(errors).some(Boolean)" class="academic-form__error-summary">
      Há campos incompletos. Revise os campos destacados.
    </p>

    <div class="academic-form__grid academic-form__grid--two">
      <Select
        v-model="conexaoStore.registry.education"
        :options="educationOptions"
        :invalid="isInvalid('education')"
        option-label="label"
        option-value="value"
        placeholder="Nível de Formação*"
        class="academic-form__select"
      />

      <SelectButton
        v-model="conexaoStore.registry.progress"
        :options="progressOptions"
        :invalid="isInvalid('progress')"
        option-label="label"
        option-value="value"
        class="academic-form__progress"
        aria-label="Cursando ou completo"
      />
    </div>

    <AutoComplete
      v-model="conexaoStore.registry.university"
      :suggestions="filteredUniversities"
      :invalid="isInvalid('university')"
      input-class="academic-form__field"
      class="academic-form__autocomplete"
      placeholder="Universidade*"
      force-selection
      @complete="searchUniversities"
    />

    <div class="academic-form__grid academic-form__grid--two">
      <AutoComplete
        v-model="conexaoStore.registry.course"
        :suggestions="filteredCourses"
        :invalid="isInvalid('course')"
        input-class="academic-form__field"
        class="academic-form__autocomplete"
        placeholder="Curso*"
        force-selection
        @complete="searchCourses"
      />

      <Select
        v-model="conexaoStore.registry.graduationDate"
        :options="graduationOptions"
        :invalid="isInvalid('graduationDate')"
        option-label="label"
        option-value="value"
        placeholder="Formatura*"
        class="academic-form__select"
      />
    </div>
  </section>
</template>

<style scoped>
.academic-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: min(100%, 52rem);
  margin: 0 auto;
  color: #171717;
  font-family: 'Raleway', Arial, sans-serif;
}

.academic-form__title {
  margin: 0 0 0.875rem;
  color: #111111;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.academic-form__error-summary {
  margin: -0.5rem 0 0;
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

.academic-form__grid {
  display: grid;
  gap: 1.5rem;
}

.academic-form__grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

:deep(.academic-form__field),
:deep(.academic-form__select),
:deep(.academic-form__autocomplete .p-inputtext) {
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

:deep(.academic-form__field),
:deep(.academic-form__autocomplete .p-inputtext) {
  padding: 0.5rem 0.8125rem;
}

:deep(.academic-form__field::placeholder),
:deep(.academic-form__autocomplete .p-inputtext::placeholder),
:deep(.p-select-label.p-placeholder) {
  color: #858585;
}

:deep(.academic-form__select) {
  display: flex;
  align-items: center;
}

:deep(.academic-form__select .p-select-label) {
  padding: 0.5rem 0.8125rem;
  color: #858585;
}

:deep(.academic-form__select .p-select-dropdown) {
  width: 2.5rem;
  color: #4f5661;
}

:deep(.academic-form__autocomplete) {
  display: block;
  width: 100%;
}

:deep(.academic-form__progress) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
  min-height: 2.375rem;
  padding: 0.25rem;
  border: 0;
  border-radius: 0.375rem;
  background: #f3f3f3;
}

:deep(.academic-form__progress .p-togglebutton) {
  min-height: 1.875rem;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: #8a8a8a;
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
}

:deep(.academic-form__progress .p-togglebutton.p-togglebutton-checked),
:deep(.academic-form__progress .p-togglebutton[data-p-checked='true']) {
  background: #ffffff;
  color: #6f6f6f;
  box-shadow: none;
}

:deep(.academic-form__field.p-invalid),
:deep(.academic-form__select.p-invalid),
:deep(.academic-form__autocomplete.p-invalid .p-inputtext),
:deep(.academic-form__autocomplete .p-inputtext.p-invalid),
:deep(.academic-form__progress.p-invalid) {
  border-color: #dc2626;
  box-shadow: inset 0 0 0 1px #dc2626;
}

@media (max-width: 760px) {
  .academic-form__grid,
  .academic-form__grid--two {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
}
</style>
