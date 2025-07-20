<script setup>
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Safe Street - Navegação Segura',
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
const mobileMenuOpen = ref(false)
const isLoggingOut = ref(false)

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark-mode', darkMode.value)
  localStorage.setItem('darkMode', darkMode.value.toString())
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Prevent body scroll when menu is open
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

async function handleLogout() {
  isLoggingOut.value = true
  closeMobileMenu()
  try {
    await logout()
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(() => {
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  if (darkMode.value) document.body.classList.add('dark-mode')
  
  // Close mobile menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu()
    }
  })

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  })
})
</script>

<template>
  <div class="layout-wrapper">
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="mobileMenuOpen" 
      class="mobile-overlay" 
      @click="closeMobileMenu"
    ></div>

    <header class="header">
      <div class="container">
        <div class="header-container">
          <!-- Logo -->
          <div class="logo">
            <NuxtLink to="/" @click="closeMobileMenu">
              <img src="/img/logo.png" alt="Safe Street Logo" />
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="desktop-nav">
            <ul class="menu">
              <li class="menu-item">
                <NuxtLink to="/" class="menu-link">SafeStreet</NuxtLink>
              </li>
              <li class="menu-item" v-if="isLoggedIn">
                <NuxtLink to="/map" class="menu-link">Mapa</NuxtLink>
              </li>
              <li class="menu-item" v-if="isLoggedIn && role === 'admin'">
                <NuxtLink to="/riskareas" class="menu-link">Área de Risco</NuxtLink>
              </li>
              <li class="menu-item">
                <NuxtLink to="/tutorial" class="menu-link">Tutorial</NuxtLink>
              </li>
              <li class="menu-item">
                <NuxtLink to="/sobre" class="menu-link">Sobre</NuxtLink>
              </li>
              <li class="menu-item" v-if="role === 'admin'">
                <NuxtLink to="/admin" class="menu-link">Admin</NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Desktop Actions -->
          <div class="desktop-actions">
            <button
              class="btn-header btn-theme"
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
              <i class="fas fa-sign-out-alt"></i>
              <span class="btn-text">Logout</span>
            </button>

            <NuxtLink
              v-else
              to="/login"
              class="btn-header btn-login"
              title="Login"
            >
              <i class="fas fa-sign-in-alt"></i>
              <span class="btn-text">Login</span>
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            class="mobile-menu-btn"
            @click="toggleMobileMenu"
            :class="{ active: mobileMenuOpen }"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" :class="{ active: mobileMenuOpen }">
      <div class="mobile-nav-header">
        <div class="mobile-logo">
          <img src="/img/logo.png" alt="Safe Street Logo" />
          <span>Safe Street</span>
        </div>
        <button class="mobile-close-btn" @click="closeMobileMenu">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <ul class="mobile-menu">
        <li class="mobile-menu-item">
          <NuxtLink to="/" class="mobile-menu-link" @click="closeMobileMenu">
            <i class="fas fa-home"></i>
            <span>SafeStreet</span>
          </NuxtLink>
        </li>
        <li class="mobile-menu-item" v-if="isLoggedIn">
          <NuxtLink to="/map" class="mobile-menu-link" @click="closeMobileMenu">
            <i class="fas fa-map-marked-alt"></i>
            <span>Mapa</span>
          </NuxtLink>
        </li>
        <li class="mobile-menu-item" v-if="isLoggedIn && role === 'admin'">
          <NuxtLink to="/riskareas" class="mobile-menu-link" @click="closeMobileMenu">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Área de Risco</span>
          </NuxtLink>
        </li>
        <li class="mobile-menu-item">
          <NuxtLink to="/tutorial" class="mobile-menu-link" @click="closeMobileMenu">
            <i class="fas fa-graduation-cap"></i>
            <span>Tutorial</span>
          </NuxtLink>
        </li>
        <li class="mobile-menu-item">
          <NuxtLink to="/sobre" class="mobile-menu-link" @click="closeMobileMenu">
            <i class="fas fa-info-circle"></i>
            <span>Sobre</span>
          </NuxtLink>
        </li>
        <li class="mobile-menu-item" v-if="role === 'admin'">
          <NuxtLink to="/admin" class="mobile-menu-link" @click="closeMobileMenu">
            <i class="fas fa-cog"></i>
            <span>Admin</span>
          </NuxtLink>
        </li>
      </ul>

      <div class="mobile-actions">
        <button
          class="mobile-action-btn"
          @click="toggleDarkMode"
        >
          <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          <span>{{ darkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </button>

        <button
          v-if="isLoggedIn"
          @click="handleLogout"
          class="mobile-action-btn logout"
          :disabled="isLoggingOut"
        >
          <i v-if="isLoggingOut" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-sign-out-alt"></i>
          <span>{{ isLoggingOut ? 'Saindo...' : 'Logout' }}</span>
        </button>

        <NuxtLink
          v-else
          to="/login"
          class="mobile-action-btn login"
          @click="closeMobileMenu"
          :class="{ 'disabled': isLoggingOut }"
        >
          <i class="fas fa-sign-in-alt"></i>
          <span>Login</span>
        </NuxtLink>
      </div>
    </nav>

    <main class="main">
      <NuxtPage />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="/img/logo.png" alt="Safe Street Logo" />
              <span>Safe Street</span>
            </div>
            <p class="footer-description">
              Navegação urbana mais segura para todos.
            </p>
          </div>
          
          <div class="footer-section">
            <h4>Links Rápidos</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/">Home</NuxtLink></li>
              <li><NuxtLink to="/tutorial">Tutorial</NuxtLink></li>
              <li><NuxtLink to="/sobre">Sobre</NuxtLink></li>
              <li v-if="isLoggedIn"><NuxtLink to="/map">Mapa</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Contato</h4>
            <div class="social-links">
              <a href="https://github.com/SafeStreetTCC" aria-label="Github" target="_blank" rel="noopener" class="social-link">
                <i class="fab fa-github"></i>
              </a>
              <a href="mailto:contatosafestreet@gmail.com" aria-label="Email" class="social-link">
                <i class="fas fa-envelope"></i>
              </a>
              <a href="https://www.instagram.com/safe_street_/" aria-label="Instagram" target="_blank" rel="noopener" class="social-link">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Safe Street. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Layout Base */
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  color: #1f2937;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

/* Header Styles */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  z-index: 101;
}

.logo img {
  height: 40px;
  width: auto;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 2rem;
}

.menu {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 2rem;
  align-items: center;
}

.menu-item {
  position: relative;
}

.menu-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.menu-link:hover {
  color: #3b82f6;
}

.menu-link.router-link-active {
  color: #3b82f6;
}

.menu-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
  border-radius: 1px;
}

