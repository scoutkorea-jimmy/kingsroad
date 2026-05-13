// 공통 컴포넌트: Nav, Footer, Tweaks, Brand, AuthorGradeBadge, NotificationBell, ScrollToTop

// === Body scroll-lock 카운터 (v00.259) ===========================
// v00.258 까지: useModalGuard / SiteSearchOverlay / 모바일 메뉴 각자 `prev`
// 스냅샷 후 cleanup 에서 복원. 두 lock 이 동시에 살아 있으면 두 번째가
// prev='hidden' 을 잡고, 첫 번째 cleanup 이 prev='' 로 풀더라도 두 번째 cleanup
// 이 다시 'hidden' 으로 덮어써 본문 스크롤이 영구 잠김 (사용자 보고: 책 상세
// 페이지에서 입력 후 마우스 스크롤이 안 됨).
// 카운터+초기 prev 1회만 캡처. 마지막 unlock 시점에 복원.
// v00.260 — 글로벌(window) 헬퍼로 승격. AuthAdminPage 등 외부 파일도 동일 카운터
// 사용하도록 통일. 새 모달/오버레이는 항상 BGNJ_SCROLL_LOCK.lock/unlock 만 호출 — 직접
// document.body.style.overflow 조작 금지(carry-over 'hidden' 회귀 차단).
window.__bgnjScrollLock = window.__bgnjScrollLock || { count: 0, prev: '' };
window.BGNJ_SCROLL_LOCK = window.BGNJ_SCROLL_LOCK || {
  lock: () => {
    const s = window.__bgnjScrollLock;
    if (s.count === 0) {
      s.prev = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
    }
    s.count += 1;
  },
  unlock: () => {
    const s = window.__bgnjScrollLock;
    if (s.count <= 0) { s.count = 0; return; }
    s.count -= 1;
    if (s.count === 0) {
      document.body.style.overflow = s.prev;
      s.prev = '';
    }
  },
};
const lockBodyScroll   = () => window.BGNJ_SCROLL_LOCK.lock();
const unlockBodyScroll = () => window.BGNJ_SCROLL_LOCK.unlock();

// === 모달 가드 훅 (v00.067) ====================================
// ESC 키 + 외부 클릭(backdrop) + 브라우저 뒤로가기 시 모달을 닫기 전에 dirty 상태면 사용자에게 confirm.
// 사용법:
//   const { onBackdropClick } = useModalGuard({ open, dirty, onClose, onSaveDraft });
//   <div onClick={onBackdropClick}>...</div>
// onSaveDraft 가 있고 dirty 면 prompt — 저장 / 버리기 / 취소.
window.useModalGuard = function useModalGuard({ open, dirty, onClose, onSaveDraft, label, contentRef }) {
  const promptName = label || '작성 중인 내용';
  // v00.127 — handleAttemptClose 를 ref 로 안정화. 이전엔 dirty/onClose/onSaveDraft 가 부모
  // re-render 마다 새 ref → handleAttemptClose 새 ref → useEffect 의 deps 변경 → cleanup 실행
  // → history.back() 호출 → popstate 발생 → modal 닫힘. (모달이 떴다 즉시 사라지는 사용자 보고)
  // ref 패턴으로 useEffect 는 [open] 만 의존, handleAttemptClose 는 항상 최신 상태 사용.
  const stateRef = React.useRef({ dirty, onClose, onSaveDraft, promptName });
  stateRef.current = { dirty, onClose, onSaveDraft, promptName };

  const handleAttemptClose = React.useCallback(async () => {
    const s = stateRef.current;
    if (!s.dirty) { s.onClose?.(); return; }
    // v00.242 — useModalGuard 의 popstate/ESC 동기 핸들러에서 호출되지만 BGNJ_CONFIRM Promise 로 정합.
    // window.confirm() 은 v00.208 에서 사이트 전반 폐기 → 본 잔재도 통일.
    const fallbackConfirm = (msg) => {
      try { return window.BGNJ_CONFIRM ? window.BGNJ_CONFIRM(msg, { danger: true, confirmLabel: '확인' }) : Promise.resolve(true); }
      catch { return Promise.resolve(true); }
    };
    if (s.onSaveDraft) {
      const yes = await fallbackConfirm(`${s.promptName}이(가) 저장되지 않았습니다. 임시저장 하시겠어요? [확인] = 임시저장 후 닫기 / [취소] = 그냥 닫기 (변경 내용 버림)`);
      if (yes) { try { s.onSaveDraft(); } catch {} }
      s.onClose?.();
    } else {
      const ok = await fallbackConfirm(`${s.promptName}이(가) 저장되지 않았습니다. 정말 닫으시겠어요?`);
      if (ok) s.onClose?.();
    }
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        handleAttemptClose();
      }
    };
    window.addEventListener('keydown', onKey);
    lockBodyScroll();
    let pushed = false;
    try {
      window.history.pushState({ bgnjModal: true }, '');
      pushed = true;
    } catch {}
    const onPop = () => { handleAttemptClose(); };
    if (pushed) window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockBodyScroll();
      if (pushed) {
        window.removeEventListener('popstate', onPop);
        try { if (window.history.state?.bgnjModal) window.history.back(); } catch {}
      }
    };
  }, [open, handleAttemptClose]);

  const onBackdropClick = React.useCallback((e) => {
    if (e.target === e.currentTarget) handleAttemptClose();
  }, [handleAttemptClose]);

  // v00.160 — focus trap (a11y P1-1). 모달 open 시 첫 focusable focus + Tab 순환 + 닫힐 때 직전 focus 복원.
  // contentRef 미전달 시 [role="dialog"][aria-modal="true"] 또는 [data-bgnj-modal="true"] 폴백 selector.
  // 5 호출 사이트는 변경 0 — selector 미매치 시 trap 비활성 (회귀 안전).
  React.useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    // 모달이 mount 되기 전에 effect 가 돌면 querySelector null → 다음 프레임에서 재시도.
    let container = null;
    const findContainer = () => contentRef?.current
      || document.querySelector('[role="dialog"][aria-modal="true"]')
      || document.querySelector('[data-bgnj-modal="true"]');
    container = findContainer();
    let raf = null;
    if (!container) {
      raf = requestAnimationFrame(() => { container = findContainer(); attach(); });
    }
    const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const listFocusables = () => {
      if (!container) return [];
      return Array.from(container.querySelectorAll(FOCUSABLE))
        .filter((el) => el.offsetParent !== null);
    };
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const fs = listFocusables();
      if (fs.length === 0) return;
      const first = fs[0], last = fs[fs.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); try { last.focus(); } catch {} }
      else if (!e.shiftKey && active === last) { e.preventDefault(); try { first.focus(); } catch {} }
    };
    function attach() {
      if (!container) return;
      // 첫 focus — 이미 모달 안에 focus 가 있지 않을 때만.
      const fs = listFocusables();
      if (fs.length > 0 && !container.contains(document.activeElement)) {
        try { fs[0].focus(); } catch {}
      }
      container.addEventListener('keydown', onKey);
    }
    attach();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (container) container.removeEventListener('keydown', onKey);
      // 직전 focus 복원 — element 가 unmount 됐으면 silent.
      try { prevFocus?.focus?.(); } catch {}
    };
  }, [open, contentRef]);

  return { onBackdropClick, handleAttemptClose };
};

