import type { ComponentType, SVGProps } from 'react'
import {
  BackendIcon,
  DataAiIcon,
  DevOpsIcon,
  EmbeddedIcon,
  EtcIcon,
  FrontendIcon,
  GameIcon,
  MobileIcon,
  SecurityIcon,
} from './majorIcons'

type MajorIconComponent = ComponentType<SVGProps<SVGSVGElement>>

/* 아이콘은 Figma `전공 아이콘`(130:1412)에서 가져왔다
   회원가입과 로드맵이 같이 쓰므로 공용에 둔다 */
const MAJOR_ICONS: Record<string, MajorIconComponent> = {
  BACKEND: BackendIcon,
  FRONTEND: FrontendIcon,
  DEVOPS: DevOpsIcon,
  SECURITY: SecurityIcon,
  MOBILE: MobileIcon,
  DATA_AI: DataAiIcon,
  GAME: GameIcon,
  EMBEDDED: EmbeddedIcon,
}

/** 서버 전공 코드에 맞는 아이콘. 표에 없는 코드가 오면 기타 아이콘 */
export function majorIcon(code: string): MajorIconComponent {
  return MAJOR_ICONS[code] ?? EtcIcon
}
