<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FeatureCard from '~/components/FeatureCard.vue'
import CreatorCard from '~/components/CreatorCard.vue'

const router = useRouter()
const darkMode = ref(false)

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark-mode', darkMode.value)
  localStorage.setItem('darkMode', darkMode.value.toString())
}

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
]

onMounted(() => {
  // Load dark mode preference
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  if (darkMode.value) document.body.classList.add('dark-mode')

  // Intersection Observer for scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, observerOptions)

  document.querySelectorAll('.tutorial-section').forEach(section => {
    section.style.opacity = '0'
    section.style.transform = 'translateY(30px)'
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(section)
  })

  // Hover effects
  function addHoverEffect(selector, enterStyle, leaveStyle) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        Object.assign(el.style, enterStyle)
      })
      el.addEventListener('mouseleave', () => {
        Object.assign(el.style, leaveStyle)
      })
    })
  }

  addHoverEffect('.intro-item',
    { transform: 'translateY(-10px) scale(1.02)', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' },
    { transform: 'translateY(0) scale(1)', boxShadow: 'none' })

  addHoverEffect('.safety-card',
    { transform: 'translateY(-10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' },
    { transform: 'translateY(0)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' })

  // Parallax effect on header
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const header = document.querySelector('.tutorial-header')
    if (header) {
      header.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })

  // Initial fade-in
  setTimeout(() => {
    const container = document.querySelector('.tutorial-container')
    if (container) container.style.opacity = '1'
  }, 100)
})
</script>

