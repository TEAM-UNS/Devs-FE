import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'

interface SidebarDrawerProps {
  /** 열림 여부 */
  open: boolean
  /** 배경 클릭·메뉴 링크 클릭·Esc로 닫힐 때 호출 */
  onClose: () => void
  children: ReactNode
}

// 뒤 배경은 Figma 참고용 프레임(2339:13815) — 검정 45% + 3px 흐림
// 밀고 나오는 움직임은 Figma에 스펙이 없어 앱 모션 토큰(slow 400ms, 들어올 때 감속·나갈 때 가속)을 쓴다
// transition-discrete·starting:은 닫힐 때도 display가 바로 꺼지지 않고 움직임이 끝난 뒤 사라지게 한다
const DIALOG_STYLES = [
  'm-0 h-dvh max-h-none max-w-none bg-transparent p-0',
  'backdrop:bg-black/45 backdrop:backdrop-blur-[3px]',
  '-translate-x-full open:translate-x-0 starting:open:-translate-x-full',
  'transition-[translate,display,overlay] transition-discrete duration-slow ease-accelerate open:ease-decelerate',
  'motion-reduce:transition-none',
].join(' ')

/**
 * 패드·모바일에서 왼쪽에서 밀려 나오는 사이드바.
 * `<dialog>`의 모달 모드라 열려 있는 동안 뒤 화면은 포커스가 닿지 않고, Esc로 닫힌다.
 */
export function SidebarDrawer({ open, onClose, children }: SidebarDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)

  // 열림 상태는 레이아웃이 들고, 실제 모달 열고 닫기는 브라우저 API로만 할 수 있어 맞춰 준다
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // 열린 채 1024px(lg) 이상으로 넓어지면 닫는다. 고정 사이드바가 보여도 모달은 남아 뒤 화면을 계속 막는다
  useEffect(() => {
    if (!open) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      if (desktop.matches) onClose()
    }
    desktop.addEventListener('change', handleChange)
    return () => desktop.removeEventListener('change', handleChange)
  }, [open, onClose])

  // 배경(::backdrop)을 누르면 클릭 대상이 dialog 자신이 된다. 메뉴 링크는 화면을 옮기면서 닫는다
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as Element
    if (target === event.currentTarget || target.closest('a')) onClose()
  }

  // 클릭은 배경 닫기용이다. 키보드는 Esc(dialog 기본)로 닫고, 링크는 Enter도 click으로 들어온다
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-label="주요 메뉴"
      onClose={onClose}
      onClick={handleClick}
      className={DIALOG_STYLES}
    >
      {children}
    </dialog>
  )
}
