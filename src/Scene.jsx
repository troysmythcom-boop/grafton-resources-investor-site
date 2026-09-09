import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {useReducedMotion} from 'motion/react';

export function MountainOutline({variant=0}){return <svg className="mountain-outline" viewBox="0 0 800 400" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1">{Array.from({length:19},(_,i)=><path key={i} opacity={.15+i*.035} d={`M -30 ${345+i*4} L ${105+variant*12+i*3} ${255+i*5} L ${230-i*2} ${150+i*5} L ${310+i*2} ${205+i*4} L ${440-i*3} ${58+i*7} L ${560+i*3} ${230+i*4} L ${640-i*2} ${150+i*6} L 830 ${350+i*4}`}/>)}<path d="M440 58 425 144 448 161 426 208 455 238 435 301 467 400M230 150 247 222 224 244 266 308 250 400M640 150 608 230 635 273 608 320 640 400"/></g></svg>}

export default function Scene({kind='terrain',active=0,reset=0,paused=false,label}){
 const host=useRef(null),objects=useRef(null),control=useRef(null);const reduced=useReducedMotion();const [failed,setFailed]=useState(false);
 useEffect(()=>{let renderer,frame,controls,visible=true,disposed=false;const el=host.current;if(!el)return;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(kind==='terrain'?38:36,1,.1,100);const group=new THREE.Group();scene.add(group);
  const meshes=[];
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
    camera.position.set(8,5.5,10);
    const colors=[0xa9d4e8,0x709cc3,0x4777a3,0x264f7c];
    for(let i=0;i<4;i++){const geometry=new THREE.BoxGeometry(5.6,.72,4.2);const mat=new THREE.MeshPhongMaterial({color:colors[i],transparent:true,opacity:.63,side:THREE.DoubleSide});const layer=new THREE.Mesh(geometry,mat);layer.position.y=.7-i*.73;group.add(layer);meshes.push(layer);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0xddf0f7,transparent:true,opacity:.45}));edge.position.copy(layer.position);group.add(edge);}
    const volcano=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.5,40,10,true),new THREE.MeshPhongMaterial({color:0xb7dceb,wireframe:true,transparent:true,opacity:.7}));volcano.position.set(-1,1.8,-.5);group.add(volcano);
    const heat=new THREE.Mesh(new THREE.SphereGeometry(1.15,32,20),new THREE.MeshPhongMaterial({color:0xc9a44c,emissive:0x634817,transparent:true,opacity:.9}));heat.scale.set(1.5,.45,1);heat.position.set(-.3,-2,0);group.add(heat);
    const veins=new THREE.Group();for(let n=0;n<7;n++){const x=(n-3)*.47;const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.2,-1.9,1.1),new THREE.Vector3(x*.5,-.7,1.4),new THREE.Vector3(x,.1,1.65),new THREE.Vector3(x+(n%2?-.2:.2),1.13,1.3)]);veins.add(new THREE.Mesh(new THREE.TubeGeometry(curve,35,.025+(n%3)*.009,6,false),new THREE.MeshBasicMaterial({color:n%2?0xf1deb0:0xffffff})));}group.add(veins);
    const blind=new THREE.Mesh(new THREE.CylinderGeometry(.04,.065,1.8,8),new THREE.MeshBasicMaterial({color:0xddf0f7}));blind.position.set(2,-.1,1.5);blind.rotation.z=.25;group.add(blind);
    const spring=new THREE.Mesh(new THREE.TorusGeometry(.32,.045,8,32),new THREE.MeshBasicMaterial({color:0xffffff}));spring.rotation.x=Math.PI/2;spring.position.set(.9,1.09,.2);group.add(spring);
    objects.current={layers:meshes,parts:[[volcano,spring],[veins],[blind],[heat]]};
    controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=7;controls.maxDistance=18;controls.minPolarAngle=.35;controls.maxPolarAngle=Math.PI*.66;controls.target.set(0,-.2,0);controls.autoRotate=!reduced&&!paused;controls.autoRotateSpeed=.45;controls.saveState();control.current=controls;
   }
   const resize=()=>{const r=el.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/Math.max(r.height,1);camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});observer.observe(el);
   const render=()=>{if(disposed)return;frame=requestAnimationFrame(render);if(!visible||document.hidden)return;if(kind==='terrain'&&!reduced&&!paused){group.rotation.y=-.18+Math.sin(performance.now()*.00008)*.12;}controls?.update();renderer.render(scene,camera);};render();
   return()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();observer.disconnect();controls?.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});renderer.dispose();renderer.domElement.remove();objects.current=null;control.current=null;};
  }catch{setFailed(true);renderer?.dispose();}
 },[kind,reduced,paused]);
 useEffect(()=>{const o=objects.current;if(!o)return;o.layers.forEach(m=>{m.material.opacity=active===0?.42:.12});o.parts.forEach((parts,i)=>parts.forEach(part=>part.traverse(m=>{if(m.material){m.material.transparent=true;m.material.opacity=active===0||active===i+1?1:.15;}})));},[active,paused,reduced]);
 useEffect(()=>{if(reset)control.current?.reset()},[reset]);
 return <div className={`scene scene-${kind}`} ref={host} role="img" aria-label={label}>{failed&&<MountainOutline/>}</div>;
}