/* Desktop Actions */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-header {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-header:hover {
  transform: translateY(-1px);
}

.btn-theme {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-theme:hover {
  background: #e5e7eb;
}

.btn-logout {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-logout:hover {
  background: #fee2e2;
}

.btn-login {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
}

.btn-login:hover {
  background: #dbeafe;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
}

.mobile-menu-btn span {
  width: 30px;
  height: 3px;
  background: #374151;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: 1px;
}

.mobile-menu-btn.active span:first-child {
  transform: rotate(45deg);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.mobile-menu-btn.active span:third-child {
  transform: rotate(-45deg);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
  backdrop-filter: blur(2px);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 85%;
  max-width: 320px;
  height: 100vh;
  background: white;
  z-index: 99;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-nav.active {
  right: 0;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-logo img {
  height: 32px;
}

.mobile-logo span {
  font-weight: 600;
  color: #374151;
}

.mobile-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.mobile-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Mobile Menu Items */
.mobile-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu-item {
  border-bottom: 1px solid #f3f4f6;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.mobile-menu-link:hover {
  background: #f9fafb;
  color: #3b82f6;
}

.mobile-menu-link.router-link-active {
  background: #eff6ff;
  color: #3b82f6;
  border-right: 3px solid #3b82f6;
}

.mobile-menu-link i {
  width: 20px;
  text-align: center;
  color: #6b7280;
}

.mobile-menu-link:hover i,
.mobile-menu-link.router-link-active i {
  color: #3b82f6;
}

/* Mobile Actions */
.mobile-actions {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}

.mobile-action-btn:hover,
.mobile-action-btn:active {
  background: #f3f4f6;
  transform: translateY(1px);
}

.mobile-action-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.mobile-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.mobile-action-btn:disabled:hover,
.mobile-action-btn:disabled:active {
  background: white;
  transform: none;
}

.mobile-action-btn.logout {
  color: #dc2626;
  border-color: #fecaca;
}

.mobile-action-btn.logout:hover,
.mobile-action-btn.logout:active {
  background: #fef2f2;
  border-color: #fca5a5;
}

.mobile-action-btn.login {
  color: #2563eb;
  border-color: #dbeafe;
}

.mobile-action-btn.login:hover,
.mobile-action-btn.login:active {
  background: #eff6ff;
  border-color: #93c5fd;
}

.mobile-action-btn.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Main Content */
.main {
  flex: 1;
  background-color: #f8fafc;
}

/* Footer */
.footer {
  background: #374151;
  color: white;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.footer-section h4 {
  color: #f3f4f6;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo img {
  height: 32px;
}

.footer-logo span {
  font-weight: 600;
  font-size: 1.1rem;
}

.footer-description {
  color: #d1d5db;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid #4b5563;
  padding: 1rem 0;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Dark Mode */
.dark-mode .header {
  background: rgba(31, 41, 55, 0.95);
  border-color: #374151;
}

.dark-mode .menu-link {
  color: #d1d5db;
}

.dark-mode .menu-link:hover,
.dark-mode .menu-link.router-link-active {
  color: #60a5fa;
}

.dark-mode .btn-theme {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark-mode .btn-theme:hover {
  background: #4b5563;
}

.dark-mode .mobile-nav {
  background: #1f2937;
}

.dark-mode .mobile-nav-header {
  background: #111827;
  border-color: #374151;
}

.dark-mode .mobile-logo span,
.dark-mode .mobile-menu-link {
  color: #d1d5db;
}

.dark-mode .mobile-menu-link:hover {
  background: #374151;
  color: #60a5fa;
}

.dark-mode .mobile-menu-link.router-link-active {
  background: #1e3a8a;
  border-color: #60a5fa;
}

.dark-mode .mobile-actions {
  background: #111827;
  border-color: #374151;
}

.dark-mode .mobile-action-btn {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark-mode .mobile-action-btn:hover {
  background: #4b5563;
}

.dark-mode .main {
  background: #111827;
}

/* Responsive Design */
@media (max-width: 768px) {
  .desktop-nav,
  .desktop-actions {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .container {
    padding: 0 0.75rem;
  }

  .header-container {
    height: 60px;
  }

  .logo img {
    height: 36px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem 0;
  }

  .footer-section {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .mobile-nav {
    width: 100%;
    max-width: none;
  }

  .container {
    padding: 0 0.5rem;
  }

  .header-container {
    height: 56px;
  }

  .logo img {
    height: 32px;
  }

  .footer-content {
    padding: 1rem 0;
  }

  .mobile-action-btn {
    padding: 1rem;
    font-size: 1rem;
    min-height: 48px;
  }

  .mobile-action-btn i {
    font-size: 1.1rem;
  }
}

/* Prevent scroll when mobile menu is open */
body.mobile-menu-open {
  overflow: hidden;
}

/* Mobile button press feedback */
@media (hover: none) and (pointer: coarse) {
  .mobile-action-btn:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}
</style>
