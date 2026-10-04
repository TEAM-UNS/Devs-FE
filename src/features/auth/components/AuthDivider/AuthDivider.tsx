interface AuthDividerProps {
  /** 가운데 라벨 */
  label: string
}

/** 인증 화면 공용 구분선 — 양옆 선 사이에 라벨. (Figma: 선 #343a40, 라벨 14px gray-300) */
export function AuthDivider({ label }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-element" />
      <span className="text-body-sm text-gray-300">{label}</span>
      <span className="h-px flex-1 bg-element" />
    </div>
  )
}
