import type { ComponentType, SVGProps } from 'react'
import { majorLabel } from '@/shared/api'
import type { MajorCategoryDto } from '@/shared/api'
import {
  BackendIcon,
  DevOpsIcon,
  EtcIcon,
  FrontendIcon,
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

/**
 * 서버 전공 코드 → 카드 아이콘. 라벨은 대시보드와 같이 쓰도록 `majorLabel`에 있다
 * 아이콘은 Figma `전공 아이콘`(130:1412)에 있는 것만 쓰고, 없는 전공은 기타 아이콘으로 둔다
 */
const MAJOR_ICONS: Record<string, MajorOption['Icon']> = {
  BACKEND: BackendIcon,
  FRONTEND: FrontendIcon,
  DEVOPS: DevOpsIcon,
  SECURITY: SecurityIcon,
}

/**
 * 서버 전공을 화면용 선택지로 바꾼다.
 *
 * @param category 서버가 준 전공
 * @returns 카드에 그릴 선택지
 */
export function toMajorOption(category: MajorCategoryDto): MajorOption {
  return {
    id: String(category.id),
    label: majorLabel(category.major),
    Icon: MAJOR_ICONS[category.major] ?? EtcIcon,
  }
}
