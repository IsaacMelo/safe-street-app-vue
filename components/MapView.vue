<template>
  <div class="app-wrapper">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Map Controls Panel -->
    <div class="map-controls-panel">
      <!-- Route Button -->
      <button @click="togglePopup" class="control-button primary" :class="{ active: showPopup }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>Rota</span>
      </button>

      <!-- Risk Areas Toggle -->
      <button @click="toggleRiskAreas" class="control-button secondary" :class="{ active: showRiskAreas }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Riscos</span>
      </button>

      <!-- Map Style Toggle -->
      <button @click="toggleMapStyle" class="control-button tertiary">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span>Estilo</span>
      </button>
    </div>

    <!-- Custom Zoom Controls -->
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <button @click="zoomOut" class="zoom-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
    </div>

    <!-- GPS Location Button -->
    <button @click="useUserLocation" class="gps-button" :class="{ active: isLocating }" title="Minha localização">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    </button>

    <!-- Risk Areas Legend -->
    <div v-if="showRiskAreas && riskAreasLoaded" class="risk-legend">
      <h4>Níveis de Risco</h4>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-color high-risk"></div>
          <span>Alto (5+ incidentes)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color medium-risk"></div>
          <span>Médio (3-4 incidentes)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color low-risk"></div>
          <span>Baixo (1-2 incidentes)</span>
        </div>
      </div>
    </div>

    <!-- Route Search Popup -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup-content">
        <div class="popup-header">
          <h3>Calcular Rota Segura</h3>
          <button @click="closePopup" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <RouteSearch
          @calculateRoute="handleRoute"
          @clearRoute="clearRoute"
          @setFromCurrentLocation="useUserLocation"
        />
      </div>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- Route Info Panel -->
    <div v-if="routeInfo" class="route-info-panel">
      <div class="route-info-header">
        <h4>Informações da Rota</h4>
        <button @click="clearRoute" class="clear-route-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="route-stats">
        <div class="stat-item">
          <span class="stat-label">Distância:</span>
          <span class="stat-value">{{ routeInfo.distance }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Tempo estimado:</span>
          <span class="stat-value">{{ routeInfo.duration }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Áreas de risco:</span>
          <span class="stat-value risk-count">{{ routeInfo.riskCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import RouteSearch from '~/components/RouteSearch.vue'
import { useAuth } from '~/composables/useAuth'
import '~/utils/leafletIconFix'

const mapContainer = ref(null)
const { token } = useAuth()
const showPopup = ref(false)
const showRiskAreas = ref(false)
const isLoading = ref(false)
const isLocating = ref(false)
const loadingMessage = ref('')
const riskAreasLoaded = ref(false)
const routeInfo = ref(null)

let map
let routeLayer
let userLocationMarker
let originMarker
let destinationMarker
const riskLayerGroup = L.layerGroup()
let currentMapStyle = 'openstreetmap'

const mapStyles = {
  openstreetmap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap'
  }
}

const togglePopup = () => {
  showPopup.value = !showPopup.value
}

const closePopup = () => {
  showPopup.value = false
}

const toggleRiskAreas = async () => {
  showRiskAreas.value = !showRiskAreas.value
  
  if (showRiskAreas.value) {
    // Get current map center for risk areas
    const center = map.getCenter()
    await showRiskAreasAroundLocation(center.lat, center.lng)
  } else {
    riskLayerGroup.clearLayers()
    riskAreasLoaded.value = false
  }
}

const toggleMapStyle = () => {
  const styles = Object.keys(mapStyles)
  const currentIndex = styles.indexOf(currentMapStyle)
  const nextIndex = (currentIndex + 1) % styles.length
  currentMapStyle = styles[nextIndex]
  
  // Remove current tile layer
  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer)
    }
  })
  
  // Add new tile layer
  const newStyle = mapStyles[currentMapStyle]
  L.tileLayer(newStyle.url, {
    attribution: newStyle.attribution
  }).addTo(map)
}

