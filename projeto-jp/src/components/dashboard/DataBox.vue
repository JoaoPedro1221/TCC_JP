<script setup>
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()
</script>

<template>
  <section class="data-boxes" aria-label="Resumo das inscrições">
    <article
      v-for="card in dashboardStore.summaryCards"
      :key="card.id"
      class="data-boxes__card"
    >
      <strong class="data-boxes__value">
        {{ dashboardStore.loading ? '...' : card.value }}
      </strong>
      <span class="data-boxes__label">{{ card.label }}</span>
    </article>
  </section>
</template>

<style scoped>
.data-boxes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 15.75rem));
  gap: 1.625rem;
  width: min(100% - 2rem, 67.5rem);
  margin: 0 auto;
}

.data-boxes__card {
  display: flex;
  min-height: 6.75rem;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem 2.25rem;
  background: #08bc99;
  color: #ffffff;
}

.data-boxes__value {
  display: block;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.data-boxes__label {
  display: block;
  margin-top: 0.3125rem;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25;
}

@media (max-width: 620px) {
  .data-boxes {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

</style>
