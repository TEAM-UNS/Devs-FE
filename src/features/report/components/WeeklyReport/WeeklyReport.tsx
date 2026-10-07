import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { trackEvent } from '@/shared/analytics'
import { userQueries } from '@/shared/api'
import { useWeekReport } from '../../hooks/useWeekReport'
import type { MajorOption } from '../../types'
import {
  LATEST_WEEK,
  parseReportParams,
  REPORT_PARAMS,
} from '../../utils/reportParams'
import { weekOffsetOf } from '../../utils/weekRange'
import { MajorFilters } from '../MajorFilters'
import { ReportCard, ReportCardBody } from '../ReportCard'
import { WeekDeck } from '../WeekDeck'
import { WeekNavigator } from '../WeekNavigator'

/* 볼 수 있는 가장 오래된 주의 월요일. 그 전은 크롤링 초기라 데이터가 부실하다 */
const OLDEST_WEEK_START = '2026-06-01'

/* 이동이 끝나기를 기다리는 최대 시간(ms). --duration-slow(400) + 여유.
   애니메이션이 돌지 않는 환경(모션 최소화·테스트)에서는 animationend가 오지 않는다.
   이 대비가 없으면 주차가 영영 바뀌지 않고 화살표도 잠긴 채로 남는다. */
const SLIDE_TIMEOUT = 600

const ALL_MAJORS: MajorOption = { value: null, label: '전체' }

/** URL 쿼리에서 한 값만 바꾼 새 쿼리. 기본값(지난주·전체)이면 키를 지워 주소를 짧게 둔다 */
function withParam(
  current: URLSearchParams,
  key: string,
  value: number | null,
): URLSearchParams {
  const next = new URLSearchParams(current)
  if (value === null || (key === REPORT_PARAMS.week && value === LATEST_WEEK)) {
    next.delete(key)
  } else {
    next.set(key, String(value))
  }

  return next
}

/**
 * 주간 리포트 본문 — 주차 네비 · 전공 필터 · 리포트 카드 · 푸터 문구.
 * 폭·간격은 Figma `리포트`(325:1962) 기준이다.
 *
 * 주차와 전공은 URL 쿼리(`?week=-1&major=3`)에 둔다 — 새로고침·공유·뒤로가기가 그대로 동작한다.
 */
