// 뱅기노자 — 사이트 콘텐츠 관리 패널 (v00.285 — AuthAdminPage.jsx 에서 분리)
//
// SiteContentAdminPanel(홈/푸터/연락처 등 사이트 텍스트·이미지) · OgPreviewBlock(OG 미리보기).
// 자기완결적 — 의존은 모두 window 전역(BGNJ_SITE_CONTENT/API/CONFIRM/TOAST 등).
// entry-admin 에서 AuthAdminPage 앞에 로드. SiteContentAdminPanel 만 window 노출.

// v00.286 ESM — cross-module import (전역 결합 제거).
import { FooterStyleEditor } from './AdminContentEditors.jsx';
import { pickImageWithR2Fallback } from './AdminShared.jsx';

const SiteContentAdminPanel = () => {
  const [tick, setTick] = React.useState(0);
  const sc = React.useMemo(() => window.BGNJ_SITE_CONTENT.get(), [tick]);
  const [msg, setMsg] = React.useState('');

  const flash = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 2000);
  };

  const fileToDataUri = (file) => new Promise((resolve, reject) => {
    if (!file) { resolve(''); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // 섹션 단위 폼 — 입력 상태는 sc 변경 시 자동 초기화 (key prop으로 강제 remount).
  const SectionForm = ({ section, fields, onAfterSave }) => {
    const [draft, setDraft] = React.useState(() => ({ ...(sc[section] || {}) }));
    const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
    const save = (e) => {
      e.preventDefault();
      window.BGNJ_SITE_CONTENT.saveSection(section, draft);
      setTick((v) => v + 1);
      flash('저장되었습니다.');
      if (onAfterSave) onAfterSave();
    };
    const reset = async () => {
      if (!(await window.BGNJ_CONFIRM('이 섹션을 기본값으로 되돌릴까요?', { danger: true }))) return;
      window.BGNJ_SITE_CONTENT.resetSection(section);
      setTick((v) => v + 1);
      flash('기본값으로 복원되었습니다.');
    };
    return (
      <form onSubmit={save} className="card" style={{padding:20, marginBottom:20}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14}}>
          {fields.map((f) => (
            <div key={f.key} className="field" style={{gridColumn: f.full ? '1 / -1' : 'auto'}}>
              <label className="field-label" htmlFor={`sc-${section}-${f.key}`}>{f.label}</label>
              {f.multiline ? (
                <textarea id={`sc-${section}-${f.key}`} className="field-input" rows={3}
                  value={draft[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}/>
              ) : (
                <input id={`sc-${section}-${f.key}`} className="field-input"
                  value={draft[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}/>
              )}
            </div>
          ))}
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', borderTop:'1px solid var(--line)', paddingTop:14, marginTop:14}}>
          <button type="button" className="btn btn-small" onClick={reset}>기본값 복원</button>
          <button type="submit" className="btn btn-gold">저장</button>
        </div>
      </form>
    );
  };

  const ImageUploader = ({ section, field, label, hint, previewSize = 56, accept = 'image/*', folder }) => {
    const current = sc[section]?.[field] || '';
    // v00.185 — pickImageWithR2Fallback 헬퍼로 통합. 25 lines → 6 lines.
    const onPick = async (e) => {
      const r2Folder = folder || section;
      const result = await pickImageWithR2Fallback(e, { folder: r2Folder });
      if (result) {
        window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: result });
        setTick((v) => v + 1);
        flash(`${label} 업로드 완료`);
      }
    };
    const clear = async () => {
      if (!(await window.BGNJ_CONFIRM(`${label}을(를) 비울까요? (기본 마크로 되돌아갑니다)`, { danger: true }))) return;
      window.BGNJ_SITE_CONTENT.saveSection(section, { [field]: '' });
      setTick((v) => v + 1);
      flash(`${label} 제거됨`);
    };
    return (
      <div className="card" style={{padding:16, display:'flex', gap:14, alignItems:'center', marginBottom:12}}>
        <div style={{
          width:previewSize, height:previewSize, flexShrink:0,
          border:'1px solid var(--line)', background:'var(--bg-2)',
          display:'grid', placeItems:'center', overflow:'hidden',
        }}>
          {current
            ? <img src={current} alt="" style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain'}}/>
            : <span className="dim-2 mono" style={{fontSize:9, letterSpacing:'0.18em'}}>NONE</span>}
        </div>
        <div style={{flex:1}}>
          <div className="ko-serif" style={{fontSize:14, marginBottom:4}}>{label}</div>
          {hint && <div className="dim-2" style={{fontSize:11, lineHeight:1.5}}>{hint}</div>}
        </div>
        <div style={{display:'flex', gap:8}}>
          <label className="btn btn-small" style={{cursor:'pointer'}}>
            업로드
            <input type="file" accept={accept} onChange={onPick} style={{display:'none'}}/>
          </label>
          {current && (
            <button type="button" className="btn btn-small" onClick={clear}
              style={{borderColor:'var(--danger)', color:'var(--danger)'}}>제거</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="dim" style={{fontSize:13, marginBottom:18, lineHeight:1.8}}>
        홈페이지 내비게이션 라벨, 히어로/푸터 텍스트, 브랜드명, 로고·파비콘, OG 메타를 직접 편집합니다.
        섹션별로 저장되며 저장 즉시 사이트에 반영됩니다.
      </p>
      {msg && (
        <div role="status" className="mono gold" style={{fontSize:12, marginBottom:14, padding:'8px 12px', border:'1px solid var(--primary-dim)', background:'rgba(59,130,246,0.06)'}}>
          {msg}
        </div>
      )}

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>메뉴 라벨</h3>
      <SectionForm key={`nav-${tick}`} section="nav" fields={[
        { key: 'home', label: '홈' },
        { key: 'community', label: '커뮤니티' },
        { key: 'lectures', label: '강연' },
        { key: 'tour', label: '투어 프로그램' },
        { key: 'column', label: '뱅기노자 칼럼' },
        { key: 'book', label: '뱅기노자 도서' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>브랜드</h3>
      <SectionForm key={`brand-${tick}`} section="brand" fields={[
        { key: 'name', label: '브랜드 이름 (한글)' },
        { key: 'sub', label: '브랜드 영문' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>히어로(메인 상단)</h3>
      <SectionForm key={`hero-${tick}`} section="hero" fields={[
        { key: 'eyebrow', label: '아이브로우 (상단 작은 텍스트)', full: true },
        { key: 'title1', label: '큰 제목 1줄' },
        { key: 'title2', label: '큰 제목 2줄 (강조 색)' },
        { key: 'title3', label: '큰 제목 3줄' },
        { key: 'subtitle', label: '본문 설명', full: true, multiline: true },
        { key: 'ctaPrimary', label: 'CTA 버튼 (주요)' },
        { key: 'ctaSecondary', label: 'CTA 버튼 (보조)' },
        { key: 'mapHint', label: '지도 안내 문구', full: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>푸터 — 소개·서명·헤딩·카피라이트</h3>
      <SectionForm key={`footer-${tick}`} section="footer" fields={[
        { key: 'description',    label: '소개 문단', full: true, multiline: true },
        { key: 'signature',      label: '하단 서명 (예: 뱅기타고 노자 · DESIGNED IN SEOUL)', full: true },
        { key: 'copyright',      label: '카피라이트 (© 라인)', full: true },
        { key: 'headingContent', label: '콘텐츠 섹션 헤딩 (기본: 콘텐츠)' },
        { key: 'headingInfo',    label: '정보 섹션 헤딩 (기본: 정보)' },
        { key: 'headingContact', label: '연락 섹션 헤딩 (기본: 연락)' },
      ]}/>

      <FooterStyleEditor/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>푸터 — 연락 + 사업자 정보</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        푸터의 '연락' 섹션 + 사업자 정보 블록에 노출됩니다. 비우면 해당 줄이 표시되지 않습니다.
        v00.144 부터 전화번호는 푸터에서 제거되고 사업자등록번호 등이 노출됩니다.
      </p>
      <SectionForm key={`contact-${tick}`} section="contact" fields={[
        { key: 'email',       label: '이메일' },
        { key: 'address',     label: '주소', full: true },
        { key: 'companyName', label: '회사명 (법인명)' },
        { key: 'ceo',         label: '대표자' },
        { key: 'bizRegNo',    label: '사업자등록번호 (예: 551-86-02188)' },
        { key: 'corpRegNo',   label: '법인등록번호 (예: 110111-7817690)' },
        { key: 'founded',     label: '개업 / 설립일 (예: 2021-04-01)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10}}>로고 · 파비콘</h3>
      <ImageUploader section="branding" field="logoDataUri" label="헤더 로고"
        hint="22x22px 표시. PNG/SVG 권장 · 1.5MB 이하."/>
      <ImageUploader section="branding" field="faviconDataUri" label="파비콘"
        hint="32x32 또는 64x64 PNG 권장 · 저장 즉시 브라우저 탭 아이콘이 갱신됩니다."
        previewSize={40} accept="image/png,image/x-icon,image/svg+xml"/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>로그인 / 회원가입 좌측 영역</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        로그인·회원가입 페이지 왼쪽에 노출되는 이미지와 문구입니다. 이미지를 업로드하면 그라데이션 배경 대신 이미지가 사용됩니다.
      </p>
      <SectionForm key={`auth-${tick}`} section="auth" fields={[
        { key: 'eyebrow', label: '윗쪽 작은 라벨 (대문자 권장)' },
        { key: 'title', label: '메인 제목 (줄바꿈 가능)', full: true, multiline: true },
        { key: 'description', label: '소개 문단', full: true, multiline: true },
      ]}/>
      <ImageUploader section="auth" field="imageDataUri" label="좌측 배경 이미지"
        hint="1200x1600 또는 1080x1920 권장 · JPG/PNG · 비우면 기본 그라데이션 배경 사용. 1.5MB 이하."
        previewSize={120}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>투어 페이지 — 상단 인트로</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        <code>/tour</code> 페이지의 답사 리스트 위쪽 hero 섹션. 비우면 코드 default 사용.
      </p>
      <SectionForm key={`tourIntro-${tick}`} section="tourIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: TOUR · 답사)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 발로 읽는 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 조선)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>투어 페이지 — 후기 안내 문구</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        답사 상세 페이지의 후기 섹션 안내 카드 문구. 비우면 코드 default.
      </p>
      <SectionForm key={`tourReviewsGate-${tick}`} section="tourReviewsGate" fields={[
        { key: 'gate',      label: '미참가 회원 안내 (참가 확정 회원만 작성 가능 안내)', full: true, multiline: true },
        { key: 'anonymous', label: '비로그인 안내 (로그인 후 작성 가능 안내)', full: true, multiline: true },
        { key: 'empty',     label: '후기가 0건일 때 안내', full: true, multiline: true },
      ]}/>

      {/* v00.073 — 전 페이지 hero/intro 일괄 편집 */}
      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>강연 페이지 — 상단 인트로</h3>
      <SectionForm key={`lectureIntro-${tick}`} section="lectureIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: LECTURE · 왕사남 강연)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 왕사남 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 강연 일정)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      {/* v00.075 — 강연 후기 게이팅 + 글로벌 진행/참고 */}
      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>강연 페이지 — 후기 안내 문구</h3>
      <p className="dim-2" style={{fontSize:12, marginBottom:12, lineHeight:1.7}}>
        강연 상세 페이지의 후기 섹션 안내 카드 문구. 비우면 코드 default.
      </p>
      <SectionForm key={`lectureReviewsGate-${tick}`} section="lectureReviewsGate" fields={[
        { key: 'gate',      label: '미참가 회원 안내', full: true, multiline: true },
        { key: 'anonymous', label: '비로그인 안내', full: true, multiline: true },
        { key: 'empty',     label: '후기가 0건일 때 안내', full: true, multiline: true },
      ]}/>
      <p className="dim-2" style={{fontSize:12, marginBottom:6, marginTop:14, lineHeight:1.7}}>
        ※ 강연별 진행 일정 / 참고 / 커버 + 글로벌 default + 템플릿은 <strong>운영설정 → 강연 페이지 (v00.083)</strong> 에서 GUI 편집.
      </p>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>홈 페이지 — 추천 여행지 섹션 헤딩</h3>
      <SectionForm key={`recommendationsHeading-${tick}`} section="recommendationsHeading" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: RECOMMENDATIONS · 뱅기노자 추천)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 뱅기노자가 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 추천)' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예: 합니다)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>커뮤니티 페이지 — 상단 인트로</h3>
      <SectionForm key={`communityIntro-${tick}`} section="communityIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: COMMUNITY · 커뮤니티)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 다섯 봉우리 )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 광장)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>칼럼 페이지 — 상단 인트로</h3>
      <SectionForm key={`columnIntro-${tick}`} section="columnIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 뱅기노자)' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예: 가 쓰다)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>FAQ 페이지 — 상단 인트로</h3>
      <SectionForm key={`faqIntro-${tick}`} section="faqIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 자주 묻는)' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예:  질문)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>주문/결제 페이지 — 상단 인트로</h3>
      <SectionForm key={`bookCheckoutIntro-${tick}`} section="bookCheckoutIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: CHECKOUT · 결제)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분 (예: 주문 / )' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: 결제)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>마이페이지 — 상단 인트로</h3>
      <p className="dim-2" style={{fontSize:11, marginBottom:8, lineHeight:1.7}}>
        강조어에 <code>{'{name}'}</code> 토큰을 쓰면 사용자 이름으로 치환됩니다 (예: 홍길동 님의 서재).
      </p>
      <SectionForm key={`myPageIntro-${tick}`} section="myPageIntro" fields={[
        { key: 'eyebrow',     label: '아이브로우 (예: MY PAGE · 회원 정보)', full: true },
        { key: 'titlePrefix', label: '큰 제목 앞부분' },
        { key: 'titleAccent', label: '큰 제목 강조어 (예: {name})' },
        { key: 'titleSuffix', label: '큰 제목 뒷부분 (예:  님의 서재)' },
        { key: 'subtitle',    label: '본문 설명', full: true, multiline: true },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>먹고 놀자 (/eat) 페이지</h3>
      <SectionForm key={`eatIntro-${tick}`} section="eatIntro" fields={[
        { key: 'eyebrow', label: '아이브로우', full: true },
        { key: 'title',   label: '큰 제목 (예: 먹고 놀자)' },
        { key: 'sub',     label: '제목 우측 작은 부제 (예: 한국의 맛, 한 끼의 인문학)' },
        { key: 'desc',    label: '본문 설명', full: true, multiline: true },
        { key: 'accent',  label: '부제 강조 색상 (HEX, 예: #E8A540)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>자고 놀자 (/sleep) 페이지</h3>
      <SectionForm key={`sleepIntro-${tick}`} section="sleepIntro" fields={[
        { key: 'eyebrow', label: '아이브로우', full: true },
        { key: 'title',   label: '큰 제목' },
        { key: 'sub',     label: '제목 우측 작은 부제' },
        { key: 'desc',    label: '본문 설명', full: true, multiline: true },
        { key: 'accent',  label: '부제 강조 색상 (HEX)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>사고 놀자 (/shop) 페이지</h3>
      <SectionForm key={`shopIntro-${tick}`} section="shopIntro" fields={[
        { key: 'eyebrow', label: '아이브로우', full: true },
        { key: 'title',   label: '큰 제목' },
        { key: 'sub',     label: '제목 우측 작은 부제' },
        { key: 'desc',    label: '본문 설명', full: true, multiline: true },
        { key: 'accent',  label: '부제 강조 색상 (HEX)' },
      ]}/>

      <h3 className="ko-serif" style={{fontSize:18, marginBottom:10, marginTop:24}}>OG 메타 (공유 미리보기)</h3>
      <SectionForm key={`og-${tick}`} section="og" fields={[
        { key: 'title', label: 'OG 제목', full: true },
        { key: 'description', label: 'OG 설명', full: true, multiline: true },
      ]}/>
      <ImageUploader section="og" field="imageDataUri" label="OG 이미지"
        hint="1200x630 PNG/JPG 권장 · 카카오톡/페이스북/X 공유 시 미리보기에 사용. 1.5MB 이하."
        previewSize={80}/>

      {/* OG 라이브 미리보기 + 플랫폼 호환성 (v00.060) */}
      <OgPreviewBlock sc={sc}/>
    </div>
  );
};

// === OG 라이브 미리보기 (v00.060) =========================================
// 현재 og:image 의 실제 렌더 + 카카오톡/페이스북/Discord 공유 카드 시뮬레이션 + 플랫폼 호환성 표.
// 관리자가 업로드한 imageDataUri 가 있으면 그것을, 없으면 index.html 의 fallback SVG meta 값을 사용.
const OgPreviewBlock = ({ sc }) => {
  const og = sc.og || {};
  const title = og.title || '뱅기노자 — 뱅기 타고 한국을 느끼다';
  const description = og.description || '뱅기노자 — 뱅기 타고 한국을 느끼다. 궁궐 답사부터 지역 여행까지, 한국의 역사·문화·자연을 함께 여행하는 커뮤니티.';
  const imageSrc = og.imageDataUri || (typeof document !== 'undefined' ? document.querySelector('meta[property="og:image"]')?.getAttribute('content') : '') || '';
  const isUserUpload = !!og.imageDataUri;
  const isSvg = (imageSrc || '').startsWith('data:image/svg');
  return (
    <div style={{marginTop:20}}>
      <h4 className="ko-serif" style={{fontSize:15, marginBottom:8}}>현재 OG 이미지 — 라이브 미리보기</h4>
      <p className="dim-2" style={{fontSize:11, marginBottom:10, lineHeight:1.6}}>
        {isUserUpload
          ? '✓ 관리자가 업로드한 이미지가 적용되고 있습니다.'
          : 'ⓘ 업로드된 이미지가 없어 브랜드 fallback SVG 가 사용됩니다. SVG 는 Twitter/Discord 에서만 인식 — Facebook/Kakao 공유 시 미리보기가 비어 보입니다. PNG 업로드 권장.'}
      </p>
      <div className="card" style={{padding:0, overflow:'hidden', maxWidth:520, marginBottom:18}}>
        {imageSrc ? (
          <img src={imageSrc} alt="현재 og:image"
            style={{width:'100%', display:'block', aspectRatio:'1200/630', objectFit:'cover', background:'var(--bg-2)'}}/>
        ) : (
          <div style={{aspectRatio:'1200/630', display:'grid', placeItems:'center', background:'var(--bg-3)', color:'var(--ink-3)', fontSize:13}}>
            og:image 미설정
          </div>
        )}
        <div style={{padding:'12px 14px'}}>
          <div className="mono dim-2" style={{fontSize:9, letterSpacing:'0.18em', marginBottom:4}}>BGNJ.NET</div>
          <div className="ko-serif" style={{fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:4, lineHeight:1.3}}>{title}</div>
          <div className="dim-2" style={{fontSize:12, lineHeight:1.5, color:'var(--ink-2)'}}>{description}</div>
        </div>
      </div>

      <h4 className="ko-serif" style={{fontSize:15, marginBottom:8}}>플랫폼 호환성</h4>
      <div style={{overflowX:'auto', marginBottom:14}}>
        <table style={{width:'100%', minWidth:480, borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr style={{background:'var(--bg-2)', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', color:'var(--ink-3)'}}>
              <th scope="col" style={{padding:10, textAlign:'left'}}>플랫폼</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>SVG dataURI</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>PNG/JPG dataURI</th>
              <th scope="col" style={{padding:10, textAlign:'left'}}>현재 상태</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Twitter / X',     svg: '✓',  png: '✓', current: isSvg ? '✓' : (isUserUpload ? '✓' : '✗') },
              { name: 'Discord',          svg: '✓',  png: '✓', current: isSvg ? '✓' : (isUserUpload ? '✓' : '✗') },
              { name: 'Slack',            svg: '△', png: '✓', current: isUserUpload ? '✓' : '△' },
              { name: 'Facebook',         svg: '✗', png: '✓', current: isSvg ? '✗' : (isUserUpload ? '✓' : '✗') },
              { name: 'KakaoTalk',        svg: '✗', png: '✓', current: isSvg ? '✗' : (isUserUpload ? '✓' : '✗') },
              { name: 'LinkedIn',         svg: '✗', png: '✓', current: isSvg ? '✗' : (isUserUpload ? '✓' : '✗') },
            ].map((p) => (
              <tr key={p.name} style={{borderBottom:'1px solid var(--line)'}}>
                <td style={{padding:10, color:'var(--ink)', fontWeight:500}}>{p.name}</td>
                <td className="mono" style={{padding:10, fontSize:13, color: p.svg === '✓' ? 'var(--success)' : p.svg === '△' ? 'var(--warning)' : 'var(--ink-3)'}}>{p.svg}</td>
                <td className="mono" style={{padding:10, fontSize:13, color: p.png === '✓' ? 'var(--success)' : 'var(--ink-3)'}}>{p.png}</td>
                <td className="mono" style={{padding:10, fontSize:13, color: p.current === '✓' ? 'var(--success)' : p.current === '△' ? 'var(--warning)' : 'var(--danger)', fontWeight:600}}>{p.current}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dim-2" style={{fontSize:11, lineHeight:1.6}}>
        ⓘ <strong>전 플랫폼 커버 권장:</strong> 1200×630 PNG/JPG 를 업로드하면 SVG fallback 을 덮어쓰고 Facebook/Kakao 등에서도 미리보기가 표시됩니다.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

// v00.286 ESM — 모듈 export (window 노출과 병행, 점진 전환).
export { SiteContentAdminPanel };
