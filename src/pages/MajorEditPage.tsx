import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { userQueries } from '@/shared/api'
import { ROUTES } from '@/shared/constants'
import { useGoBack } from '@/shared/hooks/useGoBack'
import { useToastStore } from '@/shared/stores/useToastStore'
import {
  AuthLayout,
  SignupStep3,
  fromPersonalHistory,
  toPersonalHistory,
  useUpdateMajor,
  type SignupStep3Input,
} from '@/features/auth'
import { PageTitle } from '@/shared/components/PageTitle'

const EDIT_DONE_MESSAGE = '수정이 완료되었어요!'

/**
 * 전공·경력 수정 (Figma 659:5461). 회원가입 3단계 폼을 지금 값으로 채워 다시 쓴다.
 * 온보딩처럼 전체 화면이라 RootLayout 밖에 둔다.
 */
export default function MajorEditPage() {
  const { data } = useQuery(userQueries.me())
  const navigate = useNavigate()
  const goBack = useGoBack(ROUTES.myPage)
  const showToast = useToastStore((state) => state.show)
  const updateMajorMutation = useUpdateMajor()

  const handleSubmit = (input: SignupStep3Input) => {
    updateMajorMutation.mutate(
      {
        personalHistory: toPersonalHistory(input),
        majorIds: input.majors.map(Number),
      },
      {
        onSuccess: () => {
          showToast({ type: 'success', title: EDIT_DONE_MESSAGE })
          navigate(ROUTES.myPage)
        },
      },
    )
  }

  return (
    <AuthLayout className="max-w-[816px]" onBack={goBack}>
      <PageTitle name="전공·경력 수정" />
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-h2 text-white">전공 · 경력 수정</h1>
          <p className="text-body-md text-gray-300">
            전공과 경력을 최신 정보로 수정해주세요
          </p>
        </div>

        {/* 폼은 첫 렌더에만 초기값을 읽어서, 지금 값이 오기 전에는 그리지 않는다 */}
        {data && (
          <SignupStep3
            initialValues={{
              majors: data.majors.map(({ majorId }) => String(majorId)),
              ...fromPersonalHistory(data.personalHistory),
            }}
            onNext={handleSubmit}
            pending={updateMajorMutation.isPending}
            submitLabel="수정 완료"
          />
        )}
      </div>
    </AuthLayout>
  )
}
