<template>
  <div>
    <ClientOnly>
      <MapView />
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
import MapView from '~/components/MapView.vue'
</script>