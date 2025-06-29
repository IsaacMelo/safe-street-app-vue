<template>
  <div>
    <h1>Página Inicial</h1>
    <ClientOnly>
      <MapView />
    </ClientOnly>
  </div>
</template>

<script setup>
import MapView from '~/components/MapView.vue'
</script>
