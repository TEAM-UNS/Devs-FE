import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, generatePath } from 'react-router-dom'
import { buttonClassName } from '@/shared/components/Button'
import { Skeleton } from '@/shared/components/Skeleton'
import { ROUTES } from '@/shared/constants'
import { roadmapQueries } from '../../api/roadmapQueries'
import { useDeleteRoadmap } from '../../hooks/useRoadmapMutations'
import type { RoadmapStatus, RoadmapSummary } from '../../types'
import { isGenerating } from '../../utils/roadmapStatus'
import { DeleteRoadmapModal } from '../DeleteRoadmapModal'

/* TODO: 목록 화면은 디자인에 없다. 기존 토큰(카드·칩·버튼)으로 맞춘 임시 화면 */

// 1열 → 패드 2열 → PC 3열
const GRID = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'

/** 다 만든 로드맵은 상태를 따로 적지 않는다 */
function statusLabel(status: RoadmapStatus): string | null {
  if (isGenerating(status)) return '만드는 중'
  if (status === 'failed') return '만들기 실패'
  return null
}

/** 'YYYY-MM-DD' → 'YYYY.MM.DD' — 리포트 주차와 같은 표기 */
function formatDate(date: string): string {
  return date.replaceAll('-', '.')
}

function roadmapName({ majorName }: RoadmapSummary): string {
  return `${majorName} 로드맵`
}

interface RoadmapCardProps {
  readonly roadmap: RoadmapSummary
  readonly onDelete: () => void
}

/** 로드맵 한 장 — 카드를 누르면 상세, 삭제는 카드 안의 별도 버튼 */
function RoadmapCard({ roadmap, onDelete }: RoadmapCardProps) {
  const label = statusLabel(roadmap.status)

  return (
    <article className="relative flex min-h-40 flex-col justify-between gap-6 rounded-sm bg-container p-6 ring-1 ring-element ring-inset motion-safe:transition-colors hover:bg-element">
      {/* 카드 전체를 누르게 하되 삭제 버튼과 겹치지 않게 덮개 링크를 깐다 (회고 카드와 같은 방식) */}
      <Link
        to={generatePath(ROUTES.roadmapDetail, {
          roadmapId: String(roadmap.roadmapId),
        })}
        aria-label={`${roadmapName(roadmap)} 열기`}
        className="absolute inset-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-primary-500"
      />
      <div className="flex items-start justify-between gap-3">
        {/* 좁은 카드에서 '엔지니어'가 글자 단위로 끊기지 않게 어절로 줄바꿈 */}
        <h2 className="text-body-lg font-semibold break-keep text-white">
          {roadmapName(roadmap)}
        </h2>
        {label && (
          <span className="shrink-0 rounded-full bg-element px-3 py-0.5 text-body-xs text-gray-400">
            {label}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-body-sm text-gray-400">
          {roadmap.targetWeeks}주 · {formatDate(roadmap.date)}
        </p>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`${roadmapName(roadmap)} 삭제`}
          className="relative text-body-sm text-gray-300 underline-offset-2 hover:text-gray-1000 hover:underline focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          삭제
        </button>
      </div>
    </article>
  )
}

/** 내 로드맵 목록 — 여러 개를 가질 수 있고, 여기서 열거나 지운다 */
export function RoadmapList() {
  const roadmaps = useQuery(roadmapQueries.list())
  const remove = useDeleteRoadmap()
  const [deleting, setDeleting] = useState<RoadmapSummary | null>(null)

  return (
    <div className="flex flex-col gap-9">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1 text-white">내 로드맵</h1>
          <p className="text-body-md text-gray-400">
            진행 중인 로드맵을 이어서 하거나 새로 만들 수 있어요.
          </p>
        </div>
        <Link
          to={ROUTES.roadmapNew}
          className={buttonClassName('primary', 'md', 'max-md:w-full')}
        >
          새 로드맵 만들기
        </Link>
      </header>

      {roadmaps.isPending && (
        <div role="status" className={GRID}>
          <span className="sr-only">로드맵 목록을 불러오는 중…</span>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      )}

      {/* 실패는 공통 에러 토스트 */}
      {roadmaps.isSuccess && roadmaps.data.length === 0 && (
        <p className="py-20 text-center text-body-lg text-gray-400">
          아직 만든 로드맵이 없어요
        </p>
      )}

      {roadmaps.isSuccess && roadmaps.data.length > 0 && (
        <ul className={GRID}>
          {roadmaps.data.map((roadmap) => (
            <li key={roadmap.roadmapId}>
              <RoadmapCard
                roadmap={roadmap}
                onDelete={() => setDeleting(roadmap)}
              />
            </li>
          ))}
        </ul>
      )}

      {deleting && (
        <DeleteRoadmapModal
          name={roadmapName(deleting)}
          deleting={remove.isPending}
          onClose={() => setDeleting(null)}
          onConfirm={() =>
            remove.mutate(deleting.roadmapId, {
              onSuccess: () => setDeleting(null),
            })
          }
        />
      )}
    </div>
  )
}
