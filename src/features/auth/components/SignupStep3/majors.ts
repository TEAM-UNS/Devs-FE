import type { ComponentType, SVGProps } from 'react'
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

export interface Major {
  /** 선택 값(고유) */
  id: string
  /** 카드 라벨 */
  label: string
  /** 카드 아이콘 (currentColor) */
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

/**
 * 전공 선택지 — Figma `전공 아이콘` 컴포넌트(130:1412)의 10개 variant 순서와 같다.
 * 라벨은 추후 서버 연동 시 교체될 목데이터다.
 */
export const MAJORS: Major[] = [
  { id: 'backend', label: 'Backend', Icon: BackendIcon },
  { id: 'frontend', label: 'Frontend', Icon: FrontendIcon },
  { id: 'devops', label: 'DevOps', Icon: DevOpsIcon },
  { id: 'android', label: 'Android', Icon: AndroidIcon },
  { id: 'ios', label: 'iOS', Icon: IosIcon },
  { id: 'ai', label: 'AI', Icon: AiIcon },
  { id: 'database', label: 'Database', Icon: DatabaseIcon },
  { id: 'security', label: 'Security', Icon: SecurityIcon },
  { id: 'design', label: 'Design', Icon: DesignIcon },
  { id: 'etc', label: 'Etc', Icon: EtcIcon },
]
