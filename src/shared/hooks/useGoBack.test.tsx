import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useGoBack } from './useGoBack'

function Edit() {
  const goBack = useGoBack('/my')
  return <button onClick={goBack}>뒤로</button>
}

function Home() {
  const navigate = useNavigate()
  return <button onClick={() => navigate('/my/major')}>수정하기</button>
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/my" element={<p>마이페이지</p>} />
        <Route path="/my/major" element={<Edit />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('useGoBack', () => {
  it('앱 안에서 왔으면 바로 전 화면으로 돌아간다', async () => {
    renderAt('/home')

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }))
    await userEvent.click(screen.getByRole('button', { name: '뒤로' }))

    expect(screen.getByRole('button', { name: '수정하기' })).toBeInTheDocument()
  })

  it('주소로 바로 연 첫 화면이면 사이트 밖 대신 대체 경로로 간다', async () => {
    renderAt('/my/major')

    await userEvent.click(screen.getByRole('button', { name: '뒤로' }))

    expect(screen.getByText('마이페이지')).toBeInTheDocument()
  })
})
