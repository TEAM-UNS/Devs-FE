import { useMutation } from '@tanstack/react-query'
import { updateMajor, updateTechStack } from '../api'
import type { PersonalHistory } from '../types'

/** 온보딩 한 번에 채우는 값. 서버에서는 두 엔드포인트로 나뉜다. */
export interface OnboardingInput {
  personal_history: PersonalHistory
  major_ids: number[]
  skill_ids: number[]
}

/**
 * 소셜 로그인 뒤 비어 있는 전공·기술 스택을 채운다.
 *
 * 회원가입은 `POST /user/signup` 하나로 끝나지만 온보딩은 `PUT /user/major`와
 * `PUT /user/tech-stack`으로 나뉘어 있다. 화면에서는 제출 버튼 하나라, 두 요청을 여기서 묶어
 * 하나의 뮤테이션으로 보이게 한다 — 그래야 실패 토스트도 한 번만 뜬다.
 *
 * 순차로 부르는 이유: 기술 스택은 전공에 딸린 값이라 전공이 먼저 저장돼야 한다.
 *
 * ⚠️ 전공은 저장됐는데 기술 스택이 실패하면 절반만 채워진 채로 남는다. 지금은 사용자가
 * 다시 제출하면 두 요청이 모두 다시 나가므로 회복되지만, 화면을 떠나면 온보딩을 다시
 * 물어볼 방법이 없다(`onboarding_required`는 토큰 발급 시점에만 온다).
 * 백엔드가 온보딩 완료 조회 API를 열어주면 그때 재진입 경로를 붙인다.
 */
export function useOnboarding() {
  return useMutation({
    mutationFn: async ({
      personal_history,
      major_ids,
      skill_ids,
    }: OnboardingInput) => {
      await updateMajor({ personal_history, major_ids })

      return updateTechStack({ skill_ids })
    },
  })
}
