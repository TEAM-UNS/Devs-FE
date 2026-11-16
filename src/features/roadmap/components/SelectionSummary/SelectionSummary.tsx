import { Fragment } from 'react'
import { Chip } from '@/shared/components/Chip'

interface SelectionSummaryProps {
  /** 칩 묶음. 묶음 사이에 세로 구분선이 들어간다 */
  readonly groups: readonly (readonly string[])[]
}

/**
 * 지금까지 고른 직무·스택 요약 — Figma 선택 요약(568:4994)
 * 모바일은 칩이 상자를 넘쳐서(Figma 2342:20819) 줄을 바꾸지 않고 가로로 밀어 본다
 */
export function SelectionSummary({ groups }: SelectionSummaryProps) {
  return (
    <div className="flex w-full max-w-full items-center gap-[21px] md:w-auto md:justify-center border-y border-dashed border-gray-200 px-12 py-3">
      <span className="shrink-0 text-body-lg font-semibold text-white">
        선택 요약:
      </span>
      <div className="scrollbar-slim flex min-w-0 items-center gap-4 max-md:overflow-x-auto md:flex-wrap">
        {groups.map((group, index) => (
          <Fragment key={group.join()}>
            {index > 0 && (
              <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
            )}
            <ul className="flex gap-2 md:flex-wrap">
              {group.map((name) => (
                <li key={name} className="shrink-0">
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
