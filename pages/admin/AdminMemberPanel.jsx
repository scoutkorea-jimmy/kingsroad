// 뱅기노자 — 회원 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// MemberAdminPanel + 종속 컴포넌트(SuspendDialog 정지 모달 · ProfileFields 프로필 카드).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_AUTH/API/CONFIRM/TOAST/FMT 등).
// entry-admin 에서 AuthAdminPage 앞에 로드. MemberAdminPanel 만 window 노출.

// 정지 사유 입력 모달 — prompt() 대신 GUI.
const SuspendDialog = ({ target, reason, onChange, onConfirm, onCancel }) => {
  // v00.077 — useModalGuard 통일 (ESC + body scroll lock + history pushState).
  // 사유 텍스트는 임시저장 prompt 가치 적음 → dirty=false.
  window.useModalGuard?.({ open: true, dirty: false, onClose: onCancel, onSaveDraft: null, label: '회원 정지' });
  return (
    <div role="dialog" aria-modal="true" aria-label="회원 정지"
      onClick={onCancel}
      style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'grid', placeItems:'center', padding:24}}>
      <div onClick={(e) => e.stopPropagation()}
        style={{background:'var(--bg)', maxWidth:480, width:'100%', padding:24, border:'1px solid var(--line)', boxShadow:'0 16px 40px rgba(0,0,0,0.25)'}}>
        <h3 className="ko-serif" style={{fontSize:20, marginBottom:8}}>회원 정지</h3>
        <p className="dim" style={{fontSize:13, marginBottom:16, lineHeight:1.7}}>
          <strong className="gold">{target?.name || target?.email}</strong> 님을 정지하시겠습니까?
          정지된 회원은 즉시 로그아웃되고 다시 로그인할 수 없습니다.
        </p>
        <label className="field" style={{margin:0}}>
          <span className="field-label">정지 사유 (선택)</span>
          <textarea className="field-input" autoFocus rows={3}
            placeholder="예: 약관 위반, 스팸 등"
            value={reason}
            onChange={(e) => onChange(e.target.value)}/>
        </label>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:18}}>
          <button type="button" className="btn" onClick={onCancel}>취소</button>
          <button type="button" className="btn" onClick={onConfirm}
            style={{borderColor:'var(--danger)', color:'var(--danger)'}}>정지 적용</button>
        </div>
      </div>
    </div>
  );
};


