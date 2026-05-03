# 뱅기노자 사이클 로드맵

> **목적:** 향후 작업 단위(사이클)의 단일 백로그. 사이클 시작 시 이 문서에서 다음 항목을 가져오고, 완료 시 status 갱신.
> **연관 문서:** 완료된 사이클 회고는 `pages/admin/AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY` 와 `CONTEXT.md §5` 에 기록.
> **마지막 갱신:** 2026-05-01 (v00.112 — 보안 audit 잔재 분류 + v00.105~111 회고 반영)

---

## 사용 규약

1. **사이클 시작** — 큐 1 의 첫 pending 항목을 in_progress 로 표시하고 작업.
2. **사이클 완료** — status `✅ done` + 한 줄 회고 (commit hash). `ADMIN_VERSION_HISTORY` 신규 엔트리는 항목과 1:1 대응.
3. **새 보고/발견** — 적절한 큐(코드측 / 워커의존 / 메이저)에 즉시 추가. 이 문서가 single source of truth.
4. **순서 변경** — 사용자 지시 또는 차단 발견 시 자유롭게 재정렬. 단 의존성(★) 명시 항목은 차단 해소 전 진입 금지.

---

## 큐 1 — 다음 사이클 (검증 보고 후 명시 갱신)

> v00.113 까지 보안 audit 잔재 대부분 마무리. 남은 작업은 사용자 수동 (Secrets) 과 nonce 기반 CSP 강화.

- **v00.118 ✅ (코드)** — CSP `'unsafe-inline'` 제거 (script-src 한정). 정적 호스팅 환경에서는 nonce 가 의미 없으므로 SHA-256 해시 방식 채택. tools/csp-hashes.mjs 가 pre-commit 시 자동 동기. style-src 'unsafe-inline' 은 Tiptap 인라인 스타일 의존도 때문에 유지.
- **v00.119 ✅ (코드)** — legacy `categories` / `grades` / `site_content` deprecation. schema.sql 에 DEPRECATED 마커 + schema-v5.sql 신설(DROP TABLE).
- **v00.123 ✅ (사용자 수동 인가)** — production D1 정리 완료. seed-kv 적용 → categories_kv 5 / grades_kv 6 시드 → schema-v5 DROP → legacy 3 테이블 제거 (28 tables remaining). server-first 정상화.

## 큐 2 — 워커 배포 의존 (★ wrangler deploy 필요)

(현재 비어있음 — v00.113 에서 v00.111 + rate limit 일괄 deploy 처리.)

---

## 큐 3 — 메이저 마이그레이션 (별 사이클)

(현재 비어있음 — v00.090 Tiptap 3 완료. v00.100 React 19 보류 결정)

후보 (재검토 시점 도래 시):
- React 18 보안 EOL 도달 시 ESM 재구조화 사이클 진입
- ProseMirror / Lexical 같은 Tiptap 대안 검토 (유지보수 변경 시점)

---

## 큐 4 — 사용자 직접 작업 (코드 외)

| 항목 | 차단 영향 | 비고 |
|---|---|---|
| **★ HTTPS/SSL 인프라 도입** | bgnj.net SSL 활성화 | CONTEXT.md §7.5 가이드 — Cloudflare 대시보드 + GitHub Pages 설정 |
| **★ Cloudflare Secrets 이관** | SUPER_ADMIN/ADMIN_BOOTSTRAP 평문 노출 제거 | `wrangler secret put SUPER_ADMIN_EMAILS` + `wrangler secret put ADMIN_BOOTSTRAP_EMAIL` 후 wrangler.toml [vars] 에서 두 항목 제거. |
| **★ schema-v4.sql 적용** | rate limit 활성화 | `cd workers && wrangler d1 execute banginoja-db --remote --file=schema-v4.sql` (1회). |
| ✅ ~~seed-kv.sql 적용~~ | (v00.123 완료) categories_kv 5 / grades_kv 6 row 세팅. server-first 정상화. | |
| ✅ ~~schema-v5.sql 적용~~ | (v00.123 완료) legacy categories / grades / site_content DROP. 28 tables remaining. | |

---

## 검증 권장 (사용자 직접)

> v00.071-100 사이클 후 라이브 회귀 점검. 각각 한 번 시도하면 충분.

- [ ] **R2 첫 업로드** — admin → 사이트 콘텐츠 → OG 이미지 업로드 한 번 → Network 탭에서 `/api/media/upload` 200 확인 + bucket object_count: 0 → 1+ 확인 (현재 0)
- [ ] **Tiptap 3 회귀** — 글쓰기 모달에서 표 / 체크리스트 / 형광펜 / Sub-Sup / 정렬 / 코드블록 / YouTube 정상 동작
- [ ] **투어 cover_url D1 분기** — admin → 투어 → 카드 `📋` 에서 cover 업로드 → 라이브 답사 페이지에서 D1 `cover_url` 우선 표시
- [ ] **강연 페이지** — admin → 강연 → 카드 `📋` 에서 진행/참고/커버 inline 편집 동작
- [ ] **books 정상 저장** — admin → 책 → 표지/대표/순서 변경 시 새로고침 후에도 보존 (v00.074 silent bug fix 회귀 검증)

---

## 발견된 hidden 항목 (audit 결과 → 큐 1 이동)

> 매 사이클 audit 시 발견된 항목은 여기에 임시 기록 후 적절한 큐로 분류.

(v00.100 검증 보고 → v00.083~086 으로 분류 완료)

