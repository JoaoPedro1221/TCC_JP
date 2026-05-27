<script setup>
import { computed } from 'vue'
import Chart from 'primevue/chart'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()

// Monta os datasets do Chart.js a partir dos dados consolidados de formatura.
const chartData = computed(() => ({
  labels: dashboardStore.graduationData.labels,
  datasets: [
    {
      label: '1º Semestre',
      backgroundColor: '#17b8d2',
      borderRadius: 0,
      barPercentage: 0.72,
      categoryPercentage: 0.62,
      data: dashboardStore.graduationData.datasets[0].data
    },
    {
      label: '2º Semestre',
      backgroundColor: '#717987',
      borderRadius: 0,
      barPercentage: 0.72,
      categoryPercentage: 0.62,
      data: dashboardStore.graduationData.datasets[1].data
    },
    {
      label: 'N/A',
      backgroundColor: '#101010',
      borderRadius: 0,
      barPercentage: 0.72,
      categoryPercentage: 0.62,
      data: dashboardStore.graduationData.datasets[2].data
    }
  ]
}))

// Calcula o maior valor das barras para sugerir uma escala vertical adequada.
const maxBarValue = computed(() => {
  const values = dashboardStore.graduationData.datasets.flatMap((dataset) => dataset.data)
  const maxValue = Math.max(...values, 0)

  return maxValue || 1
})

// Define opções visuais e callbacks do gráfico de formatura.
const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 58,
        boxHeight: 15,
        color: '#68758a',
        font: {
          family: 'Montserrat',
          size: 14,
          weight: 700
        },
        padding: 18
      }
    },
    tooltip: {
      callbacks: {
        // Formata o texto exibido no tooltip de cada barra.
        label(context) {
          return `${context.dataset.label}: ${context.raw}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#74849b',
        font: {
          family: 'Montserrat',
          size: 14,
          weight: 700
        }
      },
      border: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      suggestedMax: Math.ceil(maxBarValue.value * 1.1),
      ticks: {
        precision: 0,
        color: '#74849b',
        font: {
          family: 'Montserrat',
          size: 13,
          weight: 600
        }
      },
      grid: {
        color: '#e5ebf1',
        lineWidth: 2
      },
      border: {
        display: false
      }
    }
  }
}))
</script>

<template>
  <section class="graduation-chart" aria-label="Data de formatura">
    <div class="graduation-chart__card">
      <Chart
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="graduation-chart__canvas"
      />
    </div>
  </section>
</template>

<style scoped>
.graduation-chart {
  width: min(100% - 2rem, 67.5rem);
  margin: 0 auto;
}

.graduation-chart__card {
  height: 41rem;
  padding: 3rem 2.5rem 2.375rem;
  border: 1px solid #dfe7ef;
  border-radius: 0.75rem;
  background: #ffffff;
}

.graduation-chart__canvas {
  width: 100%;
  height: 100%;
}

@media (max-width: 760px) {
  .graduation-chart__card {
    height: 28rem;
    padding: 1.5rem 1rem 1.25rem;
  }
}

</style>
