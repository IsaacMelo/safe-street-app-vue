<template>
  <div class="map-page">
    <ClientOnly>
      <MapView />
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
import MapView from '~/components/MapView.vue'
</script>

<style scoped>
.map-page {
  /* Remove padding/margin que possam interferir com o posicionamento do mapa */
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  /* Garante que a página do mapa tenha o z-index correto */
  position: relative;
  z-index: 1;
}
</style>