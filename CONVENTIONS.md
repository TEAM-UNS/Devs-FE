# 코드 컨벤션

이 문서는 UNS-FE의 코드 작성 규칙을 정의한다. 대부분 ESLint로 자동 강제되며,
강제되지 않는 항목은 "합의 규칙"으로 표시한다.

---

## 1. 아키텍처 & 의존성 방향 (ESLint `boundaries`로 강제)

레이어: `shared → feature → pages → router → app` (이 방향으로만 import)

| 레이어            | 역할                              | import 허용                        |
| ----------------- | --------------------------------- | ---------------------------------- |
| `shared`          | 도메인 지식 없는 순수 재사용 코드 | `shared`만                         |
| `features/<name>` | 도메인 단위(수직 슬라이스)        | `shared` + **자기 자신 feature만** |
| `pages`           | feature 조립(로직 없음)           | `shared`, `feature`                |
| `router`          | 라우트 연결                       | `shared`, `feature`, `pages`       |
| `app`             | 전역 설정(Provider 등)            | 전부                               |

- **feature 간 직접 참조 금지.** 공통이 필요하면 `shared`로 올린다.
- **`shared`에 도메인 개념 금지** (`Job`, `Trend` 같은 타입은 feature 안에).
- 위반 시 `pnpm lint`가 에러로 막는다.

## 2. 폴더 · 파일 네이밍

| 대상               | 규칙              | 예시                                  |
| ------------------ | ----------------- | ------------------------------------- |
| feature 폴더       | kebab-case        | `features/job-trends/`                |
| 컴포넌트 파일/폴더 | PascalCase        | `TrendCard/TrendCard.tsx`             |
| 훅                 | `use` + camelCase | `useTechTrends.ts`                    |
| 유틸/일반 함수     | camelCase         | `sortTrends.ts`                       |
| `api/` 파일        | 동사 + 엔드포인트 | `fetchTrends.ts`, `createBookmark.ts` |
| `types/` 파일      | 도메인 엔티티명   | `techTrend.ts`                        |
| 이벤트 핸들러 prop | `on` + PascalCase | `onSelect`, `onSubmit`                |
| 내부 핸들러 함수   | `handle` + Pascal | `handleClick`, `handleSubmit`         |
| 상수               | UPPER_SNAKE_CASE  | `MEDIA_QUERIES`, `ROUTES`             |
| 타입/인터페이스    | PascalCase        | `TechTrend`                           |

- 이벤트: 자식이 부모에게 받는 콜백은 `onXxx`, 컴포넌트 내부 구현 함수는 `handleXxx`.
  (예: 부모가 `onSelect`를 넘기면, 자식은 `handleClick`에서 `onSelect(...)`를 호출)

## 3. TypeScript

- **`strict` 모드 ON** — null/undefined 및 암묵적 `any`를 컴파일 단계에서 막는다.
  `any` 사용은 지양하고, 불가피하면 `unknown` 후 좁히기(narrowing)를 쓴다.
- **타입 전용 import는 `import type`** — `verbatimModuleSyntax`가 켜져 있어, 타입만
  가져올 땐 반드시 `import type { X }` / `export type { X }`. **안 지키면 빌드 에러.**
  - 값 + 타입 혼합 시엔 인라인 `type`: `import { onCLS, type Metric } from 'web-vitals'`
- **미사용 변수·파라미터 금지** (`noUnusedLocals` / `noUnusedParameters`) — tsc가 막는다.
- 타입은 가능한 한 **추론에 맡기고**, 함수의 공개 시그니처(반환 타입 등)만 명시한다.
- 객체 형태는 `interface`, 유니온/유틸리티 타입은 `type` 권장(강제 아님).

## 4. 컴포넌트 구조 (folder-per-component + barrel)

모든 컴포넌트는 **폴더 + 배럴(`index.ts`)** 로 관리한다. 트리 모양을 균일하게
유지하고, import 경로를 `.../Button`으로 짧게 쓰기 위함.