export function WeeklyReport() {
  const [searchParams, setSearchParams] = useSearchParams()
  /* 넘기는 중이라면 그 방향.
     방향이 있는 동안은 카드가 이동 중이고, 이동이 끝나야 주차가 실제로 바뀐다.
     그래야 애니메이션의 끝 모습과 바뀐 뒤의 모습이 같은 자리라 교체가 보이지 않는다. */
  const [slidingTo, setSlidingTo] = useState<-1 | 1 | null>(null)
  /* 이동이 끝나 URL로 보낸 주차. 라우터는 주소 변경을 transition으로 늦게 반영해서,
     URL만 보면 이동이 끝난 한 프레임 동안 카드가 이전 주차로 가운데에 돌아와 보인다.
     URL이 따라오면 비운다 */
  const [pendingWeek, setPendingWeek] = useState<number | null>(null)

  const me = useQuery(userQueries.me())

  /* 0이 이번 주다. 볼 수 있는 건 지난주(LATEST_WEEK)부터 6월 첫 주까지다 */
  const oldest = weekOffsetOf(OLDEST_WEEK_START)

  const params = parseReportParams(searchParams)
  const urlWeek = params.week < oldest ? LATEST_WEEK : params.week
  const weekOffset = pendingWeek ?? urlWeek

  const majors = me.data?.majors
  // 내 전공이 아닌 id는 전체로 돌린다. 프로필을 아직 모르면 URL 값을 그대로 쓴다
  const majorId =
    params.major !== null &&
    majors &&
    !majors.some(({ majorId: id }) => id === params.major)
      ? null
      : params.major
  const majorOptions: MajorOption[] = [
    ALL_MAJORS,
    ...(majors ?? []).map(({ majorId: value, majorName: label }) => ({
      value,
      label,
    })),
  ]

  useEffect(() => {
    if (pendingWeek !== null && urlWeek === pendingWeek) setPendingWeek(null)
  }, [pendingWeek, urlWeek])

  const canPrevious = weekOffset > oldest
  const canNext = weekOffset < LATEST_WEEK

  const handleStep = (direction: -1 | 1) => {
    // 이동 중에는 새 입력을 무시한다 — 큐에 쌓으면 어디로 가는지 알 수 없어진다.
    if (slidingTo) return

    const offset = weekOffset + direction
    if (offset > LATEST_WEEK || offset < oldest) return

    // 사용자들이 주간 리포트를 보러 다시 방문하는지 또 과거 리포트를 보는 확인하기 위함 이벤트 수집
    trackEvent('Report Week Changed', {
      direction: direction === -1 ? 'previous' : 'next',
      week_offset: offset,
    })

    setSlidingTo(direction)
  }

  const handleSlideEnd = () => {
    if (!slidingTo) return

    const target = weekOffset + slidingTo
    setPendingWeek(target)
    // 기본(push)으로 남겨 브라우저 뒤로가기로 이전 주차에 돌아갈 수 있게 한다
    setSearchParams((current) => withParam(current, REPORT_PARAMS.week, target))
    setSlidingTo(null)
  }

  /* animationend가 오지 않아도 반드시 넘어가게 한다. 모션 최소화 설정이면 애니메이션이
     아예 돌지 않아 그 신호가 없고, 그대로 두면 화살표가 잠긴 채 주차가 멈춘다. */
  useEffect(() => {
    if (!slidingTo) return

    const timer = setTimeout(() => {
      const target = weekOffset + slidingTo
      setPendingWeek(target)
      setSearchParams((current) =>
        withParam(current, REPORT_PARAMS.week, target),
      )
      setSlidingTo(null)
    }, SLIDE_TIMEOUT)

    return () => clearTimeout(timer)
  }, [slidingTo, weekOffset, setSearchParams])

  const handleSelectMajor = (value: number | null) => {
    setSearchParams((current) => withParam(current, REPORT_PARAMS.major, value))
  }

  const { collectedCount, ...report } = useWeekReport(weekOffset, majorId)
  // 갈 수 없는 주차(이번 주·하한 너머)의 이웃 카드는 요청하지 않고 빈 카드로 둔다
  const previous = useWeekReport(
    weekOffset - 1,
    majorId,
    weekOffset - 1 >= oldest,
  )
  const next = useWeekReport(
    weekOffset + 1,
    majorId,
    weekOffset + 1 <= LATEST_WEEK,
  )

  /* 헤더는 **도착할 주차**를 먼저 보여준다. 이동이 끝난 뒤에 바꾸면 카드는 이미 새 주차인데
     글자만 400ms 늦게 툭 바뀌어 따로 노는 것처럼 보인다.
     도착지는 항상 위 셋 중 하나라 새로 만들지 않고 골라 쓴다. */
  const shownWeek = (
    slidingTo === 1 ? next : slidingTo === -1 ? previous : report
  ).week

  return (
    <div className="h-full">
      <WeekDeck
        previous={<ReportCardBody {...previous} />}
        next={<ReportCardBody {...next} />}
        slidingTo={slidingTo}
        onSlideEnd={handleSlideEnd}
        onSwipe={handleStep}
        header={
          /* 주차 네비와 본문 사이 간격은 0이다 (Figma 335:2838 V gap0) */
          <WeekNavigator
            week={shownWeek}
            onStep={handleStep}
            canPrevious={canPrevious}
            canNext={canNext}
          />
        }
        filters={
          <MajorFilters
            options={majorOptions}
            selected={majorId}
            onSelect={handleSelectMajor}
          />
        }
        footer={
          <p className="text-center text-body-sm text-gray-200">
            이 주에 수집된 {collectedCount.toLocaleString()}개의 공고를 분석한
            결과입니다.
          </p>
        }
      >
        <ReportCard {...report} />
      </WeekDeck>
    </div>
  )
}
