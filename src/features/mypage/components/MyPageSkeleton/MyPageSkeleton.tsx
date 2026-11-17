import { Skeleton } from '@/shared/components/Skeleton'

/** 설정 카드 하나의 로딩 자리 — 제목은 그대로 두고 내용 세 줄만 블록. 리포트 구독 카드도 혼자 늦게 올 때 쓴다 */
export function SettingCardSkeleton({ title }: { readonly title: string }) {
  return (
    <section className="flex min-h-56 flex-col gap-5 rounded-sm bg-container px-8 py-6">
      <h2 className="text-body-lg font-semibold text-gray-1000">{title}</h2>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </section>
  )
}

/**
 * 내 정보 응답 전 마이페이지 자리 — MyPageOverview와 같은 배치에 블록만 채운다
 * 카드 제목은 데이터와 상관없어 그대로 보이고, 로그아웃 버튼은 데이터와 상관없지만 배치가 흔들리지 않게 같은 크기 블록으로 둔다
 */
export function MyPageSkeleton() {
  return (
    <div
      role="status"
      className="mx-auto flex w-full max-w-[1360px] flex-col gap-9"
    >
      <span className="sr-only">내 정보를 불러오는 중…</span>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-11 w-[120px] rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-56" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-5 rounded-sm bg-container px-8 py-6">
          <h2 className="text-body-lg font-semibold text-gray-1000">
            보유 기술 스택
          </h2>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SettingCardSkeleton title="리포트 구독" />
          <SettingCardSkeleton title="내 커리어 관리" />
        </div>
      </div>
    </div>
  )
}
