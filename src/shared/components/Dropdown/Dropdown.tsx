import type { KeyboardEvent } from 'react'
import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import { ArrowIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'

interface DropdownOption {
  /** 화면에 표시할 라벨 */
  label: string
  /** 선택 시 onChange로 전달되는 값 (options 내 고유해야 함) */
  value: string
}

interface DropdownProps {
  /** 선택지 목록 */
  options: DropdownOption[]
  /** 제어(controlled) 선택값 — 주면 컴포넌트가 값을 소유하지 않는다 */
  value?: string
  /** 비제어(uncontrolled) 초기 선택값 */
  defaultValue?: string
  /** 선택 변경 콜백 (선택된 value 전달) */
  onChange?: (value: string) => void
  /** 선택 전 안내 문구 (기본 '선택해주세요') */
  placeholder?: string
  /** 상단 레이블 (없으면 미표시) */
  label?: string
  /** 비활성화 */
  disabled?: boolean
  /** 루트 래퍼에 병합할 클래스 (레이아웃·너비 조정용) */
  className?: string
}

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).

const LABEL_STYLES = 'text-body-md text-white'

// 트리거 골격. 값은 Figma Dropdown(node 123:1336) 기준:
// bg=element, border=gray-200, h48, px16, radius 6px(rounded-sm), 라벨↔값 사이 justify-between.
// transition·focus 링은 Figma엔 없지만 상호작용·키보드 a11y용으로 추가(모션 토큰 사용).
const TRIGGER_BASE = [
  'flex h-12 w-full items-center justify-between gap-2 rounded-sm border px-4',
  'text-left text-body-md',
  'transition-colors duration-fast ease-standard',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  'disabled:cursor-not-allowed',
].join(' ')

// 트리거 서피스 — Figma는 default·disabled 모두 element 배경 + gray-200 테두리.
const TRIGGER_SURFACE = 'border-gray-200 bg-element'

// 펼침 메뉴 — Figma(node 123:1357): element 배경, gray-200 테두리, radius 6px.
// 트리거와 12px 간격(space/12 → mt-3). shadow-lg·max-h·스크롤은 부유 레이어용 추가.
const MENU_STYLES = [
  'absolute inset-x-0 top-full z-dropdown mt-3',
  'max-h-60 overflow-auto',
  'rounded-sm border border-gray-200 bg-element shadow-lg',
].join(' ')

// 옵션 행 — Figma(node 123:1359): h48, px16, 행마다 하단 gray-200 구분선(마지막 제외).
// hover/keyboard-active 하이라이트는 Figma 미정의 → element보다 밝은 gray-200으로 표현.
const OPTION_BASE = [
  'flex h-12 cursor-pointer items-center px-4 text-body-md',
  'border-b border-gray-200 last:border-b-0',
  'transition-colors duration-fast ease-standard',
  'hover:bg-gray-200',
].join(' ')

// 셰브론 슬롯 — Figma 기준 24px 정사각. 열림 시 위로 회전(모션 토큰).
const CHEVRON_WRAP = [
  'inline-flex size-6 shrink-0 items-center justify-center',
  'transition-transform duration-fast ease-standard',
].join(' ')

// Figma 셰브론은 `icon / UI_actions / arrow`와 같은 에셋이라 ArrowIcon(‹)을 아래로 돌려 쓴다.
const CHEVRON_ICON = <ArrowIcon className="size-6 -rotate-90" />

interface DropdownOptionItemProps {
  /** 옵션 DOM id (aria-activedescendant 대상) */
  id: string
  /** 표시 라벨 */
  label: string
  /** 선택 값 */
  value: string
  /** 현재 선택된 옵션인지 */
  selected: boolean
  /** keyboard/pointer 하이라이트 대상인지 */
  active: boolean
  /** 선택 콜백 (value 전달) */
  onSelect: (value: string) => void
}

/**
 * 펼침 메뉴의 옵션 한 행. 클릭·Enter/Space로 자신을 선택한다.
 * 부모의 안정적인 onSelect를 받아 memo로 불필요한 리렌더를 막는다(react-perf).
 *
 * @param props.id 옵션 DOM id
 * @param props.label 표시 라벨
 * @param props.value 선택 값
 * @param props.selected 현재 선택 여부
 * @param props.active 하이라이트 여부
 * @param props.onSelect 선택 콜백
 * @returns role="option" 리스트 항목
 */
