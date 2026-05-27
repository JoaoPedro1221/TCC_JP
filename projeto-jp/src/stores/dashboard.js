import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from './error'

const API_URL = 'http://localhost:3000'

const TARGET_STATES = ['SP', 'PA', 'MG', 'RJ']

const GRADUATION_YEARS = ['Formados', '2026', '2027', '2028', '2029', '2030', '2031+']

const DIVERSITY_GROUPS = {
  race: {
    title: 'Raça',
    field: 'race',
    rows: [
      { label: 'Branca', values: ['branca'] },
      { label: 'Parda', values: ['parda'] },
      { label: 'Preta', values: ['preta'] },
      { label: 'Amarela', values: ['amarela'] },
      { label: 'S/ Resp', values: ['nao-informar', 'prefiro não informar'] },
      { label: 'Indígena', values: ['indigena', 'indígena'] }
    ]
  },
  gender: {
    title: 'Gênero',
    field: 'gender',
    rows: [
      { label: 'Mulher cis', values: ['mulherCis', 'mulher cis'] },
      { label: 'Homem cis', values: ['homemCis', 'homem cis'] },
      { label: 'S/ Resp', values: ['nao-informar', 'prefiro não informar'] },
      { label: 'Outro', values: ['outro'] },
      { label: 'Não Binário', values: ['nao-binario', 'não binário', 'nao binario'] },
      { label: 'H. Transg.', values: ['homemTrans', 'homem transgênero', 'homem transgenero'] },
      { label: 'M. Transg.', values: ['mulherTrans', 'mulher transgênero', 'mulher transgenero'] }
    ]
  },
  pcd: {
    title: 'PcD',
    field: 'pcd',
    rows: [
      { label: 'Não', values: ['não', 'nao'] },
      { label: 'S/ Resp', values: ['prefiro não informar', 'nao-informar'] },
      { label: 'Visual', values: ['deficiência visual', 'deficiencia visual'] },
      { label: 'Motora', values: ['deficiência motora', 'deficiencia motora'] },
      { label: 'Auditiva', values: ['deficiência auditiva', 'deficiencia auditiva'] },
      { label: 'Intelectual', values: ['deficiência intelectual', 'deficiencia intelectual'] }
    ]
  },
  lgbt: {
    title: 'LGBTQIA+',
    field: 'lgbt',
    rows: [
      { label: 'Não', values: ['não', 'nao'] },
      { label: 'Sim', values: ['sim'] },
      { label: 'S/ Resp', values: ['nao-informar', 'prefiro não informar'] }
    ]
  }
}

