import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('production server serves pages, approved sources, grounded answers and honest disconnected forms',async()=>{
 const child=spawn(process.execPath,['server.mjs','--production'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'5197',OPENAI_API_KEY:'',SUBSCRIBE_WEBHOOK_URL:''},stdio:['ignore','pipe','pipe']});
 try{await Promise.race([once(child.stdout,'data'),new Promise((_,reject)=>{const timer=setTimeout(()=>reject(Error('Server startup timed out')),8000);timer.unref();})]);
 const base='http://127.0.0.1:5197';
 assert.equal((await fetch(base)).status,200);
 for(const route of ['/company','/company/management','/company/directory','/company/governance','/projects','/projects/alaska','/projects/poseidon','/projects/jabali','/projects/caldera','/geology','/investors','/investors/stock','/investors/share-structure','/investors/presentations','/news','/contact','/privacy','/disclaimer']){const r=await fetch(base+route);assert.equal(r.status,200,route);assert.match(await r.text(),/<div id="root">/);}
 const logo=await fetch(base+'/grafton-logo.png');assert.equal(logo.status,200);assert.equal(logo.headers.get('content-type'),'image/png');
 for(const id of ['about','team','directory','governance','stock','shares','presentations','news','privacy','disclaimer']){const r=await fetch(base+'/api/company/'+id);assert.equal(r.status,200,id);const d=await r.json();assert.ok(d.url.startsWith('https://www.graftonresources.com/'));assert.ok(Array.isArray(d.blocks));}
 const post=(endpoint,body)=>fetch(base+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const answer=await (await post('/api/chat',{question:'Who is on the management team?',lang:'en'})).json();assert.match(answer.answer,/Campbell/i);assert.ok(answer.sources.length);assert.match(answer.answer,/CFO and Corporate Secretary/);assert.match(answer.answer,/appointed a director in March 2026/);
 const unknown=await (await post('/api/chat',{question:'What is the weather?',lang:'zh'})).json();assert.equal(unknown.sources.length,0);assert.match(unknown.answer,/公司/);
 assert.equal((await post('/api/chat',{question:''})).status,400);
 assert.equal((await post('/api/subscribe',{email:'investor@example.com',consent:true})).status,503);
 assert.equal((await fetch(base+'/api/company/not-allowed')).status,404);
 }finally{child.kill();await once(child,'exit');}
});
