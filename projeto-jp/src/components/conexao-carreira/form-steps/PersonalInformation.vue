<script setup>
import { reactive, ref, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { vMaska } from 'maska'
import { useConexaoStore } from '../../../stores/conexao'
import { fields } from './data-field/RegistrationFields'

const conexaoStore = useConexaoStore()
const submitted = ref(false)
const errors = reactive({})
const filteredCities = ref([])

const states = ref([
  { label: 'UF', value: null },
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MT', value: 'MT' },
  { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' },
  { label: 'SE', value: 'SE' },
  { label: 'TO', value: 'TO' }
])

const ddds = ref([
  { label: 'DDD', value: null },
  ...[
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '21',
    '22',
    '24',
    '27',
    '28',
    '31',
    '32',
    '33',
    '34',
    '35',
    '37',
    '38',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '51',
    '53',
    '54',
    '55',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '71',
    '73',
    '74',
    '75',
    '77',
    '79',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99'
  ].map((ddd) => ({ label: ddd, value: ddd }))
])

const genderOptions = ref([
  { label: 'Mulher cis', value: 'mulherCis' },
  { label: 'Homem cis', value: 'homemCis' },
  { label: 'Mulher transgênero', value: 'mulherTrans' },
  { label: 'Homem transgênero', value: 'homemTrans' },
  { label: 'Não binário', value: 'nao-binario' },
  { label: 'Prefiro não informar', value: 'nao-informar' }
])

const yesNoOptions = ref([
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
  { label: 'Prefiro não informar', value: 'nao-informar' }
])

const disabilityOptions = ref([
  { label: 'Não', value: 'Não' },
  { label: 'Deficiência motora', value: 'Deficiência motora' },
  { label: 'Deficiência auditiva', value: 'Deficiência auditiva' },
  { label: 'Deficiência visual', value: 'Deficiência visual' },
  { label: 'Deficiência intelectual', value: 'Deficiência intelectual' },
  { label: 'Prefiro não informar', value: 'Prefiro não informar' }
])

const raceOptions = ref([
  { label: 'Amarela', value: 'amarela' },
  { label: 'Branca', value: 'branca' },
  { label: 'Indígena', value: 'indigena' },
  { label: 'Parda', value: 'parda' },
  { label: 'Preta', value: 'preta' },
  { label: 'Prefiro não informar', value: 'nao-informar' }
])

// Remove caracteres não numéricos antes de validar ou comparar campos mascarados.
function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '')
}

// Normaliza textos para buscar cidades sem depender de acentos ou caixa.
function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Filtra as cidades da UF selecionada conforme o texto digitado no autocomplete.
function searchCities(event) {
  const cities = fields.cityByState[conexaoStore.registry.state] || []
  const query = normalizeText(event.query)

  filteredCities.value = query
    ? cities.filter((city) => normalizeText(city).includes(query)).slice(0, 20)
    : cities.slice(0, 20)
}

// Verifica se um campo obrigatório possui algum valor preenchido.
function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== ''
}

// Valida matematicamente o CPF informado no formulário.
function isValidCpf(value) {
  const cpf = onlyNumbers(value)

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  // Calcula um dígito verificador do CPF a partir da base informada.
  const calculateDigit = (base) => {
    let sum = 0

    for (let index = 0; index < base.length; index += 1) {
      sum += Number(base[index]) * (base.length + 1 - index)
    }

    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  const firstDigit = calculateDigit(cpf.slice(0, 9))
  const secondDigit = calculateDigit(cpf.slice(0, 10))

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10])
}

// Valida se o celular tem nove dígitos e começa com 9.
function isValidCellphone(value) {
  const cellphone = onlyNumbers(value)
  return cellphone.length === 9 && cellphone.startsWith('9')
}

// Registra o estado de erro de um campo da etapa de informações pessoais.
function setError(field, isInvalid) {
  errors[field] = isInvalid
}

// Valida todos os campos da etapa e informa se o usuário pode avançar.
function validate(showMessage = true) {
  if (showMessage) {
    submitted.value = true
  }

  const registry = conexaoStore.registry

  setError('email', !isFilled(registry.email) || !registry.email.includes('@'))
  setError('personalId', !isValidCpf(registry.personalId))
  setError('name', !isFilled(registry.name))
  setError('surname', !isFilled(registry.surname))
  setError('state', !isFilled(registry.state))
  setError('city', !isFilled(registry.city))
  setError('areaCode', !isFilled(registry.areaCode))
  setError('cellphone', !isValidCellphone(registry.cellphone))
  setError('birthDate', !registry.birthDate)
  setError('gender', !isFilled(registry.gender))
  setError('lgbt', !isFilled(registry.lgbt))
  setError('race', !isFilled(registry.race))
  setError('pcd', !isFilled(registry.pcd))

  return !Object.values(errors).some(Boolean)
}

