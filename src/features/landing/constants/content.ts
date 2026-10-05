import chatScreen from '@/assets/landing/feature-chat.webp'
import companyScreen from '@/assets/landing/feature-company.webp'
import reportScreen from '@/assets/landing/feature-report.webp'
import roadmapScreen from '@/assets/landing/feature-roadmap.webp'
import logo01 from '@/assets/landing/company-logo-01.webp'
import logo02 from '@/assets/landing/company-logo-02.webp'
import logo03 from '@/assets/landing/company-logo-03.webp'
import logo04 from '@/assets/landing/company-logo-04.webp'
import logo05 from '@/assets/landing/company-logo-05.webp'
import logo06 from '@/assets/landing/company-logo-06.webp'
import logo07 from '@/assets/landing/company-logo-07.webp'
import logo08 from '@/assets/landing/company-logo-08.webp'
import logo09 from '@/assets/landing/company-logo-09.webp'
import logo10 from '@/assets/landing/company-logo-10.webp'
import logo11 from '@/assets/landing/company-logo-11.webp'
import logo12 from '@/assets/landing/company-logo-12.webp'

/*
 * 랜딩 문구와 반복 데이터. 마크업과 분리해 두면 카피가 바뀌어도 컴포넌트를 안 건드린다
 * 문구는 Figma 818:7664 그대로
 */

export const HERO_TITLE = [
  '감으로 하는 취업 준비는 끝.',
  '데이터가 보여주는 기술 트렌드',
] as const

export const HERO_DESCRIPTION =
  '실시간 채용공고 분석, 기업별 매칭률, AI 맞춤형 로드맵까지 한곳에서 관리하세요.'

export interface PainPoint {
  number: string
  question: readonly string[]
  answer: readonly string[]
}

/** 말풍선 카드 3장. 배열 순서가 읽는 순서(01→02→03)다 */
export const PAIN_POINTS: readonly PainPoint[] = [
  {
    number: '01',
    question: ['네카라쿠배 가려면', '요즘 무슨 스택을 배워야 하지?'],
    answer: [
      '실시간 수집된 120개 이상 주요 IT 기업의',
      '공고 분석으로, 실제 가장 많이 요구하는',
      '기술 스택 순위를 한눈에 비교할 수 있어요.',
    ],
  },
  {
    number: '02',
    question: ['React만 써봤는데 지원해도 될까?', '공고에서 뭘 같이 요구하지?'],
    answer: [
      '특정 기술과 함께 자주 등장하는 연관 스택 분석',
      '데이터를 바탕으로, 내가 보완해야 할 필수 기술과',
      '연관 역량을 정확히 짚어드려요.',
    ],
  },
  {
    number: '03',
    question: [
      '신입 백엔드로 취업하려면',
      '포트폴리오에 어떤 기술이 필수일까?',
    ],
    answer: [
      '전공과 목표 직무에 맞춰 최근 채용 시장에서',
      '급상승 중인 키워드와 필수 스택 기반의 단계별',
      '맞춤 커리어 로드맵을 제공받아요.',
    ],
  },
]

export interface Stat {
  label: string
  value: number
}

export const STATS: readonly Stat[] = [
  { label: '매일 수집·분석되는 실시간 채용공고', value: 18000 },
  { label: '기술 스택 실시간 비교 가능 활성화 IT기업', value: 4000 },
  { label: '매일 수집·분석되는 실시간 채용공고', value: 5000 },
]

export interface Feature {
  badge: string
  title: readonly string[]
  description: string
  tags: readonly string[]
  image: string
  /** 캡처 박스 폭. 행마다 Figma 값이 다르다 */
  imageWidthClass: string
  /** 캡처를 텍스트 왼쪽에 둘지 */
  imageFirst: boolean
}

