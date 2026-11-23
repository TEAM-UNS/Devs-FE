import { afterEach, describe, expect, it } from 'vitest'
import { markAppStarted, markPageShown } from './loadWatch'
import { trackPageView } from './pageView'

describe('로딩 이탈 감시 알림', () => {
  afterEach(() => {
    delete window.__pageLoad
  })

  it('감시가 없으면(개발 빌드) 아무것도 하지 않는다', () => {
    expect(() => {
      markAppStarted()
      markPageShown()
    }).not.toThrow()
    expect(window.__pageLoad).toBeUndefined()
  })

  it('기본 코드 실행과 첫 페이지 그림을 감시에 남긴다', () => {
    window.__pageLoad = { appStarted: false, shown: false }
    markAppStarted()
    expect(window.__pageLoad).toEqual({ appStarted: true, shown: false })
    markPageShown()
    expect(window.__pageLoad).toEqual({ appStarted: true, shown: true })
  })

  it('페이지 조회를 보내면 그려진 것으로 본다', () => {
    window.__pageLoad = { appStarted: true, shown: false }
    trackPageView('Devs')
    expect(window.__pageLoad.shown).toBe(true)
  })
})