> **배럴(barrel)** = 여러 파일의 export를 한 `index.ts`에 모아 다시 내보내는 파일.
> 소비 측은 폴더까지만 import하면 되고(`import { Button } from '.../Button'`),
> 내부 파일 구조는 숨겨진다(= 그 폴더의 "공개 API" 역할).

```
components/Button/
├─ Button.tsx        # 구현 (+ JSDoc)
├─ Button.test.tsx   # RTL 테스트 (바로 옆에 co-locate)
└─ index.ts          # 배럴: export { Button } from './Button'
```

- import는 항상 폴더까지만: `import { Button } from '@/shared/components/Button'`
- 위성 파일(스타일/스토리/하위 컴포넌트/지역 훅)이 늘면 이 폴더 안에 함께 둔다.
- **훅·유틸은 폴더로 감싸지 않고 flat 파일**로 둔다 (`useX.ts`, `x.ts` + `x.test.ts`).

### feature 내부 세그먼트 구조

feature는 아래 세그먼트로 구성한다. **`api`·`types`는 단일 파일이어도 항상 폴더**로
둔다(세그먼트 일관성 + 배럴 접근).

```
features/<name>/
├─ api/          # 서버 호출 + 쿼리 팩토리. 파일당 1함수 `동사+엔드포인트` (fetchTrends.ts)
│  └─ index.ts   # 배럴
├─ types/        # 도메인 타입/스키마. 엔티티별 파일 (techTrend.ts)
│  └─ index.ts   # 배럴
├─ stores/       # feature 전용 Zustand 스토어 (useXxxStore.ts) — 있을 때만
├─ hooks/        # 개별 훅(뮤테이션·로직)은 flat 파일 (useDismissTrend.ts)
├─ utils/        # 개별 유틸은 flat 파일 (sortTrends.ts + .test.ts)
├─ components/   # 컴포넌트만 folder-per-component (TrendCard/)
└─ index.ts      # feature 공개 배럴
```

- 원칙: **세그먼트(api/types/stores/hooks/utils/components)는 폴더**, 그 안의 **개별 항목**은
  컴포넌트만 폴더, 나머지(api·types·store·hook·util 파일)는 flat 파일.
- 스토어(상태)와 hooks(뮤테이션·재사용 로직)를 **세그먼트로 분리**한다 — 성격이 다르므로.
- 외부는 세그먼트 배럴로만 접근한다 (`../api`, `../types`). 개별 파일 직접 import 금지.

### 컴포넌트 variant vs 상태 (디자인 시스템)

- **구조적 변형만 prop**으로 만든다: `variant`(예: primary/ghost/outline), `size`(md/sm), `type`, `checked`.
- **상호작용 상태는 prop이 아니라 CSS로** 처리한다: hover/pressed/disabled/focus →
  Tailwind `hover:`·`active:`·`disabled:`·`focus-visible:`. ⚠️ `state="hover"` 같은 상태 prop 금지.
- Figma에 상태가 variant로 그려져 있어도 코드에선 CSS 상태로 옮긴다.
  (Figma 한글 축 → prop 매핑은 [docs/FIGMA-WORKFLOW.md](./docs/FIGMA-WORKFLOW.md) §5.1)

## 5. feature 공개 API (barrel)

- 각 feature는 루트 `index.ts`로 **공개할 것만** 노출한다.
- 외부(pages/router)는 `@/features/job-trends`처럼 **배럴로만** 접근한다.
  내부 경로(`.../hooks/useTechTrends`)를 외부에서 직접 import하지 않는다.
- ⚠️ 현재 이 "배럴로만 접근"은 **합의 규칙(lint 미강제)** 이다. `boundaries`는
  레이어 종류만 검사하므로 내부 깊은 경로 import를 막지 못한다. (강제 전환은 §15 참고)

## 6. Import 규칙

- 절대 경로 별칭 `@/` 사용 (`@/shared/...`). 깊은 상대경로(`../../..`) 지양.
- feature **내부**에서는 상대경로 OK (`../hooks`, `../types`).
- feature **외부**에서는 feature 배럴만.

