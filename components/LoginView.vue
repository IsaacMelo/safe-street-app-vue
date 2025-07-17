<template>
  <div class="page-container full-height">
    <div class="form-container">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="email@exemplo.com" 
            required 
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha</label>
          <input 
            id="senha"
            v-model="senha" 
            type="password" 
            placeholder="••••••••" 
            required 
            class="form-input"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary btn-full">
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
