<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '#imports'

const router = useRouter()
const darkMode = ref(false)

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark-mode', darkMode.value)
  localStorage.setItem('darkMode', darkMode.value.toString())
}

onMounted(() => {
  // Load dark mode preference
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  if (darkMode.value) document.body.classList.add('dark-mode')

  // Menu toggle
  const menuToggle = document.querySelector('.menu-toggle')
  const mainNav = document.querySelector('.main-nav')
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active')
      mainNav.classList.toggle('active')
    })
  }

  // Close menu on link click
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active')
      mainNav?.classList.remove('active')
    })
  })

  // Button actions
  const btnStart = document.querySelector('.btn-start')
  const menuLinks = document.querySelectorAll('a.menu-link')
  if (btnStart && menuLinks.length > 1) {
    btnStart.addEventListener('click', () => {
      const href = menuLinks[1].getAttribute('href')
      if (href) router.push(href)
    })
  }

  const btnDownload = document.querySelector('.btn-download')
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      alert('Em breve o app estará disponível para download!')
    })
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

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

  addHoverEffect('.marker-card',
    { transform: 'translateY(-8px)', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' },
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
          <h1 class="tutorial-title">Tutorial Safe Street</h1>
          <p class="tutorial-subtitle">
            Aprenda a usar nossa plataforma para navegar com segurança
          </p>
        </div>

        <!-- Seção 1 -->
        <section id="introducao" class="tutorial-section">
          <div class="section-content">
            <h2>Bem-vindo ao Safe Street</h2>
            <div class="intro-grid">
              <div class="intro-item">
                <div class="icon-wrapper">
                  <i class="fas fa-map-marked-alt"></i>
                </div>
                <h3>Mapeamento Colaborativo</h3>
                <p>
                  Visualize e contribua com informações sobre locais perigosos em sua
                  cidade
                </p>
              </div>

              <div class="intro-item">
                <div class="icon-wrapper">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Segurança em Primeiro Lugar</h3>
                <p>
                  Receba alertas sobre áreas de risco e planeje rotas mais seguras
                </p>
              </div>

              <div class="intro-item">
                <div class="icon-wrapper">
                  <i class="fas fa-users"></i>
                </div>
                <h3>Comunidade Ativa</h3>
                <p>
                  Faça parte de uma comunidade que se preocupa com a segurança urbana
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 2 -->
        <section id="mapa-tutorial" class="tutorial-section">
          <div class="section-content">
            <h2>Como Visualizar o Mapa</h2>
            <div class="tutorial-grid">
              <div class="tutorial-text">
                <h3>Interface do Mapa</h3>
                <ul class="feature-list">
                  <li><i class="fas fa-search"></i> <span>Use a barra de pesquisa "Qual seu destino?"</span></li>
                  <li><i class="fas fa-map-pin"></i> <span>Visualize marcadores coloridos no mapa</span></li>
                  <li><i class="fas fa-sliders-h"></i> <span>Ajuste distância e tempo na parte inferior</span></li>
                  <li><i class="fas fa-user-circle"></i> <span>Acesse seu perfil no canto superior esquerdo</span></li>
                </ul>

                <div class="tip-box">
                  <i class="fas fa-lightbulb"></i>
                  <p>
                    <strong>Dica:</strong> Os marcadores coloridos representam diferentes níveis
                    de risco
                  </p>
                </div>
              </div>

              <div class="tutorial-image">
                <div class="image-container">
                  <img src="/img/mapa.png" alt="Interface do Mapa Safe Street" />
                  <div class="image-caption">
                    Interface principal do mapa com marcadores de ocorrências
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 3 -->
        <section id="reportar-ocorrencia" class="tutorial-section">
          <div class="section-content">
            <h2>Como Reportar uma Ocorrência</h2>
            <div class="tutorial-grid">
              <div class="tutorial-text">
                <h3>Passo a Passo para Reportar</h3>
                <div class="steps-list">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-description">
                      <h4>Acesse o Formulário</h4>
                      <p>Toque no botão "+" ou "Reportar" no mapa</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-description">
                      <h4>Preencha o Local</h4>
                      <p>Digite o endereço exato da ocorrência</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-description">
                      <h4>Informe o Horário</h4>
                      <p>Selecione quando aconteceu o incidente</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-description">
                      <h4>Escolha o Tipo</h4>
                      <p>Selecione a categoria da ocorrência</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">5</div>
                    <div class="step-description">
                      <h4>Descreva o Ocorrido</h4>
                      <p>Adicione detalhes importantes</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-number">6</div>
                    <div class="step-description">
                      <h4>Envie o Relato</h4>
                      <p>Toque em "Enviar" para publicar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tutorial-image">
                <div class="image-container">
                  <img src="/img/ocorrencia.png" alt="Formulário de Ocorrência" />
                  <div class="image-caption">Formulário para reportar novas ocorrências</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 4 -->
        <section id="tipos-marcadores" class="tutorial-section">
          <div class="section-content">
            <h2>Entendendo os Marcadores</h2>
            <div class="markers-grid">
              <div class="marker-card">
                <div class="marker-demo red"></div>
                <h3>Alto Risco</h3>
                <p>Quantidade de ocorrências superior a 10</p>
                <ul>
                  <li>Evite a área</li>
                  <li>Procure rotas alternativas</li>
                  <li>Informe às autoridades</li>
                </ul>
              </div>

              <div class="marker-card">
                <div class="marker-demo yellow"></div>
                <h3>Atenção</h3>
                <p>Já houve ocorrência nesse local</p>
                <ul>
                  <li>Evite horários noturnos</li>
                  <li>Use lanterna se necessário</li>
                  <li>Informe alguém sobre sua rota</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 5 -->
        <section id="dicas-seguranca" class="tutorial-section">
          <div class="section-content">
            <h2>Dicas de Segurança</h2>
            <div class="safety-grid">
              <div class="safety-card">
                <div class="safety-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <h3>Horários</h3>
                <ul>
                  <li>Evite sair sozinho à noite</li>
                  <li>Prefira horários de movimento</li>
                  <li>Informe alguém sobre seus planos</li>
                </ul>
              </div>

              <div class="safety-card">
                <div class="safety-icon">
                  <i class="fas fa-route"></i>
                </div>
                <h3>Rotas</h3>
                <ul>
                  <li>Varie seus caminhos</li>
                  <li>Prefira ruas iluminadas</li>
                  <li>Evite atalhos isolados</li>
                </ul>
              </div>

              <div class="safety-card">
                <div class="safety-icon">
                  <i class="fas fa-eye"></i>
                </div>
                <h3>Atenção</h3>
                <ul>
                  <li>Mantenha-se alerta</li>
                  <li>Confie nos seus instintos</li>
                  <li>Observe o ambiente</li>
                </ul>
              </div>
            </div>

            <div class="emergency-contacts">
              <h3>Contatos de Emergência</h3>
              <div class="contacts-grid">
                <div class="contact-item">
                  <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                  </div>
                  <span>Polícia: 190</span>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <i class="fas fa-ambulance"></i>
                  </div>
                  <span>SAMU: 192</span>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <i class="fas fa-fire"></i>
                  </div>
                  <span>Bombeiros: 193</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seção 6 -->
        <section id="comecar" class="tutorial-section">
          <div class="section-content">
            <h2>Pronto para Começar!</h2>
            <div class="complete-content">
              <i class="fas fa-check-circle"></i>
              <h3>Você aprendeu como usar o Safe Street</h3>
              <p>Agora você pode navegar com mais segurança e contribuir para uma comunidade mais protegida</p>
              <div class="complete-actions">
                <button type="button" class="btn-start">Acessar o Mapa</button>
                <button type="button" class="btn-download">Baixar o App</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>