<template>
  <div class="creator-card">
    <div class="creator-avatar">
      <img :src="img" :alt="`Criador ${name}`" />
    </div>
    <h3 class="creator-name">{{ name }}</h3>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  img: String
})
</script>