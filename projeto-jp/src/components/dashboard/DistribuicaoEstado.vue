<script setup>
import { computed } from 'vue'
import brazilGeo from '../../assets/js/brazil_geo.json'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()

const VIEWBOX = {
  width: 280,
  height: 270,
  padding: 8
}

const STATE_LIMIT = 14

// Percorre coordenadas do GeoJSON e coleta todos os pontos de longitude/latitude.
function collectPoints(coordinates, points = []) {
  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number'
  ) {
    points.push(coordinates)
    return points
  }

  coordinates.forEach((coordinate) => collectPoints(coordinate, points))

  return points
}

// Calcula os limites geográficos usados para encaixar o mapa no viewBox do SVG.
function getGeoBounds() {
  const points = brazilGeo.features.flatMap((feature) =>
    collectPoints(feature.geometry.coordinates)
  )

  return points.reduce(
    (bounds, [longitude, latitude]) => ({
      minLongitude: Math.min(bounds.minLongitude, longitude),
      maxLongitude: Math.max(bounds.maxLongitude, longitude),
      minLatitude: Math.min(bounds.minLatitude, latitude),
      maxLatitude: Math.max(bounds.maxLatitude, latitude)
    }),
    {
      minLongitude: Infinity,
      maxLongitude: -Infinity,
      minLatitude: Infinity,
      maxLatitude: -Infinity
    }
  )
}

const geoBounds = getGeoBounds()

// Projeta um ponto geográfico para coordenadas SVG respeitando escala e centralização.
function projectPoint([longitude, latitude]) {
  const availableWidth = VIEWBOX.width - VIEWBOX.padding * 2
  const availableHeight = VIEWBOX.height - VIEWBOX.padding * 2
  const geoWidth = geoBounds.maxLongitude - geoBounds.minLongitude
  const geoHeight = geoBounds.maxLatitude - geoBounds.minLatitude
  const scale = Math.min(availableWidth / geoWidth, availableHeight / geoHeight)
  const mapWidth = geoWidth * scale
  const mapHeight = geoHeight * scale
  const offsetX = (VIEWBOX.width - mapWidth) / 2
  const offsetY = (VIEWBOX.height - mapHeight) / 2

  return [
    offsetX + (longitude - geoBounds.minLongitude) * scale,
    offsetY + (geoBounds.maxLatitude - latitude) * scale
  ]
}

