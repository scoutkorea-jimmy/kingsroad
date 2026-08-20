// 우하단 도움 위젯 — 챗봇(룰 기반) + Top 버튼 스택.
//
// v00.290 — 사용자 요청: "우측 하단에 챗봇과 Top 기능. 챗봇은 AI를 쓰지 않고 질문에 답하도록."
//
// 설계 원칙
//  1. AI 를 쓰지 않는다. 이미 메모리에 올라와 있는 BGNJ_* 헬퍼를 읽어 정해진 답을 만든다.
//     서버 호출·API 비용·응답 지연이 전부 0 이고, 오프라인에서도 동작한다.
//  2. 빈손으로 돌려보내지 않는다. 2026-07-29 기준 강연 3건·투어 5건이 전부 지난 일정이라
//     "예정 없음" 만 답하면 위젯이 무용지물이 된다. 예정이 없으면 지난 기록으로 안내한다.
//  3. 모든 답에는 갈 곳이 있다. 답변 끝에 반드시 이동 버튼이 붙는다.
//
// 우하단은 이미 붐빈다 — 오류 토스트(z2000) / 쿠키 배너(z80) / 버전 토스트(좌하단 z70).
// 그래서 챗봇 FAB 와 Top FAB 를 하나의 세로 스택(.help-dock)으로 묶어 서로 겹치지 않게 한다.

// 날짜 해석 — HomePage 의 _eventTs 와 같은 규칙.
// starts_at 이 없으면 next 텍스트("2026.05.19 10:00")를 파싱한다.
const _ts = (x) => {
  if (!x) return NaN;
  if (x.startsAt) { const t = Date.parse(x.startsAt); if (!isNaN(t)) return t; }
  if (x.next) { const t = Date.parse(String(x.next).trim().replace(/\./g, '-')); if (!isNaN(t)) return t; }
  return NaN;
};

const _arr = (fn) => {
  try { const v = fn(); return Array.isArray(v) ? v : []; } catch { return []; }
};

const _fmt = (x) => {
  const t = _ts(x);
  if (isNaN(t)) return x?.next || '';
  try { return window.BGNJ_FMT?.kstFriendly?.(new Date(t).toISOString()) || x?.next || ''; }
  catch { return x?.next || ''; }
};

// 하루 전까지는 '예정' 으로 본다 (홈 히어로와 같은 기준).
const _CUTOFF = () => Date.now() - 86400000;

// 이벤트형(강연/투어) 공통 응답 생성기.
// 예정 있으면 가장 가까운 1건, 없으면 가장 최근 지난 1건 + 전체 개수 안내.
const _eventAnswer = ({ items, label, route, pendingKey }) => {
  const dated = items.filter((x) => x && !x.hidden && !isNaN(_ts(x)));
  const upcoming = dated.filter((x) => _ts(x) >= _CUTOFF()).sort((a, b) => _ts(a) - _ts(b));
  const past = dated.filter((x) => _ts(x) < _CUTOFF()).sort((a, b) => _ts(b) - _ts(a));

  if (upcoming.length > 0) {
    const n = upcoming[0];
    return {
      lines: [
        `가장 빠른 ${label}은 이것입니다.`,
        `**${n.topic || n.title}**`,
        `${_fmt(n)}${n.venue ? ` · ${n.venue}` : ''}`,
        upcoming.length > 1 ? `이후로 ${upcoming.length - 1}건이 더 예정돼 있어요.` : '',
      ].filter(Boolean),
      action: { text: `${label} 자세히 보기`, route, pendingKey, pendingId: n.id },
    };
  }
  if (past.length > 0) {
    const p = past[0];
    return {
      lines: [
        `지금 예정된 ${label}은 없습니다.`,
        `가장 최근에는 이런 ${label}이 있었어요.`,
        `**${p.topic || p.title}**`,
        `${_fmt(p)}`,
        `지난 기록 ${past.length}건을 보실 수 있습니다.`,
      ],
      action: { text: `지난 ${label} 보기`, route, pendingKey: null, pendingId: null },
    };
  }
  return {
    lines: [`아직 등록된 ${label}이 없습니다.`, '새 일정이 열리면 이곳에서 가장 먼저 알려드릴게요.'],
    action: { text: '커뮤니티 둘러보기', route: 'community', pendingKey: null, pendingId: null },
  };
};

