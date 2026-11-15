import { buttonClassName } from '@/shared/components/Button'
import { PageTitle } from '@/shared/components/PageTitle'
import { DevsLogo, WarningIcon } from '@/shared/components/icons'
import { CONTACT_EMAIL, ROUTES } from '@/shared/constants'

/**
 * 500 페이지 — Figma 662:7195. 화면을 그리다 오류가 나면 라우터가 이 화면으로 바꾼다
 * API 실패는 공통 에러 토스트가 맡아서 여기로 오지 않는다
 * Figma 왼쪽 위 로고는 예전 UNS 이미지라, 404와 같은 Devs 로고를 쓴다
 *
 * @returns 오류 안내와 메인으로 가기·새로고침 버튼
 */
export default function ServerErrorPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-canvas px-5">
      <PageTitle name="일시적인 오류" />
      <DevsLogo className="absolute top-10 left-5 h-6 md:left-10" />

      <main className="flex flex-col items-center gap-18 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center">
            <WarningIcon className="size-9 text-gray-300" />
            <h1 className="text-[64px] leading-[1.2] font-semibold text-white">
              500
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] leading-[1.2] font-bold text-white">
              일시적인 오류가 발생했어요
            </h2>
            <p className="text-body-md text-gray-300">
              서버에 문제가 생겼어요. 잠시 후 다시 시도해주세요
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* 오류 난 화면 상태를 버리고 새로 받도록 페이지째 이동한다 */}
          <a href={ROUTES.home} className={buttonClassName('outline')}>
            메인으로 가기
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={buttonClassName()}
          >
            새로고침
          </button>
        </div>
      </main>

      <p className="absolute bottom-10 text-body-sm text-gray-200">
        계속 문제가 있다면{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-[#63696f] underline"
        >
          고객센터
        </a>
        로 문의해주세요
      </p>
    </div>
  )
}