// Converte um anel de coordenadas de polígono em comandos de path SVG.
function createRingPath(ring) {
  return ring
    .map((point, index) => {
      const [x, y] = projectPoint(point)
      const command = index === 0 ? 'M' : 'L'

      return `${command}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

// Cria o path SVG completo de um estado, tratando Polygon e MultiPolygon.
function createFeaturePath(feature) {
  const { type, coordinates } = feature.geometry
  const polygons = type === 'Polygon' ? [coordinates] : coordinates

  return polygons
    .flatMap((polygon) => polygon.map((ring) => `${createRingPath(ring)} Z`))
    .join(' ')
}

// Calcula o percentual de um estado em relação ao total de inscrições.
function getPercent(value, total) {
  if (!total) {
    return 0
  }

  return Math.round((value / total) * 100)
}

// Define a cor do estado no mapa conforme sua proporção dentro do maior total.
function getStateColor(total, maxTotal) {
  if (!total) {
    return '#e9e9e9'
  }

  const ratio = total / maxTotal

  if (ratio >= 0.8) {
    return '#08bc99'
  }

  if (ratio >= 0.6) {
    return '#2fc8ad'
  }

  if (ratio >= 0.4) {
    return '#67d7c6'
  }

  if (ratio >= 0.2) {
    return '#9be4d9'
  }

  return '#c9f0eb'
}

// Indexa os totais por UF para consulta rápida durante a montagem do mapa.
const totalsByState = computed(() =>
  dashboardStore.stateDistribution.reduce((totals, item) => {
    totals[item.label] = item.total
    return totals
  }, {})
)

// Encontra o maior total estadual para calibrar a escala de cores do mapa.
const maxStateTotal = computed(() =>
  Math.max(...dashboardStore.stateDistribution.map((item) => item.total), 0)
)

// Combina GeoJSON e dados de inscrições para renderizar cada estado do mapa.
const mapStates = computed(() =>
  brazilGeo.features.map((feature) => {
    const abbreviation = feature.properties.sigla
    const total = totalsByState.value[abbreviation] || 0

    return {
      id: abbreviation,
      name: feature.properties.name,
      path: createFeaturePath(feature),
      total,
      fill: getStateColor(total, maxStateTotal.value)
    }
  })
)

// Limita o ranking exibido e agrega o excedente em "Outros".
const stateRanking = computed(() => {
  const states = dashboardStore.stateDistribution.slice(0, STATE_LIMIT)
  const otherStatesTotal = dashboardStore.stateDistribution
    .slice(STATE_LIMIT)
    .reduce((sum, item) => sum + item.total, 0)

  if (otherStatesTotal) {
    return [...states, { label: 'Outros', total: otherStatesTotal }]
  }

  return states
})
</script>

<template>
  <section class="state-distribution" aria-label="Distribuição por Estado">
    <div class="state-distribution__card">
      <h2 class="state-distribution__title">Distribuição por Estado</h2>

      <div class="state-distribution__content">
        <svg
          class="state-distribution__map"
          :viewBox="`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`"
          role="img"
          aria-label="Mapa do Brasil com distribuição de inscritos por estado"
        >
          <path
            v-for="state in mapStates"
            :key="state.id"
            :d="state.path"
            :fill="state.fill"
            class="state-distribution__state"
          >
            <title>{{ state.name }}: {{ state.total }}</title>
          </path>
        </svg>

        <ul class="state-distribution__ranking" aria-label="Ranking por estado">
          <li
            v-for="state in stateRanking"
            :key="state.label"
            class="state-distribution__ranking-item"
          >
            <span class="state-distribution__uf">{{ state.label }}</span>
            <span class="state-distribution__bar-track">
              <span
                class="state-distribution__bar"
                :style="{ width: `${getPercent(state.total, maxStateTotal)}%` }"
              ></span>
            </span>
            <strong class="state-distribution__total">{{ state.total }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.state-distribution {
  width: min(100% - 2rem, 67.5rem);
  margin: 1.875rem auto 0;
}

.state-distribution__card {
  width: min(100%, 33rem);
  min-height: 26.5rem;
  padding: 3rem 2.125rem 5.5rem;
  background: #ffffff;
  font-family: "Montserrat", "Raleway", Arial, sans-serif;
}

.state-distribution__title {
  width: auto;
  margin: 0 0 1.375rem;
  color: #3d3d3d;
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.2;
}

.state-distribution__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 7.75rem;
  align-items: center;
  gap: 1.125rem;
}

.state-distribution__map {
  display: block;
  width: 100%;
  max-width: 27rem;
  height: auto;
}

.state-distribution__state {
  stroke: #ffffff;
  stroke-width: 1.4;
  vector-effect: non-scaling-stroke;
}

.state-distribution__ranking {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.state-distribution__ranking-item {
  display: grid;
  grid-template-columns: 1.875rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  gap: 0.25rem;
  min-height: 0.875rem;
  color: #707070;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
}

.state-distribution__uf,
.state-distribution__total {
  font-size: 0.6875rem;
  line-height: 1;
}

.state-distribution__uf {
  text-align: right;
}

.state-distribution__bar-track {
  display: block;
  height: 0.6875rem;
}

.state-distribution__bar {
  display: block;
  min-width: 0.125rem;
  height: 100%;
  background: #08bc99;
}

.state-distribution__total {
  color: #08bc99;
  font-weight: 800;
}

@media (max-width: 620px) {
  .state-distribution__card {
    padding: 1.5rem;
  }

  .state-distribution__content {
    grid-template-columns: 1fr;
  }

  .state-distribution__ranking {
    max-width: 14rem;
  }
}

</style>
