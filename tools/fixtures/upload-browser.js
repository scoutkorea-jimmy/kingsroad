(async()=>{
 const results=[];
 const check=(label,ok,detail='')=>{results.push({label,ok:!!ok,detail});document.getElementById('results').textContent=results.map(x=>`${x.ok?'PASS':'FAIL'} ${x.label}${x.detail?' — '+x.detail:''}`).join('\n');};
 window.BGNJ_TOAST={info(){},error(message){results.push({label:'expected error notice',ok:true,detail:message});}};
 window.BGNJ_CONFIRM=async()=>true;
 try{
 const S=window.BGNJ_IMAGE_SHRINK;
 const source=await(await fetch('/fixture.heic')).blob();
 const raw=new File([source],'phone.HEIC',{type:''});
 check('빈 MIME의 HEIC 인식',S.isImageFile(raw)&&S.isHeicFile(raw));
 check('선택 전 변환기 미로드',!window.BGNJ_HEIC_DECODER);
 const jpeg=await S.prepareFile(raw);
 const bytes=new Uint8Array(await jpeg.slice(0,3).arrayBuffer());
 check('실제 JPG 생성',jpeg.name==='phone.jpg'&&jpeg.type==='image/jpeg'&&bytes[0]===255&&bytes[1]===216,`${jpeg.size} bytes`);
 const image=new Image();image.src=URL.createObjectURL(jpeg);await image.decode();
 check('JPG가 정상 표시됨',image.naturalWidth>0&&image.naturalHeight>0,`${image.naturalWidth} × ${image.naturalHeight}`);
 document.getElementById('preview').appendChild(image);image.style.maxWidth='400px';
 check('동일 파일 중복 변환 없음',(await S.prepareFile(raw))===jpeg);
 const uploaded=await window.BGNJ_MEDIA.uploadFile(raw,{folder:'post-images'});
 check('실제 업로드 FormData가 JPG',uploaded.received.name==='phone.jpg'&&uploaded.received.type==='image/jpeg');
 let prompts=0;window.BGNJ_CONFIRM=async()=>{prompts++;return false;};
 const padded=new File([jpeg,new Uint8Array(2*1024*1024)],'large.png',{type:'image/png'});
 const resized=await S.maybeShrinkOne(padded,{limitBytes:1024*1024});
 check('한도 초과 사진 자동 축소',resized&&resized.size<=1024*1024&&prompts===0,`${padded.size} → ${resized?.size} bytes`);
 const disguised=new File([jpeg],'browser.HEIC',{type:'image/heic'});
 const already=await S.prepareFile(disguised);
 check('선택기가 이미 바꾼 JPG 재사용',already.name==='browser.jpg'&&already.size===jpeg.size);
 const broken=new File(['invalid'],'broken.heic',{type:'image/heic'});
 const heif=new File([source],'valid.heif',{type:'image/heif'});
 const batch=await S.maybeShrinkAll([broken,heif],{limitBytes:10*1024*1024});
 check('손상 파일 뒤 정상 사진 처리',batch.cancelled.length===1&&batch.files.length===1&&batch.files[0].name==='valid.jpg');
 const iconCanvas=document.createElement('canvas');iconCanvas.width=8;iconCanvas.height=8;
 iconCanvas.getContext('2d').fillRect(0,0,8,8);
 const png=await new Promise(resolve=>iconCanvas.toBlob(resolve,'image/png'));
 const header=new ArrayBuffer(22),view=new DataView(header);view.setUint16(2,1,true);view.setUint16(4,1,true);view.setUint8(6,8);view.setUint8(7,8);view.setUint16(10,1,true);view.setUint16(12,32,true);view.setUint32(14,png.size,true);view.setUint32(18,22,true);
 const icon=await S.prepareFile(new File([header,png],'favicon.ico',{type:'image/x-icon'}));
 const iconBytes=new Uint8Array(await icon.slice(0,2).arrayBuffer());
 check('기존 ICO 파비콘은 투명 PNG로 업로드 가능',icon.name==='favicon.png'&&icon.type==='image/png'&&iconBytes[0]===137&&iconBytes[1]===80);
 const doc=new File(['test'],'note.pdf',{type:'application/pdf'});
 check('문서 파일 원본 보존',(await S.prepareFile(doc))===doc);
 let rejected=false;try{await window.BGNJ_MEDIA.uploadFile(new File(['test'],'code.exe'));}catch{rejected=true;}
 check('지원하지 않는 파일 사전 차단',rejected);
 localStorage.setItem('bgnj_session_token','test-token');
 let denied=false;try{await window.BGNJ_MEDIA.uploadFile(new File([jpeg],'denied.jpg',{type:'image/jpeg'}));}catch(e){denied=e.status===401;}
 check('인증 만료 업로드 성공 처리 없음',denied);
 check('만료 토큰 제거',!localStorage.getItem('bgnj_session_token'));
 const smallLimit=await S.maybeShrinkAll([new File([new Uint8Array(1500)],'small.gif',{type:'image/gif'})],{limitBytes:1000,askOverBytes:2*1024*1024});
 check('2MB 미만도 슬롯 용량 제한 적용',smallLimit.files.length===0&&smallLimit.cancelled.length===1);
 }catch(e){check('unexpected failure',false,e.stack||String(e));}
 await fetch('/results',{method:'POST',body:JSON.stringify({results,passed:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length})});
 document.title=results.some(x=>!x.ok)?'HEIC 검증 실패':'HEIC 검증 통과';
})();