const DropdownOptionItem = memo(function DropdownOptionItem({
  id,
  label,
  value,
  selected,
  active,
  onSelect,
}: DropdownOptionItemProps) {
  const handleClick = useCallback(() => {
    onSelect(value)
  }, [onSelect, value])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(value)
      }
    },
    [onSelect, value],
  )

  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        OPTION_BASE,
        selected ? 'text-primary-500' : 'text-white',
        active && 'bg-gray-200',
      )}
    >
      {label}
    </li>
  )
})

/**
 * 공용 셀렉트 드롭다운. 트리거(선택 라벨 + 셰브론)와 펼침 메뉴(옵션 목록)로 구성되며,
 * 클릭·키보드로 열고 닫는다. 제어(value)·비제어(defaultValue) 모두 지원한다.
 * 색·치수·타이포는 Figma "Dropdown" 컴포넌트를 그대로 구현했다(다크 서피스 기준).
 * 바깥 클릭·Escape로 닫히고, 방향키/Enter로 옵션을 이동·선택할 수 있다.
 *
 * @param props.options 선택지 목록({ label, value })
 * @param props.value 제어 선택값 (주면 값 소유권이 부모에게 있다)
 * @param props.defaultValue 비제어 초기 선택값
 * @param props.onChange 선택 변경 콜백 (선택된 value)
 * @param props.placeholder 선택 전 안내 문구 (기본 '선택해주세요')
 * @param props.label 상단 레이블
 * @param props.disabled 비활성화 여부
 * @param props.className 루트 래퍼에 병합할 클래스
 * @returns 레이블·트리거·펼침 메뉴를 포함한 셀렉트 드롭다운
 */
export function Dropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = '선택해주세요',
  label,
  disabled = false,
  className,
}: DropdownProps) {
  const reactId = useId()
  const triggerId = `${reactId}-trigger`
  const listboxId = `${reactId}-listbox`
  const labelId = `${reactId}-label`

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [internalValue, setInternalValue] = useState(defaultValue)

  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue
  const selectedIndex = options.findIndex((o) => o.value === selectedValue)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined
  const displayLabel = selectedOption ? selectedOption.label : placeholder

  const valueColor = disabled
    ? 'text-gray-200'
    : selectedOption
      ? 'text-white'
      : 'text-gray-300'

  // 메뉴가 열릴 때 keyboard-active 위치를 현재 선택값(없으면 첫 항목)으로 맞춘다.
  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [open, selectedIndex])

  // 바깥 포인터 클릭 시 닫는다.
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const handleSelect = useCallback(
    (nextValue: string) => {
      if (value === undefined) setInternalValue(nextValue)
      onChange?.(nextValue)
      setOpen(false)
      triggerRef.current?.focus()
    },
    [value, onChange],
  )

  const handleTriggerClick = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          if (!open) setOpen(true)
          else setActiveIndex((i) => Math.min(i + 1, options.length - 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          if (!open) setOpen(true)
          else setActiveIndex((i) => Math.max(i - 1, 0))
          break
        case 'Home':
          if (open) {
            event.preventDefault()
            setActiveIndex(0)
          }
          break
        case 'End':
          if (open) {
            event.preventDefault()
            setActiveIndex(options.length - 1)
          }
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (!open) setOpen(true)
          else if (activeIndex >= 0 && activeIndex < options.length)
            handleSelect(options[activeIndex].value)
          break
        case 'Escape':
          if (open) {
            event.preventDefault()
            setOpen(false)
          }
          break
        case 'Tab':
          if (open) setOpen(false)
          break
        default:
          break
      }
    },
    [open, options, activeIndex, handleSelect],
  )

  return (
    <div
      className={cn('flex w-full flex-col gap-1.5', className)}
      ref={rootRef}
    >
      {label && (
        <label id={labelId} htmlFor={triggerId} className={LABEL_STYLES}>
          {label}
        </label>
      )}
      <div className="relative w-full">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0
              ? `${reactId}-option-${activeIndex}`
              : undefined
          }
          aria-labelledby={label ? `${labelId} ${triggerId}` : undefined}
          disabled={disabled}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          className={cn(TRIGGER_BASE, TRIGGER_SURFACE)}
        >
          <span className={cn('flex-1 truncate text-left', valueColor)}>
            {displayLabel}
          </span>
          <span
            className={cn(
              CHEVRON_WRAP,
              disabled ? 'text-gray-200' : 'text-gray-300',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          >
            {CHEVRON_ICON}
          </span>
        </button>
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className={MENU_STYLES}
          >
            {options.map((option, index) => (
              <DropdownOptionItem
                key={option.value}
                id={`${reactId}-option-${index}`}
                label={option.label}
                value={option.value}
                selected={option.value === selectedValue}
                active={index === activeIndex}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
