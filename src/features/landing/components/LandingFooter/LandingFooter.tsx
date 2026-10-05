import githubIcon from '@/assets/landing/footer-github.webp'
import devsLogo from '@/assets/landing/logo-footer.svg'
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
        <img src={devsLogo} alt="Devs" className="h-8 w-[168px]" />
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
        <p className="text-body-lg text-gray-200">
          © 2026 UNS. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
