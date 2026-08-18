import { create } from 'zustand'
import type { ToastType } from '@/shared/components/Toast'

export interface ToastItem {
  /** 목록 key 겸 제거 대상 식별자 */
  id: number
  /** 상태 종류 — 색·아이콘·접근성 역할을 결정 */
  type: ToastType
  /** 표시할 문구 */
  title: string
}

interface ToastState {
  /** 표시 중인 토스트 목록 (오래된 것이 앞) */
  toasts: ToastItem[]
  /** 토스트를 띄운다 */
  show: (toast: Omit<ToastItem, 'id'>) => void
  /** 토스트를 내린다 */
  dismiss: (id: number) => void
}

/* 같은 문구가 연달아 떠도 각각 다른 항목이어야 해서, 내용이 아닌 증가 카운터로 key를 만든다. */
let nextId = 0

/**
 * 전역 토스트 상태. 어느 화면에서든 `show()`로 띄우고, 표시는
 * `app/App`에 한 번 마운트된 `ToastViewport`가 담당한다(상태와 배선 분리).
 *
 * 비도메인 전역 UI 상태라 `shared/stores`에 둔다 — 인증 화면과 앱 화면이
 * 서로 다른 레이아웃 아래 있어, 공통 조상이 라우터 바깥뿐이다.
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: nextId++ }] })),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
