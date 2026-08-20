# 워커 배포 메모

```bash
cd workers
npx wrangler deploy
```

## ⚠ wrangler 4.97.0 은 Node 26 에서 죽는다 (2026-08-21 실측)

증상이 고약하다. **오류 메시지가 한 줄도 안 나온다.**

```
 ⛅️ wrangler 4.97.0 (update available 4.124.0)
──────────────────────────────────────────────
(끝. exit code 만 1)
```

- `--dry-run` 도 똑같이 죽는다 → 네트워크·인증 문제가 아니라 **번들 이전 단계**에서 죽는 것이다.
- `WRANGLER_LOG=debug` 를 켜도 `errorType: "Error"` 만 남고 메시지가 비어 있다.
- `d1 execute --command` 는 멀쩡히 동작한다. 그래서 "wrangler 는 되는데 배포만 안 된다" 로 보인다.
- 파이프(`| tail`)를 물리면 `$?` 가 tail 의 종료코드라 **exit 0 으로 보인다.** 속지 말 것.

`npx -y wrangler@4.124.0 deploy` 로 바로 됐다. `package.json` 을 `^4.124.0` 으로 올려 뒀으므로
`npm install` 을 한 번 돌리면 그냥 `npx wrangler deploy` 가 동작한다.

## 배포됐는지 확인하는 법

```bash
npx wrangler deployments list | tail -8      # 맨 아래 Created 시각이 방금인지
curl -s https://banginoja-api.scoutkorea.workers.dev/api/categories | head -c 200
```

## D1 마이그레이션도 같은 함정이 있다

`--file` 은 remote 대상일 때 확인 프롬프트를 띄우는데, 사람이 없으면 답을 못 해
**아무것도 안 하고 조용히 끝난다.** 문장 하나씩 `--command` 로 넣고
`PRAGMA table_info(테이블)` 로 눈으로 확인할 것. 자세한 건 `migrations/schema-v12.sql` 머리말.
