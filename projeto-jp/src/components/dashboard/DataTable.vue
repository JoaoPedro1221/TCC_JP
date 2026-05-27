<script setup>
import PrimeDataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()
</script>

<template>
  <section class="diversity-tables" aria-label="Tabelas de diversidade">
    <article
      v-for="table in dashboardStore.diversityTables"
      :key="table.id"
      class="diversity-tables__card"
    >
      <h2 class="diversity-tables__title">{{ table.title }}</h2>

      <PrimeDataTable
        :value="table.rows"
        :loading="dashboardStore.loading"
        class="diversity-tables__table"
        data-key="label"
        responsive-layout="scroll"
      >
        <Column field="label" :header="table.title">
          <template #body="{ data }">
            <span class="diversity-tables__label">{{ data.label }}</span>
          </template>
        </Column>

        <Column field="total" header="#" header-class="diversity-tables__number-header">
          <template #body="{ data }">
            <strong class="diversity-tables__number">{{ data.total }}</strong>
          </template>
        </Column>

        <Column field="percent" header="%" header-class="diversity-tables__percent-header">
          <template #body="{ data }">
            <strong class="diversity-tables__percent">{{ data.percent }}%</strong>
          </template>
        </Column>

        <template #empty>
          <p class="diversity-tables__empty">Nenhum dado encontrado.</p>
        </template>
      </PrimeDataTable>
    </article>
  </section>
</template>

<style scoped>
.diversity-tables {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  width: min(100% - 2rem, 67.5rem);
  margin: 0 auto 5rem;
}

.diversity-tables__card {
  min-height: 18rem;
  padding: 2.25rem 2rem;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

.diversity-tables__title {
  width: auto;
  margin: 0 0 1.25rem;
  color: #3d3d3d;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
}

.diversity-tables__label {
  color: #3d3d3d;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.2;
}

.diversity-tables__number,
.diversity-tables__percent {
  color: #3d3d3d;
  font-size: 0.8125rem;
  font-weight: 800;
  line-height: 1;
}

.diversity-tables__percent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  padding: 0.3125rem 0.4375rem;
  border-radius: 999px;
  background: #08bc99;
  color: #ffffff;
}

.diversity-tables__empty {
  margin: 0;
  padding: 1rem 0;
  color: #707070;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
}

:deep(.diversity-tables__table) {
  border: 1px solid #e7ecef;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.diversity-tables__table .p-datatable-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.diversity-tables__table .p-datatable-thead > tr > th) {
  padding: 0.625rem 0.75rem;
  border: 0;
  border-bottom: 1px solid #dde5e8;
  background: #f5f7f8;
  color: #3d3d3d;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
}

:deep(.diversity-tables__table .p-datatable-tbody > tr > td) {
  padding: 0.5625rem 0.75rem;
  border: 0;
  border-bottom: 1px solid #edf1f2;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

:deep(.diversity-tables__table .p-datatable-tbody > tr:last-child > td) {
  border-bottom: 0;
}

:deep(.diversity-tables__table .p-datatable-tbody > tr:hover > td) {
  background: #f8fcfb;
}

:deep(.diversity-tables__table .diversity-tables__number-header),
:deep(.diversity-tables__table .p-datatable-tbody > tr > td:nth-child(2)) {
  width: 3rem;
  text-align: center;
}

:deep(.diversity-tables__table .diversity-tables__percent-header),
:deep(.diversity-tables__table .p-datatable-tbody > tr > td:last-child) {
  width: 4rem;
  text-align: center;
}

@media (max-width: 620px) {
  .diversity-tables {
    grid-template-columns: 1fr;
  }

  .diversity-tables__card {
    padding: 1.5rem;
  }
}

</style>
