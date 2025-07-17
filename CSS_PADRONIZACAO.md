# Padronização CSS - Safe Street

Este documento descreve o sistema de CSS padronizado implementado no projeto Safe Street para garantir consistência visual e facilitar a manutenção do código.

## 🎨 Variáveis CSS Padronizadas

### Cores Principais
```css
--azul-escuro: #003366;
--azul-claro: #7d9ef7;
--dourado: #c9b037;
--dourado-claro: #e6d28c;
--dourado-escuro: #b8860b;
```

### Cores para Formulários
```css
--form-bg: #ffffff;
--form-border: #cbd5e1;
--form-border-focus: #3b82f6;
--form-text: #1f2937;
--form-label: #374151;
--form-placeholder: #9ca3af;
```

### Cores para Estados
```css
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--info: #3b82f6;
```

### Espaçamentos Padronizados
```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 3rem;
```

## 🏗️ Classes de Layout

### Containers de Página
```html
<!-- Para páginas centralizadas (login, register) -->
<div class="page-container full-height">
  <!-- conteúdo -->
</div>

<!-- Para páginas com conteúdo normal -->
<div class="content-container">
  <!-- conteúdo -->
</div>
```

### Container de Formulário
```html
<div class="form-container">
  <h2>Título do Formulário</h2>
  <!-- formulário -->
</div>
```

## 📝 Classes de Formulário

### Estrutura Padrão
```html
<form>
  <div class="form-group">
    <label for="campo">Nome do Campo</label>
    <input id="campo" type="text" class="form-input" placeholder="Placeholder">
  </div>
  
  <button type="submit" class="btn btn-primary btn-full">Enviar</button>
</form>
```

### Classes de Input
- `.form-input` - Estilo padrão para inputs
- `.form-group` - Container para label + input
- `.form-group label` - Estilo automático para labels

## 🔘 Classes de Botão

### Tipos de Botão
```html
<!-- Botão primário (azul escuro) -->
<button class="btn btn-primary">Botão Primário</button>

<!-- Botão secundário (azul claro) -->
<button class="btn btn-secondary">Botão Secundário</button>

<!-- Botão de destaque (dourado) -->
<button class="btn btn-accent">Botão de Destaque</button>

<!-- Botão outline -->
<button class="btn btn-outline">Botão Outline</button>
```

### Modificadores de Botão
```html
<!-- Botão de largura total -->
<button class="btn btn-primary btn-full">Botão Completo</button>

<!-- Botão grande -->
<button class="btn btn-primary btn-lg">Botão Grande</button>

<!-- Botão pequeno -->
<button class="btn btn-primary btn-sm">Botão Pequeno</button>
```

## 🚨 Classes de Mensagem

### Alerts
```html
<!-- Sucesso -->
<div class="alert success">Operação realizada com sucesso!</div>

<!-- Erro -->
<div class="alert error">Ocorreu um erro!</div>

<!-- Aviso -->
<div class="alert warning">Atenção!</div>

<!-- Informação -->
<div class="alert info">Informação importante</div>
```

### Mensagens de Erro/Sucesso
```html
<p class="error-msg">Mensagem de erro</p>
<p class="success-msg">Mensagem de sucesso</p>
```

## 🔗 Classes de Link

```html
<!-- Link padrão -->
<a href="#" class="link">Link Padrão</a>

<!-- Link com cor de destaque -->
<a href="#" class="link-accent">Link Dourado</a>
```

## 🃏 Classes de Card

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título do Card</h3>
    <p class="card-subtitle">Subtítulo</p>
  </div>
  <p>Conteúdo do card</p>
</div>
```

## 🛠️ Classes Utilitárias

### Alinhamento de Texto
```html
<div class="text-center">Texto centralizado</div>
<div class="text-left">Texto à esquerda</div>
<div class="text-right">Texto à direita</div>
```

### Espaçamentos
```html
<!-- Margin Bottom -->
<div class="mb-0">Sem margin-bottom</div>
<div class="mb-1">margin-bottom: 0.25rem</div>
<div class="mb-2">margin-bottom: 0.5rem</div>
<div class="mb-3">margin-bottom: 1rem</div>
<div class="mb-4">margin-bottom: 1.5rem</div>
<div class="mb-5">margin-bottom: 2rem</div>
<div class="mb-6">margin-bottom: 3rem</div>

<!-- Margin Top -->
<div class="mt-0">Sem margin-top</div>
<div class="mt-1">margin-top: 0.25rem</div>
<!-- ... similar ao mb -->

<!-- Padding -->
<div class="p-0">Sem padding</div>
<div class="p-1">padding: 0.25rem</div>
<!-- ... similar ao mb -->
```

### Flexbox
```html
<div class="flex">display: flex</div>
<div class="flex-col">flex-direction: column</div>
<div class="items-center">align-items: center</div>
<div class="justify-center">justify-content: center</div>

<!-- Gaps -->
<div class="gap-1">gap: 0.25rem</div>
<div class="gap-2">gap: 0.5rem</div>
<div class="gap-3">gap: 1rem</div>
<div class="gap-4">gap: 1.5rem</div>
```

### Utilitários Gerais
```html
<div class="hidden">display: none</div>
```

## 🌙 Suporte ao Dark Mode

Todas as classes padronizadas têm suporte automático ao dark mode. Para ativar o dark mode, adicione a classe `dark-mode` ao body:

```javascript
document.body.classList.add('dark-mode');
```

## 📋 Exemplo de Página Padronizada

```html
<template>
  <div class="page-container full-height">
    <div class="form-container">
      <h2>Título da Página</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="form-input"
            placeholder="seu@email.com"
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            class="form-input"
            placeholder="••••••••"
            required 
          />
        </div>
        
        <button type="submit" class="btn btn-primary btn-full">
          Enviar
        </button>
        
        <p v-if="error" class="error-msg">{{ error }}</p>
        <p v-if="success" class="success-msg">{{ success }}</p>
      </form>
      
      <div class="text-center mt-4">
        <NuxtLink to="/other-page" class="link">
          Link para outra página
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Não precisa de styles scoped - usa classes globais
</script>
```

## ✅ Vantagens da Padronização

1. **Consistência Visual**: Todas as páginas seguem o mesmo padrão
2. **Manutenção Fácil**: Mudanças globais feitas em um só lugar
3. **Desenvolvimento Rápido**: Reutilização de classes prontas
4. **Dark Mode Automático**: Suporte nativo sem código extra
5. **Responsividade**: Classes otimizadas para diferentes telas
6. **Acessibilidade**: Estrutura semântica e contraste adequado

## 🚫 O que NÃO fazer

1. **Não criar styles scoped** para elementos que já têm classes globais
2. **Não usar cores hardcoded** - sempre usar variáveis CSS
3. **Não duplicar estilos** - verificar se já existe uma classe global
4. **Não quebrar a hierarquia** - manter a estrutura de form-group, etc.

## 🔄 Migração de Páginas Existentes

Para migrar uma página existente:

1. Substitua containers customizados por `.page-container` ou `.content-container`
2. Use `.form-container` para formulários
3. Substitua inputs por `.form-input` dentro de `.form-group`
4. Use classes de botão padronizadas
5. Remova styles scoped desnecessários
6. Teste em dark mode

## 📞 Suporte

Para dúvidas sobre a padronização CSS ou sugestões de melhorias, consulte este documento ou a equipe de desenvolvimento.