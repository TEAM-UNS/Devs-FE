import { Link } from 'react-router-dom'
import { DevsLogo } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import githubIcon from '@/assets/landing/footer-github.webp'
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  TEAM_MEMBERS,
} from '../../constants/content'

// 라벨과 값 사이 세로 구분선
const DIVIDER = <span className="h-4 w-px bg-gray-200" aria-hidden="true" />

/** 랜딩 하단 — 연락처와 팀 구성 */
export function LandingFooter() {
  return (
    <footer className="mt-[85px] flex flex-col gap-5 bg-black p-12">
      <div className="flex items-center justify-between">
        <DevsLogo className="h-8" />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <img src={githubIcon} alt="" className="size-8" />
        </a>
      </div>
      <hr className="border-gray-100" />
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5 text-body-md text-white">
          <p className="flex items-center gap-3">
            Contact
            {DIVIDER}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-body-lg">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="flex items-center gap-3">
            Team UNS
            {DIVIDER}
            {TEAM_MEMBERS.map(({ role, name }) => (
              <span key={role} className="flex gap-1">
                <span className="font-semibold">{role}</span>
                {name}
              </span>
            ))}
          </p>
        </div>
        {/* Figma 푸터는 개인정보처리방침 링크만 있다. 이용약관을 옆에 두고, 방침은 관행대로 굵게 구분한다 */}
        <div className="flex flex-col items-end gap-1.5 text-body-lg text-gray-200">
          <nav aria-label="약관 및 정책" className="flex items-center gap-3">
            <Link to={ROUTES.terms} className="underline">
              이용약관
            </Link>
            {DIVIDER}
            <Link to={ROUTES.privacy} className="font-semibold underline">
              개인정보처리방침
            </Link>
          </nav>
          <p>© 2026 UNS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