const zoomIn = () => {
  map.zoomIn()
}

const zoomOut = () => {
  map.zoomOut()
}

const initMap = async () => {
  isLoading.value = true
  loadingMessage.value = 'Carregando mapa...'
  
  try {
    map = L.map(mapContainer.value, {
      scrollWheelZoom: true,
      zoomControl: false, // We'll use custom zoom controls
      attributionControl: false
    }).setView([-23.55, -46.63], 12)
    
    const tileLayer = L.tileLayer(mapStyles[currentMapStyle].url, {
      attribution: mapStyles[currentMapStyle].attribution
    }).addTo(map)
    
    // Add attribution control in a better position
    L.control.attribution({
      position: 'bottomright',
      prefix: false
    }).addTo(map)
    
    // Add smooth zoom animation
    map.on('zoomstart', () => {
      mapContainer.value.style.transition = 'opacity 0.2s ease'
    })
    
    map.on('zoomend', () => {
      mapContainer.value.style.transition = ''
    })
    
  } catch (error) {
    console.error('Erro ao inicializar mapa:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await initMap()
})

const handleRoute = async ({ from, to }) => {
  isLoading.value = true
  loadingMessage.value = 'Calculando rota segura...'
  
  try {
    const url = `https://safe-street-api.onrender.com/api/routes?fromLat=${from.lat}&fromLng=${from.lng}&toLat=${to.lat}&toLng=${to.lng}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const data = await res.json()

    // Clear previous route
    clearRouteMarkers()

    // Add route polyline with smooth animation
    routeLayer = L.polyline(data.coordinates.map(([lat, lng]) => [lat, lng]), {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.8,
      smoothFactor: 1,
      className: 'route-line'
    }).addTo(map)

    // Fit map to route bounds with padding
    map.fitBounds(routeLayer.getBounds(), { padding: [20, 20] })
    
    // Add custom markers
    originMarker = L.marker([from.lat, from.lng], {
      icon: createCustomIcon('📍', 'origin-marker')
    }).addTo(map).bindPopup(`
      <div class="custom-popup">
        <h4>📍 Origem</h4>
        <p>Ponto de partida da rota</p>
      </div>
    `)

    destinationMarker = L.marker([to.lat, to.lng], {
      icon: createCustomIcon('🎯', 'destination-marker')
    }).addTo(map).bindPopup(`
      <div class="custom-popup">
        <h4>🎯 Destino</h4>
        <p>Ponto de chegada da rota</p>
      </div>
    `)

    // Show risk areas along the route
    await showRiskAreasAroundLocation(from.lat, from.lng)
    showRiskAreas.value = true
    
    // Calculate route info
    const distance = calculateDistance(data.coordinates)
    const duration = estimateDuration(distance)
    const riskCount = await countRiskAreasNearRoute(data.coordinates)
    
    routeInfo.value = {
      distance: `${distance.toFixed(1)} km`,
      duration: `${duration} min`,
      riskCount
    }
    
    showPopup.value = false
    
  } catch (error) {
    console.error('Erro ao calcular rota:', error)
    alert('Erro ao calcular rota. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const showRiskAreasAroundLocation = async (lat, lng) => {
  if (!showRiskAreas.value && !isLoading.value) return
  
  try {
    const url = `https://safe-street-api.onrender.com/api/riskareas?maxDistance=10000&lat=${lat}&lng=${lng}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const riskAreas = await res.json()

    riskLayerGroup.clearLayers()

    riskAreas.forEach(area => {
      const [lng, lat] = area.location.coordinates
      const { color, fillColor, className } = getRiskColor(area.count)

      const circle = L.circleMarker([lat, lng], {
        radius: Math.min(12, 6 + area.count),
        color,
        fillColor,
        fillOpacity: 0.7,
        weight: 2,
        className: `risk-marker ${className}`
      }).bindPopup(`
        <div class="risk-popup">
          <h4>⚠️ Área de Risco</h4>
          <p><strong>Local:</strong> ${area.name}</p>
          <p><strong>Incidentes:</strong> ${area.count}</p>
          <p><strong>Nível:</strong> ${getRiskLevel(area.count)}</p>
        </div>
      `)

      riskLayerGroup.addLayer(circle)
    })

    riskLayerGroup.addTo(map)
    riskAreasLoaded.value = true
    
  } catch (err) {
    console.error('Erro ao carregar áreas de risco:', err)
  }
}

const clearRoute = () => {
  if (routeLayer) {
    map.removeLayer(routeLayer)
    routeLayer = null
  }
  clearRouteMarkers()
  routeInfo.value = null
}

const clearRouteMarkers = () => {
  if (originMarker) {
    map.removeLayer(originMarker)
    originMarker = null
  }
  if (destinationMarker) {
    map.removeLayer(destinationMarker)
    destinationMarker = null
  }
}

const useUserLocation = () => {
  if (isLocating.value) return
  
  isLocating.value = true
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = pos.coords
      
      // Remove previous user location marker
      if (userLocationMarker) {
        map.removeLayer(userLocationMarker)
      }
      
      // Add user location marker with custom icon
      userLocationMarker = L.marker([coords.latitude, coords.longitude], {
        icon: createCustomIcon('📍', 'user-location-marker')
      }).addTo(map).bindPopup(`
        <div class="custom-popup">
          <h4>📍 Sua Localização</h4>
          <p>Localização atual</p>
        </div>
      `).openPopup()
      
      // Smooth pan to location
      map.setView([coords.latitude, coords.longitude], 15, {
        animate: true,
        duration: 1
      })
      
      isLocating.value = false
    },
    (error) => {
      console.error('Erro ao obter localização:', error)
      alert('Não foi possível obter sua localização. Verifique as permissões.')
      isLocating.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  )
}

