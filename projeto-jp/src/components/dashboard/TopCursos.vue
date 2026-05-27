<script setup>
import PrimeDataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()
</script>

<template>
  <section class="top-courses" aria-label="Top cursos">
    <div class="top-courses__card">
      <h2 class="top-courses__title">Top 10 Cursos</h2>

      <PrimeDataTable
        :value="dashboardStore.topCourses"
        :loading="dashboardStore.loading"
        class="top-courses__table"
        data-key="label"
        responsive-layout="scroll"
      >
        <Column field="label" header="Curso">
          <template #body="{ data, index }">
            <div class="top-courses__course">
              <span class="top-courses__position">{{ index + 1 }}</span>
              <span class="top-courses__name">{{ data.label }}</span>
            </div>
          </template>
        </Column>

        <Column field="percent" header="%" header-class="top-courses__percent-header">
          <template #body="{ data }">
            <strong class="top-courses__percent">{{ data.percent }}%</strong>
          </template>
        </Column>

        <template #empty>
          <p class="top-courses__empty">Nenhum curso encontrado.</p>
        </template>
      </PrimeDataTable>
    </div>
  </section>
</template>

<style scoped>
.top-courses {
  width: min(100% - 2rem, 67.5rem);
  margin: 1.875rem auto 0;
}

.top-courses__card {
  width: min(100%, 33rem);
  min-height: 26.5rem;
  display: flex;
  flex-direction: column;
  padding: 2.25rem 2.125rem;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

.top-courses__title {
  width: auto;
  margin: 0 0 1.375rem;
  color: #3d3d3d;
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.2;
}

.top-courses__course {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.top-courses__position {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #eefbf8;
  color: #08a98a;
  font-size: 0.75rem;
  font-weight: 800;
}

.top-courses__name {
  overflow: hidden;
  color: #3d3d3d;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
}

.top-courses__percent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.625rem;
  padding: 0.375rem 0.5rem;
  border-radius: 999px;
  background: #08bc99;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 800;
  line-height: 1;
}

.top-courses__empty {
  margin: 0;
  padding: 1rem 0;
  color: #707070;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

:deep(.top-courses__table) {
  flex: 1;
  border: 1px solid #e7ecef;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.top-courses__table .p-datatable-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.top-courses__table .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
  border: 0;
  border-bottom: 1px solid #dde5e8;
  background: #f5f7f8;
  color: #3d3d3d;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 0.8125rem;
  font-weight: 800;
}

:deep(.top-courses__table .p-datatable-tbody > tr > td) {
  padding: 0.625rem 1rem;
  border: 0;
  border-bottom: 1px solid #edf1f2;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

:deep(.top-courses__table .p-datatable-tbody > tr:last-child > td) {
  border-bottom: 0;
}

:deep(.top-courses__table .p-datatable-tbody > tr:hover > td) {
  background: #f8fcfb;
}

:deep(.top-courses__table .top-courses__percent-header),
:deep(.top-courses__table .p-datatable-tbody > tr > td:last-child) {
  width: 5.25rem;
  text-align: center;
}

@media (max-width: 620px) {
  .top-courses__card {
    padding: 1.5rem;
  }

  .top-courses__name {
    white-space: normal;
  }
}

</style>