// 프로필 필드 한글 라벨 + 빈 값은 dash 로 노출 — JSON 덤프 대신 가독성 있는 카드.
const PROFILE_LABELS = {
  birthdate: '생년월일',
  phone: '전화번호',
  zip: '우편번호',
  addr1: '주소',
  addr2: '상세 주소',
  gender: '성별',
  interest: '관심 분야',
  recommender: '추천인',
};
const PROFILE_GENDER = { f: '여성', m: '남성', x: '기타/응답 안 함' };
const ProfileFields = ({ profile }) => {
  const entries = Object.entries(profile || {});
  if (!entries.length) return <span className="dim-2">—</span>;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'140px 1fr', gap:'8px 16px',
      padding:'12px 14px', background:'var(--bg-2)', border:'1px solid var(--line)', fontSize:13,
    }}>
      {entries.map(([k, v]) => {
        const label = PROFILE_LABELS[k] || k;
        let value = v;
        if (k === 'gender' && v) value = PROFILE_GENDER[v] || v;
        const isEmpty = value === '' || value == null;
        return (
          <React.Fragment key={k}>
            <div className="dim-2 mono" style={{fontSize:11, paddingTop:2}}>{label}</div>
            <div style={{color: isEmpty ? 'var(--ink-3)' : 'var(--ink)', fontStyle: isEmpty ? 'italic' : 'normal'}}>
              {isEmpty ? '—' : String(value)}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// === Member Admin Panel ===========================================
const MemberAdminPanel = ({ go }) => {
  const [tick, setTick] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [gradeFilter, setGradeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all'); // all | active | suspended | admin
  const [sortKey, setSortKey] = React.useState('joined_desc'); // joined_desc/asc, name_asc/desc, posts_desc, comments_desc, email_asc
  const refresh = () => setTick((v) => v + 1);

  // Mount 시 + 변경 후 서버에서 회원 목록 갱신.
  React.useEffect(() => {
    window.BGNJ_AUTH.refreshUsers?.().then(() => refresh());
    const onRefresh = () => refresh();
    window.addEventListener('bgnj-users-refresh', onRefresh);
    return () => window.removeEventListener('bgnj-users-refresh', onRefresh);
  }, []);

  const users = React.useMemo(() => window.BGNJ_AUTH.listUsers(), [tick]);
  const grades = (window.BGNJ_STORES?.grades || []);

  // 필터 + 정렬 통합.
  const filtered = React.useMemo(() => {
    let list = users.slice();
    // 상태 필터
    if (statusFilter === 'active') list = list.filter((u) => !u.suspended);
    else if (statusFilter === 'suspended') list = list.filter((u) => u.suspended);
    else if (statusFilter === 'admin') list = list.filter((u) => u.isAdmin);
    // 등급 필터
    if (gradeFilter !== 'all') {
      list = list.filter((u) => u.gradeId === gradeFilter);
    }
    // 검색
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((u) =>
        String(u.name || '').toLowerCase().includes(q)
        || String(u.email || '').toLowerCase().includes(q)
        || String(u.id || '').toLowerCase().includes(q)
      );
    }
    // 정렬
    const cmpStr = (a, b) => String(a || '').localeCompare(String(b || ''), 'ko');
    const cmpDate = (a, b) => new Date(b || 0).getTime() - new Date(a || 0).getTime();
    const activityCount = (u, key) => {
      const a = window.BGNJ_AUTH.getActivity?.(u.id);
      return a?.[key] || 0;
    };
    list.sort((a, b) => {
      switch (sortKey) {
        case 'joined_asc':    return -cmpDate(a.joinedAt, b.joinedAt);
        case 'name_asc':      return cmpStr(a.name, b.name);
        case 'name_desc':     return -cmpStr(a.name, b.name);
        case 'email_asc':     return cmpStr(a.email, b.email);
        case 'posts_desc':    return activityCount(b, 'postCount') - activityCount(a, 'postCount');
        case 'comments_desc': return activityCount(b, 'commentCount') - activityCount(a, 'commentCount');
        case 'grade_desc':    return ((grades.find((g) => g.id === b.gradeId)?.level ?? 0) - (grades.find((g) => g.id === a.gradeId)?.level ?? 0));
        case 'joined_desc':
        default:              return cmpDate(a.joinedAt, b.joinedAt);
      }
    });
    return list;
  }, [users, gradeFilter, statusFilter, search, sortKey, grades, tick]);

  const selected = users.find((u) => u.id === selectedId) || null;
  const [serverActivity, setServerActivity] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    setServerActivity(null);
    if (!selected?.id) return () => {};
    Promise.resolve(window.BGNJ_AUTH.fetchActivity?.(selected.id)).then((a) => {
      if (!cancelled) setServerActivity(a);
    });
    return () => { cancelled = true; };
  }, [selected?.id]);
  const activity = selected ? (serverActivity || window.BGNJ_AUTH.getActivity(selected.id)) : null;

  const exportCsv = () => {
    const header = ['id','name','email','gradeId','isAdmin','suspended','joinedAt','postCount','commentCount','bookOrders','lectures','tours'];
    const rows = users.map((u) => {
      const a = window.BGNJ_AUTH.getActivity(u.id) || {};
      return [u.id, u.name, u.email, u.gradeId, u.isAdmin ? 'Y' : 'N', u.suspended ? 'Y' : 'N', u.joinedAt || '', a.postCount || 0, a.commentCount || 0, (a.bookOrders||[]).length, (a.lectures||[]).length, (a.tours||[]).length];
    });
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadCsv(`members-${new Date().toISOString().slice(0,10)}.csv`, csv);
  };

  const changeGrade = async (user, gradeId) => {
    try { await window.BGNJ_AUTH.setGrade(user.id, gradeId); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`등급 변경 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const toggleAdmin = async (user) => {
    if (!(await window.BGNJ_CONFIRM(`${user.name} 님의 관리자 권한을 ${user.isAdmin ? '해제' : '부여'}하시겠어요?`, { danger: true }))) return;
    try { await window.BGNJ_AUTH.toggleAdmin(user.id); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`관리자 권한 변경 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const [suspendTarget, setSuspendTarget] = React.useState(null);
  const [suspendReason, setSuspendReason] = React.useState('');
  const openSuspendDialog = (user) => { setSuspendTarget(user); setSuspendReason(''); };
  const submitSuspend = async () => {
    if (!suspendTarget) return;
    const target = suspendTarget;
    const reason = suspendReason.trim();
    setSuspendTarget(null); setSuspendReason('');
    try { await window.BGNJ_AUTH.suspendUser(target.id, reason); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`정지 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const suspendUser = (user) => openSuspendDialog(user);
  const unsuspend = async (user) => {
    if (!(await window.BGNJ_CONFIRM(`${user.name} 님의 정지를 해제하시겠어요?`, { danger: true }))) return;
    try { await window.BGNJ_AUTH.unsuspendUser(user.id); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`정지 해제 실패: ${err?.message || '알 수 없는 오류'}`); }
  };
  const deleteUser = async (user) => {
    if (user.email === 'admin@admin.admin') { window.BGNJ_TOAST.error('기본 관리자 계정은 삭제할 수 없습니다.'); return; }
    if (!(await window.BGNJ_CONFIRM(`${user.name} (${user.email}) 계정을 정말 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.`, { danger: true }))) return;
    try { await window.BGNJ_AUTH.removeUser(user.id); setSelectedId(null); refresh(); }
    catch (err) { window.BGNJ_TOAST.error(`삭제 실패: ${err?.message || '알 수 없는 오류'}`); }
  };

  const gradeOf = (id) => grades.find((g) => g.id === id);
  const formatDate = (iso) => {
    if (!iso) return '-';
    try { return window.BGNJ_FMT.kstDateTime(iso); } catch { return iso; }
  };

  // ── 상세 ──
  if (selected && activity) {
    return (
      <div>
        <button type="button" className="btn btn-small" onClick={() => setSelectedId(null)} style={{marginBottom:20}}>← 회원 목록</button>

        <article className="card" style={{padding:24, marginBottom:18}}>
          <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'baseline', flexWrap:'wrap', marginBottom:12}}>
            <div>
              <h2 className="ko-serif" style={{fontSize:24, marginBottom:4}}>
                {selected.name}
                <AuthorGradeBadge authorId={selected.id} author={selected.name} authorEmail={selected.email}/>
              </h2>
              <div className="mono dim-2" style={{fontSize:11}}>#{selected.id} · {selected.email}</div>
            </div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {selected.isAdmin && <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--secondary)', border:'1px solid var(--primary-dim)', padding:'2px 8px'}}>ADMIN</span>}
              {selected.suspended && <span className="mono" style={{fontSize:10, letterSpacing:'0.18em', color:'var(--danger)', border:'1px solid var(--danger)', padding:'2px 8px'}}>SUSPENDED</span>}
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'180px 1fr', gap:'8px 24px', fontSize:13, lineHeight:1.8}}>
            <dt className="dim-2 mono" style={{fontSize:11}}>가입일</dt><dd>{formatDate(selected.joinedAt)}</dd>
            <dt className="dim-2 mono" style={{fontSize:11}}>회원 등급</dt>
            <dd>
              <select className="field-input" style={{maxWidth:240, padding:'4px 8px'}} value={selected.gradeId || ''}
                onChange={(e) => changeGrade(selected, e.target.value)}>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>{g.label} (Lv {g.level})</option>
                ))}
              </select>
              {selected.gradeChangedAt && <span className="dim-2 mono" style={{fontSize:10, marginLeft:8}}>최근 변경 {formatDate(selected.gradeChangedAt)}</span>}
            </dd>
            <dt className="dim-2 mono" style={{fontSize:11}}>관리자 권한</dt>
            <dd>
              <button type="button" className="btn btn-small" onClick={() => toggleAdmin(selected)}>
                {selected.isAdmin ? '관리자 권한 해제' : '관리자 권한 부여'}
              </button>
            </dd>
            <dt className="dim-2 mono" style={{fontSize:11}}>활성 동의</dt>
            <dd>{(() => {
              const labels = { terms: '이용약관·개인정보 처리방침', marketing: '마케팅 메일', thirdParty: '제3자 제공' };
              const active = selected.consents ? Object.entries(selected.consents).filter(([, v]) => v) : [];
              if (!active.length) return <span className="dim-2">—</span>;
              return active.map(([k]) => (
                <span key={k} className="badge" style={{marginRight:6, fontSize:11}}>{labels[k] || k}</span>
              ));
            })()}</dd>
            {selected.profile && Object.keys(selected.profile).length > 0 && (
              <>
                <dt className="dim-2 mono" style={{fontSize:11}}>프로필</dt>
                <dd>
                  <ProfileFields profile={selected.profile}/>
                </dd>
              </>
            )}
            {selected.suspended && selected.suspendedReason && (
              <>
                <dt className="dim-2 mono" style={{fontSize:11}}>정지 사유</dt>
                <dd className="dim">{selected.suspendedReason}</dd>
              </>
            )}
          </div>

          <div style={{marginTop:24, display:'flex', gap:8, flexWrap:'wrap'}}>
            {selected.suspended ? (
              <button type="button" className="btn btn-small" onClick={() => unsuspend(selected)}>정지 해제</button>
            ) : (
              <button type="button" className="btn btn-small" onClick={() => suspendUser(selected)}
                style={{borderColor:'var(--danger)', color:'var(--danger)'}}>계정 정지</button>
            )}
            <button type="button" className="btn btn-small" onClick={() => deleteUser(selected)}
              style={{borderColor:'var(--danger)', color:'var(--danger)', marginLeft:'auto'}}>계정 삭제</button>
          </div>
        </article>

        {/* 활동 요약 */}
        <article className="card" style={{padding:20, marginBottom:18}}>
          <div className="mono gold" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>ACTIVITY</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12}}>
            {[
              { l: '게시글', v: activity.postCount },
              { l: '댓글', v: activity.commentCount },
              { l: '북마크', v: activity.bookmarkCount },
              { l: '책 주문', v: activity.bookOrders.length },
              { l: '강연 신청', v: activity.lectures.length },
              { l: '답사 신청', v: activity.tours.length },
              { l: '받은 알림', v: activity.notifications.length },
            ].map((s) => (
              <div key={s.l} className="card" style={{padding:12}}>
                <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.2em', marginBottom:4}}>{s.l}</div>
                <div className="ko-serif gold-2" style={{fontSize:24}}>{s.v}</div>
              </div>
            ))}
          </div>
        </article>

        {/* 활동 상세 — 게시글 */}
        {activity.postCount > 0 && (
          <article className="card" style={{padding:20, marginBottom:18}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>POSTS · {activity.postCount}</div>
            <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
              {activity.posts.slice(0, 8).map((p) => (
                <li key={p.id} style={{display:'flex', justifyContent:'space-between', gap:12, fontSize:12, padding:'6px 0', borderBottom:'1px solid var(--line)'}}>
                  <span className="ko-serif">{p.title}</span>
                  <span className="mono dim-2">{p.date}</span>
                </li>
              ))}
              {activity.posts.length > 8 && (
                <li className="dim-2 mono" style={{fontSize:11, textAlign:'right'}}>외 {activity.posts.length - 8}건</li>
              )}
            </ul>
          </article>
        )}

        {activity.bookOrders.length > 0 && (
          <article className="card" style={{padding:20, marginBottom:18}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>BOOK ORDERS · {activity.bookOrders.length}</div>
            <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:6}}>
              {activity.bookOrders.slice(0, 8).map((o) => (
                <li key={o.id} style={{display:'flex', justifyContent:'space-between', gap:12, fontSize:12, padding:'6px 0', borderBottom:'1px solid var(--line)'}}>
                  <span className="mono">{o.orderNo}</span>
                  <span>{o.version === 'KR' ? '국문' : '영문'} × {o.qty} · <span className="gold">{window.BGNJ_FMT.won(o.total)}</span></span>
                  <span className="mono dim-2">{o.status}</span>
                </li>
              ))}
            </ul>
          </article>
        )}

        {(activity.lectures.length > 0 || activity.tours.length > 0) && (
          <article className="card" style={{padding:20}}>
            <div className="mono dim-2" style={{fontSize:10, letterSpacing:'0.22em', marginBottom:10}}>LECTURES & TOURS</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}} className="member-act-grid">
              <div>
                <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', marginBottom:6}}>강연 신청 · {activity.lectures.length}</div>
                <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                  {activity.lectures.slice(0, 6).map((r) => (
                    <li key={r.id} style={{fontSize:12, lineHeight:1.6}}>· {r.lecture?.topic || '강연'} <span className="dim-2 mono" style={{fontSize:10}}>· {r.status}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', marginBottom:6}}>답사 신청 · {activity.tours.length}</div>
                <ul style={{listStyle:'none', margin:0, padding:0, display:'grid', gap:4}}>
                  {activity.tours.slice(0, 6).map((r) => (
                    <li key={r.id} style={{fontSize:12, lineHeight:1.6}}>· {r.tour?.title || '답사'} <span className="dim-2 mono" style={{fontSize:10}}>· {r.status}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        )}
        {suspendTarget && (
          <SuspendDialog target={suspendTarget} reason={suspendReason}
            onChange={setSuspendReason}
            onConfirm={submitSuspend}
            onCancel={() => { setSuspendTarget(null); setSuspendReason(''); }}/>
        )}
      </div>
    );
  }

  // ── 목록 ──
  return (
    <div>
      <div style={{display:'flex', gap:12, marginBottom:16, alignItems:'center', flexWrap:'wrap'}}>
        <input className="field-input" placeholder="이름·이메일 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <select className="field-input" style={{maxWidth:160}}
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="suspended">정지됨</option>
          <option value="admin">관리자만</option>
        </select>
        <select className="field-input" style={{maxWidth:200}}
          value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="all">전체 등급</option>
          {grades.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
        </select>
        <select className="field-input" style={{maxWidth:200}}
          value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="joined_desc">가입일 ↓ (최신)</option>
          <option value="joined_asc">가입일 ↑ (오래된)</option>
          <option value="name_asc">이름 가나다</option>
          <option value="name_desc">이름 역순</option>
          <option value="email_asc">이메일 a→z</option>
          <option value="grade_desc">등급 ↓ (높은 순)</option>
          <option value="posts_desc">게시글 많은 순</option>
          <option value="comments_desc">댓글 많은 순</option>
        </select>
        <span className="mono dim-2" style={{fontSize:11}}>총 {users.length}명 · 표시 {filtered.length}명</span>
        <button type="button" className="btn btn-small" onClick={exportCsv}>CSV 다운로드</button>
      </div>

      <p className="dim" style={{fontSize:12, marginBottom:14}}>
        회원 이메일/이름은 <strong className="gold">개인식별정보(PII)</strong>입니다. 등급 변경·정지·삭제는 즉시 반영되며,
        본인이 로그인 중이면 세션도 자동으로 갱신/종료됩니다.
      </p>

      <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
        <thead>
          <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)', textTransform:'uppercase'}}>
            <th scope="col" style={{padding:12, textAlign:'left'}}>이름</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>이메일</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>등급</th>
            <th scope="col" style={{padding:12, textAlign:'left'}}>가입일</th>
            {/* v00.261 — 마지막 접속(로그인 + 세션 갱신 24h throttle). 처방침 고지 완료. */}
            <th scope="col" style={{padding:12, textAlign:'left'}}>마지막 접속</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>활동</th>
            <th scope="col" style={{padding:12, textAlign:'right'}}>액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => {
            const g = gradeOf(u.gradeId);
            const a = window.BGNJ_AUTH.getActivity(u.id) || {};
            const activitySummary = `글 ${a.postCount || 0} · 댓글 ${a.commentCount || 0} · 주문 ${(a.bookOrders||[]).length} · 강연 ${(a.lectures||[]).length} · 답사 ${(a.tours||[]).length}`;
            return (
              <tr key={u.id} style={{borderBottom:'1px solid var(--line)'}}>
                <td style={{padding:12}}>
                  <button type="button" onClick={() => setSelectedId(u.id)}
                    style={{all:'unset', cursor:'pointer'}}>
                    <span className="ko-serif" style={{fontSize:14}}>{u.name}</span>
                    {u.isAdmin && <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color:'var(--secondary)', marginLeft:8}}>ADMIN</span>}
                    {u.suspended && <span className="mono" style={{fontSize:9, letterSpacing:'0.18em', color:'var(--danger)', marginLeft:8}}>정지</span>}
                  </button>
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:11}}>{u.email}</td>
                <td style={{padding:12}}>
                  {g ? (
                    <span className="mono" style={{fontSize:10, letterSpacing:'0.14em', color: g.color || 'var(--primary)', border:`1px solid ${g.color || 'var(--primary-dim)'}`, padding:'1px 6px'}}>
                      {g.label}
                    </span>
                  ) : (
                    <span className="dim-2 mono" style={{fontSize:10}}>—</span>
                  )}
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:11}}>{u.joinedAt ? window.BGNJ_FMT.kstDate(u.joinedAt) : '-'}</td>
                {/* v00.261 — 마지막 접속: 30일 이내 상대시간 ('3일 전'), 그 외 절대 날짜.
                    null(스키마 미적용 또는 v00.261 이전 가입자 미접속) 시 '—'. */}
                <td className="mono dim-2" style={{padding:12, fontSize:11}}
                  title={u.lastLoginAt ? window.BGNJ_FMT.kstDateTime(u.lastLoginAt) : '기록 없음'}>
                  {u.lastLoginAt ? window.BGNJ_FMT.kstRelative(u.lastLoginAt) : <span className="dim-2">—</span>}
                </td>
                <td className="mono dim-2" style={{padding:12, fontSize:10, textAlign:'right'}}>{activitySummary}</td>
                <td style={{padding:12, textAlign:'right'}}>
                  <button type="button" className="btn btn-small" onClick={() => setSelectedId(u.id)}>상세</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="card dim" style={{padding:32, textAlign:'center', marginTop:14}}>
          조건에 맞는 회원이 없습니다.
        </div>
      )}
    </div>
  );
};

// v00.187 — pickImageWithR2Fallback / downloadBlob/Csv/Json / SubTabsView 모두 AdminShared.jsx 로 이동.
import { downloadCsv } from './AdminShared.jsx';


// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { MemberAdminPanel };
