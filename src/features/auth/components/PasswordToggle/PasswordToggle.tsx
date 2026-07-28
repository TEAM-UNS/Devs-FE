import { EyeIcon, EyeOffIcon } from '@/shared/components/icons'

interface PasswordToggleProps {
  /** 현재 비밀번호가 보이는 상태인지 */
  shown: boolean
  onToggle: () => void
}

/** 비밀번호 표시/숨김 토글 버튼 (Input trailing 슬롯용, 접근성 라벨 포함). */
export function PasswordToggle({ shown, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? '비밀번호 숨기기' : '비밀번호 표시'}
      aria-pressed={shown}
      className="flex size-full items-center justify-center text-gray-300 transition-colors hover:text-white"
    >
      {shown ? (
        <EyeIcon className="size-full" />
      ) : (
        <EyeOffIcon className="size-full" />
      )}
    </button>
  )
}
