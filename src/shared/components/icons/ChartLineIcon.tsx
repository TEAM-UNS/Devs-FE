import type { SVGProps } from 'react'

/** 꺾은선 차트 아이콘 — Figma `274:1621`(24px 슬롯) 에셋 그대로, currentColor 상속. */
export function ChartLineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 3V19H21V21H3V3H5ZM20.2929 6.29289L21.7071 7.70711L16 13.4142L13 10.415L8.70711 14.7071L7.29289 13.2929L13 7.58579L16 10.585L20.2929 6.29289Z"
        fill="currentColor"
      />
    </svg>
  )
}
