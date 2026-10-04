import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPerf from 'eslint-plugin-react-perf'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import boundaries from 'eslint-plugin-boundaries'
import jsdoc from 'eslint-plugin-jsdoc'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  // 린트 대상에서 제외 (빌드 산출물, 커버리지, E2E 리포트 등)
  {
    ignores: [
      'dist',
      'coverage',
      'playwright-report',
      'test-results',
      'node_modules',
    ],
  },

  // 기본 권장 규칙: JS 표준 + TypeScript
  js.configs.recommended,
  tseslint.configs.recommended,

  // 접근성(a11y): img alt, label 연결, aria 속성 오용 등을 정적으로 검사
  jsxA11y.flatConfigs.recommended,

  // React Fast Refresh: HMR이 깨지는 export 패턴(컴포넌트+비컴포넌트 혼합 export)을 경고
  reactRefresh.configs.vite,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-perf': reactPerf,
    },
    rules: {
      // ─────────────────────────────────────────────────────────────
      // react-hooks — Hook을 "규칙대로" 쓰는지 검사
      // ─────────────────────────────────────────────────────────────
      // rules-of-hooks: Hook은 항상 컴포넌트/커스텀훅 최상단에서, 조건문·반복문·
      //   콜백 안이 아닌 곳에서 호출돼야 한다. 조건부 호출은 렌더마다 Hook 순서를
      //   바꿔 React 내부 상태를 깨뜨리므로 'error'로 강제한다.
      'react-hooks/rules-of-hooks': 'error',
      // exhaustive-deps: useEffect/useMemo/useCallback의 의존성 배열에 실제로
      //   참조하는 값이 빠졌거나 불필요하게 들어간 경우를 잡는다. 누락 시 stale
      //   closure(오래된 값 참조) 버그가 생기므로 최소 'warn'으로 노출한다.
      'react-hooks/exhaustive-deps': 'warn',

      // ─────────────────────────────────────────────────────────────
      // react-perf — 전부 off. 의도적인 선택이다.
      // ─────────────────────────────────────────────────────────────
      // 이 룰들은 "매 렌더 새 참조 생성"을 잡아준다. 하지만 룰이 켜져 있으면
      // 측정 없이 memo/useCallback/모듈 스코프 상수를 붙이게 되고, 그렇게 붙은
      // 코드는 "왜 붙였나"에 "린트가 시켜서"밖에 답할 수 없다.
      // docs/WORKING-RULES.md: 성능 최적화는 측정 없이 시작하지 않는다.
      //
      // 메모이제이션은 React DevTools Profiler로 리렌더를 확인한 뒤,
      // 개선 전후 수치를 남기면서 붙인다. 룰로 강제하지 않는다.
      // (기존 코드의 memo/useCallback도 측정 단계에서 근거를 재검토한다)
      'react-perf/jsx-no-new-object-as-prop': 'off',
      'react-perf/jsx-no-new-array-as-prop': 'off',
      'react-perf/jsx-no-new-function-as-prop': 'off',
      'react-perf/jsx-no-jsx-as-prop': 'off',
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // 아키텍처 경계(boundaries) — 폴더 구조 규칙을 "코드로" 강제
  // ─────────────────────────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // @/ 별칭을 실제 파일로 해석하기 위해 TS resolver 사용
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
      // 각 폴더를 하나의 "레이어(element)"로 정의한다.
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'router', pattern: 'src/router/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        // features는 폴더 단위로 잡고, 첫 세그먼트(feature 이름)를 캡처해
        // "같은 feature끼리만" 참조 가능하도록 아래 정책에서 활용한다.
        { type: 'feature', pattern: 'src/features/*', capture: ['feature'] },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
    },
    rules: {
      // 의존성 방향: shared → feature → pages → router → app (역방향 금지)
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // shared: 순수 계층. 오직 shared 내부만 참조 (도메인/feature 참조 금지)
            {
              from: { element: { type: 'shared' } },
              allow: [{ to: { element: { type: 'shared' } } }],
            },
            // feature: shared + "자기 자신 feature"만. 다른 feature 직접 참조 금지.
            {
              from: { element: { type: 'feature' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: { type: 'feature' },
                    captured: { feature: '{{from.element.captured.feature}}' },
                  },
                },
              ],
            },
            // pages: feature들을 조립. shared/feature 참조 가능 (로직은 넣지 않음)
            {
              from: { element: { type: 'pages' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'feature' } } },
              ],
            },
            // router: 페이지를 연결. pages/feature/shared 참조 가능
            {
              from: { element: { type: 'router' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'feature' } } },
                { to: { element: { type: 'pages' } } },
              ],
            },
            // app: 최상위 전역 설정. 모든 레이어 참조 가능
            {
              from: { element: { type: 'app' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'feature' } } },
                { to: { element: { type: 'pages' } } },
                { to: { element: { type: 'router' } } },
                { to: { element: { type: 'app' } } },
              ],
            },
          ],
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // JSDoc — 함수/컴포넌트에 문서 주석 강제 (역할·인자·반환 설명)
  // TS가 타입을 담당하므로 JSDoc 타입 태그(@param {string} 등)는 요구하지 않는다.
  // 지금은 'warn'으로 두어 MVP 속도를 확보하고, 릴리스 전 'error'로 승격 권장.
  // ─────────────────────────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**'],
    plugins: { jsdoc },
    rules: {
      // 공개(export) 함수·컴포넌트·훅에는 JSDoc 블록이 있어야 한다.
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: true,
          },
        },
      ],
      'jsdoc/require-description': 'warn', // 블록에 실제 설명 텍스트가 있어야 함
      'jsdoc/require-param-description': 'warn', // @param 쓰면 설명 필수
      'jsdoc/require-returns-description': 'warn', // @returns 쓰면 설명 필수
      'jsdoc/require-param-type': 'off', // 타입은 TS가 담당
      'jsdoc/require-returns-type': 'off',
      'jsdoc/no-types': 'warn', // JSDoc에 타입 중복 기재 금지 (TS와 이중관리 방지)
      // @param/@returns 태그 "존재" 자체는 강제하지 않음 (컴포넌트 props 등 유연성 확보)
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },

  // 설정 파일 / E2E는 Node 환경 전역 사용
  {
    files: ['*.config.{ts,js}', 'playwright.config.ts', 'e2e/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.node },
  },

  // Prettier와 충돌하는 스타일 규칙 비활성화 (항상 마지막에 위치)
  prettier,
)
