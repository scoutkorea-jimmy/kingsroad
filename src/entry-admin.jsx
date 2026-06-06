// 뱅기노자 — admin 번들 엔트리 (v00.285 Stage 1)
//
// boot.jsx 의 ADMIN_SCRIPTS 동적 주입 순서를 그대로 side-effect import.
// admin route 진입 시에만 로드되는 코드 스플리팅 경계를 보존하기 위해 메인 번들과 분리.
// async=false 로 보장하던 strict 순서를 여기서 import 순서로 보존한다.
//
// ⚠️ AuthAdminPage 는 AdminShared/ContentEditors/DesignHub 의 window globals 를 참조 → 순서 고정.

import '../pages/admin/AdminShared.jsx';
import '../pages/admin/AdminContentEditors.jsx';
import '../pages/admin/AdminDesignHub.jsx';
import '../pages/admin/HangyeonAdminPanel.jsx';
import '../pages/admin/AdminLogin.jsx';
import '../pages/admin/AdminPolicyPanels.jsx';
import '../pages/admin/AdminMonitorPanels.jsx';
import '../pages/admin/AdminMemberPanel.jsx';
import '../pages/admin/AdminLogPanels.jsx';
import '../pages/admin/AdminBooksPanel.jsx';
import '../pages/admin/AdminCommercePanels.jsx';
import '../pages/admin/AdminEventsPanels.jsx';
import '../pages/admin/AdminSiteContentPanel.jsx';
import '../pages/admin/AdminDashboardPanel.jsx';
import '../pages/admin/AdminCommunityConfigPanels.jsx';
import '../pages/admin/AdminGradeColumnPanels.jsx';
import '../pages/AuthAdminPage.jsx';
