import { useEffect, useState } from 'react'
import { fetchFlag, flagsEnabled, readCachedFlag } from '@/shared/analytics'

/**
 * 대시보드 필터 시작값을 정하는 방식
 * - default: 지금처럼 기본값 (플래그 off)
 * - remember: 마지막 선택 기억 (플래그 on)
 * - fallback: 플래그를 시간 안에 못 받아 기본값으로 그림. 분석에서 따로 거른다
 */
export type FilterMode = 'default' | 'remember' | 'fallback'

/**
 * 모드를 정한 근거
 * - cache: 이 기기에 남은 지난 값 (기다림 없음, 주 단위 전환 직후 첫 방문만 지난 값일 수 있다)
 * - live: 이번에 받은 값 / timeout: 시간 안에 못 받음 / none: Amplitude 꺼짐(개발·테스트)
 */
export type FlagSource = 'cache' | 'live' | 'timeout' | 'none'

export interface FilterModeState {
  mode: FilterMode | 'pending'
  flagSource: FlagSource
  /** 이번에 플래그를 기다린 시간(ms). 기다리지 않았으면 null. 대기 상한(500ms)의 근거로 쓴다 */
  flagLatencyMs: number | null
}

// Amplitude Experiment 플래그. 콘솔에서 주마다 전체 유저를 on·off로 바꾼다
const FLAG_KEY = 'dashboard-filter-memory'
/* 지난 값이 없을 때(이 기기의 첫 방문)만 기다리는 상한. 이보다 늦으면 기본값으로 그린다
   측정해 보니 Amplitude 초기화가 끝나야 플래그 요청이 나가서 첫 접속은 1초 넘게 걸린다 */
const WAIT_MS = 500
// 지난 값으로 그린 뒤 최신 값을 받아 두는 상한. 화면은 기다리지 않는다
const REFRESH_MS = 10_000

const toMode = (value: string | undefined): FilterMode =>
  value === 'on' ? 'remember' : 'default'

function initialState(): FilterModeState {
  if (!flagsEnabled()) {
    return { mode: 'default', flagSource: 'none', flagLatencyMs: null }
  }
  const cached = readCachedFlag(FLAG_KEY)
  if (cached !== null) {
    return { mode: toMode(cached), flagSource: 'cache', flagLatencyMs: null }
  }
  return { mode: 'pending', flagSource: 'none', flagLatencyMs: null }
}

/**
 * 플래그로 모드를 정한다. 지난 값이 있으면 바로 쓰고 최신 값은 뒤에서 받아 둔다
 * 지난 값이 없으면 최대 500ms 기다리고(pending), 못 받으면 fallback
 */
export function useFilterMode(): FilterModeState {
  const [state, setState] = useState(initialState)
  const pending = state.mode === 'pending'

  useEffect(() => {
    if (!flagsEnabled()) return
    let cancelled = false

    if (!pending) {
      // 다음 방문을 위해 최신 값만 받아 둔다. 보고 있는 화면은 바꾸지 않는다
      void fetchFlag(FLAG_KEY, REFRESH_MS)
      return
    }

    const startedAt = performance.now()
    void fetchFlag(FLAG_KEY, WAIT_MS).then((value) => {
      if (cancelled) return
      const flagLatencyMs = Math.round(performance.now() - startedAt)
      setState(
        value === null
          ? { mode: 'fallback', flagSource: 'timeout', flagLatencyMs }
          : { mode: toMode(value), flagSource: 'live', flagLatencyMs },
      )
    })

    return () => {
      cancelled = true
    }
  }, [pending])

  return state
}
