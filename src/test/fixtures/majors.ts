import type { MajorsResponse } from '@/shared/api'

/**
 * `GET /majors` 응답 대역. 실제 서버 모양(전공 안에 기술 스택 중첩)을 그대로 따른다.
 *
 * 전공 코드는 크롤러가 넣는 실제 8개를 따른다. `MAX_MAJORS`(5)보다 많아야 상한 테스트가 성립한다.
 */
export const MOCK_MAJORS: MajorsResponse = {
  categories: [
    {
      id: 1,
      major: 'BACKEND',
      techStacks: [
        { id: 101, name: 'Spring' },
        { id: 102, name: 'Node.js' },
      ],
    },
    {
      id: 2,
      major: 'FRONTEND',
      techStacks: [
        { id: 201, name: 'React' },
        { id: 202, name: 'Vue' },
      ],
    },
    { id: 3, major: 'MOBILE', techStacks: [{ id: 301, name: 'Kotlin' }] },
    { id: 4, major: 'DATA_AI', techStacks: [{ id: 401, name: 'PyTorch' }] },
    { id: 5, major: 'DEVOPS', techStacks: [{ id: 501, name: 'Docker' }] },
    { id: 6, major: 'SECURITY', techStacks: [{ id: 601, name: 'Burp' }] },
    { id: 7, major: 'GAME', techStacks: [{ id: 701, name: 'Unity' }] },
    { id: 8, major: 'EMBEDDED', techStacks: [{ id: 801, name: 'C' }] },
  ],
}
