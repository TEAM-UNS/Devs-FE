import { afterEach } from 'vitest'
import { cleanup, configure } from '@testing-library/react'
// jest-dom 매처(toBeInTheDocument 등)를 Vitest의 expect에 등록
import '@testing-library/jest-dom/vitest'

// jsdom에는 ResizeObserver가 없다. ECharts 컨테이너 크기를 감시하는 useEChart가
// 이걸 쓰므로 아무 것도 하지 않는 스텁을 넣는다. jsdom은 레이아웃을 계산하지 않아
// 어차피 크기 변화가 생기지 않으므로 관측 콜백을 흉내 낼 필요가 없다.
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}

// findBy*/waitFor 기본 대기시간(1초)을 늘린다. 화면이 서버 응답을 기다렸다가 바뀌는
// 테스트가 있는데, 병렬 워커가 붐비면 응답 처리 + 리렌더가 1초를 넘겨 간헐적으로 실패했다.
// 제품 코드의 문제가 아니라 실행 환경 편차라 대기시간만 늘린다.
configure({ asyncUtilTimeout: 5000 })

// 각 테스트 후 렌더된 DOM을 정리해 테스트 간 격리를 보장
afterEach(() => {
  cleanup()
})