## 7. 스타일링 (Tailwind CSS v4)

- **유틸리티 우선** — 스타일은 별도 CSS 파일이 아니라 `className`에 Tailwind 유틸리티로.
  - 예: `<button className="px-4 py-2 rounded-md bg-indigo-600 text-white">`
- **조건부 클래스는 `cn()`** — 상태에 따라 클래스를 켜고 끌 땐 `@/shared/utils/cn` 사용.
  - 예: `cn('px-3 py-1', active && 'bg-indigo-600 text-white')`
- **인라인 `style={{...}}` 금지** — 매 렌더 새 객체라 리렌더를 유발한다(§12). 유틸리티/`cn`으로.
  - **예외: 데이터로 결정되는 연속 치수**(게이지 폭 `82%`, 막대 높이 등)는 **자식이 없는
    말단 엘리먼트에 한해** `style`로 준다. 임의 퍼센트는 정적 유틸리티로 표현할 수 없고,
    말단 노드에는 위 근거(자식 리렌더)가 적용되지 않는다. 쓸 때는 이 예외임을 주석으로 남긴다.
- **디자인 토큰은 `src/index.css`의 `@theme`** — 색·폰트 등 공통 값은 여기서 정의한다.
  (Tailwind v4는 별도 `tailwind.config.js` 없이 이 방식으로 토큰을 관리)

## 8. 상태 관리

### 서버 상태 → TanStack Query

- **조회(Query) = `queryOptions` 팩토리** (껍데기 훅 X). feature `api/`에 `xxxQueries.ts`를 두어
  키 + queryFn + 옵션을 모으고, 컴포넌트는 `useQuery(xxxQueries.list())`로 직접 호출한다.
- **변경(Mutation) = 훅** (`hooks/useCreateXxx.ts`). `useMutation` + 성공 시 캐시 무효화.
- **기준**: 호출 뒤 추가 로직(무효화·조합·변환)이 있으면 **훅**, 그냥 읽기면 **팩토리 항목**.
- **쿼리 키는 팩토리 안에서 계층형**으로 지어, `invalidateQueries({ queryKey: xxxQueries.all() })`
  한 번으로 관련 캐시를 무효화(= "캐시를 낡음으로 표시 → 자동 재요청")한다.
- 원시 `fetch` 함수는 `api/` 배럴에서 숨기고, 팩토리 + 뮤테이션 함수만 노출한다.

```ts
// api/bookmarkQueries.ts — 조회 정의를 한 곳에 (키 + queryFn)
export const bookmarkQueries = {
  all: () => ['bookmarks'] as const,
  list: () =>
    queryOptions({
      queryKey: [...bookmarkQueries.all(), 'list'] as const,
      queryFn: fetchBookmarks,
    }),
}
// 컴포넌트:      const { data } = useQuery(bookmarkQueries.list())
// 뮤테이션 성공: queryClient.invalidateQueries({ queryKey: bookmarkQueries.all() })
```

### 클라이언트 상태 → Zustand

- **파일명 `useXxxStore.ts`**. action은 참조가 고정돼 자식에 넘겨도 안전.
- **selector로 필요한 조각만 구독**: `useXxxStore((s) => s.view)` (전체 구독은 불필요 리렌더 유발).
- **위치 = 항상 `stores/` 세그먼트, 부모만 범위에 따라 다름**:
  - **feature 전용** → `features/<x>/stores/` (예: `useTrendViewStore.ts`)
  - **전역 · 비도메인**(테마·로케일·전역 UI) → `shared/stores/` (예: `useThemeStore.ts`)
- **왜 전역은 `shared`인가**: feature는 의존성 방향상 `app`을 import할 수 없다(§1). 여러 feature가
  공유하는 상태는 **모두가 import 가능한 유일한 바닥인 `shared`** 에 둬야 한다.
- **전역인데 도메인을 담는 상태(auth/user 등)는 `shared` 금지** — 가능하면 서버 상태(Query)로,
  꼭 클라 상태면 `features/<domain>` 슬라이스로 두고 배럴로 노출한다.

