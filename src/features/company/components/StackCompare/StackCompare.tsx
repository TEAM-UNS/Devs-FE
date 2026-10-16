import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { useToastStore } from '@/shared/stores/useToastStore'
import { companyQueries } from '../../api'
import type { CompareKind } from '../../api/requests'
import { MAX_COMPARE, MIN_COMPARE } from '../../constants/compare'
import type { ComparedCompany } from '../../types'
import { compareSearch, parseCompareIds } from '../../utils/compareParams'
import { CompanyComparison } from '../CompanyComparison'
import { CompanySelect } from '../CompanySelect'

/** '다시 비교하기'가 고르기 화면에 넘기는 라우터 state */
interface SelectState {
  selected?: ComparedCompany[]
}

/**
 * 기업 고르기 화면
 * 목록은 20개씩 받아서, 고른 기업은 지금 받은 페이지에 없을 수도 있다. 그래서 칩에 띄울
 * 이름까지 상태에 들고 있는다
 */
export function StackCompareSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  // '다시 비교하기'로 돌아오면 결과 화면이 넘긴 기업을 고른 채로 시작한다
  const [selected, setSelected] = useState<ComparedCompany[]>(
    () => (location.state as SelectState | null)?.selected ?? [],
  )
  const [keyword, setKeyword] = useState('')
  // TODO: 글자마다 요청한다. 요청 수를 측정한 뒤 디바운스 도입 여부를 정한다
  const list = useInfiniteQuery(companyQueries.list(keyword.trim()))

  function handleToggle(company: ComparedCompany) {
    if (selected.some(({ id }) => id === company.id)) {
      setSelected(selected.filter(({ id }) => id !== company.id))
      return
    }
    if (selected.length >= MAX_COMPARE) {
      useToastStore.getState().show({
        type: 'info',
        title: `최대 ${MAX_COMPARE}개까지 비교할 수 있어요`,
      })
      return
    }
    setSelected([...selected, { id: company.id, name: company.name }])
  }

  return (
    <CompanySelect
      companies={list.data?.pages.flatMap((page) => page.companies) ?? []}
      selected={selected}
      keyword={keyword}
      onKeywordChange={setKeyword}
      canLoadMore={list.hasNextPage && !list.isFetchingNextPage}
      onLoadMore={list.fetchNextPage}
      onToggle={handleToggle}
      onCompare={() => {
        const ids = selected.map(({ id }) => id)
        navigate(`${ROUTES.stackCompareResult}${compareSearch(ids)}`)
      }}
    />
  )
}

/**
 * 비교 결과 화면. URL의 기업이 두 곳 미만이면 고르기 화면으로 돌려보낸다
 * 요청 5개를 함께 보내고 도착한 카드부터 그린다. 실패는 공통 에러 토스트가 알린다
 */
export function StackCompareResult() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ids = parseCompareIds(searchParams)
  const enabled = ids.length >= MIN_COMPARE

  const compare = <K extends CompareKind>(kind: K) => ({
    ...companyQueries.compare(kind, ids),
    enabled,
  })
  const topSkills = useQuery(compare('top-skills'))
  const commonSkills = useQuery(compare('common-skills'))
  const mentions = useQuery(compare('skill-mentions'))
  const matchRates = useQuery(compare('match-rates'))
  const postingCounts = useQuery(compare('posting-counts'))

  if (!enabled) return <Navigate to={ROUTES.stackCompare} replace />

  /* 언급량 응답에는 기업 이름이 없어서, 이름이 있는 응답 중 먼저 온 것에서 찾는다 */
  const named = [topSkills, matchRates, postingCounts].flatMap<{
    companyId: number
    name: string
  }>(({ data }) => data?.companies ?? [])
  const companies: ComparedCompany[] = ids.map((id) => ({
    id,
    name: named.find(({ companyId }) => companyId === id)?.name ?? '',
  }))

  return (
    <CompanyComparison
      companies={companies}
      topSkills={topSkills.data?.companies ?? []}
      commonSkills={commonSkills.data?.skills ?? []}
      mentions={mentions.data?.skills ?? []}
      matchRates={matchRates.data?.companies ?? []}
      postingCounts={postingCounts.data?.companies ?? []}
      onRecompare={() =>
        navigate(ROUTES.stackCompare, {
          state: {
            selected: companies.filter(({ name }) => name),
          } satisfies SelectState,
        })
      }
    />
  )
}
