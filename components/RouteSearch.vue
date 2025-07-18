<template>
  <div class="route-search">
    <div class="search-form">
      <!-- Origin Input -->
      <div class="input-group">
        <label for="origin">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6"/>
          </svg>
          Origem
        </label>
        <div class="input-wrapper">
          <input 
            id="origin"
            v-model="fromQuery" 
            @input="search('from')" 
            @focus="activeField = 'from'"
            @blur="handleBlur('from')"
            placeholder="Digite o endereço de origem..."
            :class="{ 'has-value': fromLocation }"
          />
          <button 
            v-if="fromQuery && !fromLocation" 
            @click="clearInput('from')" 
            class="clear-input-btn"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div v-if="fromLocation" class="input-success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
        </div>
        <ul v-if="fromSuggestions.length && activeField === 'from'" class="suggestions">
          <li v-for="s in fromSuggestions" :key="s.address_formatted" @click="select('from', s)">
            <div class="suggestion-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span class="suggestion-text">{{ s.address_formatted }}</span>
          </li>
        </ul>
      </div>

      <!-- Swap Button -->
      <div class="swap-container">
        <button @click="swapLocations" class="swap-btn" type="button" :disabled="!fromQuery || !toQuery">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </button>
      </div>

      <!-- Destination Input -->
      <div class="input-group">
        <label for="destination">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Destino
        </label>
        <div class="input-wrapper">
          <input 
            id="destination"
            v-model="toQuery" 
            @input="search('to')" 
            @focus="activeField = 'to'"
            @blur="handleBlur('to')"
            placeholder="Digite o endereço de destino..."
            :class="{ 'has-value': toLocation }"
          />
          <button 
            v-if="toQuery && !toLocation" 
            @click="clearInput('to')" 
            class="clear-input-btn"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div v-if="toLocation" class="input-success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
        </div>
        <ul v-if="toSuggestions.length && activeField === 'to'" class="suggestions">
          <li v-for="s in toSuggestions" :key="s.address_formatted" @click="select('to', s)">
            <div class="suggestion-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span class="suggestion-text">{{ s.address_formatted }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button @click="useCurrentLocation" class="quick-action-btn" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <span>Usar Minha Localização</span>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="calculate" class="primary-btn" :disabled="!canCalculate" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3 8-8"/>
        </svg>
        <span>Calcular Rota Segura</span>
      </button>
      <button @click="clear" class="secondary-btn" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        <span>Limpar</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isSearching" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p>Buscando endereços...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const fromQuery = ref('')
const toQuery = ref('')
const fromSuggestions = ref([])
const toSuggestions = ref([])
const fromLocation = ref(null)
const toLocation = ref(null)
const activeField = ref(null)
const isSearching = ref(false)
const searchTimeout = ref(null)

const { token } = useAuth()

const emit = defineEmits(['calculateRoute', 'clearRoute', 'setFromCurrentLocation'])

const canCalculate = computed(() => {
  return fromLocation.value && toLocation.value
})

const search = async (type) => {
  const query = type === 'from' ? fromQuery.value : toQuery.value
  
  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Clear location when user starts typing
  if (type === 'from') {
    fromLocation.value = null
  } else {
    toLocation.value = null
  }
  
  if (query.length < 3) {
    if (type === 'from') fromSuggestions.value = []
    if (type === 'to') toSuggestions.value = []
    return
  }

  // Debounce the search
  searchTimeout.value = setTimeout(async () => {
    isSearching.value = true
    
    try {
      const res = await fetch(`https://safe-street-api.onrender.com/api/geocodes?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      const results = await res.json()

      if (type === 'from') {
        fromSuggestions.value = results.slice(0, 5) // Limit to 5 suggestions
      } else {
        toSuggestions.value = results.slice(0, 5)
      }
    } catch (err) {
      console.error('Erro ao buscar endereço:', err)
      // Show user-friendly error message
      if (type === 'from') fromSuggestions.value = []
      if (type === 'to') toSuggestions.value = []
    } finally {
      isSearching.value = false
    }
  }, 300) // 300ms debounce
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

const handleBlur = (type) => {
  // Delay hiding suggestions to allow for clicks
  setTimeout(() => {
    if (activeField.value === type) {
      activeField.value = null
    }
  }, 200)
}

const clearInput = (type) => {
  if (type === 'from') {
    fromQuery.value = ''
    fromLocation.value = null
    fromSuggestions.value = []
  } else {
    toQuery.value = ''
    toLocation.value = null
    toSuggestions.value = []
  }
}

const swapLocations = () => {
  if (!fromQuery.value || !toQuery.value) return
  
  // Swap queries
  const tempQuery = fromQuery.value
  fromQuery.value = toQuery.value
  toQuery.value = tempQuery
  
  // Swap locations
  const tempLocation = fromLocation.value
  fromLocation.value = toLocation.value
  toLocation.value = tempLocation
  
  // Clear suggestions
  fromSuggestions.value = []
  toSuggestions.value = []
}

const calculate = () => {
  if (!canCalculate.value) {
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
  activeField.value = null
  emit('clearRoute')
}

const useCurrentLocation = () => {
  emit('setFromCurrentLocation')
}
</script>

<style scoped>
.route-search {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  position: relative;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.input-group label svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  color: #111827;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper input.has-value {
  border-color: #10b981;
  background: #f0fdf4;
}

.input-wrapper input::placeholder {
  color: #9ca3af;
}

.clear-input-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-input-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.clear-input-btn svg {
  width: 16px;
  height: 16px;
}

.input-success {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
}

.input-success svg {
  width: 16px;
  height: 16px;
}

.swap-container {
  display: flex;
  justify-content: center;
  margin: -8px 0;
}

.swap-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #6b7280;
}

.swap-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: rotate(180deg);
}

.swap-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.swap-btn svg {
  width: 20px;
  height: 20px;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestions li {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
}

.suggestions li:last-child {
  border-bottom: none;
}

.suggestions li:hover {
  background: #f8fafc;
}

.suggestion-icon {
  color: #6b7280;
  flex-shrink: 0;
}

.suggestion-icon svg {
  width: 16px;
  height: 16px;
}

.suggestion-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.quick-actions {
  display: flex;
  justify-content: center;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.quick-action-btn svg {
  width: 16px;
  height: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.primary-btn {
  background: #3b82f6;
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.primary-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.secondary-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.primary-btn svg,
.secondary-btn svg {
  width: 18px;
  height: 18px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  color: #6b7280;
  font-size: 14px;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .route-search {
    gap: 16px;
  }
  
  .search-form {
    gap: 12px;
  }
  
  .input-wrapper input {
    padding: 10px 14px;
    padding-right: 44px;
    font-size: 13px;
  }
  
  .swap-btn {
    width: 36px;
    height: 36px;
  }
  
  .swap-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .action-buttons {
    gap: 10px;
  }
  
  .primary-btn,
  .secondary-btn {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .quick-action-btn {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .quick-action-btn svg {
    width: 14px;
    height: 14px;
  }
}
</style>
