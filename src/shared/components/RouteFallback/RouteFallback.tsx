/**
 * 사이드바 없는 화면(랜딩·로그인·회원가입)의 코드를 내려받는 동안 보여줄 로딩 상태
 * 화면 코드는 금방 받으므로 뼈대를 그리지 않고 배경만 깐다
 * 도메인 지식이 없는 순수 UI라서 shared에 위치한다.
 *
 * @returns 화면 배경과 보조 기술용 로딩 안내
 */
export function RouteFallback() {
  return (
    <div role="status" className="min-h-dvh bg-canvas">
      <span className="sr-only">페이지를 불러오는 중…</span>
    </div>
  )
}
