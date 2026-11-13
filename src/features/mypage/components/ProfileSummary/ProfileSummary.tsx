import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { ArrowIcon, LogoutIcon } from '@/shared/components/icons'

interface ProfileSummaryProps {
  readonly name: string
  readonly email: string
  readonly career: string
  readonly majors: string
  readonly onLogout: () => void
  /** 로그아웃 요청 중에는 두 번 누르지 않게 막는다 */
  readonly isLoggingOut?: boolean
}

/* 경력·전공 알약. Figma 659:3988 — 높이 40, 좌우 여백 20, radius 6, container 배경
   전공이 길어 한 줄을 넘으면 알약 안에서 줄을 바꾼다. 높이는 최소 40 */
const PILL =
  'flex min-h-10 max-w-full items-center gap-2 rounded-sm bg-container px-5 py-2'

/**
 * 프로필 머리말 — 이름·이메일·로그아웃과 경력·전공 요약
 *
 * @param props.career 경력 표기 (예: `1~2년 차 (주니어)`)
 * @param props.majors 쉼표로 이어 붙인 전공 이름
 * @returns 마이페이지 상단 블록
 */
export function ProfileSummary({
  name,
  email,
  career,
  majors,
  onLogout,
  isLoggingOut = false,
}: ProfileSummaryProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h2 font-semibold text-gray-1000">{name}</h1>
          <p className="text-body-md text-gray-300">{email}</p>
        </div>

        {/* Figma `버튼-라운드`(659:4894) — 공용 Button과 모양이 달라 따로 그린다 */}
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 rounded-full bg-container px-5 py-2.5 text-body-md text-gray-400 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:cursor-wait"
        >
          <LogoutIcon className="size-6 shrink-0" />
          로그아웃
        </button>
      </div>

      {/* 모바일은 한 줄에 다 안 들어가 알약을 다음 줄로 넘긴다. 화살표는 첫 줄 오른쪽 끝에 남긴다 */}
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap gap-3">
          <p className={PILL}>
            <span className="shrink-0 text-body-md text-gray-300">경력:</span>
            <span className="text-body-md font-semibold text-gray-400">
              {career}
            </span>
          </p>
          <p className={PILL}>
            <span className="shrink-0 text-body-md text-gray-300">전공:</span>
            <span className="text-body-md font-semibold text-gray-400">
              {majors}
            </span>
          </p>
        </div>

        <Link
          to={ROUTES.myMajorEdit}
          aria-label="전공·경력 수정"
          className="mt-2 flex size-6 shrink-0 items-center justify-center text-gray-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ArrowIcon className="size-6 rotate-180" />
        </Link>
      </div>
    </section>
  )
}
