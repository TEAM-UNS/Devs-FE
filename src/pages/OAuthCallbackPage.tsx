import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { takeOAuthProvider, useOAuthLogin } from '@/features/auth'

/**
 * OAuth 콜백 — 서버가 provider 인가를 마치고 브라우저를 여기로 돌려보낸다.
 *
 * 화면이 하는 일은 하나뿐이다: 세션을 토큰으로 바꾸고, 온보딩이 필요한지에 따라 보낸다.
 * 사용자는 이 화면에 머무르지 않으므로 로딩 상태만 보여준다.
 *
 * 라우트 가드 밖에 둔다. 여기 도착한 시점에는 아직 토큰이 없어서, 가드 안에 두면
 * 교환을 해보기도 전에 로그인 화면으로 튕긴다.
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { mutateAsync } = useOAuthLogin()

  /* 교환은 마운트당 한 번만 돈다. `takeOAuthProvider()`가 표식을 지우기 때문에
     두 번째 호출은 provider를 못 찾고, StrictMode는 개발 중 이펙트를 두 번 돌린다. */
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const provider = takeOAuthProvider()

    // 표식이 없다 = 리다이렉트로 온 게 아니다(주소 직접 입력·새로고침·뒤로가기).
    // 교환할 세션이 없으므로 조용히 로그인 화면으로 돌려보낸다.
    if (!provider) {
      navigate(ROUTES.login, { replace: true })
      return
    }

    /* `mutate(provider, { onSuccess, onError })`가 아니라 `mutateAsync`를 쓴다.
       react-query는 뮤테이션이 끝나는 순간 옵저버에 리스너가 없으면 `mutate`에 넘긴
       콜백을 건너뛴다. StrictMode의 마운트→언마운트→재마운트가 정확히 그 상태를
       만들어서, 개발 중에는 응답이 와도 이동이 실행되지 않고 로딩 화면에 갇혔다.
       `mutateAsync`가 주는 프로미스는 리스너와 무관하게 결과를 준다.
       실패 토스트는 여전히 queryClient가 전역으로 띄운다. */
    mutateAsync(provider)
      .then((data) =>
        navigate(
          data.onboardingRequired ? ROUTES.onboarding : ROUTES.home,
          // replace: 뒤로가기로 이 콜백 주소에 다시 오지 않게 한다.
          // 세션은 이미 소모돼서 돌아와도 실패한다.
          { replace: true },
        ),
      )
      // 사용자가 빈 로딩 화면에 갇히지 않도록 돌려보내는 것만 맡는다.
      .catch(() => navigate(ROUTES.login, { replace: true }))
  }, [mutateAsync, navigate])

  return (
    <div
      className="flex h-full items-center justify-center bg-canvas"
      role="status"
      aria-live="polite"
    >
      <span className="text-body-md text-gray-300">로그인 중…</span>
    </div>
  )
}
