import { Fragment } from 'react'
import { Chip } from '@/shared/components/Chip'

interface SelectionSummaryProps {
  /** 칩 묶음. 묶음 사이에 세로 구분선이 들어간다 */
  readonly groups: readonly (readonly string[])[]
}

/** 지금까지 고른 직무·스택 요약 — Figma 선택 요약(568:4994) */
export function SelectionSummary({ groups }: SelectionSummaryProps) {
  return (
    <div className="flex items-center justify-center gap-[21px] border-y border-dashed border-gray-200 px-12 py-3">
      <span className="shrink-0 text-body-lg font-semibold text-white">
        선택 요약:
      </span>
      <div className="flex flex-wrap items-center gap-4">
        {groups.map((group, index) => (
          <Fragment key={group.join()}>
            {index > 0 && (
              <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
            )}
            <ul className="flex flex-wrap gap-2">
              {group.map((name) => (
                <li key={name}>
                  <Chip icon="#">{name}</Chip>
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
