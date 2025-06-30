<template>
  <div class="app-wrapper">
    <button @click="togglePopup" class="floating-button">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 17l6-6 4 4 6-6" />
      </svg>
      <span class="label">Rota</span>
    </button>

    <button @click="useUserLocation" class="gps-button" title="Minha localização">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <circle cx="12" cy="12" r="3" fill="#60a5fa" stroke="none" />
      </svg>
    </button>

    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup-content">
        <RouteSearch
          @calculateRoute="handleRoute"
          @clearRoute="clearRoute"
          @setFromCurrentLocation="useUserLocation"
        />
        <button @click="closePopup" class="close-btn">✖</button>
      </div>
    </div>

    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import RouteSearch from '~/components/RouteSearch.vue'
import { useAuth } from '~/composables/useAuth'
import '~/utils/leafletIconFix'


const mapContainer = ref(null)
const { token } = useAuth()
const showPopup = ref(false)

let map
let routeLayer
const riskLayerGroup = L.layerGroup()

const togglePopup = () => {
  showPopup.value = !showPopup.value
}

const closePopup = () => {
  showPopup.value = false
}

const initMap = async () => {
  map = L.map(mapContainer.value, {
    scrollWheelZoom: true,
    zoomControl: true
  }).setView([-23.55, -46.63], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
}

onMounted(async () => {
  await initMap()
})

const handleRoute = async ({ from, to }) => {
  const url = `https://safe-street-api.onrender.com/api/routes?fromLat=${from.lat}&fromLng=${from.lng}&toLat=${to.lat}&toLng=${to.lng}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
  const data = await res.json()

  if (routeLayer) map.removeLayer(routeLayer)

  routeLayer = L.polyline(data.coordinates.map(([lat, lng]) => [lat, lng]), {
    color: 'blue',
    weight: 4
  }).addTo(map)

  map.fitBounds(routeLayer.getBounds())
  await showRiskAreas(from.lat, from.lng)
  showPopup.value = false

  const originMarker = L.marker([from.lat, from.lng], {
    icon: L.divIcon({
      className: 'custom-marker origin',
      html: '📍',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    })
  }).addTo(map).bindPopup('📍 Origem')

  // Marcador de destino
  const destinationMarker = L.marker([to.lat, to.lng], {
    icon: L.divIcon({
      className: 'custom-marker destination',
      html: '🎯',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    })
  }).addTo(map).bindPopup('🎯 Destino')
}

const showRiskAreas = async (lat, lng) => {
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

      const { color, fillColor } = getRiskColor(area.count)

      const circle = L.circleMarker([lat, lng], {
        radius: 8,
        color,
        fillColor,
        fillOpacity: 0.6
      }).bindPopup(`⚠️ Área de risco: ${area.name}<br/>Incidentes: ${area.count}`)

      riskLayerGroup.addLayer(circle)
    })

    riskLayerGroup.addTo(map)
  } catch (err) {
    console.error('Erro ao carregar áreas de risco:', err)
  }
}

const clearRoute = () => {
  if (routeLayer) {
    map.removeLayer(routeLayer)
    routeLayer = null
  }
}

const useUserLocation = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const coords = pos.coords
    map.setView([coords.latitude, coords.longitude], 15)
    L.marker([coords.latitude, coords.longitude])
      .addTo(map)
      .bindPopup('📍 Sua localização')
      .openPopup()
  })
}

const getRiskColor = (count) => {
  if (count >= 5) return { color: '#b91c1c', fillColor: '#f87171' }     // vermelho
  if (count >= 3)  return { color: '#92400e', fillColor: '#facc15' }     // amarelo
  return { color: '#065f46', fillColor: '#34d399' }                      // verde
}

</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

.home-button {
  background: none;
  border: none;
  color: #334155;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.map-container {
  height: 100vh;
  width: 100%;
}

.map-container {
  height: 100vh;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.floating-button {
  position: fixed;
  top: 72px;
  right: 16px;
  z-index: 1000;
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 10px 14px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.floating-button:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 65, 85, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  position: relative;
  background-color: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  width: 320px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 18px;
  cursor: pointer;
}

.gps-button {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  background-color: white;
  border: 1px solid #cbd5e1;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.gps-button:hover {
  background-color: #f1f5f9;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.gps-button svg {
  display: block;
}

.custom-marker {
  font-size: 20px;
  text-align: center;
  line-height: 24px;
}

</style>
