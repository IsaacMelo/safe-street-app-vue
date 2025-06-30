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
        <p class="register-msg">
          Ainda não tem uma conta?
          <NuxtLink to="/register" class="register-link">Cadastre-se</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
//definePageMeta({
//  layout: false
//})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const senha = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const { login } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, senha.value)
    router.push('/') // Redireciona para o mapa ou dashboard
  } catch (err) {
    error.value = 'Email ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f2f4f7;
  font-family: 'Inter', system-ui, sans-serif;
}

.login-box {
  background: #ffffff;
  padding: 36px 32px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 360px;
  border: 1px solid #e2e8f0;
  margin: 10px;
}

h2 {
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
}

label {
  display: block;
  margin: 14px 0 6px;
  font-weight: 500;
  font-size: 14px;
  color: #475569;
}

input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #93c5fd;
  background: #ffffff;
}

button {
  width: 100%;
  margin-top: 24px;
  padding: 10px;
  background-color: #93c5fd; /* Azul pastel */
  color: #1e3a8a;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #60a5fa;
}

.error-msg {
  margin-top: 16px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
}
.register-msg {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #475569;
}

.register-link {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  margin-left: 4px;
}

.register-link:hover {
  text-decoration: underline;
}

</style>

