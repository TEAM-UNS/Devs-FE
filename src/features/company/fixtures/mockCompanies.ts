import type {
  CommonSkill,
  Company,
  CompanyMatchRate,
  CompanyPostingCount,
  CompanyTopSkills,
  SkillMention,
} from '../types'

/** API 연동 전까지 쓰는 기업 목록. 문구는 Figma 408:3115 그대로 */
export const MOCK_COMPANIES: Company[] = [
  {
    id: 1,
    name: '네이버 (NAVER)',
    description:
      '국내 최대 검색 포털이자 AI·클라우드·글로벌 웹툰 플랫폼까지 대규모 트래픽과 거대 인프라를 경험할 수 있는 대표 IT 거인입니다.',
  },
  {
    id: 2,
    name: '카카오 (Kakao)',
    description:
      '국민 메신저 카카오톡을 기반으로 커머스, IP, 금융 등 다양한 서비스 생태계를 갖추고 자율적인 개발 문화를 지향하는 기업입니다.',
  },
  {
    id: 3,
    name: '토스 (비바리퍼블리카)',
    description:
      '토스의 운영사 비바리퍼블리카는 서비스와의 시너지 가능성을 중점적으로 다양한 방식의 투자를 실행합니다.',
  },
  {
    id: 4,
    name: '당근 (당근마켓)',
    description:
      '하이퍼로컬(지역 기반) 커뮤니티 플랫폼으로, 방대한 지역 데이터를 다루며 자율성과 코드 리뷰 문화가 깊게 자리 잡은 기업입니다.',
  },
  {
    id: 5,
    name: '우아한형제들 (배달의민족)',
    description:
      '국내 배달 플랫폼 1위 기업으로, 상호 존중과 활발한 지식 공유, 체계적인 기술 블로그 운영 등 훌륭한 개발 문화의 대명사로 꼽힙니다.',
  },
  {
    id: 6,
    name: '라인플러스 (LINE)',
    description:
      '일본 및 동남아시아를 중심으로 글로벌 수억 명의 유저를 보유하고 있어, 국경을 넘나드는 대규모 분산 시스템 구축을 경험할 수 있습니다.',
  },
  {
    id: 7,
    name: '쿠팡 (Coupang)',
    description:
      '초대형 물류·커머스 시스템과 인공지능 기반 예측 알고리즘을 바탕으로, 데이터 중심의 거대 이커머스 엔지니어링을 주도합니다.',
  },
  {
    id: 8,
    name: '몰로코 (Moloco)',
    description:
      '머신러닝 기반의 글로벌 애드테크(AdTech) 유니콘 기업으로, 세계 최고 수준의 AI/데이터 엔지니어들과 함께 일하며 높은 보상을 기대할 수 있는 곳입니다.',
  },
  {
    id: 9,
    name: '업스테이지 (Upstage)',
    description:
      'LLM(거대언어모델)과 OCR 등 자체 AI 기술력을 바탕으로 국내외 인공지능 생태계를 선도하는 기술 중심의 AI 전문 스타트업입니다.',
  },
  {
    id: 10,
    name: '야놀자 (Yanolja)',
    description:
      '글로벌 여행·트래블 테크 기업으로 데이터 기반의 추천 시스템과 클라우드 솔루션을 적극 도입하며 빠르게 확장하고 있습니다.',
  },
  {
    id: 11,
    name: '직방 (Zigbang)',
    description:
      '부동산 시장에 프롭테크(PropTech)를 접목하고 전사 리모트 워크(원격 근무) 문화를 적극적으로 채택하여 자유로운 일터를 제공합니다.',
  },
  {
    id: 12,
    name: '두나무 (업비트)',
    description:
      '가상자산 거래소 업비트를 운영하며, 초고속 실시간 트랜잭션 처리와 최고 수준의 금융 보안 기술을 경험할 수 있는 블록체인 핀테크 기업입니다.',
  },
]

const SKILLS = [
  'Kotlin',
  'Spring Boot',
  'Kubernetes',
  'Go',
  'TypeScript',
  'AWS',
  'Python',
  'Docker',
  'Kafka',
] as const

/**
 * 고른 기업으로 비교 결과 목데이터를 만든다. 어떤 기업을 골라도 화면이 채워지게
 * id로 값을 정해 매번 같은 결과가 나온다
 */
export function mockComparison(companies: readonly Company[]) {
  const total = companies.length
  const pick = (id: number, offset: number) =>
    SKILLS[(id + offset) % SKILLS.length]

  const topSkills: CompanyTopSkills[] = companies.map(({ id, name }) => ({
    companyId: id,
    name,
    skills: [0, 1, 2].map((rank) => ({
      rank: rank + 1,
      skillName: pick(id, rank * 2),
      percentage: 90 - rank * 15 - (id % 5),
    })),
  }))

  const commonSkills: CommonSkill[] = [
    'Docker',
    'AWS',
    'Kubernetes',
    'Kafka',
  ].map((skillName, index) => ({
    skillName,
    companyCount: Math.max(1, total - Math.floor(index / 2)),
    totalCompanyCount: total,
  }))

  const mentions: SkillMention[] = ['Docker', 'AWS', 'Kafka'].map(
    (skillName, index) => ({
      skillName,
      counts: companies.map(({ id }) => ({
        companyId: id,
        postingCount: ((id * 37 + index * 23) % 120) + 20,
      })),
    }),
  )

  const matchRates: CompanyMatchRate[] = companies.map(({ id, name }) => ({
    companyId: id,
    name,
    matchRate: ((id * 29) % 60) + 30,
  }))

  const postingCounts: CompanyPostingCount[] = companies.map(
    ({ id, name }) => ({
      companyId: id,
      name,
      postingCount: ((id * 17) % 60) + 8,
    }),
  )

  return { topSkills, commonSkills, mentions, matchRates, postingCounts }
}
