import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /* 접두사를 비워 VITE_ 가 아닌 변수까지 읽는다. 소스맵 업로드용 토큰은 브라우저로 나가면
     안 되는 값이라 VITE_ 를 붙이지 않았고, 그래서 import.meta.env 로는 못 읽는다 */
  const env = loadEnv(mode, process.cwd(), '')
  const sentryAuthToken = env.SENTRY_AUTH_TOKEN

  return {
    plugins: [
      react(),
      tailwindcss(),
      /* 소스맵을 Sentry에 올려 압축된 스택을 원래 코드로 되돌린다.
         토큰이 없는 환경(CI, 다른 사람 로컬)에서는 빌드가 깨지지 않도록 건너뛴다 */
      ...(sentryAuthToken
        ? [
            sentryVitePlugin({
              authToken: sentryAuthToken,
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              sourcemaps: {
                // 업로드 후 지운다. 배포 서버에 남으면 누구나 원본 코드를 받아갈 수 있다
                filesToDeleteAfterUpload: ['./dist/**/*.map'],
              },
            }),
          ]
        : []),
    ],
    build: {
      /* Sentry가 스택을 되돌리려면 소스맵이 있어야 한다. 올린 뒤에는 위에서 지운다
         토큰이 없으면 지우는 단계도 건너뛰므로 아예 만들지 않는다
         만들어두면 .map 파일이 그대로 배포돼 원본 코드가 공개된다 */
      sourcemap: Boolean(sentryAuthToken),
    },
    resolve: {
      alias: {
        // 절대 경로 별칭. 아키텍처 경계(@/features, @/shared 등)를 import 문에서
        // 시각적으로 드러내고, 상대경로 '../../..' 지옥을 방지한다.
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Vitest 설정을 Vite config에 병합해 플러그인/alias/resolve를 그대로 재사용한다.
    // (별도 vitest.config.ts를 두면 alias·플러그인을 중복 관리해야 함)
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      // 유닛 테스트는 src 내부만 대상으로 한다. Playwright E2E(e2e/)와 명확히 분리.
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['node_modules', 'dist', 'e2e'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: ['**/*.config.*', '**/*.d.ts', 'src/test/**', 'e2e/**'],
      },
    },
  }
})