export const FEATURES: readonly Feature[] = [
  {
    badge: '대시보드 & 리포트',
    title: ['채용 시장 트렌드, 한눈에 파악하세요'],
    description:
      '매일 수집되는 실시간 채용공고를 분석해 인기·급상승 기술 스택과 기업 규모별 요구 역량을 시각화해 드립니다. 전주 대비 언급량 변화부터 필수 키워드까지 내 전공에 맞춘 주간 리포트로 시장 흐름을 빠르게 읽어보세요.',
    tags: [
      '실시간_공고_분석',
      '인기_급상승_스택',
      '기업규모별_스택분석',
      '주간_키워드_리포트',
      '전공맞춤_대시보드',
    ],
    image: reportScreen,
    imageWidthClass: 'w-[660px]',
    imageFirst: false,
  },
  {
    badge: '기업 스택 비교',
    title: ['목표 기업 요구 스택과', '내 매칭률을 한눈에'],
    description:
      '관심 있는 기업을 선택해 기업별 자주 쓰는 기술 스택과 공통 요구 역량을 직관적으로 비교해 보세요. 내 현재 보유 스택과 채용 데이터의 Gap을 계산하여 목표 기업별 합격 매칭률(%)을 바로 산출해 드립니다.',
    tags: [
      '기업간_스택_다중비교',
      '공통_요구스택_추출',
      '언급량_시각화_그래프',
      '기업별_채용_활성도',
      '내_기술_매칭률',
    ],
    image: companyScreen,
    imageWidthClass: 'w-[690px]',
    imageFirst: true,
  },
  {
    badge: 'AI 커리어 챗봇',
    title: ['실제 공고 데이터를', '근거로 답하는 AI 멘토'],
    description:
      '"React 쓰는 회사는 뭘 같이 요구해?" 같은 취업 궁금증을 자유롭게 질문해 보세요. 등록된 내 프로필(전공·스택·경력)과 기술 연관 그래프를 바탕으로 뻔한 상식이 아닌 데이터 기반의 개인화 답변을 제공합니다.',
    tags: [
      '공고데이터_근거_답변',
      '실시간_답변',
      '내_프로필_자동컨텍스트',
      '기술간_연관성_그래프',
      '맞춤형_취업_질의응답',
    ],
    image: chatScreen,
    imageWidthClass: 'w-[736px]',
    imageFirst: false,
  },
  {
    badge: '로드맵',
    title: ['부족한 역량만', '채우는 단계별 커리어 플랜'],
    description:
      '현재 보유 스택과 목표 기업/직무의 차이(Gap)를 자동 분석해 최적의 학습 순서와 프로젝트 방향을 설계해 드립니다. 1일부터 3년까지 원하는 준비 기간을 직접 설정하고 내 일정에 딱 맞춘 나만의 로드맵을 완성해 보세요.',
    tags: [
      '목표직무_스택_Gap분석',
      '기간_자유설정_UI',
      '단계별_추천_학습순서',
      '실전_프로젝트_방향',
      '마이페이지_저장',
    ],
    image: roadmapScreen,
    imageWidthClass: 'w-[715px]',
    imageFirst: true,
  },
]

/** 기업 로고 12개. 띠 한 줄에 이 묶음을 반복해 채운다 */
export const COMPANY_LOGOS: readonly string[] = [
  logo01,
  logo02,
  logo03,
  logo04,
  logo05,
  logo06,
  logo07,
  logo08,
  logo09,
  logo10,
  logo11,
  logo12,
]

export interface Faq {
  question: string
  answer: string
}

// 1번 답변만 디자인에 있고 나머지는 서비스 동작에 맞춰 채운 문구
export const FAQS: readonly Faq[] = [
  {
    question: 'Devs는 어떤 서비스인가요?',
    answer:
      "Devs는 실제 수집된 채용공고 데이터를 기반으로 기술 트렌드 분석, 기업별 스택 비교, 개인 맞춤형 AI 커리어 로드맵을 제공하는 데이터 기반 커리어 플랫폼입니다. '카더라' 정보 대신 객관적인 채용 데이터를 바탕으로 효율적인 취업 준비를 돕습니다.",
  },
  {
    question: '기존 채용 플랫폼(잡코리아, 원티드 등)과의 차별점은 무엇인가요?',
    answer:
      '채용 플랫폼이 공고를 모아 보여준다면, Devs는 공고 속 기술 스택을 분석합니다. 지금 시장이 어떤 기술을 많이 찾는지, 목표 기업이 무엇을 요구하는지, 내 스택과 무엇이 다른지를 데이터로 보여드립니다.',
  },
  {
    question: '관심 기술(보유 기술스택)은 몇 개까지 등록할 수 있나요?',
    answer:
      '기술 스택은 개수 제한 없이 등록할 수 있습니다. 전공은 최대 5개까지 고를 수 있습니다.',
  },
  {
    question: '기술 스택 순위는 매일 바뀌나요?',
    answer:
      '네. 채용공고를 매일 수집해 대시보드 순위도 매일 갱신됩니다. 주간 리포트는 한 주 단위로 모아 지난주와 비교해 보여드립니다.',
  },
  {
    question:
      '자신의 전공 분야 데이터만 리포트와 대시보드에서 확인할 수 있나요?',
    answer:
      '아니요. 전체 데이터와 전공별 데이터를 필터로 바꿔 가며 볼 수 있어, 다른 분야의 흐름도 함께 확인할 수 있습니다.',
  },
  {
    question: '로드맵은 어떻게 생성되고, 기간 설정이나 개수 제한이 있나요?',
    answer:
      '보유 스택과 목표 기업·직무의 차이를 분석해 학습 순서와 프로젝트 방향을 만들어 드립니다. 준비 기간은 1일부터 3년까지 직접 정할 수 있고, 만든 로드맵은 마이페이지에 저장됩니다.',
  },
]

export const TEAM_MEMBERS = [
  { role: 'BE', name: '이강희' },
  { role: 'FE', name: '이선우' },
  { role: 'AI', name: '이시우' },
  { role: 'Design', name: '최하은' },
] as const

export const CONTACT_EMAIL = 'teamuns2026@gmail.com'

export const GITHUB_URL = 'https://github.com/TEAM-UNS'
