import type { SVGProps } from 'react'

/** Google 브랜드 로고(4색 고정, currentColor 아님). */
export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.5 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.9a5.05 5.05 0 0 1-2.19 3.32v2.76h3.54c2.07-1.91 3.26-4.72 3.26-8.06z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.76c-.98.66-2.24 1.06-3.74 1.06-2.87 0-5.3-1.94-6.17-4.55H2.18v2.85A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.83 14.09a6.6 6.6 0 0 1 0-4.18V7.06H2.18a11 11 0 0 0 0 9.88l3.65-2.85z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.07.56 4.21 1.64l3.15-3.15A10.5 10.5 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.65 2.85C6.7 7.3 9.13 4.75 12 4.75z"
      />
    </svg>
  )
}
