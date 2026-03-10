import { ref, computed, readonly } from 'vue'
import { apiUrl } from '../config/api'

const TOKEN_KEY = 'admin_token'
const token = ref(localStorage.getItem(TOKEN_KEY) || null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  function setToken(newToken) {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
      token.value = newToken
    } else {
      localStorage.removeItem(TOKEN_KEY)
      token.value = null
    }
  }

  function getToken() {
    return token.value
  }

  function logout() {
    setToken(null)
  }

  async function login(username, password) {
    const res = await fetch(apiUrl('/api/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setToken(data.token)
      return { success: true }
    }
    return { success: false, error: data.error || '로그인에 실패했습니다.' }
  }

  async function verifyToken() {
    const t = getToken()
    if (!t) return false
    try {
      const res = await fetch(apiUrl('/api/admin/verify'), {
        headers: { Authorization: `Bearer ${t}` }
      })
      if (!res.ok) {
        setToken(null)
        return false
      }
      return true
    } catch {
      setToken(null)
      return false
    }
  }

  return {
    isLoggedIn,
    setToken,
    getToken,
    logout,
    login,
    verifyToken,
    tokenRef: readonly(token)
  }
}
