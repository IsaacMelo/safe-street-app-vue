<template>
  <div class="intro-item">
    <div class="icon-wrapper">
      <img :src="src" :alt="title" class="feature-icon" />
    </div>
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  src: String,
  title: String,
  text: String
})
</script>

<style scoped>
.feature-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
</style>