// 페이지 우하단 '맨 위로' 플로팅 버튼 — 일정 거리 이상 스크롤된 후 노출
// v00.196 — 사용자 보고 '홈페이지 반응성 확장 — 안정적인 형태로'.
// 이전엔 매 scroll tick 마다 querySelector + setVisible 호출 → 스크롤 jank.
// rAF throttle + adminScroller 캐시 + 동일 visible 상태면 setVisible 호출 skip.
const ScrollToTop = React.memo(() => {
  const [visible, setVisible] = React.useState(false);
  const visibleRef = React.useRef(visible);
  visibleRef.current = visible;

  React.useEffect(() => {
    const adminScroller = document.querySelector('div[aria-label="관리자 메뉴"] + div');
    let queued = false;
    const tick = () => {
      queued = false;
      const sy = adminScroller
        ? Math.max(adminScroller.scrollTop || 0, window.scrollY || 0)
        : (window.scrollY || 0);
      const next = sy > 320;
      if (next !== visibleRef.current) setVisible(next);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (adminScroller) adminScroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (adminScroller) adminScroller.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTop = () => {
    const adminScroller = document.querySelector('div[aria-label="관리자 메뉴"] + div');
    if (adminScroller && adminScroller.scrollTop > 0) {
      adminScroller.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;
  return (
    <button
      type="button"
      className="scroll-top-fab"
      onClick={goTop}
      aria-label="맨 위로"
      title="맨 위로">
      ↑
    </button>
  );
});


// 작성자 등급 배지 — 게시글/댓글 작성자 옆에 인라인으로 표시
const AuthorGradeBadge = ({ authorId, author, authorEmail, size = "sm" }) => {
  const grade = window.BGNJ_AUTHOR_GRADE?.({ authorId, author, authorEmail });
  if (!grade) return null;
  const small = size === "sm";
  return (
    <span
      className="mono"
      title={`${grade.label} · ${grade.desc || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: 6,
        padding: small ? '1px 6px' : '2px 8px',
        fontSize: small ? 9 : 10,
        letterSpacing: '0.14em',
        color: grade.color || 'var(--primary)',
        border: `1px solid ${grade.color || 'var(--primary-dim)'}`,
        borderRadius: 2,
        textTransform: 'uppercase',
        verticalAlign: 'middle',
      }}>
      {grade.label}
    </span>
  );
};

// 알림 벨 — 우상단 내비게이션에 노출
const NotificationBell = ({ user, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const ref = React.useRef(null);

  // 다른 탭/세션에서 알림이 추가되면 storage 이벤트로 갱신
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'bgnj_notifications') setTick((t) => t + 1);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 외부 클릭으로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!user) return null;
  // BGNJ_COMMUNITY 가 부분 로드된 시점에 호출돼도 화면이 깨지지 않도록 모든 호출에 옵셔널 체이닝 + 가드
  const rawList = (() => { try { return window.BGNJ_COMMUNITY?.listNotifications?.(user.id); } catch { return []; } })();
  const list = Array.isArray(rawList) ? rawList : [];
  const unread = list.filter((n) => n && !n.read).length;

  const pick = (n) => {
    try { window.BGNJ_COMMUNITY?.markNotificationRead?.(user.id, n.id); } catch {}
    setOpen(false);
    if (onPick) onPick(n);
    setTick((t) => t + 1);
  };

  const markAll = () => {
    try { window.BGNJ_COMMUNITY?.markAllNotificationsRead?.(user.id); } catch {}
    setTick((t) => t + 1);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn btn-small"
        aria-label={`알림 ${unread > 0 ? `${unread}건 안 읽음` : ''}`}
        onClick={() => setOpen((v) => !v)}
        style={{ position: 'relative', padding: '6px 10px', minWidth: 36 }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{ display: 'block', verticalAlign: 'middle' }}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unread > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: -4, right: -4,
              background: 'var(--primary)', color: 'var(--bg)',
              borderRadius: 999, fontSize: 9, fontWeight: 700,
              padding: '1px 5px', letterSpacing: 0,
              minWidth: 14, textAlign: 'center', lineHeight: 1.4,
            }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="알림 목록"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 320, maxHeight: 400, overflow: 'auto',
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            zIndex: 50,
          }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono gold" style={{ fontSize: 10, letterSpacing: '0.22em' }}>알림 · {list.length}</span>
            {unread > 0 && (
              <button type="button" onClick={markAll} className="btn-ghost"
                style={{ fontSize: 11, color: 'var(--ink-2)' }}>모두 읽음</button>
            )}
          </div>
          {list.length === 0 ? (
            <div className="dim" style={{ padding: 24, textAlign: 'center', fontSize: 13 }}>
              아직 받은 알림이 없습니다.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => pick(n)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '12px 14px',
                      background: n.read ? 'transparent' : 'rgba(245,213,72,0.06)',
                      borderBottom: '1px solid var(--line)',
                      cursor: 'pointer',
                    }}>
                    <div style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.5 }}>
                      <span className="gold">{n.fromName}</span>
                      <span className="dim"> · {n.message || '새 알림'}</span>
                    </div>
                    {n.postTitle && (
                      <div className="dim" style={{ fontSize: 11, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        ▸ {n.postTitle}
                      </div>
                    )}
                    <div className="mono dim-2" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>
                      {window.BGNJ_FMT.kstDateTime(n.createdAt)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// 뱅기노자 브랜드 마크 — 노란 라운드 사각형 + 'B' 컷아웃 + 뱅기 + 별들.
// PDF 원본 기반으로 SVG 재구성. 주 색상은 브랜드 노란색 #F5D548.
const BanginojaIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    {/* 라운드 사각형 배경 */}
    <rect width="64" height="64" rx="9" ry="9" fill="#F5D548"/>
    {/* 'B' 컷아웃 — 두 개의 둥근 볼륨이 좌측 세로 기둥에 붙은 형태. fillRule=evenodd 로 안쪽 빈 공간을 컷아웃. */}
    <path
      fillRule="evenodd"
      d="M 9 8 L 9 56 L 32 56 C 42 56 47 51 47 44.5 C 47 39.5 44 36 39.5 35 C 43 33.5 45.5 30.5 45.5 26 C 45.5 18.5 40 14 30 14 L 9 14 Z M 18 19 L 28 19 C 33 19 36 21 36 25 C 36 29 33 31 28 31 L 18 31 Z M 18 36 L 30 36 C 36 36 39 38.5 39 43 C 39 47.5 36 50 30 50 L 18 50 Z"
      fill="#FFFFFF"/>
    {/* 뱅기 (비행기) — B 의 상단 빈 공간을 가로지르며 좌측 위에서 우측 아래로 */}
    <path
      d="M 26 22.5 C 27 21.5 28 21.5 28.5 22.5 L 31 27 L 38 25 C 38.8 24.8 39.4 25.2 39.5 26 C 39.6 26.6 39.3 27.1 38.8 27.4 L 32.5 30.7 L 33.5 36.5 L 36 37.8 C 36.4 38 36.5 38.4 36.3 38.7 C 36.2 39 35.9 39.1 35.6 39 L 31.5 38 L 28 39.5 C 27.7 39.6 27.3 39.4 27.2 39 C 27.1 38.7 27.3 38.4 27.6 38.2 L 30 37 L 28.7 32 L 24 33.5 C 23.4 33.7 22.9 33.4 22.8 32.8 C 22.7 32.3 23 31.9 23.5 31.7 L 27.5 30.2 L 26.3 26 L 25.5 24.5 C 25.2 24 25.4 23.3 26 23 Z"
      fill="#F5D548"/>
    {/* 별 (sparkle) — 4-점 다이아몬드 5 개. 우측 상단에서 우측 하단으로 흩어짐 */}
    <g fill="#FFFFFF">
      <path d="M 53 15 L 54.5 18 L 57.5 19.5 L 54.5 21 L 53 24 L 51.5 21 L 48.5 19.5 L 51.5 18 Z"/>
      <path d="M 58 26 L 59 28 L 61 29 L 59 30 L 58 32 L 57 30 L 55 29 L 57 28 Z"/>
      <path d="M 50 33 L 50.7 34.5 L 52.2 35 L 50.7 35.5 L 50 37 L 49.3 35.5 L 47.8 35 L 49.3 34.5 Z"/>
      <path d="M 55 40 L 55.5 41 L 56.5 41.5 L 55.5 42 L 55 43 L 54.5 42 L 53.5 41.5 L 54.5 41 Z"/>
      <path d="M 59 36 L 59.4 37 L 60.4 37.5 L 59.4 38 L 59 39 L 58.6 38 L 57.6 37.5 L 58.6 37 Z"/>
    </g>
  </svg>
);

const Brand = ({ onClick }) => {
  const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
  const brand = sc.brand || { name: "뱅기노자", sub: "BANGINOJA" };
  const logo = sc.branding?.logoDataUri;
  return (
    <button
      className="brand"
      onClick={onClick}
      aria-label={`${brand.name} 홈으로`}
      style={{background:'none', border:'none', padding:0, cursor:'pointer'}}>
      <span className="brand-mark" aria-hidden="true">
        {logo
          ? <img src={logo} alt="" style={{width:22, height:22, objectFit:'contain', display:'block'}}/>
          : <BanginojaIcon size={22}/>}
      </span>
      <span className="brand-name">
        {brand.name}
        <span className="sub" lang="en">{brand.sub}</span>
      </span>
    </button>
  );
};

// v00.258 — 사이트 통합 검색. 클라 메모리 캐시(BGNJ_*) 만으로 5도메인 검색 (서버 호출 없음).
// 토글 버튼은 nav-actions 가장 앞에. 클릭 시 SiteSearchOverlay 모달.
const SiteSearchToggle = ({ go }) => {
  const [open, setOpen] = React.useState(false);
  // Cmd/Ctrl + K 단축키.
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="사이트 검색"
        className="btn btn-small nav-action-icon"
        title="사이트 검색 (⌘K)"
        style={{padding: '6px 10px', minWidth: 36}}>
        {/* v00.260 — 알림벨과 동일한 1.6 stroke 라인 아이콘. ⌘K 단축키는 title 로만 안내. */}
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{display: 'block', verticalAlign: 'middle'}}>
          <circle cx="11" cy="11" r="7"/>
          <path d="m20 20-3.5-3.5"/>
        </svg>
      </button>
      {open && <SiteSearchOverlay go={go} onClose={() => setOpen(false)}/>}
    </>
  );
};

const SiteSearchOverlay = ({ go, onClose }) => {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { inputRef.current?.focus?.(); }, []);
  // ESC 닫기.
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    lockBodyScroll();
    return () => { window.removeEventListener('keydown', onKey); unlockBodyScroll(); };
  }, [onClose]);

  // 디바운스 — 200ms.
  const [debouncedQ, setDebouncedQ] = React.useState('');
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q.trim()), 200);
    return () => clearTimeout(id);
  }, [q]);

  // 5도메인 검색 — 클라 메모리 캐시.
  const results = React.useMemo(() => {
    const lower = debouncedQ.toLowerCase();
    if (!lower) return null;
    const tryArr = (fn) => { try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; } };
    const matchPost = (p) => {
      const title = (p.title || '').toLowerCase();
      const body = ((p.body && (p.body.text || p.body.html)) || '').toLowerCase();
      return title.includes(lower) || body.includes(lower);
    };
    const matchColumn = (c) => {
      const title = (c.title || '').toLowerCase();
      const excerpt = (c.excerpt || '').toLowerCase();
      const body = ((c.body && (c.body.text || c.body.html)) || '').toLowerCase();
      return title.includes(lower) || excerpt.includes(lower) || body.includes(lower);
    };
    const matchLecture = (l) => {
      return [(l.topic||l.title||''), l.note, l.venue].some((s) => String(s||'').toLowerCase().includes(lower));
    };
    const matchTour = (t) => {
      return [t.title, t.subtitle, t.desc, t.venue].some((s) => String(s||'').toLowerCase().includes(lower));
    };
    const matchBook = (b) => {
      return [b.title, b.subtitle, b.desc, b.author].some((s) => String(s||'').toLowerCase().includes(lower));
    };
    return {
      posts:    tryArr(() => window.BGNJ_COMMUNITY?.listPosts?.()).filter(matchPost).slice(0, 8),
      columns:  tryArr(() => window.BGNJ_COLUMNS?.listPublic?.()).filter(matchColumn).slice(0, 8),
      lectures: tryArr(() => window.BGNJ_LECTURES?.listAll?.()).filter((l) => l && !l.hidden).filter(matchLecture).slice(0, 8),
      tours:    tryArr(() => window.BGNJ_TOURS?.listAll?.()).filter((t) => t && !t.hidden).filter(matchTour).slice(0, 8),
      books:    tryArr(() => window.BGNJ_BOOKS?.list?.({ status: 'published' })).filter(matchBook).slice(0, 8),
    };
  }, [debouncedQ]);

  const total = results
    ? results.posts.length + results.columns.length + results.lectures.length + results.tours.length + results.books.length
    : 0;

  const goAndClose = (route, pendingKey, pendingId) => {
    if (pendingKey && pendingId != null) {
      try { sessionStorage.setItem(pendingKey, String(pendingId)); } catch {}
    }
    onClose();
    go(route);
  };

  const Section = ({ label, items, route, pendingKey, fields }) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{marginBottom: 18}}>
        <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:8}}>
          {label} <span className="gold" style={{marginLeft:6}}>{items.length}</span>
        </div>
        <ul role="list" style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
          {items.map((it) => (
            <li key={it.id}>
              <button type="button"
                onClick={() => goAndClose(route, pendingKey, it.id)}
                style={{
                  width:'100%', textAlign:'left', padding:'10px 12px',
                  background:'var(--bg-2)', border:'1px solid var(--line)', borderRadius:4,
                  cursor:'pointer', display:'block',
                }}>
                <div style={{fontSize:14, fontWeight:600, color:'var(--ink)', marginBottom:2,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                  {fields.title(it)}
                </div>
                {fields.sub(it) && (
                  <div className="dim-2" style={{fontSize:11, lineHeight:1.5,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {fields.sub(it)}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="사이트 검색"
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', zIndex:1000,
        display:'grid', placeItems:'start center', padding:'80px 16px 16px',
        overflowY:'auto',
      }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width:'min(640px, 100%)', background:'var(--bg)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)',
        borderRadius:6,
      }}>
        <div style={{padding:'18px 20px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', gap:10}}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            style={{display:'block', color:'var(--ink-3)', flexShrink:0}}>
            <circle cx="11" cy="11" r="7"/>
            <path d="m20 20-3.5-3.5"/>
          </svg>
          <input ref={inputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="게시글·칼럼·강연·답사·책 통합 검색"
            aria-label="검색어 입력"
            style={{
              flex:1, border:'none', outline:'none', background:'transparent',
              fontSize:16, color:'var(--ink)', padding:'4px 0',
            }}/>
          <button type="button" onClick={onClose} aria-label="검색 닫기"
            style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--ink-3)', fontSize:14, padding:'4px 8px'}}>
            ESC
          </button>
        </div>
        <div style={{padding:'18px 20px', maxHeight:'70vh', overflowY:'auto'}}>
          {!debouncedQ && (
            <p className="dim" style={{fontSize:13, lineHeight:1.7, margin:0, padding:'24px 0', textAlign:'center'}}>
              검색어를 입력해 주세요.<br/>
              <span className="dim-2" style={{fontSize:11}}>⌘K / Ctrl+K 로 빠른 진입 가능</span>
            </p>
          )}
          {debouncedQ && total === 0 && (
            <p className="dim" style={{fontSize:13, padding:'24px 0', textAlign:'center'}}>
              "<strong className="gold">{debouncedQ}</strong>" 와 일치하는 결과가 없습니다.
            </p>
          )}
          {results && total > 0 && (
            <>
              <Section label="게시글" items={results.posts} route="community" pendingKey="bgnj_pending_post_id"
                fields={{
                  title: (p) => p.title,
                  sub: (p) => p.category || (p.body && p.body.text ? String(p.body.text).slice(0, 60) : ''),
                }}/>
              <Section label="칼럼" items={results.columns} route="column" pendingKey={null}
                fields={{
                  title: (c) => c.title,
                  sub: (c) => c.excerpt || c.category || '',
                }}/>
              <Section label="강연" items={results.lectures} route="lectures" pendingKey="bgnj_pending_lecture_id"
                fields={{
                  title: (l) => l.topic || l.title,
                  sub: (l) => [l.next, l.venue].filter(Boolean).join(' · '),
                }}/>
              <Section label="답사" items={results.tours} route="tour" pendingKey="bgnj_pending_tour_id"
                fields={{
                  title: (t) => t.title,
                  sub: (t) => [t.next, t.venue].filter(Boolean).join(' · '),
                }}/>
              <Section label="책" items={results.books} route="book" pendingKey={null}
                fields={{
                  title: (b) => b.title,
                  sub: (b) => b.subtitle || b.author || '',
                }}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Nav = ({ route, go, user, onLogout }) => {
  const navL = (window.BGNJ_SITE_CONTENT?.get?.() || {}).nav || {};
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // 라우트 변경 시 모바일 메뉴 자동 닫힘
  React.useEffect(() => { setMobileOpen(false); }, [route]);
  // 모바일 메뉴 열림 시: Escape 닫기 + body scroll lock + viewport 확대 시 자동 닫힘
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    lockBodyScroll();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      unlockBodyScroll();
    };
  }, [mobileOpen]);
  // 놀자 메가메뉴 자식 (의식주: 먹고/자고/사고). "놀자" 자체 클릭 시 첫 항목으로 진입.
  const playChildren = [
    { key: "eat",   label: navL.eat   || "먹고 놀자",  desc: "식 食 — 한정식·향토음식·시장" },
    { key: "sleep", label: navL.sleep || "자고 놀자",  desc: "주 住 — 한옥·고택·템플스테이" },
    { key: "shop",  label: navL.shop  || "사고 놀자",  desc: "의 衣 — 전통공예·토산물" },
  ];
  const playKeys = playChildren.map((p) => p.key);

  // v00.147 — '책' 메뉴 추가. 사용자 요청 '상단에 뱅기노자 책을 볼 수 있는 메뉴'.
  const items = [
    { key: "home", label: navL.home || "홈" },
    { key: "play", label: navL.play || "놀자", isMega: 'play', defaultRoute: 'eat' },
    { key: "tour", label: navL.tour || "투어" },
    { key: "lectures", label: navL.lectures || "강연" },
    { key: "column", label: navL.column || "칼럼" },
    { key: "book", label: navL.book || "뱅기노자 도서" },
    { key: "community", label: navL.community || "커뮤니티", isMega: 'community' },
  ];
  // 커뮤니티 메가메뉴: BGNJ_STORES.categories의 boardType=community + 사용자 등급 가시 카테고리
  const userLevel = window.BGNJ_USER_LEVEL ? window.BGNJ_USER_LEVEL(user) : (user ? 10 : 0);
  const communityBoards = (window.BGNJ_STORES?.categories || [])
    .filter((c) => c.boardType === 'community' && userLevel >= (c.minLevel ?? 0));

  const goBoard = (boardId) => {
    try { sessionStorage.setItem('bgnj_pending_board_id', boardId); } catch {}
    go('community');
  };

  // 활성 상태 판정 — 메가 그룹은 자식 라우트도 활성으로 간주
  const isActive = (it) => {
    if (it.isMega === 'play') return playKeys.includes(route);
    return route === it.key;
  };

  return (
    <nav className={`nav ${mobileOpen ? 'mobile-open' : ''}`} aria-label="주 메뉴">
      <div className="container nav-inner">
        <Brand onClick={() => go("home")} />
        <button
          type="button"
          className="nav-toggle"
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
          aria-controls="primary-nav-menu"
          onClick={() => setMobileOpen((v) => !v)}>
          {/* v00.260 — 알림벨/검색과 동일한 1.6 stroke 라인 아이콘으로 통일.
              열림 상태에서는 X 아이콘 노출. 라벨은 v00.259 사용자 인지 보강 유지. */}
          {mobileOpen ? (
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              style={{display:'block'}}>
              <path d="M6 6l12 12M18 6l-12 12"/>
            </svg>
          ) : (
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              style={{display:'block'}}>
              <path d="M4 7h16M4 12h16M4 17h16"/>
            </svg>
          )}
          <span className="nav-toggle-label" aria-hidden="true">{mobileOpen ? '닫기' : '메뉴'}</span>
        </button>
        <ul id="primary-nav-menu" className="nav-menu" role="list" style={{listStyle:'none', margin:0, padding:0}}>
          {items.map(it => {
            const hasMega = it.isMega === 'play' || (it.isMega === 'community' && communityBoards.length > 0);
            const onClick = () => go(it.defaultRoute || it.key);
            return (
              <li key={it.key} style={{position:'relative'}} className={hasMega ? 'nav-has-mega' : ''}>
                <button
                  type="button"
                  className={`nav-link ${isActive(it) ? "active" : ""}`}
                  aria-current={isActive(it) ? "page" : undefined}
                  aria-haspopup={hasMega ? 'menu' : undefined}
                  onClick={onClick}>{it.label}{hasMega ? ' ▾' : ''}</button>

                {it.isMega === 'play' && (
                  <div className="nav-mega" role="menu" aria-label="놀자 — 의식주 카테고리"
                    style={{
                      position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                      minWidth:280, padding:'10px 0',
                      background:'var(--bg)', border:'1px solid var(--line)',
                      boxShadow:'0 16px 40px rgba(15,23,42,0.10)',
                      visibility:'hidden', opacity:0, transition:'opacity .12s ease',
                      zIndex:50,
                    }}>
                    <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', padding:'6px 16px 8px'}}>의식주 衣食住</div>
                    <ul style={{listStyle:'none', margin:0, padding:0}}>
                      {playChildren.map((p) => (
                        <li key={p.key}>
                          <button type="button" role="menuitem"
                            onClick={() => go(p.key)}
                            style={{
                              display:'block', width:'100%', textAlign:'left',
                              padding:'10px 16px',
                              background:'transparent', color:'var(--ink-2)', border:'none', cursor:'pointer',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            <div style={{fontSize:13, fontWeight:500}}>{p.label}</div>
                            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.05em', marginTop:2}}>{p.desc}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 모바일 전용: 놀자 메가 자식들을 인라인 펼침으로 노출 */}
                {it.isMega === 'play' && (
                  <ul className="nav-mobile-submenu" role="list" aria-label="놀자 하위" style={{listStyle:'none', margin:0, padding:0}}>
                    {playChildren.map((p) => (
                      <li key={p.key}>
                        <button type="button"
                          className={`nav-link nav-sub-link ${route === p.key ? 'active' : ''}`}
                          aria-current={route === p.key ? 'page' : undefined}
                          onClick={() => go(p.key)}>{p.label}</button>
                      </li>
                    ))}
                  </ul>
                )}
                {it.isMega === 'community' && communityBoards.length > 0 && (
                  <div className="nav-mega" role="menu" aria-label="게시판 목록"
                    style={{
                      position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                      minWidth:220, padding:'10px 0',
                      background:'var(--bg)', border:'1px solid var(--line)',
                      boxShadow:'0 16px 40px rgba(15,23,42,0.10)',
                      visibility:'hidden', opacity:0, transition:'opacity .12s ease',
                      zIndex:50,
                    }}>
                    <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.22em', padding:'6px 16px 8px'}}>BOARDS</div>
                    <ul style={{listStyle:'none', margin:0, padding:0}}>
                      {communityBoards.map((b) => (
                        <li key={b.id}>
                          <button type="button" role="menuitem"
                            onClick={() => goBoard(b.id)}
                            style={{
                              display:'block', width:'100%', textAlign:'left',
                              padding:'8px 16px', fontSize:13,
                              background:'transparent', color:'var(--ink-2)', border:'none', cursor:'pointer',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            <span>{b.label}</span>
                          </button>
                        </li>
                      ))}
                      <li style={{borderTop:'1px solid var(--line)', marginTop:6, paddingTop:6}}>
                        <button type="button" role="menuitem"
                          onClick={() => go('community')}
                          style={{
                            display:'block', width:'100%', textAlign:'left',
                            padding:'8px 16px', fontSize:12, letterSpacing:'0.18em',
                            background:'transparent', color:'var(--secondary)', border:'none', cursor:'pointer',
                            fontFamily:'var(--font-mono)',
                          }}>전체 보기 →</button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
          {/* 모바일 전용: 사용자 액션을 메뉴 내부에 노출. 데스크탑에선 .nav-mobile-only CSS 로 숨김. */}
          <li className="nav-mobile-only nav-mobile-divider" aria-hidden="true"/>
          {user ? (
            <>
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={() => go("mypage")}>마이페이지</button>
              </li>
              {user.isAdmin && (
                <li className="nav-mobile-only">
                  <button type="button" className="nav-link" onClick={() => go("admin")}>관리</button>
                </li>
              )}
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={onLogout}>로그아웃</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={() => go("login")}>로그인</button>
              </li>
              <li className="nav-mobile-only">
                <button type="button" className="nav-link" onClick={() => go("signup")}>회원가입</button>
              </li>
            </>
          )}
        </ul>
        <div className="nav-actions">
          {/* v00.258 — 사이트 통합 검색. user 무관 노출. */}
          <SiteSearchToggle go={go}/>
          {user ? (
            <>
              <span className="mono" aria-label={`로그인: ${user.name}`}
                style={{fontSize:11, letterSpacing:'0.15em', color:'var(--ink-2)'}}>{user.name}</span>
              <NotificationBell user={user} onPick={(n) => {
                // 알림 타입별 라우팅 — 강연/투어/주문/댓글
                try {
                  if (n.type === 'comment' && n.postId) {
                    sessionStorage.setItem('bgnj_pending_post_id', String(n.postId));
                    go('community'); return;
                  }
                  if (n.type === 'lecture_confirmed' || n.type === 'lecture_promoted') {
                    if (n.lectureId) sessionStorage.setItem('bgnj_pending_lecture_id', String(n.lectureId));
                    go('lectures'); return;
                  }
                  if (n.type === 'tour_confirmed' || n.type === 'tour_promoted') {
                    if (n.tourId) sessionStorage.setItem('bgnj_pending_tour_id', String(n.tourId));
                    go('tour'); return;
                  }
                  if (String(n.type || '').startsWith('order_')) {
                    go('mypage'); return;
                  }
                  // 폴백 — postId가 있으면 커뮤니티
                  if (n.postId) {
                    sessionStorage.setItem('bgnj_pending_post_id', String(n.postId));
                    go('community');
                  }
                } catch {}
              }}/>
              <button className="btn btn-small" onClick={() => go("mypage")}>마이페이지</button>
              {user.isAdmin && (
                <button className="btn btn-small" onClick={() => go("admin")}>관리</button>
              )}
              <button className="btn btn-small" onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button type="button" className="btn-ghost nav-link" onClick={() => go("login")}
                style={{fontSize:12, letterSpacing:'0.1em', color:'var(--ink-2)'}}>로그인</button>
              <button className="btn btn-small" onClick={() => go("signup")}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ go }) => {
  const sc = (window.BGNJ_SITE_CONTENT?.get?.() || {});
  const contact = sc.contact || {};
  const footer = sc.footer || {};
  const fStyle = (window.BGNJ_FOOTER_STYLE?.() || window.BGNJ_FOOTER_STYLE_DEFAULT);
  // v00.144 — 전화번호 제거 + 사업자 정보 (회사명 / 대표자 / 사업자등록번호 / 법인등록번호 / 개업일) 노출.
  const email = contact.email || "contact@bgnj.net";
  const address = contact.address || "서울특별시 서초구 서초대로73길 40, 7층 13호 (서초동, 강남오피스텔)";
  const companyName = contact.companyName || "주식회사 뱅기노자";
  const ceo = contact.ceo || "";
  const bizRegNo = contact.bizRegNo || "";
  const corpRegNo = contact.corpRegNo || "";
  const founded = contact.founded || "";
  const headingStyle = {
    fontSize: fStyle.heading.fontSize,
    fontWeight: fStyle.heading.fontWeight,
    letterSpacing: `${fStyle.heading.letterSpacing}em`,
    color: `var(${fStyle.heading.color})`,
  };
  return (
    <footer className="footer" aria-label="사이트 정보 및 푸터">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand onClick={() => go("home")}/>
            <p className="dim bgnj-multiline" style={{
              marginTop:20,
              fontSize: fStyle.description.fontSize,
              fontWeight: fStyle.description.fontWeight,
              lineHeight: fStyle.description.lineHeight,
              color: `var(${fStyle.description.color})`,
              maxWidth: fStyle.description.maxWidth,
            }}>
              {footer.description || "뱅기타고 노자. 뱅기노자는 한국의 역사·문화·자연을 직접 걷고 느끼며 나누는 여행 커뮤니티입니다. 궁궐 답사부터 지역 여행까지, 함께 만들어가는 여행."}
            </p>
          </div>
          <nav aria-label="콘텐츠 바로가기">
            <h4 id="ft-content" style={headingStyle}>{footer.headingContent || "콘텐츠"}</h4>
            <ul aria-labelledby="ft-content">
              <li><button type="button" onClick={() => go("column")}>뱅기노자 칼럼</button></li>
              <li><button type="button" onClick={() => go("tour")}>투어 프로그램</button></li>
              {/* v00.147 — 사용자 요청 '하단에 왕의길은 삭제'. 책은 상단 nav 의 '책' 메뉴에서 진입. */}
              <li><button type="button" onClick={() => go("community")}>커뮤니티</button></li>
            </ul>
          </nav>
          <nav aria-label="정보 바로가기">
            <h4 id="ft-info" style={headingStyle}>{footer.headingInfo || "정보"}</h4>
            <ul aria-labelledby="ft-info">
              <li><button type="button" onClick={() => go("home")}>강연 일정</button></li>
              <li><button type="button" onClick={() => go("community")}>공지사항</button></li>
              <li><button type="button" onClick={() => go("faq")}>자주 묻는 질문</button></li>
              <li><button type="button" onClick={() => go("terms")}>이용약관</button></li>
              <li><button type="button" onClick={() => go("privacy")}>개인정보 처리방침</button></li>
            </ul>
          </nav>
          <address style={{fontStyle:'normal'}}>
            <h4 id="ft-contact" style={headingStyle}>{footer.headingContact || "연락"}</h4>
            <ul aria-labelledby="ft-contact">
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {address && <li><span>{address}</span></li>}
            </ul>
          </address>
        </div>
        {/* v00.144 — 사업자 정보 블록 (이용약관 + 사업자등록증 부합). 한국 웹사이트 표준 푸터 패턴. */}
        {(companyName || bizRegNo || ceo) && (
          <div className="footer-biz" style={{
            marginTop:24, paddingTop:16, borderTop:'1px solid var(--line-2)',
            fontSize:11, lineHeight:1.85, color:'var(--ink-3)',
            fontFamily:'var(--font-mono)', letterSpacing:'0.04em',
            display:'flex', gap:'2px 18px', flexWrap:'wrap',
          }}>
            {companyName && <span><strong style={{color:'var(--ink-2)'}}>{companyName}</strong></span>}
            {ceo && <span>대표자 {ceo}</span>}
            {bizRegNo && <span>사업자등록번호 {bizRegNo}</span>}
            {corpRegNo && <span>법인등록번호 {corpRegNo}</span>}
            {founded && <span>설립 {founded}</span>}
          </div>
        )}
        <div className="footer-bottom" style={{marginTop:24}}>
          <span>{footer.copyright || "© 2026 뱅기노자 BANGINOJA — ALL RIGHTS RESERVED"}</span>
          <span className="mono dim-2" style={{fontSize:10, letterSpacing:'0.14em'}}>
            v{window.BGNJ_VERSION?.version || '0.0.0'} · {window.BGNJ_VERSION?.build || '—'}
          </span>
          <ThemeToggle/>
          <span style={{
            fontSize: fStyle.signature.fontSize,
            fontWeight: fStyle.signature.fontWeight,
            letterSpacing: `${fStyle.signature.letterSpacing}em`,
            color: `var(${fStyle.signature.color})`,
            textTransform: fStyle.signature.textTransform || 'uppercase',
          }}>{footer.signature || "뱅기타고 노자 · DESIGNED IN SEOUL"}</span>
        </div>
      </div>
    </footer>
  );
};

// 테마 토글 — light → dark → auto → light 순환. BGNJ_THEME 헬퍼와 짝.
const ThemeToggle = () => {
  const [mode, setMode] = React.useState(() => (window.BGNJ_THEME?.get?.() || 'auto'));
  React.useEffect(() => {
    const onChange = () => setMode(window.BGNJ_THEME?.get?.() || 'auto');
    window.addEventListener('bgnj-theme-change', onChange);
    return () => window.removeEventListener('bgnj-theme-change', onChange);
  }, []);
  if (!window.BGNJ_THEME) return null;
  const next = window.BGNJ_THEME.cycle.bind(window.BGNJ_THEME);
  const icon = mode === 'dark' ? '🌙' : mode === 'light' ? '☀' : '◐';
  const label = mode === 'dark' ? 'DARK' : mode === 'light' ? 'LIGHT' : 'AUTO';
  return (
    <button type="button" className="theme-toggle" onClick={() => next()} aria-label={`테마 전환 — 현재 ${label}`} title="테마: 라이트 / 다크 / 자동">
      <span aria-hidden="true">{icon}</span><span>{label}</span>
    </button>
  );
};

const Ornament = ({ children }) => (
  <div className="ornament" style={{margin:"40px 0"}}>
    <span style={{fontFamily:'var(--font-serif)', fontSize:14, letterSpacing:'0.3em', color:'var(--primary)'}}>
      {children || "五"}
    </span>
  </div>
);

// title accepts string OR React node. For accent, pass JSX: <>뱅기노자에 <span className="accent">전하는 말</span></>
const SectionHead = ({ eyebrow, title, subtitle, action, level = 2 }) => {
  const H = `h${level}`;
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="section-eyebrow" aria-hidden="true">{eyebrow}</div>}
        <H className="section-title">{title}</H>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
};

const Tweaks = ({ tweaks, setTweaks, visible }) => {
  if (!visible) return null;
  const set = (k, v) => setTweaks({ ...tweaks, [k]: v });
  return (
    <div className="tweaks">
      <h3>Tweaks</h3>
      <div className="tweaks-row">
        <div className="tweaks-label">심볼 스타일</div>
        <div className="tweaks-options">
          {["outline", "filled", "dashed"].map(s => (
            <button key={s} className={tweaks.lineStyle === s ? "on" : ""}
              onClick={() => set("lineStyle", s)}>
              {s === "outline" ? "선" : s === "filled" ? "채움" : "파선"}
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">골드 강도 · {tweaks.intensity.toFixed(1)}</div>
        <input type="range" className="tweaks-slider"
          min="0.3" max="1.8" step="0.1"
          value={tweaks.intensity}
          onChange={e => set("intensity", parseFloat(e.target.value))}/>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">히어로 레이아웃</div>
        <div className="tweaks-options">
          {["center", "split", "fullbleed"].map(s => (
            <button key={s} className={tweaks.heroLayout === s ? "on" : ""}
              onClick={() => set("heroLayout", s)}>
              {s === "center" ? "중앙" : s === "split" ? "분할" : "풀블리드"}
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">인터랙션</div>
        <div className="tweaks-options">
          <button className={tweaks.interactive ? "on" : ""}
            onClick={() => set("interactive", !tweaks.interactive)}>
            {tweaks.interactive ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 쿠키 승인 배너 — 첫 방문 시 표시. 사용자가 결정하면 localStorage에 영속화.
// PIPA / GDPR 가이드라인: 필수(기능)는 사용자 거부 불가, 분석·마케팅은 옵트인.
// 저장 형태: { necessary:true, analytics:bool, marketing:bool, ts:ISO }
const CookieConsent = () => {
  const KEY = 'bgnj_cookie_consent';
  const [decision, setDecision] = React.useState(() => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [details, setDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  const persist = (next) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setDecision(next);
    try { window.dispatchEvent(new CustomEvent('bgnj-cookie-consent', { detail: next })); } catch {}
  };

  const acceptAll = () => persist({ necessary: true, analytics: true, marketing: true, ts: new Date().toISOString() });
  const rejectAll = () => persist({ necessary: true, analytics: false, marketing: false, ts: new Date().toISOString() });
  const saveCustom = () => persist({ necessary: true, analytics: !!analytics, marketing: !!marketing, ts: new Date().toISOString() });

  if (decision) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title"
      style={{
        position: 'fixed', left: 16, right: 16, bottom: 16,
        maxWidth: 720, margin: '0 auto', zIndex: 80,
        background: 'var(--bg-2)', border: '1px solid var(--primary-dim)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
        padding: '20px 22px', borderRadius: 4,
      }}>
      <h2 id="cookie-banner-title" className="ko-serif" style={{ fontSize: 16, marginBottom: 8 }}>쿠키 사용 동의</h2>
      <p className="dim" style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        뱅기노자는 서비스 운영을 위한 <strong className="gold">필수 쿠키</strong>와, 사이트 개선을 위한
        <strong className="gold"> 분석 쿠키</strong>·<strong className="gold">마케팅 쿠키</strong>를 사용합니다.
        세부 설정에서 항목별로 선택하실 수 있어요.
      </p>
      {details && (
        <div style={{ marginBottom: 14, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="sr-only">쿠키 항목별 동의</legend>
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', opacity: 0.7 }}>
                <input type="checkbox" checked readOnly aria-label="필수 쿠키 (항상 활성)"/>
                <span>
                  <strong style={{ fontSize: 13 }}>필수</strong>
                  <span className="dim" style={{ fontSize: 12, display: 'block' }}>로그인 세션, 보안, 필수 기능 동작에 사용. 거부 불가.</span>
                </span>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label="분석 쿠키 동의"/>
                <span>
                  <strong style={{ fontSize: 13 }}>분석</strong>
                  <span className="dim" style={{ fontSize: 12, display: 'block' }}>방문 통계·페이지 성능 개선용. 식별자 익명 처리.</span>
                </span>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)}
                  aria-label="마케팅 쿠키 동의"/>
                <span>
                  <strong style={{ fontSize: 13 }}>마케팅</strong>
                  <span className="dim" style={{ fontSize: 12, display: 'block' }}>관심사 기반 안내, 외부 광고 매체 연동에 사용.</span>
                </span>
              </label>
            </div>
          </fieldset>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-small" onClick={() => setDetails((v) => !v)}
          aria-expanded={details}>
          {details ? '간단히' : '세부 설정'}
        </button>
        <button type="button" className="btn btn-small" onClick={rejectAll}>모두 거부</button>
        {details
          ? <button type="button" className="btn btn-small btn-gold" onClick={saveCustom}>선택 저장</button>
          : <button type="button" className="btn btn-small btn-gold" onClick={acceptAll}>모두 동의</button>}
      </div>
    </div>
  );
};

// v00.105 — 커버 이미지 placeholder. BANGINOJA 로고를 50% 투명도로 중앙 표시.
// 사용처: 투어/강연 상세 페이지 cover 미설정 시 + 책 카탈로그 cover 미설정 시.
const CoverPlaceholder = ({ aspectRatio = '16/10', label, iconSize = 88 }) => (
  <div className="placeholder" style={{
    aspectRatio, position: 'relative',
    display: 'grid', placeItems: 'center',
    background: 'var(--bg-2)',
    border: '1px solid var(--line-2)',
  }}>
    <div style={{ opacity: 0.5, display: 'grid', placeItems: 'center', gap: 10 }}>
      <BanginojaIcon size={iconSize}/>
      {label && (
        <span className="mono dim-2" style={{ fontSize: 10, letterSpacing: '0.22em' }}>
          {label}
        </span>
      )}
    </div>
  </div>
);

// v00.196 — 사용자 보고 '홈페이지 반응성 확장'. App 의 모든 자식이 매 state 변경마다 re-render 되던 문제.
// React.memo 로 감싸 props 동일하면 re-render skip. 안전 — 내부 useEffect/state 영향 없음.
// ScrollToTop 은 이미 declaration 시점에 memo 처리됨.
const _MemoNav = React.memo(Nav);
const _MemoFooter = React.memo(Footer);
const _MemoCookieConsent = React.memo(CookieConsent);

Object.assign(window, {
  Brand,
  Nav: _MemoNav,
  Footer: _MemoFooter,
  Ornament, SectionHead, Tweaks, AuthorGradeBadge, NotificationBell,
  ScrollToTop,
  BanginojaIcon, CoverPlaceholder,
  CookieConsent: _MemoCookieConsent,
});
