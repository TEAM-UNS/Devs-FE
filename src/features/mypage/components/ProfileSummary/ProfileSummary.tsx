import { Button } from '@/shared/components/Button'
import { ArrowIcon } from '@/shared/components/icons'

interface ProfileSummaryProps {
  readonly name: string
  readonly email: string
  readonly career: string
  readonly majors: string
  readonly onLogout: () => void
}

/* 경력·전공 알약. Figma 659:3988 — 높이 40, 좌우 여백 20, radius 6, container 배경 */
const PILL = 'flex h-10 items-center gap-2 rounded-sm bg-container px-5'

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
}: ProfileSummaryProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h2 font-semibold text-gray-1000">{name}</h1>
          <p className="text-body-md text-gray-300">{email}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-11 rounded-full px-6"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <p className={PILL}>
          <span className="text-body-md text-gray-300">경력:</span>
          <span className="text-body-md font-semibold text-gray-400">
            {career}
          </span>
        </p>
        <p className={PILL}>
          <span className="text-body-md text-gray-300">전공:</span>
          <span className="text-body-md font-semibold text-gray-400">
            {majors}
          </span>
        </p>

        {/* TODO: 전공·경력 수정 화면이 생기면 연결한다 */}
        <button
          type="button"
          disabled
          aria-label="전공·경력 수정"
          className="ml-auto flex size-6 items-center justify-center text-gray-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ArrowIcon className="size-6 rotate-180" />
        </button>
      </div>
    </section>
  )
}
