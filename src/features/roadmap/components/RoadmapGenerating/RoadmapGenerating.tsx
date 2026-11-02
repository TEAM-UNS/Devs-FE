import { RoadmapProgressBar } from '../RoadmapProgressBar'

interface RoadmapGeneratingProps {
  /** 0~100 */
  readonly progress: number
}

/** 로드맵 생성 대기 화면 — Figma 574:3416 */
export function RoadmapGenerating({ progress }: RoadmapGeneratingProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-[600px] max-w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-h2 text-white">로드맵 생성 중...</h2>
          <p className="text-body-md text-gray-400">
            로드맵 생성에는 약 2분정도가 소요됩니다. 잠시만 기다려주세요.
          </p>
        </div>
        <RoadmapProgressBar value={progress} label="로드맵 생성 진행률" />
      </div>
    </div>
  )
}
