import { useMutation } from '@tanstack/react-query'
import { setTokens } from '@/shared/api'
import { login } from '../api'
import type { LoginRequest } from '../types'

/**
 * 로그인하고 받은 토큰을 저장한다.
 *
 * 저장까지 여기서 하는 이유: 로그인 응답이 곧 세션이라, 화면마다 저장을 되풀이하면
 * 한 곳만 빠뜨려도 '로그인됐는데 토큰이 없는' 상태가 된다. 이동은 화면마다 다르므로
 * 부르는 쪽에 남긴다.
 *
 * 저장을 `onSuccess`가 아니라 `mutationFn` 안에서 하는 이유: `setTokens`는 응답에
 * 토큰이 없으면 던진다. `onSuccess`에서 던지면 react-query는 이미 성공으로 판정한 뒤라
 * 실패 경로(`onError`·에러 토스트)를 타지 않고, 같은 콜백에 이어 붙은 화면 이동까지
 * 함께 죽어서 사용자가 아무 반응 없는 화면에 남는다. 여기서 던지면 그냥 실패한 요청이 된다.
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const data = await login(body)

      // 응답 타입과 보관 타입(`AuthTokens`)이 달라 여기서 옮겨 담는다.
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      return data
    },
  })
}
