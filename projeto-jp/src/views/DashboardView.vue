<script setup>
import { onMounted } from 'vue';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DataBox from '../components/dashboard/DataBox.vue';
import DistribuicaoEstado from '../components/dashboard/DistribuicaoEstado.vue';
import TopCursos from '../components/dashboard/TopCursos.vue';
import DataFormatura from '../components/dashboard/DataFormatura.vue';
import DataTable from '../components/dashboard/DataTable.vue';
import { useDashboardStore } from '../stores/dashboard';

const dashboardStore = useDashboardStore();

// Carrega os indicadores assim que a view do dashboard é montada.
onMounted(() => {
  dashboardStore.fetchDashboard();
});
</script>

<template>
  <section class="dashboard-view">
    <DashboardHeader />
    <section class="dashboard-view__summary" aria-label="Resumo das inscrições">
      <h1>RESUMO DAS INSCRIÇÕES</h1>
      <div class="dashboard-view__summary-grid">
        <DataBox />
        <DistribuicaoEstado />
        <TopCursos />
      </div>
    </section>
    <h2>DATA DE FORMATURA</h2>
    <DataFormatura />
    <h3>DIVERSIDADE</h3>
    <DataTable />
  </section>
</template>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: #f3f3f3;
  color: #3d3d3d;
  font-family: "Raleway", Arial, sans-serif;
  padding-bottom: 2rem;
}

.dashboard-view h1,
.dashboard-view h2,
.dashboard-view h3 {
  width: min(100% - 2rem, 67.5rem);
  margin-right: auto;
  margin-left: auto;
  color: #3d3d3d;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0;
  font-family: Montserrat;
}

.dashboard-view h1 {
  margin-top: 6.125rem;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.dashboard-view h2,
.dashboard-view h3 {
  font-size: 1.625rem;
}

.dashboard-view h2 {
  margin-top: 3rem;
  margin-bottom: 2.25rem;
}

.dashboard-view h3 {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.dashboard-view__summary {
  width: min(100% - 2rem, 67.5rem);
  margin: 0 auto;
}

.dashboard-view__summary h1 {
  width: 100%;
}

.dashboard-view__summary-grid {
  display: grid;
  grid-template-columns: minmax(0, 33rem) minmax(0, 33rem);
  grid-template-areas:
    "boxes courses"
    "states courses";
  gap: 1.875rem 1.5rem;
  align-items: start;
}

.dashboard-view__summary-grid :deep(.data-boxes) {
  grid-area: boxes;
  width: 100%;
  margin: 0;
}

.dashboard-view__summary-grid :deep(.state-distribution) {
  grid-area: states;
  width: 100%;
  margin: 0;
}

.dashboard-view__summary-grid :deep(.state-distribution__card) {
  width: 100%;
}

.dashboard-view__summary-grid :deep(.top-courses) {
  grid-area: courses;
  width: 100%;
  height: 100%;
  margin: 0;
}

.dashboard-view__summary-grid :deep(.top-courses__card) {
  width: 100%;
  height: 100%;
}

@media (max-width: 760px) {
  .dashboard-view h1 {
    margin-top: 3.5rem;
    font-size: 1.75rem;
  }

  .dashboard-view h2,
  .dashboard-view h3 {
    font-size: 1.375rem;
  }

  .dashboard-view__summary-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "boxes"
      "states"
      "courses";
  }
}
</style>
