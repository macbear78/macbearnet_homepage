import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PageView from '../views/PageView.vue'
import AdminView from '../views/AdminView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/page/:slug', name: 'page', component: PageView },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const { getToken } = useAuth()
    if (!getToken()) {
      return { path: '/', query: { adminLogin: '1' } }
    }
  }
})

export default router
