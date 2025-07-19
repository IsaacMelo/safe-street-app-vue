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
          <i class="fas fa-circle input-icon origin-icon"></i>
          <input 
            id="origin"
            v-model="fromQuery" 
            @input="search('from')" 
            @focus="activeField = 'from'"
            @blur="handleBlur('from')"
            placeholder="Digite o endereço de origem..."
            :class="{ 'has-value': fromLocation }"
          />
          <!-- Current Location Button for Origin -->
          <button 
            @click="setOriginToCurrentLocation" 
            class="current-location-btn"
            type="button"
            title="Usar localização atual como origem"
            :disabled="isGettingLocation"
          >
            <svg v-if="!isGettingLocation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <div v-else class="mini-spinner"></div>
          </button>
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
          <i class="fas fa-map-marker-alt input-icon destination-icon"></i>
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

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="calculate" class="primary-btn" :disabled="!canCalculate" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3 8-8"/>
        </svg>
        <span>Calcular Rota</span>
      </button>
      
      <div class="secondary-actions">
        <button @click="useCurrentLocation" class="secondary-btn" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Usar Localização</span>
        </button>
        
        <button @click="clear" class="secondary-btn clear-btn" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          <span>Limpar</span>
        </button>
      </div>
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
const isGettingLocation = ref(false)

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

const setOriginToCurrentLocation = async () => {
  if (isGettingLocation.value) return
  
  isGettingLocation.value = true
  
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })
    
    const coords = position.coords
    const lat = coords.latitude
    const lng = coords.longitude
    
    // Try to get the address from coordinates using reverse geocoding
    try {
      const response = await fetch(`https://safe-street-api.onrender.com/api/reverse-geocode?lat=${lat}&lng=${lng}`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        fromQuery.value = data.address_formatted || 'Localização Atual'
      } else {
        fromQuery.value = 'Localização Atual'
      }
    } catch (geocodeError) {
      console.warn('Erro ao obter endereço:', geocodeError)
      fromQuery.value = 'Localização Atual'
    }
    
    // Set the location coordinates
    fromLocation.value = {
      lat: lat,
      lng: lng
    }
    
    // Clear suggestions
    fromSuggestions.value = []
    activeField.value = null
    
  } catch (error) {
    console.error('Erro ao obter localização:', error)
    let errorMessage = 'Não foi possível obter sua localização.'
    
    if (error.code === error.PERMISSION_DENIED) {
      errorMessage = 'Permissão de localização negada. Verifique as configurações do navegador.'
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      errorMessage = 'Localização não disponível.'
    } else if (error.code === error.TIMEOUT) {
      errorMessage = 'Tempo limite para obter localização excedido.'
    }
    
    alert(errorMessage)
  } finally {
    isGettingLocation.value = false
  }
}
</script>

<style scoped>
.route-search {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 20px;
  background: white;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  position: relative;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
}

.input-group label svg {
  width: 12px;
  height: 12px;
  color: #9ca3af;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  z-index: 1;
}

.origin-icon {
  color: #059669;
}

.destination-icon {
  color: #dc2626;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 80px 12px 40px; /* Increased right padding for both buttons */
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
  font-family: inherit;
}

.input-wrapper input:focus {
  outline: none;
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
  font-size: 13px;
}

.clear-input-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-input-btn:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.clear-input-btn svg {
  width: 14px;
  height: 14px;
}

.input-success {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
}

.input-success svg {
  width: 14px;
  height: 14px;
}

.current-location-btn {
  position: absolute;
  right: 50px; /* Position with more space from clear button */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #3b82f6; /* Primary color */
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.current-location-btn:hover:not(:disabled) {
  background: #e0e7ff; /* Lighter blue on hover */
  color: #2563eb; /* Darker blue on hover */
}

.current-location-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-location-btn svg {
  width: 16px;
  height: 16px;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.swap-container {
  display: flex;
  justify-content: center;
  margin: -4px 0;
}

.swap-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
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
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.swap-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.swap-btn svg {
  width: 16px;
  height: 16px;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 2px 0 0 0;
  max-height: 160px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.suggestions li {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
}

.suggestions li:last-child {
  border-bottom: none;
}

.suggestions li:hover {
  background: #f8fafc;
}

.suggestion-icon {
  color: #9ca3af;
  flex-shrink: 0;
}

.suggestion-icon svg {
  width: 14px;
  height: 14px;
}

.suggestion-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.primary-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.primary-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.primary-btn svg {
  width: 16px;
  height: 16px;
}

.secondary-actions {
  display: flex;
  gap: 8px;
}

.secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8fafc;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  flex: 1;
}

.secondary-btn:hover {
  background: #f1f5f9;
  color: #374151;
  border-color: #d1d5db;
}

.secondary-btn.clear-btn:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.secondary-btn svg {
  width: 14px;
  height: 14px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  color: #6b7280;
  font-size: 13px;
  border-top: 1px solid #f3f4f6;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
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
    padding: 16px;
    gap: 14px;
  }
  
  .search-form {
    gap: 10px;
  }
  
  .input-wrapper input {
    padding: 9px 14px 9px 32px;
    font-size: 13px;
  }
  
  .input-icon {
    left: 10px;
    font-size: 13px;
  }
  
  .primary-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .secondary-btn {
    padding: 7px 10px;
    font-size: 11px;
  }
  
  .secondary-btn span {
    display: none;
  }
  
  .swap-btn {
    width: 28px;
    height: 28px;
  }
  
  .swap-btn svg {
    width: 14px;
    height: 14px;
  }
}
</style>
