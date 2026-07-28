import { cn } from '@/shared/utils/cn'

interface StepperProps {
  total: number
  /** 현재 단계 (1-based) */
  current: number
}

/** 위저드 진행 표시(dots) — 현재 단계를 primary로 강조. */
export function Stepper({ total, current }: StepperProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`${total}단계 중 ${current}단계`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'size-2 rounded-full transition-colors duration-fast ease-standard',
            i + 1 === current ? 'bg-primary-500' : 'bg-gray-200',
          )}
        />
      ))}
    </div>
  )
}
