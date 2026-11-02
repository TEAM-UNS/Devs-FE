import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CareerGoalCard } from './CareerGoalCard'

function renderCard(
  majors: string,
  skills: string[],
  retrospectCount?: number,
) {
  return render(
    <MemoryRouter>
      <CareerGoalCard
        majors={majors}
        skills={skills}
        retrospectCount={retrospectCount}
      />
    </MemoryRouter>,
  )
}

describe('CareerGoalCard', () => {
  it('목표직무·관심 스택을 내 정보로 보여주고 각 수정 화면으로 보낸다', () => {
    renderCard('프론트엔드', ['React', 'Vue.js', 'Next.js'])

    expect(screen.getByText('프론트엔드')).toBeInTheDocument()
    expect(screen.getByText('React, Vue.js, Next.js')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '목표직무 수정' })).toHaveAttribute(
      'href',
      '/my/major',
    )
    expect(
      screen.getByRole('link', { name: '관심 스택 수정' }),
    ).toHaveAttribute('href', '/my/tech-stack')
  })

  it('내 회고 보기는 개수를 보여주고 내 회고 몰아보기로 보낸다', () => {
    renderCard('프론트엔드', ['React'], 6)

    expect(screen.getByText('6개')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '내 회고 보기 열기' }),
    ).toHaveAttribute('href', '/my/retrospects')
  })

  it('나의 로드맵은 아직 값이 없고 누를 수 없다', () => {
    renderCard('프론트엔드', ['React'], 6)

    expect(screen.getByText('나의 로드맵')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })

  it('전공·스택·개수를 모르면 — 로 보여준다', () => {
    renderCard('', [])

    expect(screen.getAllByText('—')).toHaveLength(4)
  })
})
