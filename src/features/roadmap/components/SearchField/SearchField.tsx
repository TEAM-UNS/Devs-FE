import type { ReactNode } from 'react'
import { SearchIcon } from '@/shared/components/icons'

interface SearchFieldProps {
  readonly label: string
  readonly placeholder: string
  readonly value: string
  readonly onChange: (value: string) => void
  /** 검색창 아래 선택 칩 줄 */
  readonly children?: ReactNode
}

/** 단계 상단 검색창 — 기업 스택 비교 검색창과 같은 모양(Figma 520:4545) */
export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  children,
}: SearchFieldProps) {
  return (
    <div className="flex w-[700px] max-w-full shrink-0 flex-col gap-3">
      <label className="flex h-[42px] items-center gap-1 rounded-full bg-element px-5 text-gray-400">
        <SearchIcon className="size-6 shrink-0" />
        <span className="sr-only">{label}</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-body-md text-gray-1000 outline-none placeholder:text-gray-300"
        />
      </label>
      {children}
    </div>
  )
}
