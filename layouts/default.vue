<script setup>
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Tutorial - Safe Street',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' }
  ]
})

const { logout, isLoggedIn, role } = useAuth()

const darkMode = ref(false)
function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark-mode', darkMode.value)
  localStorage.setItem('darkMode', darkMode.value.toString())
}

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  if (darkMode.value) document.body.classList.add('dark-mode')
})
</script>

<template>
  <div class="layout-wrapper">
    <header class="header">
      <div class="container">
        <div class="header-container">
          <div class="logo">
            <NuxtLink to="/">
              <img src="/img/logo.png" alt="Safe Street Logo" />
            </NuxtLink>
          </div>
          <div class="nav-container">
            <nav class="main-nav">
              <ul id="menu" class="menu">
                <li class="menu-item"><NuxtLink to="/" class="menu-link">SafeStreet</NuxtLink></li>
                <li class="menu-item" v-if="isLoggedIn"><NuxtLink to="/map" class="menu-link">Mapa</NuxtLink></li>
                <li class="menu-item" v-if="isLoggedIn && role === 'admin'"><NuxtLink to="/riskareas" class="menu-link">Área de Risco</NuxtLink></li>
                <li class="menu-item"><NuxtLink to="/tutorial" class="menu-link">Tutorial</NuxtLink></li>
                <li class="menu-item"><NuxtLink to="/sobre" class="menu-link">Sobre</NuxtLink></li>
                <li class="menu-item" v-if="role === 'admin'">
                  <NuxtLink to="/map" class="menu-link">Admin</NuxtLink>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Botões agrupados -->
          <div class="btn-group">
            <button
              id="toggle-dark"
              class="btn-header"
              title="Alternar modo escuro"
              type="button"
              @click="toggleDarkMode"
            >
              <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </button>

            <button
              v-if="isLoggedIn"
              @click="logout"
              class="btn-header btn-logout"
              title="Sair"
            >
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>

            <NuxtLink
              v-else
              to="/login"
              class="btn-header btn-login"
              title="Login"
            >
              <i class="fas fa-sign-in-alt"></i> Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <NuxtPage />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="copyright">
            <p>© 2025 Safe Street. Todos os direitos reservados.</p>
          </div>
          <div class="social-links">
            <a href="https://github.com/SafeStreetTCC" aria-label="Github" target="_blank" rel="noopener" class="social-link">
              <i class="fab fa-github social-icon"></i>
            </a>
            <a href="mailto:contatosafestreet@gmail.com" aria-label="Email" class="social-link">
              <i class="fas fa-envelope social-icon"></i>
            </a>
            <a href="https://www.instagram.com/safe_street_/" aria-label="Instagram" target="_blank" rel="noopener" class="social-link">
              <i class="fab fa-instagram social-icon"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f4f8;
  color: #1f2937;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  background: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #cbd5e1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo img {
  height: 40px;
  cursor: pointer;
}

.nav-container {
  flex: 1;
  margin-left: 24px;
}

.main-nav {
  display: flex;
}

.menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 16px;
  align-items: center;
}

.menu-link {
  color: #334155;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.menu-link:hover {
  background: #cbd5e1;
}

/* Botões agrupados */
.btn-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-header {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn-header i {
  font-size: 1rem;
}

.btn-header:hover {
  transform: translateY(-1px);
}

.btn-logout {
  background-color: #f4dada;
  color: #4b4b4b;
  border: 1px solid #e7bcbc;
}

.btn-logout:hover {
  background-color: #f9e3e3;
}

.btn-login {
  background-color: #d3eafc;
  color: #1e3a8a;
  border: 1px solid #a7d0f5;
}

.btn-login:hover {
  background-color: #e1f3ff;
}

#toggle-dark {
  background-color: #cbd5e1;
  color: #334155;
  border: 1px solid #94a3b8;
}

#toggle-dark:hover {
  background-color: #94a3b8;
  color: #fff;
}

.main {
  flex: 1;
  background-color: #f8fafc;
}

.footer {
  background: #e2e8f0;
  padding: 20px 24px;
  border-top: 1px solid #cbd5e1;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  color: #334155;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #334155;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.social-link:hover {
  color: #1f2937;
}

.copyright {
  color: #334155;
  font-size: 1.0rem;
}
</style>
