import { useQuery } from '@tanstack/react-query'
import { userQueries } from '@/shared/api'
import { useLogout } from '@/shared/hooks/useLogout'
import { MOCK_PROFILE } from '../../fixtures/mockProfile'
import { toMyProfile } from '../../utils/toMyProfile'
import { CareerGoalCard } from '../CareerGoalCard'
import { ProfileSummary } from '../ProfileSummary'
import { ReportSubscriptionCard } from '../ReportSubscriptionCard'
import { SkillStackCard } from '../SkillStackCard'

/**
 * 마이페이지 본문 — 프로필 요약 + 카드 세 장.
 * 폭·간격은 Figma 653:3597(1120px 그리드) 기준이다.
 *
 * @returns 프로필과 설정 카드가 배치된 마이페이지 화면
 */
export function MyPageOverview() {
  const { data } = useQuery(userQueries.me())
  const logout = useLogout()

  // TODO: 로딩·에러 화면은 따로 정한다. 그 전까지는 응답이 오기 전엔 아무것도 그리지 않는다
  if (!data) return null

  // 구독·커리어 목표는 서버에 아직 없어 목데이터를 그대로 쓴다 (백엔드에 추가 요청)
  const profile = { ...MOCK_PROFILE, ...toMyProfile(data) }

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-9">
      <ProfileSummary
        name={profile.name}
        email={profile.email}
        career={profile.career}
        majors={profile.majors}
        onLogout={logout}
      />

      <div className="flex flex-col gap-6">
        <SkillStackCard skills={profile.skills} />

        {/* 아래 두 카드는 같은 높이로 나란히 선다 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ReportSubscriptionCard
            defaultMode={profile.subscriptionMode}
            defaultFields={profile.subscribedFields}
          />
          <CareerGoalCard goals={profile.careerGoals} />
        </div>
      </div>
    </div>
  )
}
