<template>
  <div class="app-wrapper">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Fixed Route Search Panel - Google Maps Style -->
    <div class="route-search-panel" :class="{ expanded: isRouteSearchExpanded }">
      <div class="route-panel-header" @click="toggleRouteSearch">
        <div class="route-panel-title">
          <i class="fas fa-route"></i>
          <span>Calcular Rota Segura</span>
        </div>
        <button class="expand-toggle" :class="{ rotated: isRouteSearchExpanded }">
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
      
      <div class="route-panel-content" v-show="isRouteSearchExpanded">
        <RouteSearch
          @calculateRoute="handleRoute"
          @clearRoute="clearRoute"
          @setFromCurrentLocation="useUserLocation"
        />
      </div>
    </div>

    <!-- Map Controls Panel -->
    <div class="map-controls-panel">
      <!-- Risk Areas Toggle -->
      <button @click="toggleRiskAreas" class="control-button secondary" :class="{ active: showRiskAreas }" title="Exibir áreas de risco">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Riscos</span>
      </button>

      <!-- Map Style Toggle -->
      <button @click="toggleMapStyle" class="control-button tertiary" title="Alternar estilo do mapa">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6l9-3 9 3v12l-9 3-9-3V6z"/>
          <path d="M9 3v18"/>
          <path d="M15 3v18"/>
        </svg>
        <span>Estilo</span>
      </button>

      <!-- Zoom Group -->
      <div class="zoom-group">
        <button @click="zoomIn" class="control-button zoom-in" title="Aproximar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <span>Zoom +</span>
        </button>
        <button @click="zoomOut" class="control-button zoom-out" title="Afastar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <span>Zoom -</span>
        </button>
      </div>
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

    <!-- Map Container -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- Route Info Panel -->
    <div v-if="routeInfo" class="route-info-panel">
      <div class="route-info-header">
        <h4>Informações da Rota</h4>
        <button @click="closeRouteInfo" class="clear-route-btn" title="Fechar informações">
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
      <div class="route-actions">
        <button @click="clearRoute" class="clear-route-action-btn" title="Limpar rota">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Limpar Rota
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import RouteSearch from '~/components/RouteSearch.vue'
import { useAuth } from '~/composables/useAuth'
import '~/utils/leafletIconFix'

const mapContainer = ref(null)
const { token } = useAuth()
const showRiskAreas = ref(false)
const isLoading = ref(false)
const isLocating = ref(false)
const loadingMessage = ref('')
const riskAreasLoaded = ref(false)
const routeInfo = ref(null)
const isRouteSearchExpanded = ref(window.innerWidth > 768) // Start expanded only on desktop

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

const toggleRouteSearch = () => {
  isRouteSearchExpanded.value = !isRouteSearchExpanded.value
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
  
  // Adjust route panel state based on screen size
  const handleResize = () => {
    if (window.innerWidth <= 768 && isRouteSearchExpanded.value) {
      isRouteSearchExpanded.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
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
    
    // Collapse route search panel after calculating route
    isRouteSearchExpanded.value = false
    
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
  
  // Expand route search panel when clearing route
  isRouteSearchExpanded.value = true
}

const closeRouteInfo = () => {
  // Apenas fecha o painel de informações, mantém a rota no mapa
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
  /* Garante que o mapa fique atrás dos controles */
  z-index: 1;
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
  z-index: 200; /* Muito alto para loading, mas ainda abaixo de alertas críticos */
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

/* Fixed Route Search Panel - Google Maps Style */
.route-search-panel {
  position: fixed;
  top: 85px; /* Below header */
  left: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 40; /* Below map controls to avoid overlap */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.route-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.route-panel-header:hover {
  background: #f1f5f9;
}

.route-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.route-panel-title i {
  color: #3b82f6;
  font-size: 1rem;
}

.expand-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.expand-toggle:hover {
  background: #e5e7eb;
  color: #374151;
}

.expand-toggle.rotated {
  transform: rotate(180deg);
}

.expand-toggle i {
  font-size: 0.875rem;
}

.route-panel-content {
  padding: 0;
  animation: slideDown 0.3s ease;
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

/* Map Controls Panel - Unificado para Desktop e Mobile */
.map-controls-panel {
  position: fixed;
  bottom: 80px;
  right: 10px;
  z-index: 70;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  padding: 0;
  box-shadow: none;
}

.zoom-group {
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 16px;
  overflow: hidden;
}

.zoom-group .control-button {
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
  background: rgba(255,255,255,0.95);
  transition: background 0.2s;
}

.zoom-group .control-button:first-child {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.zoom-group .control-button:last-child {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-bottom: none;
}

.zoom-group .control-button:active {
  background: #f3f4f6;
}

.control-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  min-width: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  transition: all 0.3s ease;
}

.control-button span {
  display: none;
}

.control-button svg {
  width: 20px;
  height: 20px;
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
  background: #fff;
  color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s;
}

.control-button.tertiary svg {
  color: #222;
  transition: color 0.2s;
}

.control-button.tertiary:hover {
  background: #222;
  color: #fff;
  box-shadow: 0 6px 20px rgba(34,34,34,0.2);
}

.control-button.tertiary:hover svg {
  color: #fff;
}

.control-button.zoom-in {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
}

.control-button.zoom-in:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.control-button.zoom-out {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
}

.control-button.zoom-out:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Custom Zoom Controls */
.zoom-controls {
  position: fixed;
  bottom: 200px; /* Moved up to avoid conflict with route panel */
  right: 20px;
  z-index: 50; /* Reduzido para ficar abaixo do header (z-index: 100) */
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
  right: 10px;
  width: 48px;
  height: 48px;
  z-index: 70;
  background: #fff;
  color: #222;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.gps-button svg {
  width: 20px;
  height: 20px;
  color: #222;
  transition: color 0.2s;
}

.gps-button:hover {
  background: #222;
}

.gps-button:hover svg {
  color: #fff;
}

.gps-button.active {
  background: #222;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34,34,34,0.7); }
  70% { box-shadow: 0 0 0 10px rgba(34,34,34,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,34,34,0); }
}

/* Risk Legend */
.risk-legend {
  position: fixed;
  bottom: 80px; /* Ajustado para ficar acima do footer */
  left: 20px;
  z-index: 50; /* Reduzido para ficar abaixo do header (z-index: 100) */
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

/* Route Info Panel */
.route-info-panel {
  position: fixed;
  bottom: 80px; /* Ajustado para ficar acima do footer */
  left: 50%;
  transform: translateX(-50%);
  z-index: 50; /* Reduzido para ficar abaixo do header (z-index: 100) */
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

.route-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.clear-route-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-route-action-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.clear-route-action-btn svg {
  width: 14px;
  height: 14px;
}

@keyframes slideUp {
  from { transform: translateX(-50%) translateY(20px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
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
  .route-search-panel {
    top: 75px; /* Header mobile menor */
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  /* Remover media queries que diferenciavam desktop/mobile para controles do mapa e GPS */
}

@media (max-width: 480px) {
  .route-search-panel {
    left: 5px;
    right: 5px;
    z-index: 40; /* Keep below controls */
  }
  
  /* Manter a mesma estrutura de controles em telas pequenas */
  .map-controls-panel {
    bottom: 80px;
    right: 5px;
  }
  
  .gps-button {
    bottom: 20px;
    right: 5px;
  }
  
  .risk-legend {
    display: none;
  }
  
  .route-panel-title span {
    display: none;
  }
  
  .route-panel-header {
    padding: 12px 16px;
  }
}
</style>
