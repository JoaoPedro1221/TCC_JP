<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import * as XLSX from 'xlsx'
import PrimeDataTable from 'primevue/datatable'
import Column from 'primevue/column'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'

const API_URL = 'http://localhost:3000'

const loading = ref(false)
const errorMessage = ref('')
const database = ref({})

// Transforma cada rota do banco em uma tabela administrativa, ignorando chaves que não sejam listas.
const tables = computed(() =>
  Object.entries(database.value)
    .filter(([, registrations]) => Array.isArray(registrations))
    .map(([route, registrations]) => ({
      route,
      registrations
    }))
)

// Formata a data de inscrição para exibição em português na tabela.
function formatRegistrationDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Achata uma inscrição para exportar objetos aninhados como colunas no XLSX.
function flattenRegistration(registration, prefix = '') {
  return Object.entries(registration || {}).reduce((flatRegistration, [key, value]) => {
    const field = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      return {
        ...flatRegistration,
        ...flattenRegistration(value, field)
      }
    }

    flatRegistration[field] = value
    return flatRegistration
  }, {})
}

// Converte valores de tipos diferentes para uma representação segura na planilha.
function formatSpreadsheetValue(value) {
  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.join('; ')
  }

  return String(value)
}

// Remove acentos e caracteres especiais para compor um nome de arquivo estável.
function sanitizeFileName(value) {
  return String(value || 'inscritos')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

// Gera e baixa o arquivo XLSX com todos os inscritos da rota selecionada.
function downloadXlsx(table) {
  if (!table.registrations.length) {
    return
  }

  const rows = table.registrations.map((registration) => flattenRegistration(registration))
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
  const spreadsheetRows = rows.map((row) =>
    headers.reduce((spreadsheetRow, header) => {
      spreadsheetRow[header] = formatSpreadsheetValue(row[header])
      return spreadsheetRow
    }, {})
  )
  const worksheet = XLSX.utils.json_to_sheet(spreadsheetRows, { header: headers })
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos')
  XLSX.writeFile(workbook, `mailing-inscritos-${sanitizeFileName(table.route)}.xlsx`)
}

// Busca o banco completo na API para montar as tabelas do painel administrativo.
async function fetchDatabase() {
  loading.value = true
  errorMessage.value = ''

  try {
    try {
      const response = await axios.get(`${API_URL}/db`)
      database.value = response.data
    } catch {
      const response = await axios.get(API_URL)
      database.value = response.data
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Não foi possível carregar as inscrições.'
  } finally {
    loading.value = false
  }
}

// Carrega as tabelas administrativas assim que a view é montada.
onMounted(fetchDatabase)
</script>

<template>
  <section class="admin-view">
    <DashboardHeader />

    <main class="admin-view__content">
      <div class="admin-view__heading">
        <h1>Painel Administrativo</h1>
      </div>

      <p v-if="errorMessage" class="admin-view__error">{{ errorMessage }}</p>

      <section
        v-for="table in tables"
        :key="table.route"
        class="admin-table"
        :aria-label="`Inscritos da rota ${table.route}`"
      >
        <div class="admin-table__card">
          <div class="admin-table__header">
            <div class="admin-table__heading">
              <h2 class="admin-table__title">{{ table.route }}</h2>
              <span class="admin-table__count">{{ table.registrations.length }} inscritos</span>
            </div>

            <button
              class="admin-table__download"
              type="button"
              :disabled="!table.registrations.length"
              @click="downloadXlsx(table)"
            >
              <i class="pi pi-download" aria-hidden="true"></i>
              <span>Mailing de Inscritos</span>
            </button>
          </div>

          <PrimeDataTable
            :value="table.registrations"
            :loading="loading"
            class="admin-table__table"
            data-key="id"
            paginator
            :rows="20"
            :rows-per-page-options="[20, 50, 100]"
            responsive-layout="scroll"
          >
            <Column field="id" header="ID" header-class="admin-table__id-header">
              <template #body="{ data }">
                <strong class="admin-table__id">{{ data.id }}</strong>
              </template>
            </Column>

            <Column field="createdAt" header="Data de inscrição">
              <template #body="{ data }">
                <span class="admin-table__text">{{ formatRegistrationDate(data.createdAt) }}</span>
              </template>
            </Column>

            <Column field="name" header="Nome">
              <template #body="{ data }">
                <span class="admin-table__text admin-table__text--strong">{{ data.name || '-' }}</span>
              </template>
            </Column>

            <Column field="surname" header="Sobrenome">
              <template #body="{ data }">
                <span class="admin-table__text">{{ data.surname || '-' }}</span>
              </template>
            </Column>

            <Column field="email" header="E-mail">
              <template #body="{ data }">
                <span class="admin-table__text">{{ data.email || '-' }}</span>
              </template>
            </Column>

            <Column field="personalId" header="CPF">
              <template #body="{ data }">
                <span class="admin-table__cpf">{{ data.personalId || '-' }}</span>
              </template>
            </Column>

            <template #empty>
              <p class="admin-table__empty">Nenhum inscrito encontrado.</p>
            </template>
          </PrimeDataTable>
        </div>
      </section>

      <p v-if="!loading && !errorMessage && !tables.length" class="admin-view__empty">
        Nenhuma rota com inscritos foi encontrada.
      </p>
    </main>
  </section>
</template>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: #f3f3f3;
  color: #3d3d3d;
  font-family: "Raleway", Arial, sans-serif;
  padding-bottom: 2rem;
}

.admin-view__content {
  width: min(100% - 2rem, 86rem);
  margin: 0 auto;
}

.admin-view__heading {
  margin: 6.125rem 0 2rem;
}

.admin-view__heading h1 {
  margin: 0;
  color: #3d3d3d;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0;
}

.admin-view__heading p {
  margin: 0.625rem 0 0;
  color: #707070;
  font-size: 0.9375rem;
  font-weight: 600;
}

.admin-view__error,
.admin-view__empty {
  margin: 0;
  padding: 1rem;
  background: #ffffff;
  color: #707070;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
}

.admin-view__error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.admin-table {
  width: 100%;
  margin-top: 1.875rem;
}

.admin-table:first-of-type {
  margin-top: 0;
}

.admin-table__card {
  width: 100%;
  padding: 2.25rem 2.125rem;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

.admin-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.375rem;
}

.admin-table__heading {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
}

.admin-table__title {
  margin: 0;
  color: #3d3d3d;
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.2;
  word-break: break-word;
}

.admin-table__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 1.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  background: #08bc99;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 800;
  line-height: 1;
}

