<template>
  <div class="admin">
    <div class="admin-header">
      <h1>방문자 통계</h1>
      <button type="button" class="btn-logout" @click="handleLogout">로그아웃</button>
    </div>

    <div v-if="needsLogin" class="error">로그인이 필요합니다. <router-link to="/">홈으로</router-link></div>
    <div v-else-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <section class="stats-cards">
        <div class="stat-card">
          <span class="stat-label">총 방문 수</span>
          <span class="stat-value">{{ stats.total.toLocaleString() }}</span>
        </div>
      </section>

      <section class="section">
        <h2>일별 방문 추이 (최근 30일)</h2>
        <div class="by-day-table-wrap">
          <table class="stats-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>방문 수</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in stats.byDay" :key="row.date">
                <td>{{ row.date }}</td>
                <td>{{ row.count.toLocaleString() }}</td>
              </tr>
              <tr v-if="stats.byDay.length === 0">
                <td colspan="2">데이터가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section">
        <h2>최근 방문 기록 (최대 100건)</h2>
        <div class="recent-table-wrap">
          <table class="stats-table">
            <thead>
              <tr>
                <th>순번</th>
                <th>방문 시각</th>
                <th>IP</th>
                <th>User-Agent</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in stats.recent" :key="row.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ formatDateTime(row.visited_at) }}</td>
                <td>{{ row.ip || '-' }}</td>
                <td class="ua">{{ (row.user_agent || '-').substring(0, 60) }}{{ (row.user_agent || '').length > 60 ? '...' : '' }}</td>
              </tr>
              <tr v-if="stats.recent.length === 0">
                <td colspan="4">방문 기록이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl } from '../config/api'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const auth = useAuth()
const loading = ref(true)
const error = ref(null)
const needsLogin = ref(false)
const stats = ref({
  total: 0,
  byDay: [],
  recent: []
})

function formatDateTime(str) {
  if (!str) return '-'
  const d = new Date(str)
  return d.toLocaleString('ko-KR')
}

function handleLogout() {
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  const token = auth.getToken()
  if (!token) {
    needsLogin.value = true
    loading.value = false
    return
  }
  try {
    const res = await fetch(apiUrl('/api/visitors/stats'), {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.status === 401) {
      auth.logout()
      needsLogin.value = true
    } else if (!res.ok) {
      throw new Error('통계를 불러올 수 없습니다.')
    } else {
      stats.value = await res.json()
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin {
  max-width: 900px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.admin-header h1 {
  margin: 0;
  color: var(--primary);
}

.btn-logout {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-logout:hover {
  border-color: #f87171;
  color: #f87171;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.error {
  color: #f87171;
}

.stats-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem 2rem;
  min-width: 180px;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.by-day-table-wrap, .recent-table-wrap {
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-light);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border);
}

.stats-table th,
.stats-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.stats-table th {
  background: var(--bg);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.875rem;
}

.stats-table td {
  color: var(--text);
}

.stats-table tr:last-child td {
  border-bottom: none;
}

.stats-table .ua {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