const HELP_TOPICS = [
  {
    id: 'lecture',
    q: '가장 빠른 강연 일정',
    answer: () => _eventAnswer({
      items: _arr(() => window.BGNJ_LECTURES?.listAll?.()),
      label: '강연', route: 'lectures', pendingKey: 'bgnj_pending_lecture_id',
    }),
  },
  {
    id: 'tour',
    q: '가장 빠른 답사·투어 일정',
    answer: () => _eventAnswer({
      items: _arr(() => window.BGNJ_TOURS?.listAll?.()),
      label: '답사', route: 'tour', pendingKey: 'bgnj_pending_tour_id',
    }),
  },
  {
    id: 'column',
    q: '가장 최근 칼럼',
    answer: () => {
      const cols = _arr(() => window.BGNJ_COLUMNS?.listPublic?.());
      if (cols.length === 0) {
        return {
          lines: ['아직 공개된 칼럼이 없습니다.'],
          action: { text: '커뮤니티 둘러보기', route: 'community', pendingKey: null, pendingId: null },
        };
      }
      const c = cols[0];
      const who = c.author || c.authorName || '';
      return {
        lines: [
          '가장 최근에 올라온 칼럼입니다.',
          `**${c.title}**`,
          [who, c.date || c.createdAt ? String(c.date || c.createdAt).slice(0, 10) : ''].filter(Boolean).join(' · '),
          `지금까지 ${cols.length}편이 쌓여 있어요.`,
        ].filter(Boolean),
        action: { text: '칼럼 보러 가기', route: 'column', pendingKey: null, pendingId: null },
      };
    },
  },
];

// **볼드** 만 지원하는 최소 렌더러 — 답변 문자열을 그대로 dangerouslySetInnerHTML 하지 않기 위함.
const _Line = ({ text }) => {
  const parts = String(text).split(/\*\*(.+?)\*\*/g);
  return (
    <span>
      {parts.map((p, i) => (i % 2 === 1
        ? <strong key={i} style={{ color: 'var(--ink)' }}>{p}</strong>
        : <span key={i}>{p}</span>))}
    </span>
  );
};

const HelpWidget = ({ go }) => {
  const [open, setOpen] = React.useState(false);
  const [thread, setThread] = React.useState([]);   // { role:'user'|'bot', topicId?, lines?, action? }
  const bodyRef = React.useRef(null);
  const panelRef = React.useRef(null);

  // 답변이 추가되면 스크롤을 아래로.
  React.useEffect(() => {
    if (!open) return;
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread, open]);

  // ESC 로 닫기.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // 패널이 열리면 Top 버튼을 숨긴다 — 패널이 그 자리를 쓰기 때문.
  // body 클래스로 처리해 Shell 의 ScrollToTop 을 건드리지 않는다(결합도 최소).
  React.useEffect(() => {
    try {
      document.body.classList.toggle('help-open', open);
      return () => document.body.classList.remove('help-open');
    } catch { return undefined; }
  }, [open]);

  const ask = (topic) => {
    let res;
    try { res = topic.answer(); }
    catch (err) {
      console.warn('[HelpWidget] answer failed', err);
      res = {
        lines: ['답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'],
        action: null,
      };
    }
    setThread((prev) => [...prev, { role: 'user', text: topic.q }, { role: 'bot', ...res }]);
  };

  const goTo = (action) => {
    if (!action) return;
    if (action.pendingKey && action.pendingId != null) {
      try { sessionStorage.setItem(action.pendingKey, String(action.pendingId)); } catch (_e) { console.warn('[bgnj] 화면 이동 힌트 — 실패해도 목록으로 갈 뿐 (HelpWidget.jsx:177)', _e); }
    }
    setOpen(false);
    go(action.route);
  };

  return (
    <>
      {open && (
        <div className="help-panel" role="dialog" aria-label="도움말" ref={panelRef}>
          <div className="help-panel-head">
            <div>
              <div className="help-panel-title">무엇을 도와드릴까요?</div>
              <div className="help-panel-sub">아래에서 골라주세요</div>
            </div>
            <button type="button" className="help-close" onClick={() => setOpen(false)} aria-label="도움말 닫기">×</button>
          </div>

          <div className="help-panel-body" ref={bodyRef}>
            {thread.length === 0 && (
              <p className="help-hint">
                자주 찾으시는 세 가지를 준비했습니다.
              </p>
            )}
            {thread.map((m, i) => (
              m.role === 'user'
                ? <div key={i} className="help-msg help-msg-user">{m.text}</div>
                : (
                  <div key={i} className="help-msg help-msg-bot">
                    {m.lines.map((l, j) => <p key={j}><_Line text={l}/></p>)}
                    {m.action && (
                      <button type="button" className="btn btn-small btn-gold help-action"
                        onClick={() => goTo(m.action)}>
                        {m.action.text} →
                      </button>
                    )}
                  </div>
                )
            ))}
          </div>

          <div className="help-panel-foot">
            {HELP_TOPICS.map((t) => (
              <button key={t.id} type="button" className="help-chip" onClick={() => ask(t)}>
                {t.q}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className={`help-fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? '도움말 닫기' : '도움말 열기'}
        title="무엇을 도와드릴까요?">
        {open ? '×' : '💬'}
      </button>
    </>
  );
};

export { HelpWidget };
