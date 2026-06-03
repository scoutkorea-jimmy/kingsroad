# D1 스키마 안내 (v00.273 정리)

스키마 SQL 파일이 버전별로 너무 많이 쪼개져 있어 정리했습니다.

## 현재 구조

```
workers/
├─ schema-hangyeon.sql     ← 한켠(자고 놀자) 예약 PMS 통합 스키마. 이것만 실행하면 한켠 전체 테이블 생성.
└─ migrations/             ← 코어 앱(회원/게시글/강연/투어/책 등) 의 과거 증분 마이그레이션. 운영 DB 에 이미 모두 적용됨(기록 보존).
   ├─ schema.sql           (base)
   ├─ schema-v2.sql ~ schema-v10.sql
   └─ seed-kv.sql          (categories_kv / grades_kv 초기 시드)
```

## 원칙 (앞으로)

- **기능 단위로 단일 스키마 파일 1개** 를 유지하고, 모든 컬럼을 최종 형태로 `CREATE TABLE IF NOT EXISTS` 인라인으로 둔다. (ALTER 누적 분할 금지 — `schema-hangyeon.sql` 이 그 예시)
- 멱등(IF NOT EXISTS)이므로 운영 DB 에 다시 실행해도 no-op. 신규 DB 는 한 번에 생성.
- 과거 증분 파일은 `migrations/` 로 보관만 한다(재실행 불필요 — 이미 적용됨).

## 적용 방법

```bash
# 한켠 (신규/갱신)
cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-hangyeon.sql

# 완전 신규 DB 를 처음부터 만들 때만: migrations/ 를 순서대로 실행 후 schema-hangyeon.sql
cd workers && for f in migrations/schema.sql migrations/schema-v*.sql migrations/seed-kv.sql; do \
  npx wrangler d1 execute banginoja-db --remote --file="$f"; done
```

> 운영 DB(banginoja-db)는 이미 코어 마이그레이션 + 한켠 v6/v7/v8 이 모두 적용된 상태입니다. `schema-hangyeon.sql` 은 그 위에 멱등으로 동작합니다.
