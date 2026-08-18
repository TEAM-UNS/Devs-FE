# axios 도입 — 번들 전후 측정

`shared/api`의 HTTP 클라이언트를 직접 만든 `fetch` 래퍼에서 axios로 교체했다.
CLAUDE.md §4("측정 없이 최적화하지 않는다")에 따라 전후 수치를 남긴다.

## 측정 방법

```bash
pnpm build
cat dist/assets/*.js | gzip -c | wc -c    # 총 JS gzip
```

## 결과

|                        | 총 JS gzip                      |
| ---------------------- | ------------------------------- |
| 도입 전 (fetch 래퍼)   | 346,300 B                       |
| 도입 후 (axios 1.19.0) | 364,033 B                       |
| **차이**               | **+17,733 B (+17.3 KB, +5.1%)** |

`pnpm add axios`가 하위 의존 11개를 함께 들여온다. 흔히 알려진 "axios ≈ 13KB gzip"보다
4KB 정도 크게 나온 이유다.

## 어느 청크에 들어갔나

```
QueryClientProvider-*.js   gzip 23,876   ← axios 포함
```

`AppProviders`가 이 청크를 쓰고 `App`이 그걸 즉시 렌더하므로 **lazy 라우트 청크가 아니라
최초 진입 시 무조건 내려받는 청크**다. 라우트 스플리팅으로 미룰 수 없는 위치다.

## 코드 크기 (주석·빈 줄 제외)

|            | `http.ts` |
| ---------- | --------- |
| fetch 래퍼 | 98줄      |
| axios      | 76줄      |

22줄 줄었다. 다만 `errorMessage.ts`는 타임아웃 판별이 표준 `TimeoutError` 하나에서
axios 코드 두 개(`ECONNABORTED`·`ETIMEDOUT`)로 바뀌며 소폭 늘었다.

동시 401을 하나로 묶는 `refreshInFlight` 로직은 **양쪽이 동일하다** — axios가 줄여주지
않는 부분이다.

## 결정 근거

라이브러리 자체의 필요보다 **팀이 익숙한 표준 형태**를 택했다. 대신 axios의 대표
패턴인 "응답 인터셉터에서 재시도"는 쓰지 않았다 — 인터셉터가 `client(config)`로 자기
체인에 재진입해서, 무한 루프를 막으려면 `config.retried` 같은 가변 플래그가 필요하고
그 플래그는 타입 검사가 잡지 못한다. 재시도는 `withRetry()` 안에서 요청 함수를 한 번 더
부르는 방식으로 두어 **재귀 자체가 없게** 했다.

## 다음 작업에 미치는 영향

다음 차례가 번들 줄이기(폰트 2MB · ECharts gzip 174KB)다. 이번에 늘어난 17.3KB는
그 작업의 출발선에 포함해서 봐야 한다.
