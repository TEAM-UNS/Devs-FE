import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { resetAnalytics } from '@/shared/analytics'
import { clearTokens, logout } from '@/shared/api'
import { ROUTES } from '@/shared/constants'

/**
 * 로그아웃. 서버가 refresh token을 지웠다고 응답(204)한 뒤에 브라우저에 남은 흔적을 지운다
 * 실패하면 공통 에러 토스트가 뜨고 로그인 상태로 남는다
 * 마이페이지 말고도 사이드바 등에서 부를 수 있게 shared에 둔다
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearTokens()
      // 이전 사람의 프로필 같은 캐시가 다음에 로그인한 사람에게 잠깐이라도 보이지 않게 비운다
      queryClient.clear()
      resetAnalytics()
      // 뒤로가기로 로그아웃 전 화면에 돌아가지 않게 기록을 덮어쓴다
      navigate(ROUTES.login, { replace: true })
    },
  })
}
