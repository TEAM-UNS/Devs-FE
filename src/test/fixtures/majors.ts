import type { MajorsResponse } from '@/features/auth/types'

/**
 * `GET /majors` 응답 대역. 실제 서버 모양(전공 안에 기술 스택 중첩)을 그대로 따른다.
 *
 * 전공 개수는 `MAX_MAJORS`(5)보다 많아야 상한 테스트가 성립하므로 10개를 둔다.
 */
export const MOCK_MAJORS: MajorsResponse = {
  categories: [
    {
      id: 1,
      major: 'BACKEND',
      tech_stacks: [
        { id: 101, name: 'Spring' },
        { id: 102, name: 'Node.js' },
      ],
    },
    {
      id: 2,
      major: 'FRONTEND',
      tech_stacks: [
        { id: 201, name: 'React' },
        { id: 202, name: 'Vue' },
      ],
    },
    { id: 3, major: 'DEVOPS', tech_stacks: [{ id: 301, name: 'Docker' }] },
    { id: 4, major: 'ANDROID', tech_stacks: [{ id: 401, name: 'Kotlin' }] },
    { id: 5, major: 'IOS', tech_stacks: [{ id: 501, name: 'Swift' }] },
    { id: 6, major: 'AI', tech_stacks: [{ id: 601, name: 'PyTorch' }] },
    { id: 7, major: 'DATABASE', tech_stacks: [{ id: 701, name: 'MySQL' }] },
    { id: 8, major: 'SECURITY', tech_stacks: [{ id: 801, name: 'Burp' }] },
    { id: 9, major: 'DESIGN', tech_stacks: [{ id: 901, name: 'Figma' }] },
    { id: 10, major: 'ETC', tech_stacks: [{ id: 1001, name: 'Etc' }] },
  ],
}
