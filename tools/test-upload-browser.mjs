// 운영 API를 사용하지 않는 localhost 전용 실제 브라우저 검증 서버.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const dir=process.env.BGNJ_TEST_OUTPUT || '/tmp/kingsroad-validation';
fs.mkdirSync(dir,{recursive:true});
const fixture=process.env.HEIC_FIXTURE || path.join(dir,'example.heic');
if(!fs.existsSync(fixture)) throw new Error('HEIC_FIXTURE에 테스트 사진 경로를 지정하세요. README 참고.');
let uploads=0;
const html=`<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; worker-src 'self'; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'"><title>HEIC 업로드 검증</title><h1>HEIC 업로드 검증</h1><p>운영 데이터는 사용하지 않습니다.</p><pre id="results">검증 중...</pre><div id="preview"></div><script src="/api.js"></script><script src="/data.js"></script><script src="/components/ImageShrink.jsx"></script><script src="/dist/app.js?v=test"></script><script src="/test.js"></script>`;
http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(req.method==='POST') {
  const parts=[]; for await(const b of req) parts.push(b);
  const body=Buffer.concat(parts);
  if(u.pathname==='/results') {fs.writeFileSync(`${dir}/results.json`,body);res.end('{}'); return;}
  if(u.pathname==='/api/media/upload') {
   uploads++;
   const text=body.toString('latin1');
   const name=/filename="([^"]+)"/.exec(text)?.[1]||'';
   const type=/Content-Type: ([^\r\n]+)/i.exec(text)?.[1]||'';
   fs.appendFileSync(`${dir}/upload-records.jsonl`,JSON.stringify({name,type,bytes:body.length})+'\n');
   if(name.startsWith('denied')) {res.writeHead(401,{'Content-Type':'application/json'}); res.end('{"error":"로그인이 필요합니다."}'); return;}
   res.setHeader('Content-Type','application/json');res.end(JSON.stringify({url:'/test.jpg',key:'test/'+name,uploads,received:{name,type}}));return;
  }
 }
 if(u.pathname==='/') {res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);return;}
 if(u.pathname==='/dist/app.js' && u.searchParams.get('v')==='test') {res.setHeader('Content-Type','application/javascript');res.end('// app marker for lazy loader');return;}
 if(u.pathname.includes('..')) {res.writeHead(400);res.end();return;}
 const filename=u.pathname==='/fixture.heic'?fixture:u.pathname==='/test.js'?path.join(root,'tools/fixtures/upload-browser.js'):path.join(root,u.pathname);
 if(!fs.existsSync(filename)) {res.writeHead(404);res.end('Not found');return;}
 let data=fs.readFileSync(filename);
 if(u.pathname==='/api.js') data=Buffer.from(data.toString().replace('https://api.bgnj.net/api','http://localhost:19035/api'));
 res.setHeader('Content-Type',filename.endsWith('.html')?'text/html; charset=utf-8':/\.(js|jsx)$/.test(filename)?'application/javascript':filename.endsWith('.heic')?'image/heic':'application/octet-stream');res.end(data);
}).listen(19035,'127.0.0.1',()=>console.log('validation server http://localhost:19035'));
