import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from './useToastStore'

const show = (title: string, type: 'error' | 'success' = 'error') =>
  useToastStore.getState().show({ type, title })
const toasts = () => useToastStore.getState().toasts

beforeEach(() => {
  useToastStore.setState({ toasts: [] })
})

describe('useToastStore', () => {
  it('같은 종류·문구가 떠 있는 동안에는 다시 쌓지 않는다', () => {
    show('서버 응답이 없어요.')
    show('서버 응답이 없어요.')

    expect(toasts()).toHaveLength(1)
  })

  it('문구나 종류가 다르면 따로 띄운다', () => {
    show('서버 응답이 없어요.')
    show('요청에 실패했어요.')
    show('서버 응답이 없어요.', 'success')

    expect(toasts()).toHaveLength(3)
  })

  it('사라진 뒤 같은 문구가 다시 오면 새로 띄운다', () => {
    show('서버 응답이 없어요.')
    const [first] = toasts()
    useToastStore.getState().dismiss(first.id)

    show('서버 응답이 없어요.')

    expect(toasts()).toHaveLength(1)
    expect(toasts()[0].id).not.toBe(first.id)
  })
})
