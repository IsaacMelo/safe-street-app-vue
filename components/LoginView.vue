<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="email@exemplo.com" required />

        <label>Senha</label>
        <input v-model="senha" type="password" placeholder="••••••••" required />

        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const error = ref('')
const loading = ref(false)

const { login } = useAuth()
const router = useRouter()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, senha.value)
    router.push('/mapa') // substitua pela rota desejada após login
  } catch (err) {
    error.value = 'Email ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f8fafc;
}

.login-box {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 320px;
}

h2 {
  margin-bottom: 16px;
  color: #1e293b;
  font-size: 20px;
}

label {
  display: block;
  margin: 12px 0 4px;
  font-weight: 500;
  color: #334155;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  background: #f1f5f9;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

.error-msg {
  margin-top: 12px;
  color: #dc2626;
  font-size: 14px;
}
</style>
