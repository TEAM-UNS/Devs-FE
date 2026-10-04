import { useState } from 'react'
import { Chip } from '@/shared/components/Chip'
import { cn } from '@/shared/utils/cn'
import { XCircleIcon } from '@/shared/components/icons'
import { Toggle } from '@/shared/components/Toggle'
import { SUBSCRIPTION_FIELDS } from '../../fixtures/mockProfile'
import type { SubscriptionMode } from '../../types'

interface ReportSubscriptionCardProps {
  readonly defaultMode: SubscriptionMode
  readonly defaultFields: string[]
}

/**
 * 리포트 구독 카드. 전체 구독과 분야별 구독은 같이 켤 수 없다
 *
 * 둘 다 끈 상태(`none`)도 있다 — 구독을 받지 않겠다는 뜻이다.
 * 분야 칩은 분야별 구독일 때만 고를 수 있고, 그 외에는 비활성으로 둔다.
 *
 * @param props.defaultMode 처음 구독 방식
 * @param props.defaultFields 처음 선택된 분야
 * @returns 구독 토글과 분야 칩이 담긴 카드
 */
export function ReportSubscriptionCard({
  defaultMode,
  defaultFields,
}: ReportSubscriptionCardProps) {
  // TODO: API 연동 시 서버 값으로 바꾸고 변경을 저장한다
  const [mode, setMode] = useState<SubscriptionMode>(defaultMode)
  const [fields, setFields] = useState<string[]>(defaultFields)

  const isFieldMode = mode === 'fields'

  const toggleField = (field: string) => {
    setFields((current) =>
      current.includes(field)
        ? current.filter((item) => item !== field)
        : [...current, field],
    )
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
              checked={mode === 'all'}
              onChange={(event) =>
                setMode(event.currentTarget.checked ? 'all' : 'none')
              }
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
                checked={isFieldMode}
                onChange={(event) =>
                  setMode(event.currentTarget.checked ? 'fields' : 'none')
                }
              />
            </div>

            {/* Chip에는 비활성 상태가 없다. 분야별 구독이 꺼져 있으면 흐리게 두고
                입력을 막는다 */}
            <ul
              className={cn(
                'flex flex-wrap gap-3',
                !isFieldMode && 'pointer-events-none opacity-50',
              )}
            >
              {SUBSCRIPTION_FIELDS.map((field) => (
                <li key={field}>
                  <Chip
                    selected={fields.includes(field)}
                    aria-disabled={!isFieldMode}
                    icon={fields.includes(field) ? '✓' : undefined}
                    onClick={() => toggleField(field)}
                  >
                    {field}
                  </Chip>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-body-xs text-gray-300">
        <XCircleIcon className="size-4 shrink-0" />
        구독 중인 리포트는 주 1회 이메일로 발송됩니다
      </p>
    </section>
  )
}
