<template>
  <div class="page-container">
    <h2>Cadastrar Área de Risco por CEP</h2>

    <form @submit.prevent="cadastrarArea" class="form-wrapper">
      <div class="form-group">
        <label for="cep">CEP</label>
        <input
          id="cep"
          v-model="cep"
          type="text"
          placeholder="Ex: 02987-030"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Cadastrar' }}
      </button>
    </form>

    <div v-if="mensagem" class="alert success">
      {{ mensagem }}
    </div>

    <div v-if="erro" class="alert error">
      {{ erro }}
    </div>

    <div v-if="resultado" class="resultado">
      <p><strong>Nome:</strong> {{ resultado.name }}</p>
      <p><strong>Coordenadas:</strong> {{ resultado.location.coordinates.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const cep = ref('')
const resultado = ref(null)
const mensagem = ref('')
const erro = ref('')
const loading = ref(false)

const { token } = useAuth()

async function cadastrarArea() {
  erro.value = ''
  mensagem.value = ''
  resultado.value = null

  if (!token.value) {
    erro.value = 'Você precisa estar autenticado.'
    return
  }

  loading.value = true

  try {
    const res = await fetch('https://safe-street-api.onrender.com/api/riskareas/cep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: JSON.stringify({ cep: cep.value }),
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'Erro ao cadastrar área de risco.')
    }

    const data = await res.json()
    resultado.value = data.riskArea
    mensagem.value = data.message || 'Área de risco cadastrada com sucesso.'
  } catch (e) {
    erro.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

.page-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Inter', system-ui, sans-serif;
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #1e293b;
  font-weight: 500;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #344054;
}

input {
  padding: 10px 12px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  font-size: 15px;
  transition: border 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
}

button {
  align-self: flex-start;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  margin-top: 20px;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.alert.success {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #34d399;
}

.alert.error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.resultado {
  margin-top: 24px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 15px;
  color: #1f2937;
}
</style>
