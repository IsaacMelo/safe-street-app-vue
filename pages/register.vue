<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Cadastro</h2>

      <form @submit.prevent="handleRegister">
        <label for="name">Nome</label>
        <input v-model="name" type="text" id="name" placeholder="Seu nome" required />

        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" placeholder="email@exemplo.com" required />

        <label for="senha">Senha</label>
        <input v-model="senha" type="password" id="senha" placeholder="••••••••" required />

        <button type="submit" class="btn-register">Cadastrar</button>

        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>
      </form>

      <NuxtLink to="/login" class="login-link">Já tem conta? Faça login</NuxtLink>
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

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
}

.register-box {
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
  color: #1f2937;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.btn-register {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-register:hover {
  background-color: #2563eb;
}

.error-msg {
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 6px;
}

.success-msg {
  color: #16a34a;
  font-size: 0.9rem;
  margin-top: 6px;
}

.login-link {
  margin-top: 20px;
  display: block;
  text-align: center;
  font-size: 0.95rem;
  color: #3b82f6;
}
</style>
