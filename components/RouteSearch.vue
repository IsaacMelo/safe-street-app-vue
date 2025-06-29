<template>
  <div class="route-search">
    <h3>Calcular Rota</h3>
    <label>Origem:</label>
    <input v-model="fromQuery" @input="search('from')" @focus="activeField = 'from'" />
    <ul v-if="fromSuggestions.length && activeField === 'from'" class="suggestions">
      <li v-for="s in fromSuggestions" :key="s.address_formatted" @click="select('from', s)">
        {{ s.address_formatted }}
      </li>
    </ul>

    <label>Destino:</label>
    <input v-model="toQuery" @input="search('to')" @focus="activeField = 'to'" />
    <ul v-if="toSuggestions.length && activeField === 'to'" class="suggestions">
      <li v-for="s in toSuggestions" :key="s.address_formatted" @click="select('to', s)">
        {{ s.address_formatted }}
      </li>
    </ul>

    <button @click="calculate">Calcular Rota</button>
    <button @click="clear">Limpar Rota</button>
    <button @click="useCurrentLocation">Usar Minha Localização</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const fromQuery = ref('')
const toQuery = ref('')
const fromSuggestions = ref([])
const toSuggestions = ref([])
const fromLocation = ref(null)
const toLocation = ref(null)
const activeField = ref(null)

const { token } = useAuth()

const emit = defineEmits(['calculateRoute', 'clearRoute', 'setFromCurrentLocation'])

const search = async (type) => {
  const query = type === 'from' ? fromQuery.value : toQuery.value
  if (query.length < 3) return

  try {
    const res = await fetch(`https://safe-street-api.onrender.com/api/geocodes?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const results = await res.json()

    if (type === 'from') fromSuggestions.value = results
    if (type === 'to') toSuggestions.value = results
  } catch (err) {
    console.error('Erro ao buscar endereço:', err)
  }
}

const select = (type, location) => {
  if (type === 'from') {
    fromQuery.value = location.address_formatted
    fromLocation.value = location.geometry
    fromSuggestions.value = []
  } else {
    toQuery.value = location.address_formatted
    toLocation.value = location.geometry
    toSuggestions.value = []
  }
  activeField.value = null
}

const calculate = () => {
  if (!fromLocation.value || !toLocation.value) {
    alert('Selecione origem e destino válidos')
    return
  }

  emit('calculateRoute', {
    from: fromLocation.value,
    to: toLocation.value
  })
}

const clear = () => {
  fromQuery.value = ''
  toQuery.value = ''
  fromSuggestions.value = []
  toSuggestions.value = []
  fromLocation.value = null
  toLocation.value = null
  emit('clearRoute')
}

const useCurrentLocation = () => {
  emit('setFromCurrentLocation')
}
</script>

<style scoped>
.route-search {
  background: transparent;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #0f172a;
}

label {
  font-size: 14px;
  color: #334155;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #fff;
  color: #0f172a;
  font-size: 14px;
}

.suggestions {
  background: #ffffff;
  color: #0f172a;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.suggestions li {
  padding: 8px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f1f5f9;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

button:nth-of-type(1) {
  background-color: #38bdf8; /* azul pastel */
  color: white;
}

button:nth-of-type(1):hover {
  background-color: #0ea5e9;
}

button:nth-of-type(2) {
  background-color: #facc15; /* amarelo pastel */
  color: #1e293b;
}

button:nth-of-type(2):hover {
  background-color: #fbbf24;
}

button:nth-of-type(3) {
  background-color: #cbd5e1; /* cinza pastel */
  color: #1e293b;
}

button:nth-of-type(3):hover {
  background-color: #94a3b8;
}

</style>
