import { Skeleton } from '@/shared/components/Skeleton'

/**
 * 내 로드맵 응답 전 자리 — 다 만든 로드맵(RoadmapDetail)이 가장 흔해서 그 배치를 따른다
 * 학습률 줄 · 제목 · 하루 카드 세 장 (머리줄 + 점선 안쪽 상자)
 */
export function RoadmapDetailSkeleton() {
  return (
    <div className="flex h-full flex-col gap-12">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-24 shrink-0" />
        <Skeleton className="h-3 flex-1 rounded-full" />
      </div>

      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-72 max-w-full" />
        <div className="flex flex-col gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-7 w-20" />
              </div>
              <div className="ml-1.5 border-l border-dashed border-element pl-4">
                <Skeleton className="h-28 bg-container" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
