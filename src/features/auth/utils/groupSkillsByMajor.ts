import type { MajorCategoryDto } from '@/shared/api'
import type { SignupStep4Input } from '../types'

/**
 * 서버가 평평하게 주는 기술 스택 id를 4단계 선택 모양(전공 id → 기술 스택 id)으로 묶는다.
 * 마이페이지 수정 화면이 지금 고른 스택을 미리 골라 두는 데 쓴다.
 *
 * 한 스택이 여러 전공에 걸치면 그 전공 모두에서 골라진 채로 보인다.
 *
 * @param skillIds 사용자가 고른 기술 스택 id
 * @param majorIds 사용자가 고른 전공 id
 * @param categories `GET /majors`의 전공별 기술 스택 목록
 * @returns 4단계 `initialValues.techStacks`
 */
export function groupSkillsByMajor(
  skillIds: number[],
  majorIds: number[],
  categories: MajorCategoryDto[],
): SignupStep4Input['techStacks'] {
  return Object.fromEntries(
    categories
      .filter((category) => majorIds.includes(category.id))
      .map((category) => [
        String(category.id),
        category.techStacks
          .filter((stack) => skillIds.includes(stack.id))
          .map((stack) => String(stack.id)),
      ]),
  )
}