// Indica se um campo deve ser exibido como inválido depois da tentativa de envio.
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

// Limpa a cidade selecionada quando ela não pertence mais à UF escolhida.
watch(
  () => conexaoStore.registry.state,
  (state) => {
    const cities = fields.cityByState[state] || []

    if (!cities.includes(conexaoStore.registry.city)) {
      conexaoStore.registry.city = ''
    }

    filteredCities.value = []
  }
)

defineExpose({ validate })
</script>

<template>
  <section class="personal-form" aria-label="Informações pessoais">
    <h2 class="personal-form__title">INFORMAÇÕES PESSOAIS</h2>

    <p v-if="submitted && Object.values(errors).some(Boolean)" class="personal-form__error-summary">
      Há campos incompletos ou incorretos. Revise os campos destacados.
    </p>

    <div class="personal-form__grid personal-form__grid--two">
      <InputText
        v-model="conexaoStore.registry.email"
        :invalid="isInvalid('email')"
        class="personal-form__field"
        placeholder="Email*"
      />
      <div class="personal-form__search-row">
        <InputText
          v-maska
          v-model="conexaoStore.registry.personalId"
          data-maska="###.###.###-##"
          :invalid="isInvalid('personalId')"
          class="personal-form__field"
          placeholder="CPF*"
        />
        <Button
          class="personal-form__search"
          icon="pi pi-search"
          label="Procurar"
          @click="conexaoStore.searchPreviousRegistration"
        />
      </div>
    </div>

    <p class="personal-form__hint">
      <i class="pi pi-lock" aria-hidden="true"></i>
      Usaremos seu e-mail e CPF para encontrar sua inscrição anterior (caso tenha), e preencher os campos para você :)
    </p>

    <div class="personal-form__grid personal-form__grid--two">
      <InputText
        v-model="conexaoStore.registry.name"
        :invalid="isInvalid('name')"
        class="personal-form__field"
        placeholder="Nome*"
      />
      <InputText
        v-model="conexaoStore.registry.surname"
        :invalid="isInvalid('surname')"
        class="personal-form__field"
        placeholder="Sobrenome*"
      />
    </div>

    <div class="personal-form__grid personal-form__grid--two">
      <div class="personal-form__combo">
        <Select
          v-model="conexaoStore.registry.state"
          :options="states"
          :invalid="isInvalid('state')"
          option-label="label"
          option-value="value"
          placeholder="UF"
          class="personal-form__select personal-form__select--small"
        />
        <AutoComplete
          v-model="conexaoStore.registry.city"
          :suggestions="filteredCities"
          :disabled="!conexaoStore.registry.state"
          :invalid="isInvalid('city')"
          input-class="personal-form__field"
          class="personal-form__city"
          placeholder="Cidade"
          force-selection
          @complete="searchCities"
        />
      </div>

      <div class="personal-form__contact-row">
        <div class="personal-form__combo">
          <Select
            v-model="conexaoStore.registry.areaCode"
            :options="ddds"
            :invalid="isInvalid('areaCode')"
            option-label="label"
            option-value="value"
            placeholder="DDD"
            class="personal-form__select personal-form__select--small"
          />
          <InputText
            v-maska
            v-model="conexaoStore.registry.cellphone"
            data-maska="#####-####"
            :invalid="isInvalid('cellphone')"
            class="personal-form__field"
            placeholder="Celular"
          />
        </div>

        <DatePicker
          v-model="conexaoStore.registry.birthDate"
          :invalid="isInvalid('birthDate')"
          class="personal-form__date"
          input-class="personal-form__field"
          placeholder="Data Nasc."
          show-icon
          icon-display="input"
        />
      </div>
    </div>

    <p class="personal-form__question">
      Sendo a Empower e as patrocinadoras empresas que valorizam a diversidade, como você se declara em relação às perguntas abaixo?
    </p>

    <div class="personal-form__grid personal-form__grid--two">
      <Select
        v-model="conexaoStore.registry.gender"
        :options="genderOptions"
        :invalid="isInvalid('gender')"
        option-label="label"
        option-value="value"
        placeholder="Gênero*"
        class="personal-form__select"
      />
      <Select
        v-model="conexaoStore.registry.lgbt"
        :options="yesNoOptions"
        :invalid="isInvalid('lgbt')"
        option-label="label"
        option-value="value"
        placeholder="LGBTQIA+*"
        class="personal-form__select"
      />
      <Select
        v-model="conexaoStore.registry.race"
        :options="raceOptions"
        :invalid="isInvalid('race')"
        option-label="label"
        option-value="value"
        placeholder="Raça*"
        class="personal-form__select"
      />
      <Select
        v-model="conexaoStore.registry.pcd"
        :options="disabilityOptions"
        :invalid="isInvalid('pcd')"
        option-label="label"
        option-value="value"
        placeholder="PcD*"
        class="personal-form__select"
      />
    </div>
  </section>
