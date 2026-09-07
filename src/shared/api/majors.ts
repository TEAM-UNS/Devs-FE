import { queryOptions } from '@tanstack/react-query'
import { get } from './http'

/*
 * 전공·기술 스택 목록. 회원가입(선택지)과 대시보드(필터)가 같은 목록을 쓰므로
 * 한 피처에 두면 다른 피처가 그 내부를 가져다 쓰게 된다. 도메인 데이터지만
 * 소유 피처를 하나로 정할 수 없어 공용으로 올림
 */

/** 기술 스택 한 개 `id`가 회원가입의 `skill_ids` 원소 */
export interface TechStackDto {
  id: number
  name: string
}

/**
 * 전공 한 개 `id`가 회원가입의 `major_ids`이자 대시보드의 `major_id`가 됨
 * `major`는 표시용 라벨이 아니라 `"BACKEND"` 같은 ENUM 문자열
 */
export interface MajorCategoryDto {
  id: number
  major: string
  tech_stacks: TechStackDto[]
}

/** GET /majors 응답은 전공 안에 기술 스택이 중첩 되어서 옴  */
export interface MajorsResponse {
  categories: MajorCategoryDto[]
}

/** 전공 목록을 조회 (GET /majors — 인증 카테고리와 달리 최상위 경로다) */
export async function fetchMajors(): Promise<MajorsResponse> {
  return get<MajorsResponse>('/majors')
}

/**
 * 전공 목록 쿼리 정의
 * 거의 바뀌지 않는 목록이라 `staleTime`을 길게 둬 화면을 오갈 때 재요청하지 않음
 */
export const majorQueries = {
  all: () => ['majors'] as const,
  list: () =>
    queryOptions({
      queryKey: [...majorQueries.all(), 'list'] as const,
      queryFn: fetchMajors,
      staleTime: 12 * 60 * 60 * 1000,
    }),
}
