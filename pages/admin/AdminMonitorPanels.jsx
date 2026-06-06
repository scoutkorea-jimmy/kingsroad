// 뱅기노자 — 사이트 모니터링/SEO 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// ErrorLogPanel (D1.error_log 클라이언트 오류 조회) · SEOAdminPanel (OG/Hero/브랜드 메타) ·
// SearchConsoleAdminPanel (검색엔진 소유확인 meta + sitemap ping).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_API/CONFIRM/TOAST/FMT/SITE_CONTENT).
// entry-admin 에서 AuthAdminPage 앞에 로드. 각 패널 window 노출.

// === Error Log Panel ==============================================
// 사이트에서 발생한 모든 클라이언트 오류(인증/네트워크/렌더링/미처리 promise) 를 D1.error_log 에서 조회.
const ErrorLogPanel = () => {
  const [errors, setErrors] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [codeFilter, setCodeFilter] = React.useState('all');
  const [loading, setLoading] = React.useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const { errors: list } = await window.BGNJ_API.errorLog.list({ limit: 500 });
      setErrors(list || []);
    } catch {} finally { setLoading(false); }
  };
  React.useEffect(() => { refresh(); }, []);

  const codeOptions = React.useMemo(() => {
    const set = new Set(errors.map((e) => e.code).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [errors]);

  const filtered = React.useMemo(() => {
    let list = errors.slice();
    if (codeFilter !== 'all') list = list.filter((e) => e.code === codeFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((e) =>
      String(e.message || '').toLowerCase().includes(q)
      || String(e.url || '').toLowerCase().includes(q)
      || String(e.pathname || '').toLowerCase().includes(q)
    );
    return list;
  }, [errors, codeFilter, search]);

  const clearAll = async () => {
    if (!(await window.BGNJ_CONFIRM('모든 오류 로그를 삭제하시겠습니까? (되돌릴 수 없음)', { danger: true }))) return;
    try { await window.BGNJ_API.errorLog.clear(); await refresh(); }
    catch (err) { window.BGNJ_TOAST.error('삭제 실패: ' + (err?.message || '')); }
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:14, lineHeight:1.7}}>
        사이트에서 발생한 모든 클라이언트 오류가 D1.error_log 에 기록됩니다 (인증/네트워크/렌더링/미처리 promise).
        AI 또는 운영자가 작업을 시작할 때 <strong className="gold">이 패널을 가장 먼저 확인</strong>하여 미해결 오류를 우선 처리하는 것이 원칙입니다.
      </p>
      <div style={{display:'flex', gap:12, marginBottom:14, alignItems:'center', flexWrap:'wrap'}}>
        <input className="field-input" placeholder="메시지/URL 검색..." style={{flex:1, minWidth:240}}
          value={search} onChange={(e) => setSearch(e.target.value)}/>
        <select className="field-input" style={{maxWidth:200}}
          value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)}>
          {codeOptions.map((c) => <option key={c} value={c}>{c === 'all' ? '전체 코드' : c}</option>)}
        </select>
        <button type="button" className="btn btn-small" onClick={refresh} disabled={loading}>
          {loading ? '불러오는 중...' : '새로고침'}
        </button>
        <button type="button" className="btn btn-small" onClick={clearAll}
          style={{borderColor:'var(--danger)', color:'var(--danger)'}}>전체 삭제</button>
        <span className="mono dim-2" style={{fontSize:11}}>총 {errors.length}건 · 표시 {filtered.length}건</span>
      </div>
      <div style={{overflowX:'auto', border:'1px solid var(--line)'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:980}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:160}}>시각</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:140}}>코드</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:60}}>HTTP</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left'}}>메시지</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:160}}>경로</th>
              <th scope="col" style={{padding:'10px 12px', textAlign:'left', width:200}}>요청 URL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="dim" style={{padding:32, textAlign:'center'}}>{loading ? '불러오는 중...' : '오류 로그가 없습니다.'}</td></tr>
            ) : filtered.map((e) => (
              <tr key={e.id} style={{borderTop:'1px solid var(--line)'}}>
                <td className="mono dim-2" style={{padding:'10px 12px', fontSize:11, verticalAlign:'top'}}>
                  {e.ts ? window.BGNJ_FMT.kstDateTime(e.ts) : '-'}
                </td>
                <td className="mono" style={{padding:'10px 12px', fontSize:11, verticalAlign:'top', color:'var(--danger)', letterSpacing:'0.1em'}}>
                  {e.code || '-'}
                </td>
                <td className="mono" style={{padding:'10px 12px', fontSize:11, verticalAlign:'top'}}>{e.status || '-'}</td>
                <td style={{padding:'10px 12px', fontSize:13, verticalAlign:'top', lineHeight:1.6}}>
                  <div style={{fontWeight:500}}>{e.message}</div>
                  {e.hint && <div className="dim-2" style={{fontSize:11, marginTop:4}}>{e.hint}</div>}
                </td>
                <td className="mono dim-2" style={{padding:'10px 12px', fontSize:10, verticalAlign:'top', wordBreak:'break-all'}}>{e.pathname || '-'}</td>
                <td className="mono dim-2" style={{padding:'10px 12px', fontSize:10, verticalAlign:'top', wordBreak:'break-all'}}>{e.url || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// === SEO Admin Panel ==============================================
// 사이트 메타데이터(OG 이미지, 페이지 title/description) 관리.
// 서버 source: site_content_kv.og 섹션. data.js applyHead 가 <head> 메타를 즉시 갱신.
const SEOAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const [og, setOg] = React.useState({ title: '', description: '', imageDataUri: '' });
  const [hero, setHero] = React.useState({ eyebrow: '', title1: '', title2: '', title3: '', subtitle: '' });
  const [brand, setBrand] = React.useState({ name: '', sub: '' });
  const [msg, setMsg] = React.useState('');

  const refresh = async () => {
    await window.BGNJ_SITE_CONTENT.refresh();
    const sc = window.BGNJ_SITE_CONTENT.get();
    setOg(sc.og || {});
    setHero(sc.hero || {});
    setBrand(sc.brand || {});
    setTick((v) => v + 1);
  };
  React.useEffect(() => { refresh(); }, []);

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2400); };

  const save = async (section, data) => {
    try {
      await window.BGNJ_SITE_CONTENT.saveSection(section, data);
      flash('✓ 저장되었습니다. <head> 메타가 즉시 갱신됩니다.');
      await refresh();
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.body?.error || err?.message || ''));
    }
  };

  const onPickImage = async (e, section, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      flash('✗ 이미지가 너무 큽니다 (1.5MB 이하 권장).'); e.target.value = ''; return;
    }
    const dataUri = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    if (section === 'og') {
      const next = { ...og, [field]: dataUri };
      setOg(next);
      await save(section, next);
    }
    e.target.value = '';
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        검색엔진과 SNS 공유 미리보기에 사용되는 메타데이터를 관리합니다. 변경 사항은 저장 즉시 페이지의 <code className="mono">&lt;head&gt;</code> 에 반영됩니다.
      </p>

      {msg && (
        <div role="status" style={{
          marginBottom:16, padding:'10px 14px',
          border: msg.startsWith('✗') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
          background: msg.startsWith('✗') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
          color: msg.startsWith('✗') ? 'var(--danger)' : 'var(--primary)', fontSize:13,
        }}>{msg}</div>
      )}

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>OG · 검색엔진 공유 메타</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        카카오톡/페이스북/X 공유 시 노출되는 미리보기 카드와 검색엔진 description.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); save('og', og); }} className="card" style={{padding:20, marginBottom:24}}>
        <div className="field">
          <label className="field-label">OG 제목 (검색·공유 카드 제목)</label>
          <input className="field-input" placeholder="뱅기노자 — 뱅기 타고 한국을 느끼다"
            value={og.title || ''} onChange={(e) => setOg({ ...og, title: e.target.value })}/>
        </div>
        <div className="field">
          <label className="field-label">OG 설명 (검색·공유 카드 본문)</label>
          <textarea className="field-input" rows={3}
            placeholder="궁궐 답사부터 지역 여행까지, 한국의 역사·문화·자연을 함께 여행하는 커뮤니티."
            value={og.description || ''} onChange={(e) => setOg({ ...og, description: e.target.value })}/>
        </div>
        <div className="field">
          <label className="field-label">OG 이미지 (1200×630 권장 · 1.5MB 이하)</label>
          {og.imageDataUri && (
            <img src={og.imageDataUri} alt="OG preview"
              style={{display:'block', maxWidth:240, maxHeight:126, marginBottom:8, border:'1px solid var(--line)'}}/>
          )}
          <input type="file" accept="image/png,image/jpeg" onChange={(e) => onPickImage(e, 'og', 'imageDataUri')}/>
          {og.imageDataUri && (
            <button type="button" className="btn-ghost" style={{fontSize:11, color:'var(--danger)', marginTop:6}}
              onClick={() => save('og', { ...og, imageDataUri: '' })}>이미지 제거</button>
          )}
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="submit" className="btn btn-gold">OG 저장</button>
        </div>
      </form>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>페이지 상단 (Hero)</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:14, lineHeight:1.7}}>
        홈페이지 첫 화면의 큰 제목과 부제. 검색엔진의 페이지 본문 첫 인상에 사용됩니다.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); save('hero', hero); }} className="card" style={{padding:20, marginBottom:24}}>
        <div className="field">
          <label className="field-label">상단 라벨 (대문자 권장)</label>
          <input className="field-input" placeholder="BANGINOJA · 뱅기타고 노자"
            value={hero.eyebrow || ''} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
          <div className="field">
            <label className="field-label">제목 1행</label>
            <input className="field-input" value={hero.title1 || ''} onChange={(e) => setHero({ ...hero, title1: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">제목 2행</label>
            <input className="field-input" value={hero.title2 || ''} onChange={(e) => setHero({ ...hero, title2: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">제목 3행</label>
            <input className="field-input" value={hero.title3 || ''} onChange={(e) => setHero({ ...hero, title3: e.target.value })}/>
          </div>
        </div>
        <div className="field">
          <label className="field-label">부제 (Hero subtitle)</label>
          <textarea className="field-input" rows={2}
            value={hero.subtitle || ''} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}/>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="submit" className="btn btn-gold">Hero 저장</button>
        </div>
      </form>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>브랜드 이름</h3>
      <form onSubmit={(e) => { e.preventDefault(); save('brand', brand); }} className="card" style={{padding:20}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div className="field">
            <label className="field-label">브랜드명 (한글)</label>
            <input className="field-input" placeholder="뱅기노자"
              value={brand.name || ''} onChange={(e) => setBrand({ ...brand, name: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">서브 (영문/약어)</label>
            <input className="field-input" placeholder="BANGINOJA"
              value={brand.sub || ''} onChange={(e) => setBrand({ ...brand, sub: e.target.value })}/>
          </div>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="submit" className="btn btn-gold">브랜드 저장</button>
        </div>
      </form>
    </div>
  );
};

// === Search Console Admin Panel (v00.196) =========================
// 사용자 요청 '구글/네이버 등 서치 콘솔 + 최신화 가능한 api 입력 페이지'.
// 검증 meta tag 입력 → site_content_kv.searchConsole 저장 → applyHead 가 <head> 즉시 주입.
// + sitemap.xml URL 표시 + 각 콘솔 새창 진입 + Google sitemap ping (no-cors fetch).
const SearchConsoleAdminPanel = () => {
  const [data, setData] = React.useState({
    google: '', naver: '', bing: '', yandex: '',
    sitemapUrl: '', lastUpdated: '',
  });
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2400); };

  const refresh = React.useCallback(async () => {
    try { await window.BGNJ_SITE_CONTENT.refresh(); } catch {}
    const sc = window.BGNJ_SITE_CONTENT?.get?.() || {};
    const cur = sc.searchConsole || {};
    const origin = (typeof location !== 'undefined' ? location.origin : 'https://bgnj.net');
    setData({
      google: cur.google || '',
      naver: cur.naver || '',
      bing: cur.bing || '',
      yandex: cur.yandex || '',
      sitemapUrl: cur.sitemapUrl || `${origin}/sitemap.xml`,
      lastUpdated: cur.lastUpdated || '',
    });
    setDirty(false);
  }, []);
  React.useEffect(() => { refresh(); }, [refresh]);

  const setField = (k, v) => { setData((cur) => ({ ...cur, [k]: v })); setDirty(true); };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const next = { ...data, lastUpdated: new Date().toISOString() };
      await window.BGNJ_SITE_CONTENT.saveSection('searchConsole', next);
      try { window.BGNJ_SITE_CONTENT.applyHead(); } catch {}
      setData(next);
      setDirty(false);
      flash('✓ 저장됨 — <head> 검증 meta 즉시 갱신');
    } catch (err) {
      flash('✗ 저장 실패: ' + (err?.body?.error || err?.message || ''));
    } finally { setSaving(false); }
  };

  const pingGoogleSitemap = () => {
    if (!data.sitemapUrl) { flash('✗ sitemap URL 이 없습니다'); return; }
    // Google ping endpoint (no-cors fetch — 응답 못 읽지만 요청은 도달). BGNJ_API 우회: 외부 도메인 호출.
    try {
      // bgnj-lint-ignore-next-line direct_fetch
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(data.sitemapUrl)}`, { mode: 'no-cors' })
        .catch(() => {});
      flash('✓ Google 에 sitemap ping 요청 (응답은 Search Console 에서 확인)');
    } catch (err) {
      flash('✗ ping 실패: ' + (err?.message || ''));
    }
  };

  const openConsole = (url) => { try { window.open(url, '_blank', 'noopener'); } catch {} };

  const lastUpdLabel = data.lastUpdated
    ? window.BGNJ_FMT.kstDateTime(data.lastUpdated)
    : '저장 이력 없음';

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        검색엔진 사이트 소유 확인용 meta tag 를 입력합니다. 저장 즉시 <code className="mono">&lt;head&gt;</code> 에 주입되며, 각 검색 콘솔 사이트의 "HTML 태그" 검증 방법을 통과합니다.
      </p>

      {msg && (
        <div role="status" style={{
          marginBottom:16, padding:'10px 14px',
          border: msg.startsWith('✗') ? '1px solid var(--danger)' : '1px solid var(--primary-dim)',
          background: msg.startsWith('✗') ? 'rgba(194,74,61,0.06)' : 'rgba(245,213,72,0.06)',
          color: msg.startsWith('✗') ? 'var(--danger)' : 'var(--primary)', fontSize:13,
        }}>{msg}</div>
      )}

      <div className="card" style={{padding:20, marginBottom:18}}>
        <h3 className="ko-serif" style={{fontSize:16, marginBottom:14}}>검증 코드 (HTML 태그 방식)</h3>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Google Search Console — <code className="mono">&lt;meta name="google-site-verification" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="예: 8R9z4...... (content 값만 입력)"
            value={data.google} onChange={(e) => setField('google', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://search.google.com/search-console')}>↗ Search Console 열기</button>
          </div>
        </div>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Naver Search Advisor — <code className="mono">&lt;meta name="naver-site-verification" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="예: a1b2c3d4......"
            value={data.naver} onChange={(e) => setField('naver', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://searchadvisor.naver.com/')}>↗ Search Advisor 열기</button>
          </div>
        </div>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Bing Webmaster — <code className="mono">&lt;meta name="msvalidate.01" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="예: A1B2C3......"
            value={data.bing} onChange={(e) => setField('bing', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://www.bing.com/webmasters')}>↗ Bing Webmaster 열기</button>
          </div>
        </div>

        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">
            Yandex Webmaster — <code className="mono">&lt;meta name="yandex-verification" content="..."&gt;</code>
          </label>
          <input className="field-input" placeholder="(선택) 예: 1234abcd......"
            value={data.yandex} onChange={(e) => setField('yandex', e.target.value.trim())}/>
          <div style={{display:'flex', gap:8, marginTop:6, flexWrap:'wrap'}}>
            <button type="button" className="btn btn-small" onClick={() => openConsole('https://webmaster.yandex.com/')}>↗ Yandex 열기</button>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20, marginBottom:18}}>
        <h3 className="ko-serif" style={{fontSize:16, marginBottom:14}}>Sitemap & 인덱싱 최신화</h3>
        <div className="field" style={{marginBottom:14}}>
          <label className="field-label">Sitemap URL</label>
          <input className="field-input" placeholder="https://bgnj.net/sitemap.xml"
            value={data.sitemapUrl} onChange={(e) => setField('sitemapUrl', e.target.value.trim())}/>
          <p className="dim-2" style={{fontSize:11, marginTop:6, lineHeight:1.6}}>
            Google / Naver 콘솔에 동일한 URL 을 등록하세요. 미등록 시 색인 누락 가능.
          </p>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button type="button" className="btn btn-small btn-gold" onClick={pingGoogleSitemap}>
            🔔 Google 에 sitemap 변경 알림 (ping)
          </button>
          <button type="button" className="btn btn-small"
            onClick={() => openConsole(`https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent((typeof location !== 'undefined' ? location.origin : 'https://bgnj.net'))}`)}>
            ↗ Google Sitemap 페이지 열기
          </button>
          <button type="button" className="btn btn-small"
            onClick={() => openConsole('https://searchadvisor.naver.com/console/board')}>
            ↗ Naver 사이트맵 콘솔 열기
          </button>
        </div>
        <p className="dim-2" style={{fontSize:11, marginTop:10, lineHeight:1.6}}>
          ※ Naver 는 직접 ping 엔드포인트 미공식 — 콘솔에서 수동 등록 필요. Bing 은 Google 과 색인 공유.
        </p>
      </div>

      <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', justifyContent:'flex-end'}}>
        <span className="dim-2 mono" style={{fontSize:11}}>
          마지막 저장: {lastUpdLabel}
        </span>
        <span style={{flex:1}}/>
        {dirty && (
          <button type="button" className="btn btn-small" onClick={refresh}>변경 취소</button>
        )}
        <button type="button" className="btn btn-gold" onClick={save} disabled={saving || !dirty}>
          {saving ? '저장 중…' : (dirty ? '💾 저장' : '저장됨 ✓')}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { ErrorLogPanel, SEOAdminPanel, SearchConsoleAdminPanel };
