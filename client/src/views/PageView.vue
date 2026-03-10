<template>
  <div class="page">
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <article v-else-if="page">
      <h1>{{ page.title }}</h1>
      <div class="page-content">{{ page.content }}</div>
    </article>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiUrl } from '../config/api'

const route = useRoute()
const page = ref(null)
const loading = ref(true)
const error = ref(null)

async function fetchPage(slug) {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(apiUrl(`/api/pages/${slug}`))
    if (!res.ok) throw new Error('페이지를 찾을 수 없습니다.')
    page.value = await res.json()
  } catch (e) {
    error.value = e.message
    page.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, (slug) => slug && fetchPage(slug))
onMounted(() => fetchPage(route.params.slug))
</script>

<style scoped>
.page {
  max-width: 720px;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.error {
  color: #f87171;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
}

.page-content {
  white-space: pre-wrap;
  line-height: 1.8;
  color: var(--text-muted);
}
</style>
