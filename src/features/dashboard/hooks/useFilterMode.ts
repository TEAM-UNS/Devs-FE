import { useEffect, useState } from 'react'
import { fetchFlag, flagsEnabled, readCachedFlag } from '@/shared/analytics'

/**
 * 대시보드 필터 시작값을 정하는 방식
 * - default: 지금처럼 기본값 (플래그 off)
 * - remember: 마지막 선택 기억 (플래그 on)
 * - fallback: 이 기기에서 아직 플래그를 받은 적이 없어 기본값으로 그림. 분석에서 따로 거른다
 */
export type FilterMode = 'default' | 'remember' | 'fallback'

/**
 * 모드를 정한 근거
 * - cache: 이 기기에 남은 지난 값 (주 단위 전환 직후 첫 방문만 지난 값일 수 있다)
 * - uncached: 받은 적이 없음 (이 기기의 첫 방문, 또는 광고 차단 등으로 Amplitude가 막힘)
 * - none: Amplitude 꺼짐 (개발·테스트)
 */
export type FlagSource = 'cache' | 'uncached' | 'none'

export interface FilterModeState {
  mode: FilterMode
  flagSource: FlagSource
}

// Amplitude Experiment 플래그. 콘솔에서 주마다 전체 유저를 on·off로 바꾼다
const FLAG_KEY = 'dashboard-filter-memory'
// 최신 값을 뒤에서 받아 두는 상한. 화면은 기다리지 않는다
const REFRESH_MS = 10_000

function readFilterMode(): FilterModeState {
  if (!flagsEnabled()) return { mode: 'default', flagSource: 'none' }

  const cached = readCachedFlag(FLAG_KEY)
  if (cached === null) return { mode: 'fallback', flagSource: 'uncached' }
  return {
    mode: cached === 'on' ? 'remember' : 'default',
    flagSource: 'cache',
  }
}

/**
 * 플래그로 모드를 정한다. 첫 화면은 기다리지 않는다
 *
 * 실측해 보니 Amplitude 초기화가 1초 넘게 걸려 첫 접속에 플래그를 기다리면 빈 화면만 길어지고
 * 결국 시간 안에 못 받는다. 그래서 이 기기에 남은 지난 값으로 바로 정하고, 최신 값은 뒤에서 받아
 * 다음 방문에 쓴다. 남은 값이 없으면 기본값(fallback)으로 그린다
 */
export function useFilterMode(): FilterModeState {
  const [state] = useState(readFilterMode)

  useEffect(() => {
    if (flagsEnabled()) void fetchFlag(FLAG_KEY, REFRESH_MS)
  }, [])

  return state
}
