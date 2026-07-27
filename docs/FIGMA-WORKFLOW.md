# Figma → 코드 퍼블리싱 워크플로우 (초안)

> **목적**: Figma 디자인을 우리 프로젝트 컨벤션([CONVENTIONS.md](../CONVENTIONS.md))에 맞는
> React + Tailwind 코드로 **일관되게** 변환한다.
> **전제**: 변환의 "타겟 언어"인 **디자인 시스템(토큰 + 컴포넌트)이 먼저 존재**해야 결과가 일관된다.
> ⚠️ 이 문서는 **초안**이다. 맨 아래 "완성까지 남은 것(TODO)"을 채워야 실사용 가능.

---

## 0. 전제 & 환경

- **스택**: Vite + React 19 + TypeScript + Tailwind CSS v4
- **규칙**: 생성 코드는 반드시 [CONVENTIONS.md](../CONVENTIONS.md)를 따른다
  (folder-per-component·배럴·`@theme` 토큰·`cn()`·react-perf·a11y).
- **Figma MCP**: 공식 Dev Mode MCP (아래 도구들). ⚠️ **사용 전 인증(authorize) 필요** — 현재 미인증.

## 1. MCP 도구 & 역할

| 도구                                     | 역할                            | 언제                      |
| ---------------------------------------- | ------------------------------- | ------------------------- |
| `get_variable_defs`                      | 색·타이포·spacing **토큰** 추출 | 토큰 sync / Tailwind 매핑 |
| `get_metadata`                           | 레이아웃 + **노드 트리(재귀)**  | 노드 발견·검증            |
| `get_design_context`                     | 구조·스타일·참조코드 (한 번에)  | 화면 최초 퍼블리싱        |
| `get_screenshot`                         | 시각 참조 이미지                | 단순 블록                 |
| `download_assets`                        | 이미지·아이콘 **로컬 저장**     | 에셋 관리                 |
| `search_design_system` / `get_libraries` | 디자인 시스템 컴포넌트 조회     | 컴포넌트 매핑             |
| `get_code_connect_map`                   | Figma ↔ 코드 컴포넌트 매핑      | 1회 셋업 후 재사용        |

> ⚠️ `get_design_context` 호출 **전 반드시** `figma-design-to-code` 스킬을 로드한다 (MCP가 요구).

## 2. 파이프라인 (단방향: Figma → 코드)

```
Figma 프레임 URL
  → (토큰)  get_variable_defs        → @theme 토큰과 매핑
  → (구조)  get_metadata             → 루트에서 전 자식까지 재귀로 node-id 전부 수집
  → (맥락)  get_design_context(전체) → 한 번에 (호출 최소화)
  → 코드 작성                         → 우리 컴포넌트/토큰으로 리팩터
  → 검증                              → 구현 ↔ 디자인 비교
```

## 3. 핵심 규칙

- **Rule 1 — 전 노드 재귀 (필수)**: 루트 node-id만 읽으면 CTA·푸터·배너 등 **자식이 누락**된다.
  `get_metadata`로 leaf까지 재귀 수집한 뒤 `get_design_context`를 **전체 node-id로 1회** 호출.
- **Rule 2 — 토큰/호출 최적화**: 비싼 `get_design_context`를 최소화한다.
  "풀 프레임 한 번, 섹션은 정말 필요할 때만". 이미 받은 코드·토큰은 로컬에서 재사용.
- **Rule 3 — 아이콘·이미지는 Figma 에셋을 export해서 사용 (직접 작도 금지)**:
  Figma에 에셋으로 존재하는 아이콘·이미지·로고는 반드시 `download_assets`/`get_design_context`로
  **export**해서 쓴다. 임의로 `<svg>`/`<path>`를 손으로 그리거나 "비슷한 다른 아이콘"으로
  대체하지 않는다. 불가피한 각색(예: `currentColor` 재색상)은 **export한 실제 path를 기반**으로만
  하고 형상은 원본과 동일해야 한다. 퍼블리싱 뒤 **"Figma에 있는데 안 쓴 에셋이 없는지" 자가 점검**한다.

## 4. 코드 작성 규칙 (CONVENTIONS 연결)

- Figma raw 출력을 **그대로 붙이지 말 것** → 우리 패턴으로 리팩터.
- 컴포넌트: **folder-per-component + 배럴** (CONVENTIONS §4).
- 색·간격: 하드코딩 금지 → **`@theme` 토큰**(§7) 사용.
- 조건부 클래스: **`cn()`**(§7). 인라인 `style={{}}`·인라인 객체 금지 (react-perf §12).
- 접근성: 시맨틱 HTML, `alt`/`label`/`aria`, hover·focus-visible·disabled 상태 (§12).
- 반응형: 데스크톱 프레임 기준 + `md:`/`lg:` 브레이크포인트.
- export: named 기본 (pages만 default) §14. JSDoc 필수(§10).

## 5. Figma → 우리 매핑

### 5.1 variant 축 매핑 (Figma 한글 축 → 코드)

