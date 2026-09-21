const MOCK_DELAY_MS = 1000

const MOCK_RESPONSES: Readonly<Record<string, string>> = {
  '백엔드 중 가장 인기있는 기술 스택':
    '현재 가장 인기가 높은 백엔드 주요 기술 스택은 Node.js(NestJS), Python(FastAPI), Java(Spring Boot), Go, PostgreSQL과 Redis입니다.',
  '최근 한달 간 급하락중인 기술 스택':
    '최근 한 달 동안 Ruby on Rails, PHP, Objective-C와 초기 하이브리드 웹뷰 기술의 채용 공고 언급량이 감소하고 있습니다.',
  '로드맵 생성 기준은 무엇인가요?':
    '로드맵 생성 기준에 대해 답변드리겠습니다.\n\n로드맵 생성 엔진은 사용자의 기본 프로필 데이터(전공, 관련 기술 스택, 경력 단계, 희망 목표 기업)를 핵심 입력 매개변수로 활용합니다. 또한 사용자의 실시간 요구사항 매개변수를 추가 통합하여 데이터 기반의 고도화된 맞춤형 학습 및 커리어 로드맵을 도출합니다.',
}

/** 실제 챗봇 API를 붙이기 전 화면 동작을 확인하기 위한 임시 응답 함수 */
export async function requestMockChatReply(question: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))

  if (question.includes('오류')) {
    throw new Error('mock chat request failed')
  }

  return (
    MOCK_RESPONSES[question] ??
    `“${question}”에 대한 목 응답입니다. 실제 API 연결 시 채용 공고 데이터를 근거로 한 답변으로 교체됩니다.`
  )
}