---

## 사이클 완료 회고 (요약, 상세는 ADMIN_VERSION_HISTORY)

> 본 문서는 forward-looking. 완료 항목은 한 줄로 옮기고 본문에서 제거.

- **v00.070** ✅ 투어 페이지 모든 항목 admin 편집 + AuthAdminPage 9332→6900 분할 (commit `3ccc6b9`)
- **v00.071** ✅ 빌드 단계 도입 (esbuild) — Babel-standalone 제거, in-browser 경고 / 500KB deopt 근본 차단 (commit `0dcf267`)
- **v00.072** ✅ 홈 카드 desc 축약 + TourAdminPanel inline 답사 일정·준비물·커버 편집 통합 (commit `16940d3`)
- **v00.073** ✅ 전 페이지 hero/intro + 푸터 잔재 admin 편집화 sweep — 9 페이지 + 푸터 4 필드 (commit `07a9ca0`) — *추천 섹션 헤더 잔재는 v00.083 으로 이월*
- **v00.074** ✅ 데이터 매퍼 audit — _toBook 양방향 silent 버그 fix + _toLecture/_toOrder 보강 (commit `726fbb1`)
- **v00.075** ✅ 강연 페이지 편집화 parity — 진행/참고/커버 per-lecture + 후기 게이팅 + inline LectureAdminPanel (commit `9bb52f8`) — *글로벌 default GUI 편집은 v00.083 LecturePageEditorPanel 로 이월*
- **v00.076** ✅ Tiptap CSS 보강 — 14 extension 시각 스타일 일괄 (commit `5a918f7`)
- **v00.077** ✅ useModalGuard 일괄 적용 — 5 모달 ESC+body lock+popstate 통일 (commit `bddd796`)
- **v00.078** ✅ AuthAdminPage 2차 분할 — AdminContentEditors.jsx 1300 줄 추출 (commit `7249dc5`)
- **v00.079** ✅ legacy `bgnj_comments` 제거 + storage v6 + ★ wrangler deploy v00.062 metrics endpoint 활성화 (commit `5132fb5`)
- **v00.081** ✅ 투어 D1 `cover_url` 컬럼 마이그레이션 + ★ wrangler deploy (commit `8356cef`) — *legacy site_content cover 자동 마이그 도구는 v00.086 으로 분리*
- **v00.082** ✅ R2 업로드 흐름 활성화 — admin 6 슬롯 (OG/로고/파비콘/auth/투어 커버/강연 커버) (commit `0707e00`) — *Books/Recommendations/게시글 미적용 → v00.084-085 로 분리*
- **v00.090** ✅ Tiptap 3 메이저 — @tiptap/* 3.22.5 + StarterKit 중복 제거 (commit `2115b77`)
- **v00.100** ✅ React 19 마이그레이션 평가 — UMD 단종으로 보류 + 18.3.1 LTS 유지 + DEPENDENCY_MATRIX 갱신 (commit `583c255`)
- **v00.101** ✅ LecturePageEditorPanel + HomePage 추천 헤딩 (ROADMAP v00.083, commit `6886d4d`)
- **v00.102** ✅ R2 admin 확장 — Books 표지/PDF + Recommendations 이미지 (ROADMAP v00.084, commit `983d094`)
- **v00.103** ✅ R2 사용자 콘텐츠 — 게시글 첨부 + 이미지 (ROADMAP v00.085, commit `0eaf1d2`)
- **v00.104** ✅ LegacyMigrationPanel — 누적 legacy cover 일괄 마이그 (ROADMAP v00.086, commit 다음 sha)
- **v00.105** ✅ 홈 hero 지도 제거 + 빈 섹션 미노출 + 커버 placeholder 통합 + 책 추가 fix + site_content 줄바꿈 + 투어/강연 admin 통합 + 놀자 시리즈 그룹화 + Tiptap 3 named imports
- **v00.106** ✅ TourAdminPanel 폼 재구조화 (필드 그룹 6) + 부제/환불정책 D1 컬럼 + GUI 일정/준비물 편집 (zebra cards) + ★ wrangler deploy
- **v00.107** ✅ ADMIN_VERSION_HISTORY datetime + KST 헬퍼 (BGNJ_FMT) + CSV 다운로드 + 사이트 KST sweep 시작
- **v00.108** ✅ BGNJ_FMT formatToParts fix (정규식 출력 깨짐 해소) + 사이트 전반 KST sweep 19곳 + DEPENDENCY_MATRIX 갱신
- **v00.109** ✅ 보안 audit — DOMPurify XSS sanitize 5곳 + R2 폴더 권한 분기 + HTTP origin 제거 + ★ wrangler deploy
- **v00.110** ✅ 홈 hero ReferenceError fix (HeroProgramCards G 미정의) + v00.106~109 datetime 실제 commit 시간 정정
- **v00.111** ✅ datetime auto-stamp (tools/stamp-datetime.mjs) + 게시판 작성 권한 검증(post_min_level) + X-Frame-Options/CSP frame-ancestors (commit `5ddcf25`) — *★ 워커 deploy 보류*
- **v00.112** ✅ BGNJ_SAFE_HTML hardening — iframe src 화이트리스트(YouTube/Vimeo) + data: URI image-only + a[target=_blank] noopener 강제 + ROADMAP 갱신
- **v00.113** ✅ 전체 CSP 메타 + brute-force rate limit (D1 login_attempts) + ★ wrangler deploy v00.111 post_min_level + rate limit 일괄