// Normaliza textos para comparações sem acento, espaço extra ou diferença de caixa.
function normalizeText(value) {
  return String(value || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Converte uma UF para o formato padronizado usado nos agrupamentos do dashboard.
function normalizeState(value) {
  return String(value || '').trim().toUpperCase()
}

// Calcula um percentual inteiro a partir de uma quantidade e de um total.
function toPercent(value, total) {
  if (!total) {
    return 0
  }

  return Math.round((value / total) * 100)
}

// Agrupa uma lista de inscrições contando quantas vezes cada valor de um campo aparece.
function countBy(items, field) {
  return items.reduce((totals, item) => {
    const value = item[field]

    if (!value) {
      return totals
    }

    const key = String(value).trim()
    totals[key] = (totals[key] || 0) + 1

    return totals
  }, {})
}

// Ordena itens por total decrescente e usa o rótulo como desempate alfabético.
function sortByCountDesc(a, b) {
  if (b.total !== a.total) {
    return b.total - a.total
  }

  return a.label.localeCompare(b.label)
}

// Interpreta o valor de formatura e retorna o ano e o semestre usados no gráfico.
function getGraduationSlot(graduationDate) {
  const value = String(graduationDate || '').trim()

  if (!value) {
    return null
  }

  if (value === 'Já me formei') {
    return { year: 'Formados', semester: 'na' }
  }

  if (value === '2031+') {
    return { year: '2031+', semester: 'na' }
  }

  const [, year, semester] = value.match(/^(\d{4})\.(1|2)$/) || []

  if (!year || !semester) {
    return null
  }

  return {
    year,
    semester: semester === '1' ? 'firstSemester' : 'secondSemester'
  }
}

// Cria a estrutura inicial zerada para todos os anos/semestres do gráfico de formatura.
function createEmptyGraduationData() {
  return GRADUATION_YEARS.reduce((data, year) => {
    data[year] = {
      firstSemester: 0,
      secondSemester: 0,
      na: 0
    }

    return data
  }, {})
}

// Gera as linhas de uma tabela de diversidade com total e percentual por categoria.
function createDiversityRows(registrations, group) {
  const total = registrations.length

  return group.rows.map((row) => {
    const normalizedValues = row.values.map(normalizeText)
    const amount = registrations.filter((registration) =>
      normalizedValues.includes(normalizeText(registration[group.field]))
    ).length

    return {
      label: row.label,
      total: amount,
      percent: toPercent(amount, total)
    }
  })
}

// Busca o banco completo na API, usando /db como caminho principal e / como fallback.
async function fetchDatabase() {
  try {
    const response = await axios.get(`${API_URL}/db`)
    return response.data
  } catch {
    const response = await axios.get(API_URL)
    return response.data
  }
}

export const useDashboardStore = defineStore('dashboard', {
  // Define o estado reativo inicial do dashboard.
  state: () => ({
    event: 'ConexaoCarreira-2026.1',
    registrations: [],
    targetStates: [...TARGET_STATES],
    loading: false,
    loaded: false
  }),

  getters: {
    // Retorna o total de inscrições carregadas para o evento ativo.
    totalRegistrations: (state) => state.registrations.length,

    // Conta quantas inscrições pertencem aos estados alvo configurados.
    targetStateRegistrations: (state) => {
      const targetStates = state.targetStates.map(normalizeState)

      return state.registrations.filter((registration) =>
        targetStates.includes(normalizeState(registration.state))
      ).length
    },

    // Monta os cards de resumo exibidos no início do dashboard.
    summaryCards() {
      return [
        {
          id: 'total',
          value: this.totalRegistrations,
          label: 'Total de Inscritos'
        },
        {
          id: 'targetStates',
          value: this.targetStateRegistrations,
          label: 'Inscritos dos estados alvo'
        }
      ]
    },

    // Lista os dez cursos com mais inscrições, incluindo total e percentual.
    topCourses: (state) => {
      const total = state.registrations.length
      const courses = countBy(state.registrations, 'course')

      return Object.entries(courses)
        .map(([label, amount]) => ({
          label,
          total: amount,
          percent: toPercent(amount, total)
        }))
        .sort(sortByCountDesc)
        .slice(0, 10)
    },

    // Agrupa as inscrições por UF para alimentar o mapa e o ranking de estados.
    stateDistribution: (state) => {
      const states = countBy(state.registrations, 'state')

      return Object.entries(states)
        .map(([label, total]) => ({
          label: normalizeState(label),
          total
        }))
        .filter((item) => item.label)
        .sort(sortByCountDesc)
    },

    // Consolida inscrições por data de formatura no formato esperado pelo gráfico.
    graduationData: (state) => {
      const data = createEmptyGraduationData()

      state.registrations.forEach((registration) => {
        const slot = getGraduationSlot(registration.graduationDate)

        if (slot && data[slot.year]) {
          data[slot.year][slot.semester] += 1
        }
      })

      return {
        labels: GRADUATION_YEARS,
        datasets: [
          {
            label: '1º Semestre',
            key: 'firstSemester',
            data: GRADUATION_YEARS.map((year) => data[year].firstSemester)
          },
          {
            label: '2º Semestre',
            key: 'secondSemester',
            data: GRADUATION_YEARS.map((year) => data[year].secondSemester)
          },
          {
            label: 'N/A',
            key: 'na',
            data: GRADUATION_YEARS.map((year) => data[year].na)
          }
        ]
      }
    },

    // Monta todas as tabelas de diversidade a partir dos grupos configurados.
    diversityTables: (state) =>
      Object.entries(DIVERSITY_GROUPS).map(([id, group]) => ({
        id,
        title: group.title,
        rows: createDiversityRows(state.registrations, group)
      }))
  },

  actions: {
    // Carrega da API as inscrições do evento ativo e atualiza o estado do dashboard.
    async fetchDashboard() {
      const errorStore = useErrorStore()

      this.loading = true

      try {
        const database = await fetchDatabase()
        const registrations = database[this.event]

        this.registrations = Array.isArray(registrations) ? registrations : []
        this.loaded = true
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        errorStore.alertError(message)
      } finally {
        this.loading = false
      }
    },

    // Troca o evento analisado e limpa dados carregados anteriormente.
    setEvent(event) {
      this.event = event
      this.loaded = false
      this.registrations = []
    },

    // Atualiza a lista de UFs consideradas como estados alvo.
    setTargetStates(states) {
      this.targetStates = states
    }
  }
})
