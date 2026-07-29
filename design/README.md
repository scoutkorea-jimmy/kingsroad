# design/

디자인의 **스펙과 자산**이 있는 곳입니다. 규칙(무엇을 지켜야 하는가)은 [../rules/20-design.md](../rules/20-design.md) 에 있습니다.

| 파일·폴더 | 내용 |
|---|---|
| [tokens.md](tokens.md) | 컬러·타이포·형태·브레이크포인트 **실측값** — `styles.css` `:root` 의 사람용 사본 |
| [components.md](components.md) | 버튼·카드·칩·배지·폼·모달 스펙 |
| `mockups/` | 개편 시안 |
| `references/` | 참고 이미지, 개편 전후 스크린샷 |

## 세 곳을 함께 갱신합니다

디자인 결정이 바뀌면 다음 셋이 **같은 커밋에서** 움직여야 합니다.

1. `styles.css` — 실제 구현
2. `design/tokens.md` · `design/components.md` — 스펙
3. `pages/admin/AdminDesignHub.jsx` — 관리자 화면의 Design System View

하나만 고치면 나머지는 그 순간부터 거짓말이 됩니다.
`rules/20-design.md` 는 원칙이 바뀔 때만 건드립니다 (값이 아니라 규칙이 바뀔 때).

## 사진 자산 기준

히어로 배경으로 쓰려면 **가로형, 폭 2,000px 이상**이 필요합니다.

2026-07-29 조사 기준 기존 자산은 이 기준에 못 미칩니다 — 커뮤니티 게시글 이미지 497장은 대부분
폭 510px(네이버 블로그 본문 폭)이고, 칼럼 커버 74장도 462~800px 입니다. 일부는 스톡 사진으로 보이는
Exif 가 남아 있어 눈에 띄는 자리에 쓸 때 저작권 확인이 필요합니다.

히어로 배경은 관리자 → 사이트 콘텐츠 → 히어로에서 업로드합니다
([pages/admin/AdminContentEditors.jsx:1503](../pages/admin/AdminContentEditors.jsx#L1503)).
R2 폴더는 `hero-bg/` 이며 `USER_ALLOWED_FOLDERS` 에 없으므로 자동으로 관리자 전용입니다.
