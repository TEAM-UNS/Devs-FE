import { Link } from 'react-router-dom'
import { buttonClassName } from '@/shared/components/Button'
import { PageTitle } from '@/shared/components/PageTitle'
import { DevsLogo, QuestionCircleIcon } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import { useGoBack } from '@/shared/hooks/useGoBack'

/**
 * 404 페이지 — Figma 662:7087. 없는 경로(`*`)로 들어오면 사이드바 없이 전체 화면으로 띄운다
 * Figma 왼쪽 위 로고는 예전 UNS 이미지라, 다른 화면과 같은 Devs 로고를 쓴다
 *
 * @returns 404 안내와 이전 페이지·메인으로 가는 버튼
 */
export default function NotFoundPage() {
  // 주소를 직접 쳐서 들어와 돌아갈 기록이 없으면 메인으로 보낸다
  const goBack = useGoBack(ROUTES.home)

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-canvas px-5">
      <PageTitle name="페이지를 찾을 수 없음" />
      <DevsLogo className="absolute top-10 left-5 h-6 md:left-10" />

      <main className="flex flex-col items-center gap-18 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <QuestionCircleIcon className="size-9 text-gray-300" />
            <h1 className="text-[64px] leading-[1.2] font-semibold text-white">
              404
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] leading-[1.2] font-bold text-white">
              페이지를 찾을 수 없어요
            </h2>
            <p className="text-body-md text-gray-300">
              찾으시는 페이지가 삭제되었거나, 주소가 변경되었을 수 있어요
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={goBack}
            className={buttonClassName('outline')}
          >
            이전 페이지로
          </button>
          <Link to={ROUTES.home} className={buttonClassName()}>
            메인으로 가기
          </Link>
        </div>
      </main>
    </div>
  )
}
