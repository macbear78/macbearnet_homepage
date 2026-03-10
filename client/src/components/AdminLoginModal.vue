<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="onClose">
        <div class="modal">
          <div class="modal-header">
            <h2>관리자 로그인</h2>
            <button class="close-btn" @click="onClose" aria-label="닫기">×</button>
          </div>
          <form class="modal-body" @submit.prevent="handleSubmit">
            <p v-if="error" class="error-msg">{{ error }}</p>
            <div class="form-group">
              <label for="username">아이디</label>
              <input id="username" v-model="username" type="text" autocomplete="username" required />
            </div>
            <div class="form-group">
              <label for="password">비밀번호</label>
              <input id="password" v-model="password" type="password" autocomplete="current-password" required />
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-ghost" @click="onClose">취소</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">로그인</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'success'])

const { login } = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

watch(() => props.show, (v) => {
  if (v) {
    error.value = ''
    username.value = ''
    password.value = ''
  }
})

function onClose() {
  emit('close')
}

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const result = await login(username.value, password.value)
    if (result.success) {
      emit('success')
      onClose()
    } else {
      error.value = result.error || '로그인에 실패했습니다.'
    }
  } catch {
    error.value = '로그인 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  min-width: 320px;
  max-width: 400px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
.close-btn:hover {
  color: var(--text);
}

.modal-body {
  padding: 1.5rem;
}

.error-msg {
  color: #f87171;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  color: var(--text);
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}
.btn-ghost:hover {
  color: var(--text);
}

.btn-primary {
  background: var(--primary);
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95);
}
</style>
