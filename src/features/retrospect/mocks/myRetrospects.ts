import type { Retrospect } from '../types'

/*
 * TODO: 내가 쓴 회고 목록 API가 생기면 지운다
 * 서버는 지금 이번 주 익명 회고(GET /retrospect)만 주고 작성자를 알 수 없어서,
 * '내 회고 몰아보기'를 퍼블리싱하려고 둔 임시 데이터다. id는 실제 회고와 겹치지 않게 크게 잡았다
 */
export const MY_RETROSPECTS_MOCK: Retrospect[] = [
  {
    retrospectId: 900006,
    dayNo: 6,
    content:
      "올해 초, 스스로 선언했던 '프론트엔드 역량 강화 로드맵'의 목표 기간이 마무리되었다. 당시 내가 설정했던 로드맵은 명확했다. React 깊이 있게 다루기, TypeScript 완벽 적용, 그리고 성능 최적화 경험 쌓기.",
    date: '2026-08-23',
    likeCount: 2,
    liked: false,
  },
  {
    retrospectId: 900005,
    dayNo: 5,
    content:
      '오늘은 리액트 핵심 개념을 학습했는데 좀 어려웠다. 그래서 내일 로드맵 진행 전에 한번 복습하려 한다. 내일도 화이팅~',
    date: '2026-08-22',
    likeCount: 1,
    liked: true,
  },
  {
    retrospectId: 900004,
    dayNo: 4,
    content: '벌써 4일째. 꾸준히 하는 게 제일 어렵다.',
    date: '2026-08-21',
    likeCount: 0,
    liked: false,
  },
  {
    retrospectId: 900003,
    dayNo: 3,
    content:
      'State와 Props의 차이를 정리했다. 예제를 직접 만들어 보니 훨씬 잘 이해됐다.',
    date: '2026-08-20',
    likeCount: 12,
    liked: true,
  },
  {
    retrospectId: 900002,
    dayNo: 2,
    content:
      '컴포넌트를 잘게 나누는 연습을 했다. 어디서 끊어야 할지가 아직 감이 잘 안 온다.',
    date: '2026-08-19',
    likeCount: 65,
    liked: false,
  },
  {
    retrospectId: 900001,
    dayNo: 1,
    content: '첫날. JSX 문법과 개발 환경을 세팅했다.',
    date: '2026-08-18',
    likeCount: 4,
    liked: true,
  },
]
