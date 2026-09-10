import test from 'node:test';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {load} from 'cheerio';
import {mapData} from '../src/map-data.js';
import {projectNames,sources} from '../src/content.js';
test('portfolio map and presentation capital are consistent',()=>{
 assert.deepEqual(projectNames,['Poseidon','Jabalí','Caldera']);
 const svg=gunzipSync(Buffer.from(mapData,'base64')).toString();
 assert.doesNotMatch(svg,/alaska/i);
 const d=load(svg,{xmlMode:true});
 assert.equal(d('#project circle').length,4);
 assert.equal(d('#project_x0020_text text').filter((i,e)=>d(e).text()==='JABAL').attr('transform'),'translate(-2600 0)');
 const shares=sources.find(s=>s.id==='shares').text;
 for(const n of ['24,408,856','5,282,368','1,735,000','31,426,224','C$5.2 million'])assert.ok(shares.includes(n));
 assert.equal(24408856+5282368+1735000,31426224);
});
