import { UNSLogo } from '@/shared/components/icons'

interface AuthHeaderProps {
  title: string
}

/** 인증 화면 공용 헤더 — UNS 로고 + 제목. */
export function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <UNSLogo />
      <h1 className="text-h1 text-white">{title}</h1>
    </div>
  )
}
