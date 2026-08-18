import { useMutation } from '@tanstack/react-query'
import { setTokens } from '@/shared/api'
import { login } from '../api'

/**
 * 로그인하고 받은 토큰을 저장한다.
 *
 * 저장까지 여기서 하는 이유: 로그인 응답이 곧 세션이라, 화면마다 저장을 되풀이하면
 * 한 곳만 빠뜨려도 '로그인됐는데 토큰이 없는' 상태가 된다. 이동은 화면마다 다르므로
 * 부르는 쪽에 남긴다.
 */
export function useLogin() {
  return useMutation({ mutationFn: login, onSuccess: setTokens })
}
