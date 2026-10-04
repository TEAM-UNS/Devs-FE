import { Button } from '@/shared/components/Button'
import { GithubIcon, GoogleIcon } from '@/shared/components/icons'

/* 핸들러를 필수로 둔다. optional이던 동안 `<SocialLoginButtons />`가 타입 검사를
   통과해서, 아무 일도 하지 않는 버튼이 로그인 화면에 그대로 놓여 있었다. */
interface SocialLoginButtonsProps {
  onGoogleClick: () => void
  onGithubClick: () => void
}

// 아이콘은 모듈 스코프에 한 번만 생성해 재사용 (react-perf).
const GOOGLE_ICON = <GoogleIcon className="size-full" />
const GITHUB_ICON = <GithubIcon className="size-full" />

/** 소셜 간편 로그인 버튼(Google·GitHub) — 로그인/회원가입 공용. */
export function SocialLoginButtons({
  onGoogleClick,
  onGithubClick,
}: SocialLoginButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        startIcon={GOOGLE_ICON}
        onClick={onGoogleClick}
        className="w-full"
      >
        Google로 로그인
      </Button>
      <Button
        type="button"
        variant="outline"
        startIcon={GITHUB_ICON}
        onClick={onGithubClick}
        className="w-full"
      >
        Github로 로그인
      </Button>
    </div>
  )
}
