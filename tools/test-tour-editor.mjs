// 운영 API 없이 등록 취소·필수 가격·무료 등록·숙박 일정·사진 보존을 검증한다.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { build } from 'esbuild';
const root = path.resolve(import.meta.dirname, '..');
const result = await build({ stdin: { contents: `import './pages/WangsanamTourPage.jsx'; import './components/ConfirmDialog.jsx'; export { TourAdminPanel } from './pages/admin/AdminEventsPanels.jsx'; export { TPE_ScheduleEditor } from './pages/admin/AdminContentEditors.jsx';`, resolveDir: root, loader: 'jsx' }, bundle: true, write: false, format: 'iife', globalName: 'TourTest', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' });
const code = result.outputFiles[0].text;
const setup = () => {
  window.testCalls = [];
  window.testContent = { tourPages: { existing: { images: [{url:'/poster.jpg'}], photos: [{url:'/photo.jpg'}], templateId: 'keep', schedule: [{t:'1일차 10:00',l:'출발'}], prep:['운동화'] } } };
  window.testTours = [{id:'existing',title:'무주·전주 탐방',startsAt:'2026-10-30T01:00:00Z',duration:'1박 2일',durationMinutes:2040,capacity:22,priceNumber:0}];
  window.BGNJ_TOURS = {
    listAll: () => window.testTours, getTour: id => window.testTours.find(t => t.id === id),
    getSeats: () => ({capacity:22,remaining:22,waitlist:0}), listReservations: () => [], refreshReservations: async () => [],
    saveTour: async p => { window.testCalls.push(p); let t=window.testTours.find(t => t.id===p.id); if(t) Object.assign(t,p); else window.testTours.push(p); return p; }
  };
  window.BGNJ_SITE_CONTENT = {get: () => window.testContent, saveSection: async (k,p) => {window.testContent[k] = {...window.testContent[k],...p};}};
  window.BGNJ_FMT = {won: n => `${n||0}원`, kstDateTime: () => '2026.10.30 10:00'};
  window.BGNJ_TOAST = {success: () => {},error: () => {}};
};
if (process.argv.includes('--serve')) {
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>투어 등록·수정 검토</title><link rel="stylesheet" href="/styles.css"><script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script><script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script><div class="container" style="padding-top:24px;max-width:1000px"><p>로컬 검토 화면 · 운영 데이터에 저장되지 않습니다</p><div id="app"></div><pre id="status"></pre></div><script src="/test.js"></script>`;
  const js = `window.fetch=()=>Promise.reject(new Error('운영 API 차단')); (${setup})(); ${code}\nconst booking=new URLSearchParams(location.search).get('booking'); if(booking){window.testContent.tourPages.existing.bookingUrl=booking==='internal'?'':'https://example.org/apply';} ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(React.Fragment,null, React.createElement(window.ConfirmDialogHost), booking?React.createElement(window.TourBookingPanel,{tour:window.testTours[0],user:booking==='guest'?null:{id:'test'},seats:{remaining:22,waitlist:0},formatPrice:n=>n+'원',onRefresh(){}}):React.createElement(TourTest.TourAdminPanel)));  setInterval(()=>{document.getElementById('status').textContent='모의 저장: '+JSON.stringify(window.testCalls,null,2)},500);`;
  http.createServer((req,res) => {const u = new URL(req.url,'http://localhost'); if(u.pathname==='/test.js'){res.setHeader('Content-Type','application/javascript');res.end(js);} else if(u.pathname==='/styles.css'){res.setHeader('Content-Type','text/css');res.end(fs.readFileSync(path.join(root,'styles.css')));} else {res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);}}).listen(19036,'127.0.0.1',()=>console.log('http://localhost:19036'));
} else {
  let state=[], cursor=0;
  const w = {console, Date, URL, setTimeout, location:{hash:''}, history:{replaceState(){}}, React:{
    createElement:(type,props,...children)=>({type,props:{...props,children}}), Fragment:'fragment', memo: f=>f, useCallback: f=>f,
    useRef: initial => {const i=cursor++;if(!(i in state))state[i]={current:initial};return state[i];},
    useState: initial => {const i=cursor++; if(!(i in state))state[i]=typeof initial==='function'?initial():initial;return [state[i],v=>{state[i]=typeof v==='function'?v(state[i]):v;}];},
    useMemo: f=>f(), useEffect(){}
  }};
  w.window=w; vm.createContext(w); vm.runInContext(`(${setup})(); ${code}`,w);
  w.BGNJ_DRAFT_PROMPT = async () => 'cancel';
  w.useModalGuard = () => ({}); // 이 검사는 저장 경로만 검증한다. 실제 모달 가드는 브라우저에서 실행.
  const render = (fn,props={}) => {cursor=0;return fn(props);};
  const nodes = t => [t,...(t?.props?.children || []).flat(Infinity).flatMap(x=>x&&typeof x==='object'?nodes(x):[])];
  const text = t => (t?.props?.children || []).flat(Infinity).map(x=>typeof x==='object'?text(x):String(x??'')).join('');
  const button = (t,label) => nodes(t).find(n=>n.type==='button'&&text(n)===label);
  let tree=render(w.TourTest.TourAdminPanel);
  await button(tree,'＋ 새 투어 추가').props.onClick(); tree=render(w.TourTest.TourAdminPanel);
  assert.equal(w.testCalls.length,0,'등록창만 열 때 저장 금지');
  nodes(tree).find(n=>n.type===w.TourQuickAddModal).props.onClose();
  assert.equal(w.testCalls.length,0,'등록 취소 시 저장 금지');
  tree=render(w.TourTest.TourAdminPanel);
  await nodes(tree).find(n=>n.type?.name==='EventListRow').props.onOpen();tree=render(w.TourTest.TourAdminPanel);
  await button(tree,'일정·신청 설정 저장').props.onClick();
  assert.equal(w.testContent.tourPages.existing.images[0].url,'/poster.jpg');
  assert.equal(w.testContent.tourPages.existing.photos[0].url,'/photo.jpg');
  assert.equal(w.testContent.tourPages.existing.templateId,'keep');
  const schedule=nodes(tree).find(n=>n.type===w.TourTest.TPE_ScheduleEditor);
  assert.equal(schedule.props.rows[0].t,'1일차 10:00');
  state=[];tree=render(w.TourQuickAddModal,{onClose(){}});
  const title=nodes(tree).find(n=>n.type==='input'&&n.props.placeholder==='예: 창덕궁 후원 답사');
  title.props.onChange({target:{value:'무료 탐방'}});tree=render(w.TourQuickAddModal,{onClose(){}});
  const before=w.testCalls.length;
  await nodes(tree).find(n=>n.type==='form').props.onSubmit({preventDefault(){}});
  assert.equal(w.testCalls.length,before,'가격 미입력은 등록하지 않음');
  tree=render(w.TourQuickAddModal,{onClose(){}});
  nodes(tree).find(n=>n.type==='input'&&n.props.required).props.onChange({target:{value:'0'}});
  let savedId;tree=render(w.TourQuickAddModal,{onClose(){},onSaved:id=>{savedId=id;}});
  await nodes(tree).find(n=>n.type==='form').props.onSubmit({preventDefault(){}});
  assert.equal(w.testCalls.at(-1).priceNumber,0);assert.equal(w.testCalls.at(-1).group,'12명');assert.equal(savedId,w.testCalls.at(-1).id);
  // 비로그인/외부/내부/잘못된 링크 분기와 저장 실패 시 이동 차단.
  const bookingProps = {tour:w.testTours[0],user:null,seats:{remaining:22,waitlist:0},formatPrice:n=>`${n}원`,onRefresh(){}};
  state=[];tree=render(w.TourBookingPanel,bookingProps);
  assert.equal(button(tree,'답사 신청하기').props.disabled,true);
  assert.equal(button(tree,'답사 신청하기').props.style.opacity,0.45);
  w.testContent.tourPages.existing.bookingUrl='https://example.org/apply';
  state=[];tree=render(w.TourBookingPanel,bookingProps);
  assert.equal(nodes(tree).some(n=>n.type==='a'&&n.props.href==='https://example.org/apply'),false);
  state=[];tree=render(w.TourBookingPanel,{...bookingProps,user:{id:'test'}});
  const link=nodes(tree).find(n=>n.type==='a'&&n.props.href==='https://example.org/apply');
  assert.equal(link.props.rel,'noopener noreferrer');
  w.testContent.tourPages.existing.bookingUrl='javascript:alert(1)';
  state=[];tree=render(w.TourBookingPanel,{...bookingProps,user:{id:'test'}});
  assert.equal(button(tree,'답사 신청하기').props.disabled,true);
  assert.throws(()=>w.BGNJ_TOUR_URL('https://user:password@example.org'));
  w.testContent.tourPages.existing.bookingUrl='';
  state=[];tree=render(w.TourBookingPanel,{...bookingProps,user:{id:'test'}});
  assert.equal(button(tree,'답사 신청하기').props.disabled,false);
  let saved=0,discarded=0;state=[];cursor=0;
  let check=w.useUnsavedTourChanges({dirty:true,onSave:async()=>{saved++;return false;},onDiscard:()=>{discarded++;}});
  assert.equal(await check(),false);assert.equal(saved,0);
  w.BGNJ_DRAFT_PROMPT=async()=> 'save';assert.equal(await check(),false);assert.equal(saved,1);
  w.BGNJ_DRAFT_PROMPT=async()=> 'discard';assert.equal(await check(),true);assert.equal(discarded,1);
  state=[];cursor=0;check=w.useUnsavedTourChanges({dirty:false,onSave:async()=>false});
  w.BGNJ_DRAFT_PROMPT=()=>{throw new Error('保存済みなのに確認');};assert.equal(await check(),true);
  console.log('투어 편집 회귀 검사 통과: 임시 등록 방지·가격 명시·무료 등록·일정/사진 보존·등록 ID 전달');
}
