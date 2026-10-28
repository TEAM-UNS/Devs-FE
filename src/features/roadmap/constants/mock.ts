import type { Roadmap, RoadmapMajor } from '../types'

// TODO: API 연동 때 지운다. 직무·스택은 GET /majors, 로드맵은 GET /roadmap

export const MOCK_MAJORS: RoadmapMajor[] = [
  {
    id: 1,
    major: 'BACKEND',
    techStacks: [
      { id: 101, name: 'Java' },
      { id: 102, name: 'Spring' },
      { id: 103, name: 'Node.js' },
      { id: 104, name: 'MySQL' },
      { id: 105, name: 'Redis' },
    ],
  },
  {
    id: 2,
    major: 'FRONTEND',
    techStacks: [
      { id: 201, name: 'React' },
      { id: 202, name: 'Vue.js' },
      { id: 203, name: 'Next.js' },
      { id: 204, name: 'TypeScript' },
      { id: 205, name: 'Tailwind CSS' },
      { id: 206, name: 'Svelte' },
    ],
  },
  { id: 3, major: 'MOBILE', techStacks: [{ id: 301, name: 'Kotlin' }] },
  { id: 4, major: 'DATA_AI', techStacks: [{ id: 401, name: 'Python' }] },
  { id: 5, major: 'DEVOPS', techStacks: [{ id: 501, name: 'Docker' }] },
  { id: 6, major: 'SECURITY', techStacks: [{ id: 601, name: 'Burp Suite' }] },
  { id: 7, major: 'GAME', techStacks: [{ id: 701, name: 'Unity' }] },
  { id: 8, major: 'EMBEDDED', techStacks: [{ id: 801, name: 'C' }] },
]

export const MOCK_GENERATING_PROGRESS = 82

export const MOCK_ROADMAP: Roadmap = {
  roadmapId: 1,
  status: 'COMPLETED',
  fieldName: 'frontend',
  summary:
    '이 로드맵은 사용자가 선택한 희망 기술 스택과 목표 기업이 요구하는 스택을 30일 동안 집중 학습할 수 있도록 구성되어 있습니다.',
  learningRate: 64,
  days: [
    {
      dayNo: 1,
      weekNo: 1,
      locked: false,
      allItemsDone: true,
      completed: true,
      retrospect: '오늘은 리엑트 핵심 개념을 학습했는데 좀 어려웠다.',
      items: [
        {
          itemId: 1,
          title: 'React 핵심 개념 및 JSX 기본 문법 학습',
          description: '성장하기 위해서는 탄탄한 기본기가 가장 중요합니다.',
          done: true,
        },
        {
          itemId: 2,
          title: 'Component 구조 이해 및 함수형 컴포넌트 작성',
          description: '',
          done: true,
        },
        {
          itemId: 3,
          title: 'Virtual DOM의 동작 원리와 렌더링 방식 이해',
          description: '',
          done: true,
        },
      ],
    },
    {
      dayNo: 2,
      weekNo: 1,
      locked: false,
      allItemsDone: true,
      completed: false,
      retrospect: null,
      items: [
        {
          itemId: 4,
          title: 'State와 Props를 활용한 데이터 전달 및 흐름 제어',
          description:
            'State와 Props란 무엇인지 정확한 개념을 숙지하는 것이 중요합니다.',
          done: true,
        },
        {
          itemId: 5,
          title: 'useState / useEffect 핵심 Hooks 활용 실습',
          description:
            'useState / useEffect 의 차이가 무엇인지 숙지하는 것이 중요합니다.\n핵심 Hooks들에는 무엇이 있나 학습하세요.',
          done: true,
        },
      ],
    },
    {
      dayNo: 3,
      weekNo: 1,
      locked: true,
      allItemsDone: false,
      completed: false,
      retrospect: null,
      items: [],
    },
    {
      dayNo: 4,
      weekNo: 1,
      locked: true,
      allItemsDone: false,
      completed: false,
      retrospect: null,
      items: [],
    },
  ],
}
