# rules/ — 전체 지도

`CLAUDE.md` 가 "어디를 볼지"를 알려주고, 이 폴더가 "무엇을 지킬지"를 담습니다.
각 파일은 200줄 안팎으로 유지합니다 — 한 번에 하나만 읽고 작업할 수 있게 하기 위함입니다.

---

## 파일 목록

| 파일 | 담는 것 |
|---|---|
| [10-coding.md](10-coding.md) | 차단 룰 4 · 정보 룰 · 우회 마커 · `BGNJ_GUARD` · ErrorBoundary · 구현 규칙 · 헬퍼 목록 |
| [11-data-flow.md](11-data-flow.md) | D1 source-of-truth · 캐시 덮어쓰기 금지 · 저장소 4태그 분류 · 응답 매퍼 |
| [20-design.md](20-design.md) | 브랜드 무드 · 컬러 v2 · 타이포 · 레이아웃 · 컴포넌트 · 인터랙션 · 접근성 · 디자인 금지 |
| [30-release.md](30-release.md) | 버전 체계 · 3종 동기 · 캐시버스터 · CSP · Git/배포 · 검증 명령 |
| [40-security.md](40-security.md) | 권한 모델 · 업로드 폴더 정책 · 시크릿 · rate limit · 오류 표시 4요소 |
| [50-workflow.md](50-workflow.md) | 작업 절차 · handoff 운영 · 완료 체크리스트 · 비개발자 설명 · AI 협업 |
| [60-environment.md](60-environment.md) | 새 PC 셋업 · 훅 설치 · 빌드 복구 · 로컬 미리보기 |
| [90-file-map.md](90-file-map.md) | 파일 구조 · 라우팅 · **핵심 파일·라인 포인터** |
| [handoff/](handoff/) | 작업 기록 — `ACTIVE.md`(진행 중) · `INDEX.md`(목록) · `done/`(완료) |

`design/` 은 규칙이 아니라 **스펙과 자산**입니다 — 토큰 실측값, 컴포넌트 스펙, 시안, 참고 이미지.
`docs/kms.md` 는 관리자 KMS 화면과 동기되는 지식 문서로, 규칙이 아니므로 분할하지 않습니다.

---

## 언제 무엇을 읽나

| 상황 | 읽는 순서 |
|---|---|
| 새 작업을 받았다 | `handoff/ACTIVE.md` → `50-workflow.md` → 해당 주제 파일 |
| PC가 바뀌어 이어받는다 | `handoff/ACTIVE.md` → `60-environment.md` |
| 어떤 코드가 어디 있는지 모르겠다 | `90-file-map.md` 하나만 |
| 새 화면·섹션을 만든다 | `20-design.md` → `design/tokens.md` → `10-coding.md` |
| 데이터를 붙인다 | `11-data-flow.md` → `90-file-map.md` |
| 커밋·배포하려 한다 | `30-release.md` → `50-workflow.md` 완료 체크리스트 |
| 빌드/환경이 깨졌다 | `60-environment.md` |
| 권한·업로드를 건드린다 | `40-security.md` |

---

## 인프라 한 장

```
사용자 브라우저
   │  GET https://bgnj.net/...
   ▼
GitHub Pages (정적)
   ├─ index.html          단일 번들 <script dist/app.js> + CSP meta + JSON-LD
   ├─ data.js / api.js    손작성, 번들 제외 (BGNJ_* 헬퍼 · API 래퍼)
   ├─ styles.css
   ├─ dist/app.js         메인 번들 (src/entry-main.jsx)
   └─ dist/admin.js       admin route 진입 시 지연 로드 (src/entry-admin.jsx)
   │
   │  fetch /api/...
   ▼
Cloudflare Worker (banginoja-api)  ← 배포는 사용자 수동 (wrangler deploy)
   ├─ D1 (banginoja-db)   28 tables — 콘텐츠 source-of-truth
   └─ R2 (banginoja-media) 이미지·첨부
```

**세 가지 운영 축**

1. **D1 source-of-truth** — 사용자가 보는 모든 콘텐츠는 서버에서 온다. 시드/로컬 폴백을 만들지 않는다.
2. **가드 + ErrorBoundary 2-tier** — 한 페이지나 섹션이 죽어도 전역 트리는 살아남는다.
3. **pre-commit 자동화 5도구** — stamp-datetime → csp-hashes → check-version → build → check-syntax.

**배포 흐름**
- 프론트엔드: `git push origin main` → GitHub Pages 자동 빌드.
- 워커: `cd workers && npx wrangler deploy` — **사용자가 직접 실행.**
- D1 스키마: `cd workers && npx wrangler d1 execute banginoja-db --remote --file=schema-vN.sql` (멱등).
