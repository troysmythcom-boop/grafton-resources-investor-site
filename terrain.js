// Synthetic geology: deliberately separate from any project survey or resource model.
export function heightAt(x,z){
  const ridge=Math.exp(-Math.pow(z*.65+Math.sin(x*1.15)*.6,2)*1.5)*(1.2+.38*Math.sin(x*2.2));
  const peak=.7*Math.exp(-((x-.9)**2+(z+.5)**2)*1.8);
  return .12+ridge+peak+.13*Math.sin(x*5+z*2)*Math.cos(z*4-x)*Math.exp(-(x*x+z*z)*.09);
}
export function initTerrain(canvas){
  const context=canvas.getContext('2d');if(!context)return;
  const panel=canvas.closest('.terrain-panel');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let yaw=-.45,pitch=.72,zoom=1,mode='surface',width=0,height=0,drag=null,visible=false,frame=0;
  const count=42,extent=2.9;
  const grid=Array.from({length:count+1},(_,i)=>Array.from({length:count+1},(_,j)=>{const x=(i/count*2-1)*extent,z=(j/count*2-1)*extent;return[x,heightAt(x,z),z];}));
  function project([x,y,z]){const xx=x*Math.cos(yaw)-z*Math.sin(yaw),zz=x*Math.sin(yaw)+z*Math.cos(yaw);const yy=y*Math.cos(pitch)+zz*Math.sin(pitch),depth=-y*Math.sin(pitch)+zz*Math.cos(pitch);const s=Math.min(width/9.8,height/6.6)*zoom*(12/(12+depth));return[width*.48+xx*s,height*.52-yy*s,depth];}
  function polygon(points,fill,stroke){context.beginPath();points.forEach((p,i)=>i?context.lineTo(p[0],p[1]):context.moveTo(p[0],p[1]));context.closePath();context.fillStyle=fill;context.fill();if(stroke){context.strokeStyle=stroke;context.lineWidth=.45;context.stroke();}}
  function draw(){
    frame=0;if(!width||!height)return;context.clearRect(0,0,width,height);
    context.strokeStyle='#80a6b314';context.lineWidth=.6;
    for(let i=-6;i<=6;i++){const a=project([i,-.75,-5]),b=project([i,-.75,5]),c=project([-5,-.75,i]),d=project([5,-.75,i]);context.beginPath();context.moveTo(...a.slice(0,2));context.lineTo(...b.slice(0,2));context.moveTo(...c.slice(0,2));context.lineTo(...d.slice(0,2));context.stroke();}
    const faces=[];
    // Visible block sides carry stratigraphic bands; all coordinates are synthetic.
    const edges=[grid[0],grid[count],[...grid.map(r=>r[0])],[...grid.map(r=>r[count])]];
    edges.forEach((edge,e)=>{for(let i=0;i<count;i++){const a=edge[i],b=edge[i+1];for(let k=0;k<4;k++){const top=k===0?a[1]:-.15-(k-1)*.18,topB=k===0?b[1]:top,low=-.15-k*.18;const pts=[project([a[0],top,a[2]]),project([b[0],topB,b[2]]),project([b[0],low,b[2]]),project([a[0],low,a[2]])];faces.push({pts,depth:pts.reduce((s,p)=>s+p[2],0)/4,fill:['#786a53','#647072','#786c57','#4a6066'][k],stroke:'#9dafad25'});}}});
    for(let i=0;i<count;i++){for(let j=0;j<count;j++){
      if(mode==='section'&&j>count*.57&&i>count*.2&&i<count*.78)continue;
      const vertices=[grid[i][j],grid[i+1][j],grid[i+1][j+1],grid[i][j+1]];
      for(const tri of [[0,1,2],[0,2,3]]){const original=tri.map(k=>vertices[k]);const pts=original.map(project);const elevation=original.reduce((s,p)=>s+p[1],0)/3;const cx=original.reduce((s,p)=>s+p[0],0)/3,cz=original.reduce((s,p)=>s+p[2],0)/3;const slope=(heightAt(cx+.05,cz)-heightAt(cx-.05,cz))*8;const light=Math.max(22,Math.min(65,35+elevation*10+slope*16));faces.push({pts,depth:pts.reduce((s,p)=>s+p[2],0)/3,fill:mode==='wire'?'#143440':`hsl(${32+elevation*4} ${17+elevation*5}% ${light}%)`,stroke:mode==='wire'?'#79a3ad99':'#e2d3b015'});}
    }}
    if(mode==='section'){
      for(let i=9;i<33;i++){const x=(i/count*2-1)*extent,z=(24/count*2-1)*extent;const pts=[project([x,heightAt(x,z),z]),project([x+extent*2/count,heightAt(x+extent*2/count,z),z]),project([x+extent*2/count,-.65,z]),project([x,-.65,z])];faces.push({pts,depth:pts.reduce((s,p)=>s+p[2],0)/4,fill:i>17&&i<28?'#bf9354':'#6a7976',stroke:'#c9b88233'});}
    }
    faces.sort((a,b)=>b.depth-a.depth).forEach(f=>polygon(f.pts,f.fill,f.stroke));
    const pin=project([.1,heightAt(.1,.1)+.02,.1]);context.strokeStyle='#e0c38b';context.lineWidth=1;context.beginPath();context.arc(pin[0],pin[1],5,0,Math.PI*2);context.moveTo(pin[0],pin[1]-6);context.lineTo(pin[0],pin[1]-34);context.stroke();context.fillStyle='#ead8b1';context.font='9px "Raleway",sans-serif';context.fillText(mode==='section'?'CONCEPTUAL SYSTEM':'SURFACE EXPRESSION',pin[0]+8,pin[1]-29);
  }
  function requestDraw(){if(!frame)frame=requestAnimationFrame(draw);}
  const resize=new ResizeObserver(()=>{const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;context.setTransform(dpr,0,0,dpr,0,0);requestDraw();});resize.observe(canvas);
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.008;pitch=Math.max(.25,Math.min(1.2,pitch+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY};requestDraw();});
  const end=()=>{drag=null;};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
  // Horizontal touch gestures rotate while vertical gestures preserve page scrolling.
  let touch=null;canvas.addEventListener('touchstart',e=>{touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  canvas.addEventListener('touchmove',e=>{if(!touch||e.touches.length!==1)return;const t=e.touches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;if(Math.abs(dx)>Math.abs(dy)){yaw+=dx*.01;requestDraw();}touch={x:t.clientX,y:t.clientY};},{passive:true});canvas.addEventListener('touchend',()=>touch=null,{passive:true});
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','0'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=.12;if(e.key==='ArrowRight')yaw+=.12;if(e.key==='ArrowUp')pitch=Math.min(1.2,pitch+.08);if(e.key==='ArrowDown')pitch=Math.max(.25,pitch-.08);if(e.key==='+'||e.key==='=')zoom=Math.min(1.6,zoom+.1);if(e.key==='-')zoom=Math.max(.6,zoom-.1);if(e.key==='0'){zoom=1;yaw=-.45;pitch=.72;}requestDraw();});
  panel.querySelectorAll('[data-model-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.modelMode;panel.querySelectorAll('[data-model-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));requestDraw();}));
  panel.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.zoom==='reset'){zoom=1;yaw=-.45;pitch=.72;}else zoom=Math.max(.6,Math.min(1.6,zoom+(b.dataset.zoom==='in'?.12:-.12)));requestDraw();}));
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();}).observe(canvas);
  if(!reduce)addEventListener('scroll',()=>{if(visible&&!drag){const r=canvas.getBoundingClientRect();yaw=-.45+(innerHeight*.5-r.top)/innerHeight*.35;requestDraw();}},{passive:true});
}
