import { useStorage } from '@vueuse/core'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return

  const token = useStorage('token', '')
  const { role } = useAuth()

  const publicRoutes = ['/login', '/tutorial', '/sobre', '/register']
  const adminRoutes = ['/admin', '/riskareas']

  // Bloqueia se não estiver logado e a rota não for pública
  if (!token.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // Bloqueia rotas que exigem admin
  const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route))
  if (isAdminRoute && role.value !== 'admin') {
    console.log(`Acesso negado a rota ${to.path} para role: ${role.value}`)
    return navigateTo('/')
  }
})
