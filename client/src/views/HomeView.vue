<template>
  <div class="home">
    <section class="hero">
      <p class="hero-badge">응용소프트웨어 공급업체</p>
      <h1 class="hero-title">맥베어넷 MacBearNet</h1>
      <p class="hero-subtitle">홈페이지 · 웹사이트 · 데스크탑 응용소프트웨어 · 모바일 앱 솔루션 공급</p>
      <router-link to="/page/about" class="btn btn-primary">솔루션 안내</router-link>
    </section>

    <section v-if="homeContent" class="content-section">
      <h2>{{ homeContent.title }}</h2>
      <div class="content-body">{{ homeContent.content }}</div>
    </section>

    <section class="features">
      <h2>공급 솔루션</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">웹</div>
          <h3>홈페이지 솔루션</h3>
          <p>기업 홈페이지 구축용 웹 솔루션 공급</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">SYS</div>
          <h3>웹사이트 솔루션</h3>
          <p>전자상거래·예약·관리시스템 공급</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">PC</div>
          <h3>데스크탑 응용소프트웨어</h3>
          <p>Windows·Mac 업무용 애플리케이션 공급</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">앱</div>
          <h3>모바일 애플리케이션</h3>
          <p>iOS·Android 기업용·컨슈머 앱 공급</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiUrl } from '../config/api'

const homeContent = ref(null)

onMounted(async () => {
  try {
    const res = await fetch(apiUrl('/api/pages/home'))
    if (res.ok) homeContent.value = await res.json()
  } catch {
    homeContent.value = { title: 'MacBearNet', content: '맥베어넷은 응용소프트웨어 공급업체로서 홈페이지, 웹사이트, 데스크탑 응용소프트웨어, 모바일 앱 솔루션을 기업·기관에 공급합니다.' }
  }
})
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #2dd4bf, #0d9488);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: white;
}
.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.content-section {
  margin: 4rem 0;
  padding: 2rem;
  background: var(--bg-light);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.content-section h2 {
  margin-bottom: 1rem;
  color: var(--primary);
}

.content-body {
  white-space: pre-wrap;
  color: var(--text-muted);
}

.features h2 {
  margin-bottom: 2rem;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.2s, transform 0.2s;
}

.feature-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary), #14b8a6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.feature-card p {
  color: var(--text-muted);
  font-size: 0.875rem;
}
</style>
