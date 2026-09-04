import { useEffect, useState } from 'react'
import { mockReportAt } from '../../fixtures/mockReport'
import type { JobFilter } from '../../types'
import { JobFilters } from '../JobFilters'
import { ReportCard, ReportCardBody } from '../ReportCard'
import { WeekDeck } from '../WeekDeck'
import { WeekNavigator } from '../WeekNavigator'

/* 과거로 볼 수 있는 최대 주 수. 서버가 보관 기간을 정하면 그 값으로 바꾼다. */
const OLDEST_WEEK_OFFSET = 8

/* 이동이 끝나기를 기다리는 최대 시간(ms). --duration-slow(400) + 여유.
   애니메이션이 돌지 않는 환경(모션 최소화·테스트)에서는 animationend가 오지 않는다.
   이 대비가 없으면 주차가 영영 바뀌지 않고 화살표도 잠긴 채로 남는다. */
const SLIDE_TIMEOUT = 600

/**
 * 주간 리포트 본문 — 주차 네비 · 직군 필터 · 리포트 카드 · 푸터 문구.
 * 폭·간격은 Figma `리포트`(325:1962) 기준이다.
 *
 * ⚠️ 아직 퍼블리싱 단계다. 데이터는 전부 목데이터다.
 */
export function WeeklyReport() {
  /* 직군 필터와 보고 있는 주차를 상태로 둔다.
     URL 쿼리로 올릴지는 아직 정하지 않았다 — 공유·새로고침·뒤로가기 동작이 달라지는
     결정이라 데이터 연동 시점에 함께 정한다. */
  const [jobFilter, setJobFilter] = useState<JobFilter>('ALL')
  /* 보고 있는 주차와, 넘기는 중이라면 그 방향.
     방향이 있는 동안은 카드가 이동 중이고, 이동이 끝나야 주차가 실제로 바뀐다.
     그래야 애니메이션의 끝 모습과 바뀐 뒤의 모습이 같은 자리라 교체가 보이지 않는다. */
  const [weekOffset, setWeekOffset] = useState(0)
  const [slidingTo, setSlidingTo] = useState<-1 | 1 | null>(null)

  /* 0이 가장 최근 주차다. 아직 끝나지 않은 주는 집계가 없으므로 미래로는 못 간다.
     과거 하한(8주)은 임의값이다 — 서버가 보관 기간을 정하면 그 값으로 바꾼다. */
  const canPrevious = weekOffset > -OLDEST_WEEK_OFFSET
  const canNext = weekOffset < 0

  const handleStep = (direction: -1 | 1) => {
    // 이동 중에는 새 입력을 무시한다 — 큐에 쌓으면 어디로 가는지 알 수 없어진다.
    if (slidingTo) return

    const offset = weekOffset + direction
    if (offset > 0 || offset < -OLDEST_WEEK_OFFSET) return

    setSlidingTo(direction)
  }

  const handleSlideEnd = () => {
    if (!slidingTo) return

    setWeekOffset((current) => current + slidingTo)
    setSlidingTo(null)
  }

  /* animationend가 오지 않아도 반드시 넘어가게 한다. 모션 최소화 설정이면 애니메이션이
     아예 돌지 않아 그 신호가 없고, 그대로 두면 화살표가 잠긴 채 주차가 멈춘다. */
  useEffect(() => {
    if (!slidingTo) return

    const timer = setTimeout(() => {
      setWeekOffset((current) => current + slidingTo)
      setSlidingTo(null)
    }, SLIDE_TIMEOUT)

    return () => clearTimeout(timer)
  }, [slidingTo])

  const { collectedCount, ...report } = mockReportAt(weekOffset)
  const previous = mockReportAt(weekOffset - 1)
  const next = mockReportAt(weekOffset + 1)

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
        filters={<JobFilters selected={jobFilter} onSelect={setJobFilter} />}
        footer={
          <p className="text-center text-body-sm text-gray-200">
            이번 주 수집된 {collectedCount.toLocaleString()}개의 공고를 분석한
            결과입니다.
          </p>
        }
      >
        <ReportCard {...report} />
      </WeekDeck>
    </div>
  )
}
