<template>
  <div class="container-fluid py-3">
    <div class="row g-3 align-items-center">
      <img src="/img/LogoCnome.png" width="70" alt="Logo" />
      <div class="col-auto">
        <label>Distância (m):</label>
        <input v-model.number="localDistance" type="number" class="form-control" />
      </div>
      <div class="col-auto">
        <label>Latitude:</label>
        <input v-model="localLat" readonly class="form-control" />
      </div>
      <div class="col-auto">
        <label>Longitude:</label>
        <input v-model="localLng" readonly class="form-control" />
      </div>
      <!-- outros botões -->
      <button @click="$emit('capture-location')" class="btn btn-success">📍 Capturar</button>
      <button @click="search" class="btn btn-primary">Buscar</button>
      <button @click="$emit('toggle-dark')" :class="['btn', isDark ? 'btn-light' : 'btn-dark']">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
      <button @click="$emit('show-route')" class="btn btn-primary">🗺️ Rotas</button>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, toRef } from 'vue'

const props = defineProps({
  lat: Number,
  lng: Number,
  distance: Number,
  dark: Boolean
})

const localLat = ref(props.lat)
const localLng = ref(props.lng)
const localDistance = ref(props.distance)
const isDark = toRef(props, 'dark')

watch([localLat, localLng, localDistance], () => {
  $emit('update', { lat: localLat.value, lng: localLng.value, dist: localDistance.value })
})

function search() {
  $emit('search-points')
}
</script>
