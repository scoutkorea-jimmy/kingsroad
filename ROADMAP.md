# 뱅기노자 사이클 로드맵

> **목적:** 향후 작업 단위(사이클)의 단일 백로그. 사이클 시작 시 이 문서에서 다음 항목을 가져오고, 완료 시 status 갱신.
> **연관 문서:** 완료된 사이클 회고는 `pages/admin/AdminDesignHub.jsx` 의 `ADMIN_VERSION_HISTORY` 와 `CONTEXT.md §5` 에 기록.
> **마지막 갱신:** 2026-05-01 (v00.100 직후 — 일관성 검증 보고 반영)

---

## 사용 규약

1. **사이클 시작** — 큐 1 의 첫 pending 항목을 in_progress 로 표시하고 작업.
2. **사이클 완료** — status `✅ done` + 한 줄 회고 (commit hash). `ADMIN_VERSION_HISTORY` 신규 엔트리는 항목과 1:1 대응.
3. **새 보고/발견** — 적절한 큐(코드측 / 워커의존 / 메이저)에 즉시 추가. 이 문서가 single source of truth.
4. **순서 변경** — 사용자 지시 또는 차단 발견 시 자유롭게 재정렬. 단 의존성(★) 명시 항목은 차단 해소 전 진입 금지.

---

## 큐 1 — 다음 사이클 (검증 보고 후 명시 갱신)

### ⏳ v00.083 — LecturePageEditorPanel + HomePage 추천 섹션 잔재
- [ ] LecturePageEditorPanel 신설 — TourPageEditorPanel 의 글로벌 / 템플릿 / per-lecture 3 모드 패턴 복제 (lectureSchedule / lectureNotes / lecturePages 편집)
- [ ] admin 사이드바 운영설정 그룹에 "강연 페이지" 탭 추가
- [ ] HomePage 추천 여행지 섹션 헤더 / 빈 상태 메시지 → `site_content_kv.recommendationsHeading` 신설 + 연동 (v00.073 sweep 미완 항목)
- **동기:** 검증 보고 — v00.075 에서 강연 inline per-lecture 만 구현, 글로벌 default 편집 GUI 없음. 투어와 parity 미완.
- **추정:** 1-2 시간 (코드 거의 복제).
- **status:** pending

### ⏳ v00.084 — R2 admin 콘텐츠 확장 (Books + Recommendations)
- [ ] BooksAdminPanel: 책 표지 (cover_key) + PDF 미리보기 (pdf_key) 업로드 → BGNJ_MEDIA.uploadFile (folder='book-covers' / 'book-pdfs'). dataURI 폴백 유지.
- [ ] RecommendationsAdminPanel: 추천 여행지 이미지 → BGNJ_MEDIA.uploadFile (folder='recommendations'). dataURI 폴백 유지.
- [ ] 워커 변경 없음 — handleMediaUpload + handleMediaGet 활용.
- **동기:** v00.082 가 admin 6 슬롯만 처리. Books/Recommendations 패널은 fileToDataUri 직접 호출 잔재.
- **영향:** D1 books 테이블 행 비대화 (PDF base64 ~수백KB 누적) 차단.
- **추정:** 1-2 시간.
- **status:** pending

### ⏳ v00.085 — R2 사용자 콘텐츠 (게시글 첨부 + 이미지)
- [ ] CommunityPage PostCompose: 첨부 (10MB×3) + 이미지 (10장) 업로드 → BGNJ_MEDIA.uploadFile (folder='post-attachments' / 'post-images'). dataURI 폴백 유지.
- [ ] 게시글 상세 렌더 — 첨부 다운로드 링크 + 이미지 슬라이드가 R2 URL / dataURI 양쪽 정상 처리.
- [ ] legacy dataURI 게시글 호환 — 기존 게시글 표시 유지.
- **동기:** v00.082 가 admin only. 사용자 콘텐츠가 가장 큰 데이터 비대화 잠재 (10MB×3 첨부 누적).
- **영향:** D1 posts 테이블 행 비대화 차단. 첨부 한도 R2 도입 시 완화 가능 (다음 사이클).
- **추정:** 2-3 시간 (사용자 facing — 회귀 위험 신중).
- **status:** pending

### ⏳ v00.086 — legacy site_content cover 일괄 마이그레이션 도구 (선택)
- [ ] admin 운영자 도구: `site_content_kv.tourPages[id].coverDataUri` (v00.070 legacy) → `tours.cover_url` (v00.081 D1) 일괄 이동
- [ ] 동일 패턴 lecture 적용 (v00.083 LecturePageEditorPanel 완료 후)
- [ ] R2 함께 처리 — dataURI cover 를 R2 객체로 마이그레이션 (folder='tour-covers' / 'lecture-covers')
- [ ] 마이그 후 `tourPages[id].coverDataUri` 키 자동 삭제 (정합성)
- **동기:** v00.081 분기 저장 후 legacy 잔재 자동 정리 도구 부재. 운영자가 인지 못하면 잔재 무한 보존.
- **추정:** 1-2 시간.
- **status:** pending — v00.083~085 완료 후 진입 권장.

---

## 큐 2 — 워커 배포 의존 (★ wrangler deploy 필요)

(현재 비어있음 — v00.079 / v00.081 에서 처리. 향후 워커 변경 발생 시 추가)

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
