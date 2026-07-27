import githubLogoSrc from '@/assets/social-github.png'
import { cn } from '@/shared/utils/cn'

interface GithubIconProps {
  /** 접근성 이름 (기본 '' — 아이콘 슬롯이 이미 aria-hidden) */
  alt?: string
  /** 병합할 클래스 (기본 size-6 = Figma 24px) */
  className?: string
}

/**
 * GitHub 로고 배지 (PNG). Figma 원본이 흰 원 + 마크 합성이라
 * 24px 배지를 4배 래스터로 export해 쓴다.
 */
export function GithubIcon({ alt = '', className }: GithubIconProps) {
  return (
    <img src={githubLogoSrc} alt={alt} className={cn('size-6', className)} />
  )
}