Figma 컴포넌트는 한글 variant 축으로 구성돼 있다. 아래 규칙으로 일관되게 옮긴다.

| Figma 축          | 값(예)                               | → 코드                   | 방식                    |
| ----------------- | ------------------------------------ | ------------------------ | ----------------------- |
| `대분류`          | primary / ghost / outline            | `variant`                | **prop**                |
| `사이즈` / `크기` | medium / small                       | `size` (`'md'` / `'sm'`) | **prop**                |
| `타입`            | (컴포넌트별)                         | `type`                   | **prop**                |
| `선택`            | off / on / indeterminate             | `checked` / `selected`   | **prop (boolean)**      |
| `종류` / `상태`   | Default / Hover / Pressed / Disabled | —                        | ⚠️ **CSS 상태(prop X)** |

> ⚠️ **상호작용 상태(hover/pressed/disabled/focus)는 절대 prop으로 만들지 않는다.**
> Tailwind 상태 유틸리티(`hover:`·`active:`·`disabled:`·`focus-visible:`)로 처리한다.
> Figma에 상태가 variant로 그려져 있어도 코드에선 CSS 상태로 옮긴다. (CONVENTIONS §4)

### 5.2 토큰 매핑 (Figma Foundations → `@theme`)

| Figma 프레임                                    | 우리 `@theme`          |
| ----------------------------------------------- | ---------------------- |
| `color` (색상 스케일)                           | `--color-*`            |
| `Typography` (Pretendard, Display/Heading/Body) | `--font-*`, `--text-*` |
| `Radius` (5단계, max 16)                        | `--radius-*`           |
| `Spacing System` (4px 그리드)                   | `--spacing-*`          |
| `아이콘` (24px 기준, weight 300)                | 아이콘 컴포넌트        |

> 실제 **값(hex·px)** 은 `get_variable_defs` / `get_design_context`로 추출해 채운다.

### 5.3 컴포넌트 매핑

| Figma 컴포넌트                           | 우리 컴포넌트                             |
| ---------------------------------------- | ----------------------------------------- |
| `Button` (primary/ghost/outline × md/sm) | `@/shared/components/Button`              |
| `Input` (states)                         | `@/shared/components/Input`               |
| `Toast` (success/warning/error/info)     | `@/shared/components/Toast`               |
| `Dropdown`                               | `@/shared/components/Dropdown`            |
| `Checkbox` (off/on/indeterminate)        | `@/shared/components/Checkbox`            |
| `Chip` (Filter/Input/기본)               | `@/shared/components/Chip`                |
| 아이콘 세트                              | `@/shared/components/icons/*`             |
| 직무 배지 (서버/프론트/…)                | **feature 도메인 컴포넌트** (shared 아님) |

## 6. 에셋 관리 &nbsp; `[TODO: 위치·레지스트리 규칙 확정]`

- Figma 이미지 URL은 만료되므로 `download_assets`로 **로컬 저장 필수**.
- 저장 위치(안): `public/images/<feature>/` (Vite `public/`은 `/`로 서빙).
- 레지스트리(안): `src/shared/constants/figmaAssets.ts`에 경로 상수 등록.
- 코드 참조: `/images/<feature>/<name>`.

## 7. 프롬프트 템플릿

### 섹션 퍼블리싱

```
[Figma 프레임 URL, 섹션명]
1. get_variable_defs로 토큰 확인 → @theme 매핑 (§5)
2. get_metadata로 node-id 재귀 수집 (Rule 1)
3. figma-design-to-code 스킬 로드 후 get_design_context 1회
4. CONVENTIONS 준수로 코드 작성 — 기존 컴포넌트 재사용 우선 (§4)
5. 이미지는 download_assets로 로컬 저장 + figmaAssets 등록 (§6)
```

### 디자인 검증

```
[구현 파일 ↔ Figma 프레임]
1. get_metadata로 노드 트리·레이아웃 비교
2. 불일치 섹션만 좁혀서 get_design_context (토큰 낭비 방지)
3. 토큰 의심되면 get_variable_defs로 값만 비교
```

## 8. 검증 (구현 ↔ 디자인)

- `get_metadata`로 레이아웃 먼저 확인 → 불일치 구간만 좁혀 `get_design_context`.
- 필요 시 `get_screenshot`으로 시각 대조.

---

## ✅ 완성까지 남은 것 (TODO)

- [ ] **Figma MCP 인증** — 현재 미인증. 연결/authorize 후에야 실제 loop 실행 가능.
- [ ] **디자인 시스템 구축** (토큰 + 핵심 컴포넌트) — §5 매핑의 "타겟"이 먼저 있어야 함.
- [ ] **§5 매핑 표 채우기** — Figma 변수/컴포넌트 실제 이름 확인 후.
- [ ] **§6 에셋 규칙 확정** — 저장 위치·레지스트리 파일 확정.
- [ ] **Code Connect 도입 여부** — `figma-code-connect`로 컴포넌트 매핑 자동화할지 결정.
