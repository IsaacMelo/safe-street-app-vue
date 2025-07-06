<!-- File: pages/index.vue -->
<template>
  <div>
    <main class="main">
      <section class="hero">
        <div class="container sobre-nos-container">
          <div class="texto-sobre-nos">
            <h1 class="section-title gold-accent">Sobre o Safe Street</h1>
            <p class="section-text">
              Safe Street é um aplicativo inovador criado com o objetivo de melhorar a segurança nas cidades, permitindo que os usuários identifiquem e compartilhem áreas de risco em tempo real.
            </p>
          </div>
          <div class="imagem-sobre-nos">
            <img class="hero-image" src="/img/Dark-Mode.png" alt="Imagem sobre o Safe Street" />
          </div>
        </div>
      </section>

      <section class="nossa-missao">
        <div class="container missao-content">
          <div class="texto-missao">
            <h2 class="section-title">Nossa Missão</h2>
            <p class="section-text">Nossa missão é ajudar as pessoas a identificar e se proteger contra áreas de risco...</p>
          </div>
          <div class="missao-decoration"><div class="decoration-circle" /></div>
        </div>
      </section>

      <section class="como-funciona">
        <div class="container">
          <h2 class="section-title text-center gold-accent">Como funciona</h2>
          <div class="feature-grid">
            <!-- Feature Cards -->
            <FeatureCard src="/img/ocorrencia.png" title="Relatos de Usuários" text="Os usuários relatam incidentes..." />
            <FeatureCard src="/img/comunidade.png" title="Comunidade de Segurança" text="Compartilhamento de experiências..." />
            <FeatureCard src="/img/mapa.png" title="Mapa de Áreas de Risco" text="O app cria um mapa interativo..." />
          </div>
        </div>
      </section>

      <!-- Outras seções semelhantes -->

      <section class="creators">
        <div class="container">
          <h2 class="section-title text-center gold-accent">Conheça nossos criadores</h2>
          <div class="creator-grid">
            <CreatorCard v-for="creator in creators" :key="creator.name" :name="creator.name" :img="creator.img" />
          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<script setup>
import CreatorCard from '~/components/CreatorCard.vue'

const creators = [
  { name: 'Alisson Seabra', img: 'img/alisson.jpeg' },
  { name: 'Caio', img: 'img/caio.jpeg' },
  { name: 'Deryck Siqueira', img: 'img/deryck.jpg' },
  { name: 'Felipe Cesare', img: 'img/felipe.jpg' },
  { name: 'Gabriel Felix', img: 'img/gabrielfelix.jpg' },
  { name: 'Gabriel Sousa', img: 'img/freitas.jpg' },
  { name: 'Guilherme Chagas', img: 'img/gui.jpeg' },
  { name: 'João Paulo', img: 'img/paulo.jpg' },
  { name: 'Miguel Santos', img: 'img/miguelsantos.jpg' },
  { name: 'Miguel Teodoro', img: 'img/miguelteodoro.jpg' },
];
</script>
