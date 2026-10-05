import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/Button'
import { ROUTES } from '@/shared/constants'
import { HERO_DESCRIPTION, HERO_TITLE } from '../../constants/content'

/** 마무리 CTA — 히어로 카피를 다시 보여주고 가입으로 보낸다 */
export function ClosingCta() {
  const navigate = useNavigate()

  return (
    <section className="mx-auto mt-[250px] flex w-[765px] flex-col items-center gap-[100px] text-center">
      <div className="flex flex-col gap-8">
        <p className="text-h2 text-white">아직도 망설이고 있나요?</p>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[56px] leading-[1.2] font-semibold text-white">
            {HERO_TITLE[0]}
            <br />
            {HERO_TITLE[1]}
          </h2>
          <p className="text-body-lg text-gray-400">{HERO_DESCRIPTION}</p>
        </div>
      </div>
      <Button onClick={() => navigate(ROUTES.signup)}>무료로 시작하기</Button>
    </section>
  )
}