### 파생 상태

- 서버/클라 상태를 중복 저장하지 말고 `useMemo`로 계산한다.

## 9. 폼 & 검증

- **React Hook Form + Zod** (`zodResolver`).
- Zod 스키마 하나를 **런타임 검증 + 정적 타입(`z.infer`)** 의 단일 소스로 재사용한다.
- **스키마 위치·이름**: feature `types/`에 `xxxSchema`로 두고, 타입은 `z.infer`로 뽑아 함께 둔다.
  - 예: `types/bookmark.ts`가 `bookmarkInputSchema` + `type BookmarkInput = z.infer<...>`를 함께 export.
- 참고: Zod 스키마는 폼 전용이 아니라 **데이터 모양 명세**다. API 응답 검증 등에도 같은 스키마를 쓴다.

## 10. 주석 — JSDoc · 인라인 (JSDoc은 ESLint `jsdoc`로 강제, 현재 warn)

원칙: **주석은 "왜"를 적고 "무엇"은 코드에 맡긴다.** 코드보다 주석이 많아지면 과한 것 —
이름·타입·구조로 대체한다.

### JSDoc (공개 export 함수·컴포넌트·훅에 필수)

**역할을 핵심만 한 줄**로 적는다. 인자·반환 타입은 시그니처가, prop 설명은 인터페이스가 이미 말해준다.

```ts
/** 트렌드를 공고 수 내림차순으로 정렬한다. (원본 불변) */
export function sortTrendsByCount(trends: TechTrend[]): TechTrend[] { ... }

/** 회원가입 1단계 — 이메일 인증. 코드 전송 후 6자리 입력 시 '다음' 활성화. */
export function SignupStep1({ onNext }: SignupStep1Props) { ... }
```

- **타입은 JSDoc에 적지 않는다** (`@param {string}` ✕). 타입은 TypeScript가 담당.
- **`@param`/`@returns`는 기본 생략.** prop 설명은 인터페이스 각 필드의 `/** */`에 두고,
  인자·반환 타입은 시그니처에 이미 있다 → 중복이라 오히려 노이즈.
  (ESLint도 태그 존재는 강제하지 않음: `require-param`/`require-returns` = off. 단, **쓰면** 설명 필수.)
- 인터페이스 prop 주석도 **비직관적인 것만**. 자명한 prop(`children`·`title` 등)은 생략.
- 정말 짚어야 할 비직관적 인자에 한해 예외적으로 `@param` 한 줄.
- 현재 `warn` 레벨(공개 export 대상). 릴리스 전 `error`로 승격 권장.

### 인라인 주석 (`//`) — 합의 규칙

**비직관적인 것만** 짧게 남긴다:

- 결정의 근거·트레이드오프 (예: `간편로그인은 진입 지점(1단계)에서만 노출`)
- 매직값의 의미 (예: `const CODE_TTL = 300 // 5:00`)
- 성능 이유 (react-perf: `모듈 스코프에 한 번만 생성해 재사용`)
- 디자인 값 출처 (Figma node·렌더 hex 매핑)
- `TODO:` — 미래 독자가 이해할 문구로 (대화·리뷰용 임시 라벨 `TODO(F4)` 금지)

적지 않는 것:

- 코드가 그대로 하는 일의 서술 (`secondsLeft를 1 줄인다` ✕)
- 코드로 자명한 레이아웃/값 나열 (`gap 24 / 항목간 20` ✕ — className에 이미 있음)

## 11. 테스트 위치

| 종류            | 도구         | 위치                        | 파일명       |
| --------------- | ------------ | --------------------------- | ------------ |
| 유닛(순수 함수) | Vitest       | 대상 **바로 옆** (`src/**`) | `*.test.ts`  |
| 컴포넌트        | Vitest + RTL | 컴포넌트 **폴더 안**        | `*.test.tsx` |
| E2E             | Playwright   | **`e2e/`** 폴더             | `*.spec.ts`  |

