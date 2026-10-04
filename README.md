# UNS-FE

취준생들이 채용공고 트랜드를 한 눈에 파악할 수 있는 서비스

![CI](https://github.com/TEAM-UNS/UNS-FE/actions/workflows/ci.yml/badge.svg)

## ⚠️ 현재 상태 — 스캐폴드

이 저장소는 **아키텍처/툴링 스캐폴드**다. 아래 "실제 인프라"는 그대로 쓰고,
"레퍼런스"로 표시된 UI는 **디자인 시스템 구축 후 대체**한다.

| 구분                     | 대상                                                                                                                                         | 상태    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| **실제 인프라 (유지)**   | `app/`(Provider·Sentry·web-vitals), `router/`(라우팅 구조·Suspense), `shared/utils`·`shared/hooks`·`shared/constants`, ESLint/CI/테스트 설정 | ✅ 확정 |
| **레퍼런스 (대체 예정)** | `shared/components/Button`·`RouteFallback`, `pages/*`의 화면, `features/job-trends/*`(목업)                                                  | 🔁 임시 |

- 레퍼런스 파일 상단에는 `⚠️ 레퍼런스 스캐폴드` 배너가 달려 있다.
- **다음 단계: 디자인 시스템 구축** → 이후 위 UI들을 실제 컴포넌트로 교체.

## 기술 스택

| 영역                | 사용 기술                                       |
| ------------------- | ----------------------------------------------- |
| 빌드/런타임         | Vite, React 19, TypeScript                      |
| 스타일링            | Tailwind CSS v4 (`@tailwindcss/vite`)           |
| 서버 상태           | TanStack Query                                  |
| 클라이언트 상태     | Zustand                                         |
| 라우팅              | React Router (route 단위 코드 스플리팅)         |
| 폼 / 검증           | React Hook Form + Zod                           |
| 관측(Observability) | Sentry(Performance Monitoring), web-vitals      |
| 테스트              | Vitest + React Testing Library, Playwright(E2E) |
| 코드 품질           | ESLint, Prettier, Husky, lint-staged            |
| 개발 도구           | why-did-you-render (dev 전용)                   |

## 아키텍처 (Feature-based)

```
src/
├─ app/        # 전역 설정 (Provider, Sentry/web-vitals init, 루트 App)
├─ router/     # 라우트 정의 + Suspense 경계 (React.lazy 코드 스플리팅)
├─ pages/      # feature를 "조립"만 (로직 없음)
├─ features/   # 도메인 단위. 각 feature는 항상 동일 구조:
│  └─ <name>/
│     ├─ api/       # 서버 호출 (파일당 1함수: fetchTrends.ts) + 배럴
│     ├─ types/     # 도메인 타입 (엔티티별: techTrend.ts) + 배럴
│     ├─ stores/    # feature 전용 Zustand 스토어 (useXxxStore.ts, 있을 때만)
│     ├─ hooks/
│     ├─ utils/
│     ├─ components/
│     └─ index.ts   # 공개 API(barrel). 외부는 이 파일로만 접근
└─ shared/     # 도메인 지식이 없는 순수 재사용 코드
   ├─ components/
   ├─ constants/
   ├─ hooks/
   ├─ stores/     # 전역 클라이언트 상태 (테마 등, 비도메인)
   └─ utils/
```

### 의존성 규칙 (ESLint `boundaries`로 강제)

의존성은 한 방향으로만 흐른다: **shared → feature → pages → router → app**

- feature는 서로 직접 참조하지 않는다 (공통 로직은 `shared`로).
- `shared`는 특정 도메인 개념을 포함하지 않는다 (순수).
- 규칙 위반 시 `pnpm lint`가 에러로 잡는다.

> 상세 코드 컨벤션(네이밍·컴포넌트 구조·JSDoc·테스트·성능 등)은 [CONVENTIONS.md](./CONVENTIONS.md) 참고.

## 명령어

```bash
pnpm dev            # 개발 서버
pnpm build          # 타입체크 + 프로덕션 빌드
pnpm preview        # 빌드 결과 미리보기
pnpm lint           # ESLint
pnpm type-check     # tsc 타입 검사
pnpm test           # Vitest 유닛/컴포넌트 테스트
pnpm test:coverage  # 커버리지 리포트
pnpm e2e            # Playwright E2E
pnpm format         # Prettier 포맷팅
```

## 환경 변수

`.env.example`을 복사해 `.env.local`을 만든다.

- `VITE_SENTRY_DSN` — Sentry DSN. 비워두면 Sentry 초기화를 건너뛴다.

## CI

PR(→ `main`)마다 GitHub Actions에서 실행:
`lint` · `type-check` · `unit-test` (병렬) → `build` → `e2e` · `lighthouse`.
