import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Company } from '../../types'
import { CompanyCard } from './CompanyCard'

const company = (logoUrl: string | null): Company => ({
  id: 1,
  name: '네이버 (NAVER)',
  description: '소개',
  logoUrl,
})

const renderCard = (logoUrl: string | null) =>
  render(
    <CompanyCard
      company={company(logoUrl)}
      selected={false}
      onToggle={vi.fn()}
    />,
  )

describe('CompanyCard 로고', () => {
  it('주소가 있으면 로고 이미지를 보여준다', () => {
    const { container } = renderCard('https://cdn.example.com/naver.png')

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.example.com/naver.png',
    )
  })

  it('로고가 없으면(null) 빈 칸을 보여준다', () => {
    const { container } = renderCard(null)

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('이미지를 못 불러오면 깨진 이미지 대신 빈 칸으로 바꾼다', () => {
    const { container } = renderCard('https://cdn.example.com/broken.png')

    fireEvent.error(container.querySelector('img') as HTMLImageElement)

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
