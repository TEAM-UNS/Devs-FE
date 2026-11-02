/** 생성 단계. URL `?step=`에 1부터 들어간다 */
export const CREATE_STEPS = [
  '목표 직무 선택',
  '관심 스택 선택',
  '로드맵 기간 설정',
  '로드맵 조건 설정',
] as const

/** 서버 `targetWeeks` 범위 */
export const MIN_WEEKS = 1
export const MAX_WEEKS = 12

export const WEEK_PRESETS = [1, 4, 8, 12] as const

/** 서버 `additionalComment` 최대 길이 */
export const COMMENT_MAX_LENGTH = 500

/** 서버 `retrospect` 최대 길이 */
export const RETROSPECT_MAX_LENGTH = 1000

/* 직무 카드 설명. 서버가 주지 않아 Figma(520:2430) 문구를 그대로 둔다 */
export const MAJOR_DESCRIPTIONS: Record<string, string> = {
  BACKEND: '비즈니스 로직과 데이터 처리를 책임지는 서버 환경을 개발합니다.',
  FRONTEND: '사용자가 직접 오가는 인터렉티브한 웹 화면을 구현합니다.',
  MOBILE:
    '모바일 환경과 사용자 경험(UX)에 최적화된 모바일 앱 서비스를 개발합니다.',
  DATA_AI:
    '데이터 분석 및 인공지능(AI) 모델을 활용하여 가치 있는 인사이트와 지능형 서비스를 개발합니다.',
  DEVOPS: '안정적인 서비스 배포 및 인프라 파이프라인을 구축합니다.',
  SECURITY:
    '시스템의 보안 취약점을 탐지하고 사용자 데이터를 안전하게 지킵니다.',
  GAME: 'Unity 및 Unreal 엔진을 기반으로 실시간 최적화, 게임 로직 및 서버 시스템을 구축합니다.',
  EMBEDDED:
    '하드웨어와 소프트웨어를 융합하여 기기를 제어하고 전자기기의 최적화된 시스템을 개발합니다.',
}
