<template>
  <div class="page-container full-height">
    <div class="form-container">
      <h2>Cadastro</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nome</label>
          <input 
            id="name"
            v-model="name" 
            type="text" 
            placeholder="Seu nome" 
            required 
            class="form-input"
          />
        </div>

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

        <button type="submit" class="btn btn-primary btn-full">Cadastrar</button>

        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>
      </form>

      <div class="text-center mt-4">
        <NuxtLink to="/login" class="link">Já tem conta? Faça login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const senha = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  error.value = ''
  success.value = ''
  try {
    const res = await $fetch('https://safe-street-api.onrender.com/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, senha: senha.value },
    })
    success.value = 'Cadastro realizado com sucesso!'
    name.value = ''
    email.value = ''
    senha.value = ''
  } catch (err) {
    error.value = err?.data?.message || 'Erro ao cadastrar. Tente novamente.'
  }
}
</script>