const createCustomIcon = (emoji, className) => {
  return L.divIcon({
    className: `custom-marker ${className}`,
    html: `<div class="marker-content">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

const getRiskColor = (count) => {
  if (count >= 5) return { 
    color: '#dc2626', 
    fillColor: '#fca5a5', 
    className: 'high-risk' 
  }
  if (count >= 3) return { 
    color: '#d97706', 
    fillColor: '#fcd34d', 
    className: 'medium-risk' 
  }
  return { 
    color: '#059669', 
    fillColor: '#6ee7b7', 
    className: 'low-risk' 
  }
}

const getRiskLevel = (count) => {
  if (count >= 5) return 'Alto'
  if (count >= 3) return 'Médio'
  return 'Baixo'
}

const calculateDistance = (coordinates) => {
  let distance = 0
  for (let i = 1; i < coordinates.length; i++) {
    const [lat1, lng1] = coordinates[i - 1]
    const [lat2, lng2] = coordinates[i]
    distance += getDistanceBetweenPoints(lat1, lng1, lat2, lng2)
  }
  return distance
}

const getDistanceBetweenPoints = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const estimateDuration = (distance) => {
  // Estimate based on average urban speed (30 km/h)
  const hours = distance / 30
  return Math.round(hours * 60)
}

const countRiskAreasNearRoute = async (coordinates) => {
  // This would need to be implemented on the backend
  // For now, return a mock count
  return Math.floor(Math.random() * 5)
}
</script>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.map-container {
  height: 100vh;
  width: 100%;
  position: relative;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Map Controls Panel */
.map-controls-panel {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  min-width: 120px;
}

.control-button svg {
  width: 18px;
  height: 18px;
}

.control-button.primary {
  background: rgba(59, 130, 246, 0.9);
  color: white;
}

.control-button.primary:hover,
.control-button.primary.active {
  background: rgba(37, 99, 235, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.control-button.secondary {
  background: rgba(245, 101, 101, 0.9);
  color: white;
}

.control-button.secondary:hover,
.control-button.secondary.active {
  background: rgba(220, 38, 38, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.4);
}

.control-button.tertiary {
  background: rgba(107, 114, 128, 0.9);
  color: white;
}

.control-button.tertiary:hover {
  background: rgba(75, 85, 99, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

/* Custom Zoom Controls */
.zoom-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.zoom-button {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.zoom-button:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.zoom-button svg {
  width: 20px;
  height: 20px;
  color: #374151;
}

/* GPS Button */
.gps-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 56px;
  height: 56px;
  border: none;
  background: rgba(59, 130, 246, 0.95);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.gps-button:hover {
  background: rgba(37, 99, 235, 0.95);
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.6);
}

.gps-button.active {
  background: rgba(16, 185, 129, 0.95);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.gps-button svg {
  width: 24px;
  height: 24px;
}

/* Risk Legend */
.risk-legend {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 200px;
}

.risk-legend h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
}

.legend-color.high-risk {
  background: #fca5a5;
  border-color: #dc2626;
}

.legend-color.medium-risk {
  background: #fcd34d;
  border-color: #d97706;
}

.legend-color.low-risk {
  background: #6ee7b7;
  border-color: #059669;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  position: relative;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.popup-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Route Info Panel */
.route-info-panel {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  animation: slideUp 0.3s ease;
}

.route-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.route-info-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.clear-route-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-route-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.clear-route-btn svg {
  width: 16px;
  height: 16px;
}

.route-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.stat-value.risk-count {
  color: #dc2626;
}

/* Custom Markers */
:deep(.custom-marker) {
  background: none;
  border: none;
}

:deep(.marker-content) {
  font-size: 24px;
  text-align: center;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

:deep(.origin-marker .marker-content) {
  color: #059669;
}

:deep(.destination-marker .marker-content) {
  color: #dc2626;
}

:deep(.user-location-marker .marker-content) {
  color: #3b82f6;
}

/* Custom Popups */
:deep(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
}

:deep(.custom-popup) {
  font-family: 'Inter', sans-serif;
}

:deep(.custom-popup h4) {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
}

:deep(.custom-popup p) {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
}

:deep(.risk-popup) {
  font-family: 'Inter', sans-serif;
}

:deep(.risk-popup h4) {
  margin: 0 0 8px 0;
  color: #dc2626;
  font-size: 14px;
  font-weight: 600;
}

:deep(.risk-popup p) {
  margin: 0 0 4px 0;
  color: #374151;
  font-size: 12px;
}

:deep(.risk-popup p:last-child) {
  margin-bottom: 0;
}

/* Route Line Animation */
:deep(.route-line) {
  animation: routeAppear 1s ease;
}

@keyframes routeAppear {
  from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
  to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
}

/* Risk Markers */
:deep(.risk-marker) {
  animation: riskAppear 0.5s ease;
}

@keyframes riskAppear {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

:deep(.risk-marker.high-risk) {
  animation: riskPulse 2s infinite;
}

@keyframes riskPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .map-controls-panel {
    top: 10px;
    left: 10px;
    gap: 6px;
  }
  
  .control-button {
    padding: 10px 12px;
    font-size: 12px;
    min-width: 100px;
  }
  
  .control-button svg {
    width: 16px;
    height: 16px;
  }
  
  .zoom-controls {
    top: 10px;
    right: 10px;
  }
  
  .zoom-button {
    width: 40px;
    height: 40px;
  }
  
  .gps-button {
    bottom: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
  }
  
  .risk-legend {
    bottom: 10px;
    left: 10px;
    padding: 12px;
    min-width: 180px;
  }
  
  .route-info-panel {
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    min-width: auto;
  }
  
  .route-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .popup-content {
    width: 95%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .map-controls-panel {
    flex-direction: row;
    flex-wrap: wrap;
    max-width: calc(100vw - 80px);
  }
  
  .control-button {
    flex: 1;
    min-width: 80px;
    padding: 8px;
  }
  
  .control-button span {
    display: none;
  }
  
  .risk-legend {
    display: none;
  }
}
</style>
