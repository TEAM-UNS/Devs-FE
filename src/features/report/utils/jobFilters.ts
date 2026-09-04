import type { JobFilter } from '../types'

/**
 * 직군 필터 칩. 순서는 디자인 표기 순서다.
 *
 * ⚠️ 값(`FE`·`BE`·`SECURITY`)은 디자인 라벨에서 역산한 임시값이다. 서버가 전공 ENUM
 * (`FRONTEND`·`BACKEND`···)을 쓸지, 별도 직군 축을 쓸지 정해지지 않았다.
 * 회원가입 전공은 8종인데 여기 칩은 3종뿐이라 같은 축이 아닐 가능성이 크다.
 */
export const JOB_FILTERS: { value: JobFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'FE', label: 'FE' },
  { value: 'BE', label: 'BE' },
  { value: 'SECURITY', label: 'Security' },
]
