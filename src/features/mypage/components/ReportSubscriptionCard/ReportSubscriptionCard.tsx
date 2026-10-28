import { useQuery } from '@tanstack/react-query'
import { majorLabel, majorQueries } from '@/shared/api'
import { Chip } from '@/shared/components/Chip'
import { cn } from '@/shared/utils/cn'
import { InfoCircleIcon } from '@/shared/components/icons'
import { Toggle } from '@/shared/components/Toggle'
import {
  type ReportSubscription,
  subscriptionQueries,
} from '../../api/subscription'
import { SUBSCRIPTION_LABELS } from '../../constants/subscription'
import { useUpdateReportSubscription } from '../../hooks/useUpdateReportSubscription'

/**
 * 리포트 구독 카드. 전체 구독과 분야별 구독은 같이 켤 수 없다
 *
 * 둘 다 끈 상태도 있다 — 구독을 받지 않겠다는 뜻이다.
 * 분야 칩은 분야별 구독일 때만 고를 수 있고, 그 외에는 비활성으로 둔다.
 * 저장 버튼 없이 누를 때마다 저장한다. 전체로 바꿔도 고른 분야는 그대로 보내 기억해 둔다
 *
 * @returns 구독 토글과 분야 칩이 담긴 카드
 */
export function ReportSubscriptionCard() {
  const { data: subscription, isRefetchError } = useQuery(
    subscriptionQueries.detail(),
  )
  const { data: majorList } = useQuery(majorQueries.list())
  const update = useUpdateReportSubscription()

  // TODO: 로딩·에러 화면은 프로필과 같이 따로 정한다. 그 전까지는 응답 전엔 그리지 않는다
  if (!subscription) return null

  const { totalReport, majorReport, majorIds } = subscription
  /* 저장이 실패하면 서버 값을 다시 받아 맞추는데, 그 조회까지 실패하면 저장 안 된 값이 그대로 보인다
     그때만 알린다. 다음 저장이나 조회가 성공하면 사라진다 */
  const unsaved = update.isError && isRefetchError
  /* 화면 값이 아니라 캐시 값에 덮는다. 다시 그려지기 전에 또 눌러도 앞 변경이 남는다 */
  const save = (
    changes: (current: ReportSubscription) => Partial<ReportSubscription>,
  ) => update.mutate((current) => ({ ...current, ...changes(current) }))

  const toggleField = (majorId: number) => {
    /* 분야별 구독이 꺼져 있으면 무시한다. 흐리게 두고 포인터만 막으면 키보드로는
       그대로 눌려서 선택이 바뀐다 */
    if (!majorReport) return

    save((current) => {
      const next = current.majorIds.includes(majorId)
        ? current.majorIds.filter((id) => id !== majorId)
        : [...current.majorIds, majorId]
      // 마지막 분야를 빼면 받을 리포트가 없으니 분야별 구독도 끈다
      return next.length > 0
        ? { majorIds: next }
        : { majorIds: next, majorReport: false }
    })
  }

  return (
    <section className="flex flex-col justify-between rounded-sm bg-container px-8 py-6">
      <div>
        <h2 className="text-body-lg font-semibold text-gray-1000">
          리포트 구독
        </h2>

        <div className="mt-9 flex flex-col gap-11">
          <div className="flex items-center justify-between">
            <span id="subscribe-all" className="text-body-md text-gray-1000">
              전체 리포트 구독
            </span>
            <Toggle
              aria-labelledby="subscribe-all"
              checked={totalReport}
              onChange={(event) => {
                const checked = event.currentTarget.checked
                save(() => ({ totalReport: checked, majorReport: false }))
              }}
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span
                id="subscribe-fields"
                className="text-body-md text-gray-1000"
              >
                분야별 리포트 구독
              </span>
              <Toggle
                aria-labelledby="subscribe-fields"
                checked={majorReport}
                onChange={(event) => {
                  const checked = event.currentTarget.checked
                  save(() => ({ totalReport: false, majorReport: checked }))
                }}
              />
            </div>

            {/* Chip에는 비활성 상태가 없다. 분야별 구독이 꺼져 있으면 흐리게 두고
                입력을 막는다 */}
            <ul
              className={cn(
                'flex flex-wrap gap-3',
                !majorReport && 'pointer-events-none opacity-50',
              )}
            >
              {majorList?.categories.map(({ id, major }) => (
                <li key={id}>
                  <Chip
                    selected={majorIds.includes(id)}
                    aria-disabled={!majorReport}
                    icon={majorIds.includes(id) ? '✓' : undefined}
                    onClick={() => toggleField(id)}
                  >
                    {SUBSCRIPTION_LABELS[major] ?? majorLabel(major)}
                  </Chip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* TODO: 디자인에 없는 상태라 문구·위치는 임시. 디자이너 확인 후 바꾼다 */}
      {unsaved && (
        <p role="alert" className="mt-6 text-body-xs text-error">
          설정을 저장하지 못했어요. 새로고침하면 저장된 설정을 볼 수 있어요
        </p>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-body-xs text-gray-300">
        <InfoCircleIcon className="size-4 shrink-0" />
        구독 중인 리포트는 매주 월요일 아침 9시에 이메일로 발송됩니다
      </p>
    </section>
  )
}