<template>
  <div>
    <main class="main">
      <div class="tutorial-container">
        <div class="tutorial-header">
          <h1 class="tutorial-title">Sobre o Safe Street</h1>
          <p class="tutorial-subtitle">
            Conheça nossa plataforma inovadora para melhorar a segurança urbana
          </p>
        </div>

        <!-- Seção 1: Introdução -->
        <section id="introducao" class="tutorial-section">
          <div class="section-content">
            <h2>O que é o Safe Street</h2>
            <div class="tutorial-grid">
              <div class="tutorial-text">
                <h3>Nossa Plataforma</h3>
                <p class="section-description">
                  Safe Street é um aplicativo inovador criado com o objetivo de melhorar a segurança nas cidades, 
                  permitindo que os usuários identifiquem e compartilhem áreas de risco em tempo real. 
                  Nossa plataforma conecta comunidades e oferece informações valiosas para uma navegação mais segura.
                </p>
                
                <div class="tip-box">
                  <i class="fas fa-lightbulb"></i>
                  <p>
                    <strong>Missão:</strong> Criar cidades mais seguras através da colaboração comunitária 
                    e compartilhamento inteligente de informações.
                  </p>
                </div>
              </div>

              <div class="tutorial-image">
                <div class="image-container">
                  <img src="/img/Dark-Mode.png" alt="Interface do Safe Street" />
                  <div class="image-caption">
                    Interface principal do Safe Street em modo escuro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 2: Como Funciona -->
        <section id="como-funciona" class="tutorial-section">
          <div class="section-content">
            <h2>Como Funciona</h2>
            <div class="intro-grid">
              <FeatureCard 
                src="/img/ocorrencia.png" 
                title="Relatos de Usuários" 
                text="Os usuários relatam incidentes de segurança em tempo real, criando uma base de dados colaborativa e atualizada sobre áreas de risco na cidade." 
              />
              <FeatureCard 
                src="/img/comunidade.png" 
                title="Comunidade de Segurança" 
                text="Compartilhamento de experiências e informações entre usuários, fortalecendo a rede de segurança comunitária e promovendo a conscientização." 
              />
              <FeatureCard 
                src="/img/mapa.png" 
                title="Mapa de Áreas de Risco" 
                text="O app cria um mapa interativo com marcadores coloridos que indicam diferentes níveis de risco, ajudando na escolha de rotas mais seguras." 
              />
            </div>
          </div>
        </section>

        <!-- Seção 3: Recursos Principais -->
        <section id="recursos" class="tutorial-section">
          <div class="section-content">
            <h2>Recursos Principais</h2>
            <div class="tutorial-grid">
              <div class="tutorial-text">
                <h3>Funcionalidades Avançadas</h3>
                <ul class="feature-list">
                  <li><i class="fas fa-map-marker-alt"></i> <span>Mapeamento em tempo real de áreas de risco</span></li>
                  <li><i class="fas fa-users"></i> <span>Sistema colaborativo de relatos comunitários</span></li>
                  <li><i class="fas fa-route"></i> <span>Sugestões de rotas alternativas mais seguras</span></li>
                  <li><i class="fas fa-bell"></i> <span>Notificações de alertas de segurança</span></li>
                  <li><i class="fas fa-chart-line"></i> <span>Análise de dados e estatísticas de segurança</span></li>
                                     <li><i class="fas fa-mobile-alt"></i> <span>Interface intuitiva e responsiva</span></li>
                </ul>
              </div>

              <div class="tutorial-image">
                <div class="image-container">
                  <img src="/img/mapa.png" alt="Recursos do Safe Street" />
                  <div class="image-caption">
                    Principais recursos e funcionalidades da plataforma
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 4: Impacto Social -->
        <section id="impacto" class="tutorial-section">
          <div class="section-content">
            <h2>Nosso Impacto</h2>
            <div class="safety-grid">
              <div class="safety-card">
                <div class="safety-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Segurança Preventiva</h3>
                <ul>
                  <li>Identificação precoce de áreas de risco</li>
                  <li>Redução de incidentes através da prevenção</li>
                  <li>Conscientização comunitária sobre segurança</li>
                </ul>
              </div>

              <div class="safety-card">
                <div class="safety-icon">
                  <i class="fas fa-handshake"></i>
                </div>
                <h3>Colaboração Comunitária</h3>
                <ul>
                  <li>Fortalecimento dos laços comunitários</li>
                  <li>Participação ativa dos cidadãos</li>
                  <li>Responsabilidade social compartilhada</li>
                </ul>
              </div>

              <div class="safety-card">
                <div class="safety-icon">
                  <i class="fas fa-city"></i>
                </div>
                <h3>Cidades Inteligentes</h3>
                <ul>
                  <li>Dados para políticas públicas</li>
                  <li>Otimização de recursos de segurança</li>
                  <li>Planejamento urbano mais eficiente</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 5: Tecnologia -->
        <section id="tecnologia" class="tutorial-section">
          <div class="section-content">
            <h2>Tecnologia e Inovação</h2>
            <div class="tutorial-grid">
              <div class="tutorial-text">
                <h3>Stack Tecnológico</h3>
                <div class="steps-list">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-description">
                      <h4>Frontend Moderno</h4>
                      <p>Vue.js 3 com Nuxt.js para uma experiência de usuário fluida e responsiva</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-description">
                      <h4>Mapas Interativos</h4>
                      <p>Integração com Leaflet para visualização geográfica precisa e interativa</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-description">
                      <h4>Backend Robusto</h4>
                      <p>API REST para gerenciamento seguro de dados e comunicação eficiente</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-description">
                      <h4>Segurança de Dados</h4>
                      <p>Criptografia e proteção de dados pessoais seguindo as melhores práticas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tutorial-image">
                <div class="image-container">
                  <img src="/img/ocorrencia.png" alt="Tecnologia Safe Street" />
                  <div class="image-caption">
                    Arquitetura tecnológica moderna e segura
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 6: Equipe -->
        <section id="equipe" class="tutorial-section">
          <div class="section-content">
            <h2>Conheça Nossa Equipe</h2>
            <p class="team-description">
              Nossa equipe é composta por profissionais dedicados e apaixonados por tecnologia e segurança urbana. 
              Juntos, trabalhamos para criar soluções inovadoras que fazem a diferença na vida das pessoas.
            </p>
            
            <div class="creators-grid">
              <CreatorCard 
                v-for="creator in creators" 
                :key="creator.name" 
                :name="creator.name" 
                :img="creator.img" 
              />
            </div>
          </div>
        </section>

        <!-- Seção 7: Próximos Passos -->
        <section id="proximos-passos" class="tutorial-section">
          <div class="section-content">
            <h2>Junte-se a Nós!</h2>
            <div class="complete-content">
              <i class="fas fa-rocket"></i>
              <h3>Faça Parte da Revolução da Segurança Urbana</h3>
              <p>Juntos podemos criar cidades mais seguras e inteligentes. Comece a usar o Safe Street hoje mesmo!</p>
              <div class="complete-actions">
                <button type="button" class="btn-start" @click="$router.push('/map')">Acessar o Mapa</button>
                <button type="button" class="btn-download" @click="$router.push('/tutorial')">Ver Tutorial</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.section-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--texto-primario);
  margin-bottom: 30px;
}

.team-description {
  text-align: center;
  font-size: 1.1rem;
  color: var(--texto-primario);
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.creators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

/* Responsivo */
@media (max-width: 768px) {
  .tutorial-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .complete-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .creators-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }
}
</style>
