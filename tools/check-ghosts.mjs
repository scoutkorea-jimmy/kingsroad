#!/usr/bin/env node
// 뱅기노자 — 없는 함수를 부르는 곳 검사 (v00.310.000)
//
// 왜 필요한가:
//   `window.BGNJ_AUTH?.currentUser?.()` — 그런 함수는 **존재한 적이 없다.**
//   옵셔널 체이닝이 오타를 오류가 아니라 '값 없음' 으로 바꾸는 바람에
//   page_views 1,789건 전부 user_id 가 빈 채로 쌓였고, 홈넥스트 화면은
//   관리자에게도 편집 버튼을 띄운 적이 없었다. 넉 달간 아무도 몰랐다.
//   같은 자리에서 `BGNJ_BOOK_ORDERS?.refreshBankAccount?.()` 도 나왔다(주인은 BGNJ_LECTURES).
//
//   글자만 보는 검사로는 못 잡는다. data.js·api.js 를 **실제로 실행**해 전역을 만들고,
//   부르는 이름이 거기 있는지 대조한다.
//
// 한계: 번들 밖에서 정의되는 전역(컴포넌트 등)은 판단하지 않고 건너뛴다.
//       그쪽은 tools/check-globals.mjs 가 번들 경계까지 함께 본다.
//
// 실행: node tools/check-ghosts.mjs
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const ROOT = process.cwd();
const walk = (d, out=[]) => {
  for (const f of readdirSync(d)) {
    if (f === 'node_modules' || f === 'dist' || f.startsWith('.')) continue;
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(f)) out.push(p);
  }
  return out;
};
// data.js 를 실제로 실행해 전역을 얻는다
const sb = { console:{log(){},warn(){},error(){},info(){}}, JSON,Math,Date,Array,Object,String,Number,Boolean,RegExp,Error,Promise,Map,Set,WeakMap,isNaN,parseInt,parseFloat,encodeURIComponent,decodeURIComponent,setTimeout,clearTimeout,setInterval,clearInterval,TextEncoder,TextDecoder,crypto,
  localStorage:{getItem:()=>null,setItem(){},removeItem(){},key:()=>null,length:0},
  sessionStorage:{getItem:()=>null,setItem(){},removeItem(){}},
  document:{createElement:()=>({style:{},dataset:{},setAttribute(){},classList:{add(){},remove(){},contains:()=>false},appendChild(){},addEventListener(){}}),documentElement:{style:{},classList:{add(){},remove(){},contains:()=>false},setAttribute(){}},body:{},head:{},addEventListener(){},querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null,cookie:''},
  navigator:{userAgent:'node',language:'ko-KR'},
  location:{href:'https://bgnj.net/',origin:'https://bgnj.net',pathname:'/',search:'',hash:''},
  fetch:async()=>({ok:true,status:200,json:async()=>({}),text:async()=>'{}'}),
  CustomEvent:function(t,o){this.type=t;this.detail=o&&o.detail;}, Event:function(t){this.type=t;},
  DOMParser:function(){this.parseFromString=()=>({getElementById:()=>null,body:{innerHTML:''}});},
  matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
  requestAnimationFrame:(f)=>setTimeout(f,0), dispatchEvent:()=>true, addEventListener(){}, removeEventListener(){},
};
sb.window = sb; sb.globalThis = sb; sb.self = sb;
vm.createContext(sb);
vm.runInContext(readFileSync(path.join(ROOT,'data.js'),'utf8'), sb, {filename:'data.js'});
vm.runInContext(readFileSync(path.join(ROOT,'api.js'),'utf8'), sb, {filename:'api.js'});

const known = Object.keys(sb).filter((k) => k.startsWith('BGNJ_'));
const re = /window\.(BGNJ_[A-Z_]+)\??\.([A-Za-z_$][\w$]*)\??\.?\(/g;
const ghosts = [];
for (const f of walk(ROOT)) {
  const src = readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(src))) {
    const [, obj, meth] = m;
    if (!known.includes(obj)) continue;               // 번들 밖 전역은 판단 불가 — 건너뛴다
    const target = sb[obj];
    if (target && typeof target === 'object' && !(meth in target)) {
      const line = src.slice(0, m.index).split('\n').length;
      ghosts.push(`${path.relative(ROOT,f)}:${line}  window.${obj}.${meth}()`);
    }
  }
}
if (!ghosts.length) {
  console.log(`✅ 없는 함수를 부르는 곳 0건 (전역 ${known.length}개 대조).`);
  process.exit(0);
}
console.log(`⚠ 없는 함수를 부르는 곳 ${ghosts.length}건 — 오류 없이 조용히 건너뛴다:\n`);
ghosts.forEach((g) => console.log('  •', g));
console.log(`\n고치는 법: 진짜 이름을 확인해 고친다. 옵셔널 체이닝은 오타를 감춘다.`);
process.exit(1);
