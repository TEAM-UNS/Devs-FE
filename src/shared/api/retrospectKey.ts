/**
 * 회고 쿼리 키의 루트. 회고는 retrospect feature가 조회하지만 roadmap에서 하루를 마칠 때 쓰여서,
 * 두 feature가 같이 알아야 해 shared에 둔다 (feature끼리는 import하지 않는다)
 */
export const RETROSPECT_QUERY_KEY = ['retrospect'] as const
