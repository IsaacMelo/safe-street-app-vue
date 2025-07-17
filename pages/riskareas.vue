<template>
  <div class="content-container">
    <div class="form-container" style="max-width: 600px;">
      <h2>Cadastrar Área de Risco por CEP</h2>

      <form @submit.prevent="cadastrarArea">
        <div class="form-group">
          <label for="cep">CEP</label>
          <input
            id="cep"
            v-model="cep"
            type="text"
            placeholder="Ex: 02987-030"
            required
            class="form-input"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Enviando...' : 'Cadastrar' }}
        </button>
      </form>

      <div v-if="mensagem" class="alert success">
        {{ mensagem }}
      </div>

      <div v-if="erro" class="alert error">
        {{ erro }}
      </div>

      <div v-if="resultado" class="card mt-4">
        <div class="card-header">
          <h3 class="card-title">Área Cadastrada</h3>
        </div>
        <p><strong>Nome:</strong> {{ resultado.name }}</p>
        <p><strong>Coordenadas:</strong> {{ resultado.location.coordinates.join(', ') }}</p>
      </div>
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
