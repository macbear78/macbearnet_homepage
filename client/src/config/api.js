/**
 * API 기본 URL (환경 변수 VITE_API_BASE 사용)
 * - 개발: 빈 값 → Vite 프록시(localhost:3000) 사용
 * - 프로덕션: https://api.macbearnet.co.kr
 */
export const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export function apiUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
