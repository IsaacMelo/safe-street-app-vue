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

<style scoped>
.creator-card {
  background: var(--fundo-claro);
  padding: 30px 20px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
  border-top: 4px solid var(--azul-escuro);
}

.creator-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-top: 4px solid var(--dourado);
}

.creator-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--dourado);
  box-shadow: var(--shadow);
}

.creator-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.creator-name {
  color: var(--azul-escuro);
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
}

/* Dark mode */
.dark-mode .creator-card {
  background: var(--dark-surface);
  border-top: 4px solid var(--dourado);
}

.dark-mode .creator-card:hover {
  border-top: 4px solid var(--dourado-claro);
}

.dark-mode .creator-name {
  color: var(--dourado-claro);
}
</style>