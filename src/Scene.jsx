import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {useReducedMotion} from 'motion/react';

export function MountainOutline({variant=0}){return <svg className="mountain-outline" viewBox="0 0 800 400" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1">{Array.from({length:19},(_,i)=><path key={i} opacity={.15+i*.035} d={`M -30 ${345+i*4} L ${105+variant*12+i*3} ${255+i*5} L ${230-i*2} ${150+i*5} L ${310+i*2} ${205+i*4} L ${440-i*3} ${58+i*7} L ${560+i*3} ${230+i*4} L ${640-i*2} ${150+i*6} L 830 ${350+i*4}`}/>)}<path d="M440 58 425 144 448 161 426 208 455 238 435 301 467 400M230 150 247 222 224 244 266 308 250 400M640 150 608 230 635 273 608 320 640 400"/></g></svg>}

export default function Scene({kind='terrain',active=0,reset=0,paused=false,label,onSelect,t=(a)=>a}){
 const labels=useRef([]);const host=useRef(null),objects=useRef(null),control=useRef(null);const reduced=useReducedMotion();const [failed,setFailed]=useState(false);
 useEffect(()=>{let renderer,frame,controls,visible=true,disposed=false;const el=host.current;if(!el)return;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(kind==='terrain'?38:36,1,.1,100);const group=new THREE.Group();scene.add(group);
  const meshes=[],flows=[],anchors=[];
  try{
   renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
   scene.add(new THREE.AmbientLight(0xddf0f7,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(4,6,5);scene.add(light);
   const grid=new THREE.GridHelper(18,30,0x86b3d7,0x86b3d7);grid.material.transparent=true;grid.material.opacity=.12;grid.position.y=kind==='terrain'?-.3:-2.2;group.add(grid);
   if(kind==='terrain'){
    const geo=new THREE.PlaneGeometry(18,11,95,64);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let h=0;for(const [px,pz,peak,width] of [[-4,-1,3.8,2.1],[0,-1.7,5.3,2.5],[3.2,0,3.4,2],[-.5,2.5,1.8,2]]){const d=Math.hypot(x-px,z-pz);h=Math.max(h,peak*Math.pow(Math.max(0,1-d/(width*2.1)),1.7));}h+=(Math.sin(x*4+z*3)+Math.sin(z*7-x*2.4))*.16*Math.min(1,h)+Math.abs(Math.sin(x*2-z))*h*.09;pos.setY(i,h-.5);}geo.computeVertexNormals();
    group.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x1f477d,transparent:true,opacity:.4,side:THREE.DoubleSide})));
    const wire=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0xddf0f7,wireframe:true,transparent:true,opacity:.27}));group.add(wire);group.rotation.y=-.18;camera.position.set(10,7.2,13);camera.lookAt(0,1,0);
    const marker=new THREE.Mesh(new THREE.RingGeometry(.18,.21,40),new THREE.MeshBasicMaterial({color:0xddf0f7,side:THREE.DoubleSide}));marker.rotation.x=-Math.PI/2;marker.position.set(2,.1,2);group.add(marker);
   }else{
    camera.position.set(5,3.1,8.5);
    const colors=[0xa9d4e8,0x709cc3,0x4777a3,0x264f7c];
    for(let i=0;i<4;i++){
     const geometry=new THREE.BoxGeometry(5.6,.72,2.6);
     const rock=new THREE.Mesh(geometry,new THREE.MeshPhongMaterial({color:colors[i],transparent:true,opacity:.2,depthWrite:false}));
     rock.position.set(0,.69-i*.73,-.3);group.add(rock);meshes.push(rock);
     const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0xddf0f7,transparent:true,opacity:.24}));edge.position.copy(rock.position);group.add(edge);
    }
    const surface=new THREE.Group(),veins=new THREE.Group(),blind=new THREE.Group(),heatGroup=new THREE.Group();
    group.add(surface,veins,blind,heatGroup);
    const cone=new THREE.Mesh(new THREE.ConeGeometry(.85,1.05,32,8,true),new THREE.MeshPhongMaterial({color:0xddf0f7,wireframe:true,transparent:true,opacity:.6}));
    cone.position.set(-1.65,1.575,-.75);surface.add(cone);
    const heat=new THREE.Mesh(new THREE.SphereGeometry(1,40,24),new THREE.MeshPhongMaterial({color:0xc9a44c,emissive:0x634817,transparent:true,opacity:.95}));
    heat.scale.set(1.45,.42,.85);heat.position.set(-.6,-2,0);heatGroup.add(heat);
    function path(points,color,radius,parent,flow=false){
     const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
     const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,64,radius,8,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95}));parent.add(tube);
     if(flow)for(let i=0;i<6;i++){const bead=new THREE.Mesh(new THREE.SphereGeometry(.048,8,8),new THREE.MeshBasicMaterial({color:0xffffff}));parent.add(bead);flows.push({bead,curve,offset:i/6});}
     return curve;
    }
    // Connected schematic: meteoric recharge circulates above the intrusion;
    // the upflow conduit branches into mineralised fractures and reaches the spring.
    path([[-2.45,1.06,1.04],[-2.25,.1,1.06],[-1.8,-1.05,1.06],[-.6,-1.55,1.06],[.15,-1.15,1.06]],0x0d94c4,.025,heatGroup,true);
    path([[.15,-1.15,1.06],[.45,-.55,1.06],[.62,.1,1.06],[.92,.65,1.06],[1.35,1.06,1.06]],0xc9a44c,.035,veins,true);
    for(const [x,y] of [[-.9,.45],[-.3,.75],[1.55,.7]]){
     path([[.45,-.55,1.06],[x*.55,-.08,1.06],[x,y,1.06]],0xc9a44c,.048,veins);
    }
    path([[.45,-.55,1.06],[1.15,-.65,1.06],[1.9,-.1,1.06],[2.1,.42,1.06]],0xc9a44c,.04,blind);
    const spring=new THREE.Mesh(new THREE.TorusGeometry(.24,.035,8,36),new THREE.MeshBasicMaterial({color:0xddf0f7}));spring.rotation.x=Math.PI/2;spring.position.set(1.35,1.065,1.06);surface.add(spring);
    for(let i=0;i<3;i++)path([[1.2+i*.15,1.08,1.06],[1.15+i*.15,1.32,1.06],[1.23+i*.15,1.53,1.06]],0xddf0f7,.012,surface);
    anchors.push(new THREE.Vector3(1.35,1.54,1.06),new THREE.Vector3(-.65,.43,1.06),new THREE.Vector3(2.1,.42,1.06),new THREE.Vector3(-.6,-2,0));
    objects.current={layers:meshes,parts:[[surface],[veins],[blind],[heatGroup]]};
    controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=8;controls.maxDistance=19;controls.minPolarAngle=.65;controls.maxPolarAngle=Math.PI*.52;controls.target.set(0,-.15,0);controls.autoRotate=false;controls.update();controls.saveState();control.current=controls;
   }
   const resize=()=>{const r=el.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/Math.max(r.height,1);if(kind!=='terrain')camera.fov=r.width<450?49:36;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});observer.observe(el);
   const render=()=>{if(disposed)return;frame=requestAnimationFrame(render);if(!visible||document.hidden)return;if(kind==='terrain'&&!reduced&&!paused){group.rotation.y=-.18+Math.sin(performance.now()*.00008)*.12;}controls?.update();if(!reduced&&!paused)for(const f of flows)f.bead.position.copy(f.curve.getPoint((performance.now()*.00007+f.offset)%1));for(let i=0;i<anchors.length;i++){const p=anchors[i].clone().project(camera),label=labels.current[i];if(label){label.style.left=((p.x+1)*50)+'%';label.style.top=((-p.y+1)*50)+'%';}}renderer.render(scene,camera);};render();
   return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();observer.disconnect();controls?.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});renderer.dispose();renderer.domElement.remove();objects.current=null;control.current=null;};
  }catch{setFailed(true);renderer?.dispose();}
 },[kind,reduced,paused]);
 useEffect(()=>{const o=objects.current;if(!o)return;o.layers.forEach(m=>{m.material.opacity=active===0?.2:.09});o.parts.forEach((parts,i)=>parts.forEach(part=>part.traverse(m=>{if(m.material){m.material.transparent=true;m.material.opacity=active===0||active===i+1?1:.35;}})));},[active,paused,reduced]);
 useEffect(()=>{if(reset)control.current?.reset()},[reset]);
 return <div className={`scene scene-${kind}`} ref={host} role={kind==='terrain'?'img':'group'} aria-label={label}>{failed&&<svg viewBox="0 0 600 420" className="system-fallback" role="img" aria-label={label}><path d="M40 100h520M40 180h520M40 260h520M40 340h520" stroke="#ddf0f7" opacity=".4"/><ellipse cx="250" cy="350" rx="100" ry="28" fill="#c9a44c"/><path d="M80 100Q70 315 250 310Q300 280 315 220L400 100M315 220L220 140M315 220L420 250L490 165" fill="none" stroke="#c9a44c" strokeWidth="5"/><text x="70" y="80" fill="#ddf0f7">{t('Surface','Superficie','地表')}</text><text x="180" y="400" fill="#ddf0f7">{t('Heat source','Fuente de calor','热源')}</text></svg>}{kind!=='terrain'&&!failed&&<div className="model-annotations">{[t('Hot spring','Fuente termal','温泉'),t('Quartz + gold','Cuarzo + oro','石英与金'),t('Blind vein','Veta oculta','隐伏矿脉'),t('Intrusive heat','Calor intrusivo','侵入体热源')].map((name,i)=><button ref={el=>labels.current[i]=el} key={name} className={active===i+1?'active':''} onClick={()=>onSelect?.(i+1)}><i>{i+1}</i><span>{name}</span></button>)}</div>}</div>;
}
