import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
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

// 각 테스트 후 렌더된 DOM을 정리해 테스트 간 격리를 보장
afterEach(() => {
  cleanup()
})
