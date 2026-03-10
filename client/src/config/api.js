/**
 * API 기본 URL
 * - 개발: Vite 프록시 사용 (빈 값 = 상대 경로)
 * - 프로덕션: S3와 분리된 백엔드 URL (예: https://api.yourdomain.com)
 */
export const API_BASE = import.meta.env.VITE_API_URL || ''

export function apiUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