.admin-table__download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  min-height: 2rem;
  padding: 0.375rem 1rem;
  border: 0;
  border-radius: 999px;
  background: #000000;
  color: #ffffff;
  cursor: pointer;
  font-family: "Raleway", Arial, sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.admin-table__download .pi {
  font-size: 0.75rem;
}

.admin-table__download:hover:not(:disabled) {
  background: #222222;
}

.admin-table__download:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.admin-table__id {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: #eefbf8;
  color: #08a98a;
  font-size: 0.75rem;
  font-weight: 800;
}

.admin-table__text,
.admin-table__cpf {
  display: inline-block;
  color: #3d3d3d;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.35;
}

.admin-table__text--strong {
  font-weight: 800;
}

.admin-table__cpf {
  white-space: nowrap;
}

.admin-table__empty {
  margin: 0;
  padding: 1rem 0;
  color: #707070;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

:deep(.admin-table__table) {
  border: 1px solid #e7ecef;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.admin-table__table .p-datatable-table) {
  min-width: 68rem;
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.admin-table__table .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  border: 0;
  border-bottom: 1px solid #dde5e8;
  background: #f5f7f8;
  color: #3d3d3d;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 0.8125rem;
  font-weight: 800;
  white-space: nowrap;
}

:deep(.admin-table__table .p-datatable-tbody > tr > td) {
  padding: 0.625rem 1rem;
  border: 0;
  border-bottom: 1px solid #edf1f2;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  vertical-align: middle;
}

:deep(.admin-table__table .p-datatable-tbody > tr:last-child > td) {
  border-bottom: 0;
}

:deep(.admin-table__table .p-datatable-tbody > tr:hover > td) {
  background: #f8fcfb;
}

:deep(.admin-table__table .admin-table__id-header),
:deep(.admin-table__table .p-datatable-tbody > tr > td:first-child) {
  width: 5rem;
  text-align: center;
}

:deep(.admin-table__table .p-paginator) {
  border: 0;
  border-top: 1px solid #edf1f2;
  border-radius: 0;
  background: #ffffff;
  color: #3d3d3d;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

@media (max-width: 760px) {
  .admin-view__heading {
    margin-top: 3.5rem;
  }

  .admin-view__heading h1 {
    font-size: 1.75rem;
  }

  .admin-table__card {
    padding: 1.5rem;
  }

  .admin-table__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-table__heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