- "unit vs RTL"은 대립 개념이 아니다. RTL은 컴포넌트를 테스트하는 **도구**다.
- 로직이 복잡하면 순수 함수/훅으로 **분리**해 각각 테스트한다(렌더/로직 분리).

## 12. 성능 & 접근성 (ESLint로 감지)

**성능 (`react-perf`)**

- JSX prop에 **인라인 객체/배열/함수/JSX 생성 금지** (매 렌더 새 참조 → 불필요 리렌더).
  - 상수는 모듈 스코프로 hoist, 핸들러는 `useCallback`, 자식은 `memo`.
- `useEffect/useMemo/useCallback` 의존성 배열은 `exhaustive-deps` 규칙을 따른다.

**접근성 (`jsx-a11y`)**

- 시맨틱 HTML 우선(`<button>`/`<nav>`/`<ul>` 등), `<div onClick>` 지양.
- 이미지 `alt`, 폼 요소 `label` 연결, 상태는 `aria-*`(예: `aria-pressed`, `role="status"`).
- 규칙 위반은 `pnpm lint`가 잡는다.

## 13. 에러 처리

- **에러 바운더리는 배포 시 Sentry와 함께 도입 예정** — 현재 Sentry 프로젝트 미생성이라 보류.
  `src/app/App.tsx`에 `// TODO`로 위치를 표시해 뒀다(`Sentry.ErrorBoundary`로 라우터를 감싸는 자리).
- API 에러는 각 쿼리/뮤테이션의 `isError`/`error`로 컴포넌트에서 처리한다(예: `TrendBoard`).

## 14. Export 스타일 (합의 규칙)

- 기본은 **named export**.
- **예외: `pages/`의 페이지 컴포넌트는 default export** (라우트 `React.lazy` 대상이라).

## 15. 추후 도입 검토 (합의 규칙, 아직 미적용)

- **배럴 강제** — `boundaries/entry-point` 규칙으로 "feature 외부는 배럴로만"을 lint 강제 (§5).
- import 정렬 규칙(`eslint-plugin-import` / `perfectionist`)
- JSDoc 규칙 `warn` → `error` 승격

## 16. Git 워크플로우

### 브랜치 전략 — 2-브랜치 (develop 통합 / main 배포)

- **`develop`** (default): 평소 개발·통합 브랜치. 모든 작업 PR이 여기로 향한다.
- **`main`**: 배포(프로덕션). `develop → main` merge 시점이 릴리스·배포다.
- 일반 흐름: `feature/*` (develop에서 분기) → push → **PR → develop** → CI(lint·type·test·e2e) + 프리뷰 → merge.
- 릴리스: `develop → PR → main` → 배포.
- hotfix: `main`에서 분기 → PR → `main` → 이후 `develop`로 back-merge(누락 방지).

| 브랜치 종류 | 형식             | 예                      |
| ----------- | ---------------- | ----------------------- |
| 기능        | `feature/<설명>` | `feature/trend-chart`   |
| 버그        | `fix/<설명>`     | `fix/dark-toggle-flash` |
| 잡무/설정   | `chore/<설명>`   | `chore/update-deps`     |
| 긴급 수정   | `hotfix/<설명>`  | `hotfix/login-crash`    |

### 커밋 컨벤션 — Conventional Commits (commitlint로 강제)

- 형식: **`<type>(<scope>): <설명>`** — scope는 선택, 설명은 간결하게·마침표 없음.
- **type**: `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci` `build`
- **scope**(선택): feature/레이어 이름 — `feat(job-trends): ...`, `chore(ci): ...`
- **언어**: type·scope는 영어(고정), **설명은 한글**.
- 예시:
  - `feat(job-trends): 트렌드 숨김 뮤테이션 추가`
  - `fix(theme): 초기 로드 시 깜빡임 방지`
  - `chore: 프로젝트 초기 스캐폴드`
- **commitlint + husky `commit-msg` 훅으로 강제** — 형식이 어긋나면 커밋이 막힌다.
