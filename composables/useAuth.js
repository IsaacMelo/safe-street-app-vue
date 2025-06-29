import { useStorage } from '@vueuse/core'

export const useAuth = () => {
  const token = useStorage('token', '')

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

  return { token, login }
}
