import { useQuery } from '@tanstack/react-query'
import { userQueries } from '@/shared/api'
import { useLogout } from '@/shared/hooks/useLogout'
import { toMyProfile } from '../../utils/toMyProfile'
import { CareerGoalCard } from '../CareerGoalCard'
import { ProfileSummary } from '../ProfileSummary'
import { ReportSubscriptionCard } from '../ReportSubscriptionCard'
import { SkillStackCard } from '../SkillStackCard'

interface MyPageOverviewProps {
  /** 내가 쓴 회고 개수 — 회고 feature가 알고 있어 page가 넘겨준다 */
  readonly retrospectCount?: number
}

/**
 * 마이페이지 본문 — 프로필 요약 + 카드 세 장.
 * 폭·간격은 Figma 653:3597(1120px 그리드) 기준이다.
 *
 * @returns 프로필과 설정 카드가 배치된 마이페이지 화면
 */
export function MyPageOverview({ retrospectCount }: MyPageOverviewProps) {
  const { data } = useQuery(userQueries.me())
  const logout = useLogout()

  // TODO: 로딩·에러 화면은 따로 정한다. 그 전까지는 응답이 오기 전엔 아무것도 그리지 않는다
  if (!data) return null

  const profile = toMyProfile(data)

  return (
    // 다른 화면처럼 페이지 여백 안에서 최대 1360 (Figma 2284:12046)
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-9">
      <ProfileSummary
        name={profile.name}
        email={profile.email}
        career={profile.career}
        majors={profile.majors}
        onLogout={() => logout.mutate()}
        isLoggingOut={logout.isPending}
      />

      <div className="flex flex-col gap-6">
        <SkillStackCard skills={profile.skills} />

        {/* 아래 두 카드는 패드부터 같은 높이로 나란히 서고, 모바일은 쌓는다 (Figma 876 · 390)
            grid-cols-1을 적어야 열이 minmax(0,1fr)이 된다. 없으면 긴 관심 스택 한 줄만큼 열이 넓어져 화면을 넘는다 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ReportSubscriptionCard />
          <CareerGoalCard
            majors={profile.majors}
            skills={profile.skills}
            retrospectCount={retrospectCount}
          />
        </div>
      </div>
    </div>
  )
}
