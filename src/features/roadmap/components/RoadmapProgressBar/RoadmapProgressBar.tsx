interface RoadmapProgressBarProps {
  /** 0~100 */
  readonly value: number
  readonly label: string
}

/** 보라 그라데이션 진행 막대 + 퍼센트 — 생성 진행률·학습률이 같이 쓴다 (Figma 574:3596) */
export function RoadmapProgressBar({ value, label }: RoadmapProgressBarProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-3 flex-1 overflow-hidden rounded-full border border-gray-200 bg-element"
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-primary-600 to-primary-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <span aria-hidden="true" className="shrink-0">
        <span className="text-h3 text-primary-400">{value}</span>
        <span className="text-body-lg text-white">%</span>
      </span>
    </div>
  )
}
