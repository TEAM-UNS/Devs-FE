import unsLogoSrc from '@/assets/uns-logo.png'
import { cn } from '@/shared/utils/cn'

interface UNSLogoProps {
  /** 접근성 이름 (기본 'UNS') */
  alt?: string
  /** 병합할 클래스 (기본 h-5 = Figma 20px) */
  className?: string
}

/** UNS 워드마크 로고 (PNG). */
export function UNSLogo({ alt = 'UNS', className }: UNSLogoProps) {
  return (
    <img src={unsLogoSrc} alt={alt} className={cn('h-5 w-auto', className)} />
  )
}
