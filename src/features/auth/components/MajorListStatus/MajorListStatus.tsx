import { Button } from '@/shared/components/Button'

const LOADING = '전공 목록을 불러오는 중이에요…'
const FAILED = '전공 목록을 불러오지 못했어요.'

// Figma에 로딩·실패 상태 스펙이 없어 문구 + 재시도 버튼으로 최소로만 표현한다.
const BOX = 'flex flex-col items-center justify-center gap-3 py-10'

interface MajorListStatusProps {
  /** 조회 중이면 안내 문구를 보여준다 */
  pending: boolean
  /** 실패하면 문구와 다시 시도 버튼을 보여준다 */
  failed: boolean
  /** 다시 시도 */
  onRetry: () => void
}

/**
 * 전공 목록(GET /majors)의 로딩·실패 상태. 3·4단계가 같은 목록을 쓰므로 함께 쓴다.
 *
 * 빈 화면만 두면 '선택지가 없는 것'과 '못 불러온 것'을 구분할 수 없어 둘을 나눠 보여준다.
 *
 * @returns 상태 문구 (정상일 때는 null)
 */
export function MajorListStatus({
  pending,
  failed,
  onRetry,
}: MajorListStatusProps) {
  if (pending) {
    return (
      <div className={BOX}>
        <p className="text-body-md text-gray-300">{LOADING}</p>
      </div>
    )
  }

  if (failed) {
    return (
      <div className={BOX}>
        <p className="text-body-md text-error">{FAILED}</p>
        <Button type="button" variant="outline" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    )
  }

  return null
}
