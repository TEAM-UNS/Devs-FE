import type { Retrospect } from '../types'

/** 흐르는 줄 수 (Figma 2079:11912) */
export const ROW_COUNT = 3

/** 회고를 줄마다 차례로 나눈다 — 최신순이라 최근 회고가 세 줄 앞쪽에 고르게 놓인다 */
export function splitIntoRows(
  retrospects: readonly Retrospect[],
): Retrospect[][] {
  const rows: Retrospect[][] = Array.from({ length: ROW_COUNT }, () => [])
  retrospects.forEach((retrospect, index) => {
    rows[index % ROW_COUNT].push(retrospect)
  })
  return rows.filter((row) => row.length > 0)
}

/**
 * 서버는 제목을 주지 않아 며칠째 회고인지로 만든다
 * 내 회고 몰아보기에서는 익명이 아니라 '내 로드맵'으로 부른다 (Figma 2217:8656)
 */
export function retrospectTitle(dayNo: number, mine = false): string {
  return `${mine ? '내 로드맵' : '익명 러너의 로드맵'} - Day${dayNo}`
}

/** '2026-10-26' → '2026.10.26' (Figma 표기) */
export function formatBoardDate(date: string): string {
  return date.replaceAll('-', '.')
}
