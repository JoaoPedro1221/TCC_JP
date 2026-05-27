import { createRouter, createWebHistory } from 'vue-router'
import ConexaoCarreira from '../views/ConexaoCarreira.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'conexao-carreira',
      component: ConexaoCarreira
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
  ]
})

export default router
