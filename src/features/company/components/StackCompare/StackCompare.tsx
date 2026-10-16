import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { useToastStore } from '@/shared/stores/useToastStore'
import { MAX_COMPARE, MIN_COMPARE } from '../../constants/compare'
import { MOCK_COMPANIES, mockComparison } from '../../fixtures/mockCompanies'
import { compareSearch, parseCompareIds } from '../../utils/compareParams'
import { CompanyComparison } from '../CompanyComparison'
import { CompanySelect } from '../CompanySelect'

/* TODO: API 연동 때 목데이터를 GET /company(keyword)와 비교 API 5개로 바꾼다 */

/** id 순서대로 기업을 찾는다. 목록에 없는 id는 버린다 */
const findCompanies = (ids: readonly number[]) =>
  ids.flatMap((id) => MOCK_COMPANIES.find((company) => company.id === id) ?? [])

/** 기업 고르기 화면 */
export function StackCompareSelect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // '다시 비교하기'로 돌아오면 URL의 기업을 고른 채로 시작한다
  const [selectedIds, setSelectedIds] = useState(() =>
    parseCompareIds(searchParams),
  )
  const [keyword, setKeyword] = useState('')

  function handleToggle(id: number) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
      return
    }
    if (selectedIds.length >= MAX_COMPARE) {
      useToastStore.getState().show({
        type: 'info',
        title: `최대 ${MAX_COMPARE}개까지 비교할 수 있어요`,
      })
      return
    }
    setSelectedIds([...selectedIds, id])
  }

  const query = keyword.trim().toLowerCase()
  const companies = MOCK_COMPANIES.filter(({ name }) =>
    name.toLowerCase().includes(query),
  )

  return (
    <CompanySelect
      companies={companies}
      selected={findCompanies(selectedIds)}
      keyword={keyword}
      onKeywordChange={setKeyword}
      onToggle={handleToggle}
      onCompare={() =>
        navigate(`${ROUTES.stackCompareResult}${compareSearch(selectedIds)}`)
      }
    />
  )
}

/** 비교 결과 화면. URL의 기업이 두 곳 미만이면 고르기 화면으로 돌려보낸다 */
export function StackCompareResult() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const companies = findCompanies(parseCompareIds(searchParams))

  if (companies.length < MIN_COMPARE) {
    return <Navigate to={ROUTES.stackCompare} replace />
  }

  const ids = companies.map(({ id }) => id)

  return (
    <CompanyComparison
      companies={companies}
      {...mockComparison(companies)}
      onRecompare={() =>
        navigate(`${ROUTES.stackCompare}${compareSearch(ids)}`)
      }
    />
  )
}
