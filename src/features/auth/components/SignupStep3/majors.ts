import type { ComponentType, SVGProps } from 'react'
import type { MajorCategoryDto } from '@/shared/api'
import {
  AiIcon,
  AndroidIcon,
  BackendIcon,
  DatabaseIcon,
  DesignIcon,
  DevOpsIcon,
  EtcIcon,
  FrontendIcon,
  IosIcon,
  SecurityIcon,
} from './majorIcons'

export interface MajorOption {
  /** 서버 전공 id를 문자열로 담는다 — 선택 스키마가 `string[]`이라 그대로 맞춘다 */
  id: string
  /** 카드·그룹 헤더 라벨 */
  label: string
  /** 카드 아이콘 (currentColor) */
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

type Presentation = Pick<MajorOption, 'label' | 'Icon'>

/**
 * 서버 전공 ENUM(`"BACKEND"`) → 화면 표기.
 *
 * 서버는 표시용 라벨을 주지 않고 ENUM 문자열만 준다. 그런데 디자인은 `iOS`·`DevOps`처럼
 * 대소문자가 정해진 표기와 전공별 아이콘을 쓰므로, 목록은 서버에서 받고 표기만 여기서 잇는다.
 * 아이콘 순서·라벨은 Figma `전공 아이콘` 컴포넌트(130:1412) 기준이다.
 */
const PRESENTATION: Record<string, Presentation> = {
  BACKEND: { label: 'Backend', Icon: BackendIcon },
  FRONTEND: { label: 'Frontend', Icon: FrontendIcon },
  DEVOPS: { label: 'DevOps', Icon: DevOpsIcon },
  ANDROID: { label: 'Android', Icon: AndroidIcon },
  IOS: { label: 'iOS', Icon: IosIcon },
  AI: { label: 'AI', Icon: AiIcon },
  DATABASE: { label: 'Database', Icon: DatabaseIcon },
  SECURITY: { label: 'Security', Icon: SecurityIcon },
  DESIGN: { label: 'Design', Icon: DesignIcon },
  ETC: { label: 'Etc', Icon: EtcIcon },
}

/**
 * 서버 전공을 화면용 선택지로 바꾼다.
 * 표기표에 없는 ENUM이 와도 목록에서 사라지지 않도록 원문 라벨 + 기본 아이콘으로 떨어진다.
 *
 * @param category 서버가 준 전공
 * @returns 카드에 그릴 선택지
 */
export function toMajorOption(category: MajorCategoryDto): MajorOption {
  const presentation = PRESENTATION[category.major] ?? {
    label: category.major,
    Icon: EtcIcon,
  }

  return { id: String(category.id), ...presentation }
}
