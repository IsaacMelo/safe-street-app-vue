import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export const useAuth = () => {
  const token = useStorage('token', '')
  const router = useRouter()

  const login = async (email, senha) => {
    const res = await fetch('https://safe-street-api.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })

    if (!res.ok) throw new Error('Falha no login')

    const data = await res.json()
    token.value = data.token
    return data.token
  }

  const logout = async () => {
    token.value = ''
    try {
      await router.push('/tutorial')
    } catch (error) {
      console.error('Erro ao redirecionar após logout:', error)
      // Fallback para navegação
      window.location.href = '/tutorial'
    }
  }

  const role = computed(() => {
    console.log("Carregando as roles")
    if (!token.value) return null
    try {
      const payloadBase64 = token.value.split('.')[1]
      const payload = JSON.parse(atob(payloadBase64))
      return payload.role || null
    } catch (e) {
      return null
    }
  })

  const isLoggedIn = computed(() => {
    return !!token.value && role.value !== null
  })

  return { token, login, logout, role, isLoggedIn }
}
