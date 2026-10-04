import { MOCK_PROFILE } from '../../fixtures/mockProfile'
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
  // TODO: API 연동 시 목데이터를 서버 응답으로 바꾼다
  const profile = MOCK_PROFILE

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-9">
      <ProfileSummary
        name={profile.name}
        email={profile.email}
        career={profile.career}
        majors={profile.majors}
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
