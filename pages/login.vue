<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <div class="logo">
          <img src="/img/logo.png" alt="Safe Street Logo" />
        </div>
        <h1>Bem-vindo de volta</h1>
        <p>Entre na sua conta para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope input-icon"></i>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="seu@email.com" 
              required 
              :disabled="loading"
              autocomplete="email"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <div class="input-wrapper">
            <i class="fas fa-lock input-icon"></i>
            <input 
              id="password"
              v-model="senha" 
              type="password" 
              placeholder="••••••••" 
              required 
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-sign-in-alt"></i>
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>
      </form>

      <div class="login-footer">
        <p>
          Ainda não tem uma conta?
          <NuxtLink to="/register" class="register-link">Cadastre-se aqui</NuxtLink>
        </p>
        <NuxtLink to="/" class="back-home">
          <i class="fas fa-arrow-left"></i>
          Voltar ao início
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  title: 'Login - Safe Street'
})

const email = ref('')
const senha = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const { login } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    await login(email.value, senha.value)
    router.push('/map') // Redireciona para o mapa
  } catch (err) {
    error.value = 'Email ou senha inválidos. Verifique suas credenciais e tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.login-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  padding: 2.5rem 2rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.logo img {
  height: 60px;
  margin-bottom: 1rem;
}

.login-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.9rem;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f9fafb;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper input:focus + .input-icon {
  color: #3b82f6;
}

.input-wrapper input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.login-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.login-footer {
  padding: 1.5rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid #f3f4f6;
  background: #f9fafb;
}

.login-footer p {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.register-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.back-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.back-home:hover {
  color: #374151;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .login-content {
    background: #1f2937;
  }

  .login-header {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  }

  .login-header h1 {
    color: #f9fafb;
  }

  .login-header p {
    color: #d1d5db;
  }

  .form-group label {
    color: #f3f4f6;
  }

  .input-wrapper input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .input-wrapper input:focus {
    background: #4b5563;
    border-color: #60a5fa;
  }

  .login-footer {
    background: #374151;
    border-color: #4b5563;
  }

  .login-footer p {
    color: #d1d5db;
  }

  .back-home {
    color: #d1d5db;
  }

  .back-home:hover {
    color: #f9fafb;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .login-content {
    max-width: 100%;
    border-radius: 16px;
  }

  .login-header {
    padding: 2rem 1.5rem 1rem;
  }

  .logo img {
    height: 50px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .login-form {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .login-footer {
    padding: 1.25rem 1.5rem 1.75rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0.25rem;
    padding-top: 1rem;
  }

  .login-content {
    border-radius: 12px;
  }

  .login-header {
    padding: 1.5rem 1rem 0.75rem;
  }

  .logo img {
    height: 45px;
  }

  .login-header h1 {
    font-size: 1.375rem;
  }

  .login-header p {
    font-size: 0.875rem;
  }

  .login-form {
    padding: 1.25rem 1rem;
  }

  .input-wrapper input {
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    font-size: 0.9rem;
  }

  .login-btn {
    padding: 0.875rem;
    font-size: 0.95rem;
  }

  .login-footer {
    padding: 1rem;
  }
}

/* Landscape Mobile */
@media (max-height: 600px) and (orientation: landscape) {
  .login-container {
    padding-top: 1rem;
  }

  .login-header {
    padding: 1rem 2rem 0.5rem;
  }

  .logo img {
    height: 40px;
    margin-bottom: 0.5rem;
  }

  .login-header h1 {
    font-size: 1.375rem;
    margin-bottom: 0.25rem;
  }

  .login-form {
    padding: 1rem 2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .login-footer {
    padding: 1rem 2rem;
  }
}
</style>

