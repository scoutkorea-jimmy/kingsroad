// 뱅기노자 — 메인 번들 엔트리 (v00.285 Stage 1)
//
// index.html 의 <script defer> 로딩 순서를 그대로 side-effect import 로 옮긴 것.
// 각 파일은 여전히 `window.X = X` 로 전역 노출하고, 의존은 `const X = window.X` 로 받는다.
// esbuild bundle 모드는 각 import 를 독립 모듈 스코프로 처리(현 IIFE 격리와 동일) +
// import 순서대로 side-effect(전역 할당) 실행 → 런타임 동작 불변.
//
// ⚠️ 이 순서는 index.html script 순서와 1:1 이어야 한다. 바꾸면 전역 미정의(undefined) 발생.
// admin 4종(+AuthAdminPage)은 여기 없음 — entry-admin.jsx 로 분리, boot 가 동적 주입.

import '../api.js';
import '../data.js';
import '../components/KoreaMapData.js';
import '../components/KoreaMap.jsx';
import '../components/Shell.jsx';
import '../components/TiptapEditor.jsx';
import '../components/ConfirmDialog.jsx';
import '../components/CashReceiptField.jsx';
import '../components/TaxInvoiceField.jsx';
import '../components/MediaGallery.jsx';
import '../pages/HomePage.jsx';
import '../pages/HomeNextPage.jsx';
import '../pages/CommunityPage.jsx';
import '../pages/WangsanamTourPage.jsx';
import '../pages/ColumnPage.jsx';
import '../pages/BookCheckoutPage.jsx';
import '../pages/HangyeonPage.jsx';
import '../pages/LecturesPage.jsx';
import '../pages/LegalFaqPages.jsx';
import '../pages/MyPage.jsx';
import '../pages/ErrorPages.jsx';
import '../boot.jsx';
