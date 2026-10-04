import { Chip } from '@/shared/components/Chip'
import { ArrowIcon } from '@/shared/components/icons'

interface SkillStackCardProps {
  readonly skills: string[]
}

/**
 * 보유 기술 스택 카드. 태그가 많아지면 줄바꿈된다
 *
 * @param props.skills 태그로 보여줄 기술 이름
 * @returns 제목·수정 화살표·기술 태그가 담긴 카드
 */
export function SkillStackCard({ skills }: SkillStackCardProps) {
  return (
    <section className="rounded-sm bg-container px-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg font-semibold text-gray-1000">
          보유 기술 스택
        </h2>

        {/* TODO: 보유 기술 스택 수정 화면이 생기면 연결한다 */}
        <button
          type="button"
          disabled
          aria-label="보유 기술 스택 수정"
          className="flex size-6 items-center justify-center text-gray-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ArrowIcon className="size-6 rotate-180" />
        </button>
      </div>

      <ul className="mt-5 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <li key={skill}>
            <Chip icon="#">{skill}</Chip>
          </li>
        ))}
      </ul>
    </section>
  )
}
