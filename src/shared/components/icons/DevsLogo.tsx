import devsLogoSrc from '@/assets/devs-logo.svg'
import { cn } from '@/shared/utils/cn'

interface DevsLogoProps {
  /** 접근성 이름 (기본 'Devs') */
  alt?: string
  /** 병합할 클래스 (기본 h-5 = 사이드바·인증 화면 Figma 20px) */
  className?: string
}

/** Devs 워드마크 로고. SVG라 높이만 정하면 같은 파일로 어느 크기든 쓴다 */
export function DevsLogo({ alt = 'Devs', className }: DevsLogoProps) {
  return (
    <img src={devsLogoSrc} alt={alt} className={cn('h-5 w-auto', className)} />
  )
}
