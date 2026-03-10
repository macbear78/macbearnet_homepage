<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="logo">MacBearNet</router-link>
        <div class="nav-links">
          <router-link v-for="page in pages" :key="page.id" :to="`/page/${page.slug}`" class="nav-link">
            {{ page.title }}
          </router-link>
          <router-link v-if="auth.isLoggedIn" to="/admin" class="nav-link admin-link">관리자</router-link>
          <button
            type="button"
            class="btn-login"
            :class="{ 'btn-login--disabled': auth.isLoggedIn }"
            :disabled="auth.isLoggedIn"
            @click="!auth.isLoggedIn && (showLoginModal = true)"
          >
            관리자 로그인
          </button>
        </div>
      </nav>
    </header>
    <AdminLoginModal
      :show="showLoginModal"
      @close="showLoginModal = false"
      @success="showLoginModal = false"
    />
    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <p>
        &copy; {{ new Date().getFullYear() }} MacBearNet. All rights reserved.
        <button type="button" class="btn-backend-check" :disabled="backendCheck === 'checking'" @click="checkBackend">
          {{ backendCheck === 'checking' ? '확인 중…' : '백엔드 연결 확인' }}
        </button>
        <span v-if="backendCheck === 'ok'" class="backend-status backend-status--ok">연결됨</span>
        <span v-else-if="backendCheck === 'fail'" class="backend-status backend-status--fail">연결 안 됨</span>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { apiUrl } from './config/api'
import { useAuth } from './composables/useAuth'
import { useRoute } from 'vue-router'
import AdminLoginModal from './components/AdminLoginModal.vue'

const route = useRoute()
const auth = useAuth()
const pages = ref([])
const showLoginModal = ref(false)
const backendCheck = ref(null) // null | 'checking' | 'ok' | 'fail'

async function checkBackend() {
  backendCheck.value = 'checking'
  try {
    const res = await fetch(apiUrl('/api/health'))
    backendCheck.value = res.ok ? 'ok' : 'fail'
  } catch {
    backendCheck.value = 'fail'
  }
}

onMounted(async () => {
  try {
    const res = await fetch(apiUrl('/api/pages'))
    pages.value = await res.json()
  } catch {
    pages.value = [
      { id: 1, title: '홈', slug: 'home' },
      { id: 2, title: '회사 소개', slug: 'about' },
      { id: 3, title: '연락처', slug: 'contact' }
    ]
  }

  // URL에 adminLogin 있으면 로그인 모달 표시
  watch(() => route.query.adminLogin, (v) => {
    if (v === '1') showLoginModal.value = true
  }, { immediate: true })

  // 방문 시 카운트 기록 (표시는 관리자 페이지에서만)
  try {
    await fetch(apiUrl('/api/visitors'), { method: 'POST' })
  } catch { /* 무시 */ }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #0d9488;
  --primary-dark: #0f766e;
  --bg: #0f172a;
  --bg-light: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
}

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  line-height: 1.6;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: var(--bg-light);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s;
}
.logo:hover {
  color: #2dd4bf;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover, .nav-link.router-link-active {
  color: var(--primary);
}

.admin-link {
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

.btn-login {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.2s;
}
.btn-login:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}
.btn-login--disabled,
.btn-login:disabled {
  opacity: 0.5;
  cursor: default;
  border-color: transparent;
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  width: 100%;
}

.footer {
  background: var(--bg-light);
  border-top: 1px solid var(--border);
  text-align: center;
  padding: 1.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.footer p {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-backend-check {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 0.25rem;
}
.btn-backend-check:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}
.btn-backend-check:disabled {
  opacity: 0.7;
  cursor: wait;
}

.backend-status {
  font-size: 0.75rem;
  font-weight: 600;
}
.backend-status--ok {
  color: #34d399;
}
.backend-status--fail {
  color: #f87171;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
