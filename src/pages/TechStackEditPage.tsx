import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { majorQueries, userQueries } from '@/shared/api'
import { ROUTES } from '@/shared/constants'
import { useToastStore } from '@/shared/stores/useToastStore'
import {
  AuthLayout,
  SignupStep4,
  groupSkillsByMajor,
  useUpdateTechStack,
  type SignupStep4Input,
} from '@/features/auth'
import { PageTitle } from '@/shared/components/PageTitle'

const EDIT_DONE_MESSAGE = '수정이 완료되었어요!'

/**
 * 보유 기술 스택 수정 (Figma 659:5562). 회원가입 4단계 폼을 지금 값으로 채워 다시 쓴다.
 * 서버는 내 전공에 속한 스택만 받으므로 지금 전공의 스택만 보여준다.
 */
export default function TechStackEditPage() {
  const { data } = useQuery(userQueries.me())
  const majorList = useQuery(majorQueries.list())
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  const updateTechStackMutation = useUpdateTechStack()

  const handleSubmit = (input: SignupStep4Input) => {
    updateTechStackMutation.mutate(
      // 여러 전공에 걸친 스택은 그룹마다 담겨 있어 중복을 걷어낸다
      {
        skillIds: [...new Set(Object.values(input.techStacks).flat())].map(
          Number,
        ),
      },
      {
        onSuccess: () => {
          showToast({ type: 'success', title: EDIT_DONE_MESSAGE })
          navigate(ROUTES.myPage)
        },
      },
    )
  }

  const majorIds = data?.majors.map(({ majorId }) => majorId) ?? []

  return (
    <AuthLayout className="max-w-[708px]" onBack={() => navigate(-1)}>
      <PageTitle name="보유 기술 스택 수정" />
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-h2 text-white">보유 기술 스택 수정</h1>
          <p className="text-body-md text-gray-300">
            보유 기술을 최신 정보로 수정해주세요
          </p>
        </div>

        {/* 초기 선택을 전공별로 묶으려면 전공 목록까지 있어야 한다. 폼은 첫 렌더에만 읽는다 */}
        {data && majorList.data && (
          <SignupStep4
            majors={majorIds.map(String)}
            initialValues={{
              techStacks: groupSkillsByMajor(
                data.techStacks.map(({ skillId }) => skillId),
                majorIds,
                majorList.data.categories,
              ),
            }}
            onSubmit={handleSubmit}
            pending={updateTechStackMutation.isPending}
            submitLabel="수정 완료"
          />
        )}
      </div>
    </AuthLayout>
  )
}
