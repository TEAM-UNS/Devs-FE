import { useEffect, useState } from 'react'
import { fetchFlag, flagsEnabled } from '@/shared/analytics'

/**
 * 대시보드 필터 시작값을 정하는 방식
 * - default: 지금처럼 기본값 (플래그 off)
 * - remember: 마지막 선택 기억 (플래그 on)
 * - fallback: 플래그를 시간 안에 못 받아 기본값으로 그림. 분석에서 따로 거른다
 */
export type FilterMode = 'default' | 'remember' | 'fallback'

export interface FilterModeState {
  mode: FilterMode | 'pending'
  /** 플래그를 받는 데 걸린 시간(ms). 기다리지 않았으면 null. 대기 상한(500ms)의 근거로 쓴다 */
  flagLatencyMs: number | null
}

// Amplitude Experiment 플래그. 콘솔에서 주마다 전체 유저를 on·off로 바꾼다
const FLAG_KEY = 'dashboard-filter-memory'
// 이보다 늦으면 기본값으로 그린다. 첫 화면을 이 이상 비워 두지 않는다
const WAIT_MS = 500

/**
 * 플래그를 받아 모드를 정한다. 받기 전에는 pending
 * Amplitude를 켜지 않는 개발·테스트 환경은 기다리지 않고 바로 default
 */
export function useFilterMode(): FilterModeState {
  const [state, setState] = useState<FilterModeState>(() => ({
    mode: flagsEnabled() ? 'pending' : 'default',
    flagLatencyMs: null,
  }))
  const pending = state.mode === 'pending'

  useEffect(() => {
    if (!pending) return
    let cancelled = false
    const startedAt = performance.now()

    void fetchFlag(FLAG_KEY, WAIT_MS).then((value) => {
      if (cancelled) return
      const flagLatencyMs = Math.round(performance.now() - startedAt)
      if (value === null) setState({ mode: 'fallback', flagLatencyMs })
      else {
        setState({
          mode: value === 'on' ? 'remember' : 'default',
          flagLatencyMs,
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [pending])

  return state
}
