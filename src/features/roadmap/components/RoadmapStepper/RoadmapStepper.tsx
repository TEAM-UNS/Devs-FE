import { ArrowIcon, CheckIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import { CREATE_STEPS } from '../../constants/create'

interface RoadmapStepperProps {
  /** 지금 단계 (1부터) */
  readonly current: number
}

// 지금 단계는 Figma 그림자1(primary-500 60%, blur 8)로 띄운다
const CURRENT =
  'border-primary-400 bg-primary-400/15 text-white shadow-[0_0_8px_rgba(188,114,244,0.6)]'
const DONE = 'border-gray-200 bg-gray-100 text-gray-300'
const UPCOMING = 'border-gray-200 text-gray-300'

/** 로드맵 생성 단계 표시줄 — Figma 프로그레스(520:4205) */
export function RoadmapStepper({ current }: RoadmapStepperProps) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="로드맵 생성 단계">
      {CREATE_STEPS.map((label, index) => {
        const step = index + 1
        const done = step < current
        const isCurrent = step === current

        return (
          <li key={label} className="flex items-center gap-1.5">
            {index > 0 && (
              <ArrowIcon className="size-6 rotate-180 text-gray-200" />
            )}
            <span
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-body-sm',
                isCurrent ? CURRENT : done ? DONE : UPCOMING,
              )}
            >
              {done ? (
                <CheckIcon className="size-5" />
              ) : (
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full text-body-xs',
                    isCurrent ? 'bg-primary-400' : 'bg-gray-100',
                  )}
                >
                  {step}
                </span>
              )}
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
