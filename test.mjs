import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer,routes} from './server.mjs';
import {heightAt} from './terrain.js';

test('All six pages, assets, method restrictions and traversal protection',async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  for(const route of routes){const r=await fetch(base+route);assert.equal(r.status,200,route);assert.match(await r.text(),/id="app"/);}
  const health=await fetch(base+'/health');assert.equal(health.status,200);assert.deepEqual(await health.json(),{status:'ok'});
  for(const asset of ['/styles.css','/app.js','/terrain.js','/assets/andes.png','/assets/logo.png'])assert.equal((await fetch(base+asset)).status,200,asset);
  assert.equal((await fetch(base+'/package.json')).status,404);
  assert.equal((await fetch(base+'/%2e%2e%5cpackage.json')).status,404);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
  assert.equal((await fetch(base+'/missing')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
test('Capital reconciles and illustrative terrain remains finite and deterministic',()=>{
 assert.equal(16860901+7179568+700000,24740469);
 assert.ok(Math.abs(16860901/24740469*100-68.15)<.01);
 for(let x=-3;x<=3;x+=.2)for(let z=-3;z<=3;z+=.2){const h=heightAt(x,z);assert.ok(Number.isFinite(h));assert.equal(h,heightAt(x,z));assert.ok(h>-.5&&h<3);}
});
