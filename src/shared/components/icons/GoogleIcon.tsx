import googleLogoSrc from '@/assets/social-google.png'
import { cn } from '@/shared/utils/cn'

interface GoogleIconProps {
  /** 접근성 이름 (기본 '' — 아이콘 슬롯이 이미 aria-hidden) */
  alt?: string
  /** 병합할 클래스 (기본 size-6 = Figma 24px) */
  className?: string
}

/**
 * Google 로고 배지 (PNG). Figma 원본이 마스크 합성이라 벡터로 옮길 수 없어
 * 24px 배지를 4배 래스터로 export해 쓴다.
 */
export function GoogleIcon({ alt = '', className }: GoogleIconProps) {
  return (
    <img src={googleLogoSrc} alt={alt} className={cn('size-6', className)} />
  )
}
