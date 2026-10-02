# 프로젝트 현재 상태

- 목적: 뱅기노자 역사·문화·여행 홈페이지 및 회원 커뮤니티.
- 구조: GitHub Pages 정적 사이트, React 18 전역 + esbuild, Cloudflare Worker + D1 + R2. Node 20+ / tools의 npm 잠금 파일 사용.
- 운영 배포: **v00.317.000, 2026-10-03**, 사용자 승인 후 코드 커밋 `f65c3674`·push·운영 반영 확인. 배포 소스·운영 파일 해시 검사 추가.
- 구현: HEIC/HEIF 자동 JPG 변환(heic-to 1.6.5 CSP Worker, 선택 시 지연 로드), 공통 업로드 관문, 한도 초과 이미지 단계적 자동 축소, 실패 시 기존 내용 보존, 변환된 첨부 메타데이터 저장.
- 추가 수정: 관리자 활동 기록 오류 API 경로/응답 필드, 오류 조회 실패 안내, 서버 UTC 방문 차트 해석. 일별 UTC 집계와 시간별 KST 표시를 구분.
- 운영 점검: 로그인된 관리자 UI 및 오류 API에서 기록 139건 확인. 2026-09-03~2026-10-03 신규 기록 0건. 마지막은 9월 1일 대용량 사진 업로드 실패. 기록 없음이 모든 오류의 부재를 보증하지는 않음. 과거 오류 기록은 보존.
- 검증: 빌드 3종, check-all 8종, smoke 253건, git diff --check 통과. Safari/Chrome에서 실제 HEIC→JPG·미리보기·localhost 모의 업로드, 손상 파일 다음 사진 처리·자동 축소·401 실패 확인. 실제 새 버전 홈페이지 부팅 확인.
- 제약: HEIC 원본 최대 50MB, JPG 출력은 슬롯별 한도. GIF 애니메이션은 보존하며 자동 축소하지 않음. JPG 변환 시 EXIF 등 원본 메타데이터 보존을 보장하지 않음. iPhone 실기기·운영 R2 업로드·배포 후 검증은 아직 수행하지 않음.
- 인증: Wrangler OAuth 만료는 확인했으나 이번 프론트엔드 작업에 재로그인 불필요. GitHub 로그인 확인 완료. 이번 Worker 코드 변경 없음; 이전 ACTIVE에 남은 Worker 배포 상태는 별도 사항.
- Git: 사용자 기존 `.claude/scheduled_tasks.lock` 삭제 및 `.claude/scheduled_tasks 3.lock` 미추적 파일 보존. 이번 커밋 대상에서 제외.
- 배포 확인: Pages 기존 `legacy` 브랜치 배포가 미추적 HEIC 산출물을 누락시킨 것을 발견. `workflow`로 변경·재배포해 변환기/Worker/라이선스 HTTP 200 확인. 이후 CI가 배포 소스 설정과 실제 운영 파일 해시까지 검사.
- 다음 작업: GitHub Pages 마지막 Actions의 운영 해시 검사 결과 확인. iPhone 실기기에서 실제 HEIC 업로드 확인.
- 이어서 읽기: `rules/handoff/ACTIVE.md`, `README.md`, `components/ImageShrink.jsx`, `data.js`, `tools/test-upload.mjs`.
- 이어서 실행: `node tools/check-all.mjs`, `node tools/build.mjs`, `git diff --check`, `git status --short`. 실제 HEIC 브라우저 검증은 README의 localhost 전용 절차 사용.
