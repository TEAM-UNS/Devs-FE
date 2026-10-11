import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Toast, type ToastType } from '@/shared/components/Toast'
import { CheckCircleIcon, XCircleIcon } from '@/shared/components/icons'
import { useToastStore, type ToastItem } from '@/shared/stores/useToastStore'

// 노출 시간 — Figma에 스펙이 없어 읽을 만큼만 둔다.
const TOAST_DURATION = 3000
// 퇴장 애니메이션 길이 — index.css의 toast-out과 같아야 한다
const TOAST_EXIT_DURATION = 200

// 배치 — Figma는 화면 상단 36px 중앙에 pill(sm)로 띄운다.
const VIEWPORT =
  'fixed inset-x-0 top-9 z-toast flex flex-col items-center gap-2 px-4'

// 상태별 아이콘. warning·info는 Figma에 대응 아이콘이 없어 비워 둔다.
const ICONS: Partial<Record<ToastType, ReactNode>> = {
  success: <CheckCircleIcon className="size-full" />,
  error: <XCircleIcon className="size-full" />,
}

interface ToastRowProps {
  /** 표시할 토스트 */
  item: ToastItem
}

/** 토스트 한 장 — 자기 수명(등장·자동 사라짐)만 관리한다. */
function ToastRow({ item }: ToastRowProps) {
  const dismiss = useToastStore((state) => state.dismiss)
  // 바로 지우면 퇴장 애니메이션을 그릴 틈이 없어서, 먼저 사라지는 중으로 바꾸고 끝난 뒤 지운다
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!leaving) return
    /* animationend 대신 시간으로 지운다. 동작 줄이기 설정이면 애니메이션이 돌지 않아
       그 신호가 오지 않고, 토스트가 영영 남는다 */
    const timer = setTimeout(() => dismiss(item.id), TOAST_EXIT_DURATION)
    return () => clearTimeout(timer)
  }, [leaving, dismiss, item.id])

  return (
    <Toast
      className={
        leaving
          ? 'motion-safe:animate-toast-out'
          : 'motion-safe:animate-toast-in'
      }
      type={item.type}
      size="sm"
      title={item.title}
      icon={ICONS[item.type]}
    />
  )
}

/**
 * 전역 토스트 표시 영역. 앱에 한 번만 마운트한다.
 * 인증 화면과 앱 화면이 레이아웃을 공유하지 않아 라우터 바깥(App)에 둔다.
 *
 * @returns 화면 상단 중앙에 쌓이는 토스트 목록
 */
export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)

  if (toasts.length === 0) return null

  return (
    <div className={VIEWPORT}>
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </div>
  )
}
