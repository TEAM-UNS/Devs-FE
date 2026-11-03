import * as amplitude from '@amplitude/unified'
import { getAccessToken } from '@/shared/api/tokenStorage'

/* 초기화가 끝났는지. 실험 플래그는 초기화가 끝나야 붙는 플러그인이라 이걸 기다린다
   개발 빌드·키 없음이면 초기화를 안 하므로 null로 남는다 */
let ready: Promise<boolean> | null = null
// 초기화가 성공해 끝났는지. 끝난 뒤의 식별은 기다리지 않고 바로 해야 같은 자리의 다음 이벤트에 붙는다
let initialized = false

/**
 * Amplitude 초기화 (이벤트 + 세션 리플레이)
 * 개발 중 클릭이 실제 지표에 섞이지 않도록 프로덕션 빌드에서만 킴
 * API 키는 환경변수(VITE_AMPLITUDE_API_KEY)로 주입하며 없으면 초기화를 건너뜀
 */
export function initAmplitude() {
  if (!import.meta.env.PROD) return

  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY
  if (!apiKey) {
    console.warn('Amplitude API key missing — analytics disabled')
    return
  }

  ready = amplitude
    .initAll(apiKey, {
      analytics: {
        /* 사용자 id는 DB 번호('42')라 짧다. 서버 기본값(5자 미만 거절)이면 로그인한 사람의 이벤트가
           통째로 버려지므로 1자부터 받게 한다 */
        minIdLength: 1,
        /* 페이지 조회는 제목이 들어간 뒤 trackPageView로 직접 보낸다
           객체로 넘기면 클릭·네트워크·웹 바이탈 수집은 기본이 꺼짐이라 true일 때처럼 켜 둔다 */
        autocapture: {
          pageViews: false,
          elementInteractions: true,
          frustrationInteractions: true,
          networkTracking: true,
          webVitals: true,
        },
      },
      // 베타 테스트까지는 1로 두고 추후 트래픽이 증가하면 낮춰야함
      sessionReplay: { sampleRate: 1 },
      /* 플래그는 화면이 쓰기 전에 뒤에서 미리 받아 둔다. 읽을 때마다 노출을 남기면 실제로 본 화면과
         다른 variant가 기록되므로 자동 노출은 끄고, 노출은 화면이 남기는 이벤트(Dashboard Viewed 등)로 본다 */
      experiment: { automaticExposureTracking: false },
    })
    .then(() => {
      initialized = true
      return true
    })
    // 초기화가 실패해도 화면은 계속 돌아야 하기 때문에 예외처리가 필요함
    .catch(() => {
      console.warn('Amplitude init failed — analytics disabled')
      return false
    })
}

/** 원격 플래그를 쓸 수 있는 환경인지. 개발·테스트처럼 Amplitude를 켜지 않았으면 false라 기다릴 필요가 없다 */
export function flagsEnabled(): boolean {
  return ready !== null
}

// 플래그는 페이지당 한 번만 받아 온다
let started: Promise<void> | null = null

/* 마지막으로 받은 플래그 값. Amplitude 초기화가 1초 넘게 걸려 첫 화면이 플래그를 기다릴 수 없어서,
   다음 방문부터는 이 값으로 바로 그린다. variant가 없으면(undefined) 빈 문자열로 남긴다 */
const cacheKeyOf = (key: string) => `uns-flag:${key}`

/**
 * 이 기기에서 마지막으로 받은 플래그 값
 *
 * @param key 플래그 키
 * @returns 받은 적 없으면 null, variant가 없었으면 undefined
 */
export function readCachedFlag(key: string): string | undefined | null {
  try {
    const cached = localStorage.getItem(cacheKeyOf(key))
    if (cached === null) return null
    return cached === '' ? undefined : cached
  } catch {
    return null
  }
}

function writeCachedFlag(key: string, value: string | undefined) {
  try {
    localStorage.setItem(cacheKeyOf(key), value ?? '')
  } catch {
    // 저장소를 못 쓰면 매번 기다린다
  }
}

/**
 * 원격 플래그 값. 정해진 시간 안에 못 받거나 Amplitude가 꺼져 있으면 null
 * 시간이 지나도 받는 일은 계속해서, 받으면 다음 방문을 위해 기기에 남긴다
 * 자동 노출 기록은 꺼 두었다. 노출은 실제로 그린 화면이 이벤트로 남긴다
 *
 * @param key 플래그 키
 * @param timeoutMs 기다릴 최대 시간
 * @returns 받은 variant 값(없으면 undefined), 못 받으면 null
 */
export async function fetchFlag(
  key: string,
  timeoutMs: number,
): Promise<string | undefined | null> {
  const load = (async () => {
    if (!ready || !(await ready)) return null
    const client = amplitude.experiment()
    if (!client) return null
    started ??= client.start()
    await started
    const { value } = client.variant(key)
    writeCachedFlag(key, value)
    return value
  })().catch(() => null)

  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), timeoutMs)
  })

  try {
    return await Promise.race([load, timeout])
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 나중에 다른 분석 SDK로 변경할 수도 있기 때문에 SDK에 직접 의존하지 않고 해당 함수를 거치도록 함
 */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  amplitude.track(name, properties)
}

/**
 * 액세스 토큰(JWT)의 sub — 백엔드 JwtProvider가 사용자 DB id를 넣는다
 * 서명은 검증하지 않는다. 분석용 식별이라 충분하고, 토큰 검증은 서버가 한다
 * 토큰 모양이 아니면 null (분석 때문에 화면이 깨지면 안 된다)
 */
export function userIdFromToken(token: string | null): string | null {
  const payload = token?.split('.')[1]
  if (!payload) return null
  try {
    const json = atob(payload.replaceAll('-', '+').replaceAll('_', '/'))
    const { sub } = JSON.parse(json) as { sub?: unknown }
    return typeof sub === 'string' && sub !== '' ? sub : null
  } catch {
    return null
  }
}

/**
 * 로그인한 사람을 Amplitude에 알린다 — 그 전의 익명 기록도 이 사람에게 이어 붙는다
 * 로그인 성공 직후와, 이미 로그인된 채로 앱을 열었을 때 부른다. 이메일은 보내지 않는다
 * 백엔드가 sub에 다른 값을 넣도록 바뀌면 식별이 조용히 달라지니 그때 함께 고친다
 */
export function identifyUser() {
  // 로그인 직후처럼 초기화가 끝났으면 바로 맞춰 바로 다음 이벤트(Logged In)부터 붙게 한다
  if (initialized) {
    applyIdentity()
    return
  }
  // 앱 시작 직후엔 초기화 전이라 저장된 id를 못 읽으므로 끝난 뒤에 맞춘다
  // 개발·테스트처럼 초기화하지 않았으면(ready === null) 아무것도 하지 않는다
  void ready?.then((ok) => {
    if (ok) applyIdentity()
  })
}

function applyIdentity() {
  let token: string | null
  try {
    token = getAccessToken()
  } catch {
    // 브라우저가 저장소를 막으면 식별만 건너뛴다
    return
  }
  const userId = userIdFromToken(token)
  if (userId) amplitude.setUserId(userId)
  // 토큰은 없는데 지난 사람 id가 남아 있으면(만료로 지워짐 등) 기기 식별부터 새로 시작한다
  else if (amplitude.getUserId()) amplitude.reset()
}

/**
 * 로그아웃할 때 기기 식별을 새로 시작한다
 * 그대로 두면 같은 브라우저로 다음에 로그인한 사람의 행동이 이전 사람과 한 사용자로 묶인다
 */
export function resetAnalytics() {
  amplitude.reset()
}
