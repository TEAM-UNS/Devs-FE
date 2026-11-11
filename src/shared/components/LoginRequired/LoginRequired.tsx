import { Link, useLocation } from 'react-router-dom'
import { trackEvent } from '@/shared/analytics'
import { buttonClassName } from '@/shared/components/Button'
import { PageTitle } from '@/shared/components/PageTitle'
import { ROUTES } from '@/shared/constants'

interface LoginRequiredProps {
  /** 탭 제목에 쓸 페이지 이름 */
  readonly title: string
  /** 큰 제목 위 한 줄 안내 */
  readonly message: string
  /** 흐리게 깔 페이지 화면 이미지 */
  readonly background: string
}

/**
 * 비로그인으로 로그인이 필요한 화면에 들어왔을 때 — Figma 로그인 전(2166:9236)
 * 실제 페이지를 그리면 API가 전부 401이라 Figma 화면 이미지를 흐리게 깔고 그 위에 안내를 띄운다
 * 로그인하면 지금 보던 화면으로 돌아온다
 */
export function LoginRequired({
  title,
  message,
  background,
}: LoginRequiredProps) {
  const location = useLocation()

  return (
    /* 배경이 main 끝까지 깔리게 main의 안쪽 여백(p-page)만큼 밖으로 넓힌다 */
    <div className="relative -m-page flex h-[calc(100%+var(--page-pt)+var(--page-pb))] items-center justify-center overflow-hidden">
      <PageTitle name={title} />
      <img
        src={background}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover object-top"
      />
      {/* Figma Rectangle 11 — 배경 흐림 6(CSS 3px) + 검정 45% */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" />

      <div className="relative flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col gap-2">
          <p className="text-body-lg font-semibold text-gray-600">{message}</p>
          <h2 className="text-h1 text-white">
            지금 로그인하고, DEVS의 모든 기능을 확인해보세요!
          </h2>
        </div>
        <Link
          to={ROUTES.login}
          state={{ from: location.pathname + location.search }}
          // 로그인 없이 둘러보다 가입으로 넘어오는 흐름을 본다. 경로에 식별자가 없어 그대로 보낸다
          onClick={() =>
            trackEvent('Login Required CTA Clicked', {
              page_path: location.pathname,
            })
          }
          className={buttonClassName()}
        >
          Devs 시작하기
        </Link>
      </div>
    </div>
  )
}
