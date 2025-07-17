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
        
        <p class="text-center mt-4">
          Ainda não tem uma conta?
          <NuxtLink to="/register" class="link">Cadastre-se</NuxtLink>
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

