import { useLocation, useNavigate } from 'react-router-dom'

/**
 * 뒤로가기. 앱 안에서 온 기록이 없으면(주소로 바로 연 첫 화면) 사이트 밖으로 나가지 않게
 * 대신 갈 곳으로 보낸다. 라우터는 첫 화면의 location.key를 'default'로 둔다
 *
 * @param fallback 앱 안 기록이 없을 때 갈 경로
 * @returns 누르면 뒤로 가는 함수
 */
export function useGoBack(fallback: string) {
  const navigate = useNavigate()
  const location = useLocation()

  return () => {
    if (location.key === 'default') {
      navigate(fallback, { replace: true })
      return
    }
    navigate(-1)
  }
}
