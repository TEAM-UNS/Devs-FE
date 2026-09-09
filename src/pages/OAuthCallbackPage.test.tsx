import { StrictMode } from 'react'
import { screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import OAuthCallbackPage from './OAuthCallbackPage'

/* 전송 계층만 막는다. 요청 함수(exchangeOAuthToken)와 훅은 실제로 돌려서
   경로·withCredentials까지 이 테스트가 지키게 한다. */
const mocks = vi.hoisted(() => ({ post: vi.fn() }))

vi.mock('@/shared/api/http', () => ({
  get: vi.fn(),
  put: vi.fn(),
  post: mocks.post,
}))

const PROVIDER_KEY = 'uns-oauth-provider'

/* 앱과 같이 StrictMode로 감싼다.
   ⚠️ 이 래퍼가 막아주지 못하는 것이 하나 있다. 개발 서버에서 `mutate(provider, {onSuccess})`
   방식이 응답을 받고도 이동하지 않고 로딩 화면에 멈추는 버그가 있었는데(react-query는
   뮤테이션이 끝나는 순간 옵저버에 리스너가 없으면 mutate 콜백을 건너뛴다),
   여기서는 재현되지 않는다 — testing-library의 act()가 StrictMode의 재구독을 동기로
   끝내버려서 그 틈이 생기지 않는다. 옛 구현으로 되돌려 확인했고 이 파일은 통과했다.
   프로덕션 빌드에서는 StrictMode가 아무 일도 하지 않아 e2e로도 잡히지 않는다.
   그래서 `OAuthCallbackPage`는 콜백 대신 `mutateAsync`를 쓴다 — 그쪽은 리스너와 무관하다. */
function renderCallback() {
  return renderWithQuery(
    <StrictMode>
      <MemoryRouter initialEntries={['/oauth/callback']}>
        <Routes>
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/" element={<p>대시보드</p>} />
          <Route path="/onboarding" element={<p>온보딩</p>} />
          <Route path="/login" element={<p>로그인 화면</p>} />
        </Routes>
      </MemoryRouter>
    </StrictMode>,
  )
}

/* 응답을 한 틱 미룬다. 즉시 resolve되는 mock은 StrictMode의 재구독보다 먼저 끝나버려서
   위의 함정을 재현하지 못한다. 실제 네트워크는 항상 늦게 온다. */
const settleLater = <T,>(value: T, fail = false) =>
  new Promise<T>((resolve, reject) =>
    setTimeout(() => (fail ? reject(value) : resolve(value)), 0),
  )

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    mocks.post.mockReset()
    sessionStorage.clear()
    localStorage.clear()
  })

  it('온보딩이 끝난 사용자는 토큰을 저장하고 대시보드로 보낸다', async () => {
    sessionStorage.setItem(PROVIDER_KEY, 'google')
    mocks.post.mockImplementationOnce(() =>
      settleLater({
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        onboardingRequired: false,
      }),
    )

    renderCallback()

    expect(await screen.findByText('대시보드')).toBeInTheDocument()
    expect(localStorage.getItem('uns-access-token')).toBe('access-1')
    expect(localStorage.getItem('uns-refresh-token')).toBe('refresh-1')
  })

  it('세션 쿠키를 실어 provider 경로로 교환을 요청한다', async () => {
    sessionStorage.setItem(PROVIDER_KEY, 'github')
    mocks.post.mockImplementationOnce(() =>
      settleLater({
        accessToken: 'a',
        refreshToken: 'r',
        onboardingRequired: false,
      }),
    )

    renderCallback()
    await screen.findByText('대시보드')

    // 쿠키가 이 요청의 유일한 인증 근거라 withCredentials가 빠지면 서버가 못 알아본다.
    expect(mocks.post).toHaveBeenCalledWith(
      '/user/oauth/github/token',
      undefined,
      { withCredentials: true },
    )
  })

  it('전공·기술 스택이 비어 있으면 온보딩으로 보낸다', async () => {
    sessionStorage.setItem(PROVIDER_KEY, 'google')
    mocks.post.mockImplementationOnce(() =>
      settleLater({
        accessToken: 'a',
        refreshToken: 'r',
        onboardingRequired: true,
      }),
    )

    renderCallback()

    expect(await screen.findByText('온보딩')).toBeInTheDocument()
  })

  it('표식이 없으면 교환을 시도하지 않고 로그인 화면으로 돌려보낸다', async () => {
    renderCallback()

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(mocks.post).not.toHaveBeenCalled()
  })

  it('교환에 실패하면 로딩 화면에 가두지 않고 로그인 화면으로 돌려보낸다', async () => {
    sessionStorage.setItem(PROVIDER_KEY, 'google')
    mocks.post.mockImplementationOnce(() =>
      settleLater(new Error('세션 없음'), true),
    )

    renderCallback()

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    expect(localStorage.getItem('uns-access-token')).toBeNull()
  })

  it('응답에 토큰이 없으면 로딩 화면에 가두지 않고 로그인 화면으로 돌려보낸다', async () => {
    sessionStorage.setItem(PROVIDER_KEY, 'google')
    // 200이지만 refreshToken이 빠진 응답 — setTokens가 던진다.
    // 저장이 onSuccess 안에 있으면 react-query가 이미 성공으로 판정한 뒤라
    // 실패 경로도 화면 이동도 타지 않고 로딩 화면에 영원히 멈춘다.
    mocks.post.mockImplementationOnce(() =>
      settleLater({
        accessToken: 'access-1',
        onboardingRequired: false,
      }),
    )

    renderCallback()

    expect(await screen.findByText('로그인 화면')).toBeInTheDocument()
    // 반쪽짜리 세션을 남기지 않는다.
    expect(localStorage.getItem('uns-access-token')).toBeNull()
  })

  it('교환이 끝나면 표식을 지워 새로고침으로 다시 시도되지 않게 한다', async () => {
    sessionStorage.setItem(PROVIDER_KEY, 'google')
    mocks.post.mockImplementationOnce(() =>
      settleLater({
        accessToken: 'a',
        refreshToken: 'r',
        onboardingRequired: false,
      }),
    )

    renderCallback()
    await screen.findByText('대시보드')

    expect(sessionStorage.getItem(PROVIDER_KEY)).toBeNull()
  })
})