</template>

<style scoped>
.personal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: min(100%, 52rem);
  margin: 0 auto;
  color: #171717;
  font-family: 'Raleway', Arial, sans-serif;
}

.personal-form__title {
  margin: 0 0 0.5rem;
  color: #111111;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.personal-form__error-summary {
  margin: -0.25rem 0 0;
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

.personal-form__grid {
  display: grid;
  gap: 1.5rem;
}

.personal-form__grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.personal-form__search-row,
.personal-form__contact-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 9.625rem;
  gap: 1.5rem;
}

.personal-form__combo {
  display: grid;
  grid-template-columns: 4.7rem minmax(0, 1fr);
}

.personal-form__hint,
.personal-form__question {
  margin: -0.875rem 0 0;
  color: #1f1f1f;
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.45;
}

.personal-form__hint {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding-left: 0.5rem;
}

.personal-form__hint .pi {
  color: #000000;
  font-size: 0.75rem;
}

.personal-form__question {
  margin-top: -0.125rem;
  font-size: 0.8125rem;
}

.personal-form__search {
  min-height: 2.375rem;
  border: 0;
  border-radius: 0.5rem;
  background: #06255c;
  color: #ffffff;
  font-family: 'Raleway', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

:deep(.personal-form__field),
:deep(.personal-form__select),
:deep(.personal-form__date .p-inputtext),
:deep(.personal-form__city .p-inputtext) {
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

:deep(.personal-form__field) {
  padding: 0.5rem 0.8125rem;
}

:deep(.personal-form__field::placeholder),
:deep(.personal-form__city .p-inputtext::placeholder),
:deep(.p-select-label.p-placeholder) {
  color: #858585;
}
:deep(.personal-form__select--small .p-select-label.p-placeholder) {
  font-size: 0.7rem;
}

:deep(.personal-form__select) {
  display: flex;
  align-items: center;
}

:deep(.personal-form__select .p-select-label) {
  padding: 0.5rem 0.6rem;
  color: #858585;
}

:deep(.personal-form__select .p-select-dropdown) {
  width: 1.8rem;
  color: #4f5661;
}

:deep(.personal-form__select--small) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.personal-form__combo :deep(.personal-form__field) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

:deep(.personal-form__city) {
  display: block;
  width: 100%;
}

:deep(.personal-form__city .p-inputtext:disabled) {
  background: #f6f6f6;
  color: #9ca3af;
  cursor: not-allowed;
}

:deep(.personal-form__date) {
  width: 100%;
}

:deep(.personal-form__date .p-datepicker-input-icon-container) {
  color: #4f5661;
}

:deep(.personal-form__field.p-invalid),
:deep(.personal-form__select.p-invalid),
:deep(.personal-form__date.p-invalid .p-inputtext),
:deep(.personal-form__date .p-inputtext.p-invalid),
:deep(.personal-form__city.p-invalid .p-inputtext),
:deep(.personal-form__city .p-inputtext.p-invalid) {
  border-color: #dc2626;
  box-shadow: inset 0 0 0 1px #dc2626;
}

@media (max-width: 760px) {
  .personal-form__grid,
  .personal-form__grid,
  .personal-form__grid--two,
  .personal-form__search-row,
  .personal-form__contact-row {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  .personal-form__search {
    width: 100%;
  }

  .personal-form__hint,
  .personal-form__question {
    margin-top: -0.25rem;
  }
}
</style>
