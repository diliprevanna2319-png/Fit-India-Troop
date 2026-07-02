/* =============================================================================
   Hero 3D scene — scroll-driven LAT PULLDOWN.
   An articulated athlete performs a lat pulldown; scroll progress (0→1) drives
   the bar down to the chest, bends the arms via 2-bone IK, lifts the weight
   stack, stretches the cable and leans the torso. Ambient dust + fog + tricolor
   lighting + mouse parallax for depth.

   Progressive enhancement: dynamically imports Three.js; if it fails or WebGL is
   unavailable the hero keeps its CSS background. initHero() resolves to an object
   { setPulldown(p) } (or null on failure) so the caller can drive it from scroll.
   ============================================================================= */

export async function initHero(canvas){
  if(!canvas) return null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let THREE;
  try{ THREE = await import('https://esm.sh/three@0.160.0'); }
  catch(e){ console.warn('Three.js unavailable — hero uses CSS fallback.'); return null; }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0b, 0.055);

  const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0.4, 3.0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const V = (x,y,z)=>new THREE.Vector3(x,y,z);

  /* ---------- materials ---------- */
  const matBody  = new THREE.MeshStandardMaterial({ color:0x33333c, metalness:0.5, roughness:0.5, emissive:0xff9933, emissiveIntensity:0.05 });
  const matSkin  = new THREE.MeshStandardMaterial({ color:0x5a4636, metalness:0.2, roughness:0.7 });
  const matSteel = new THREE.MeshStandardMaterial({ color:0x9a9aa2, metalness:0.95, roughness:0.25 });
  const matDark  = new THREE.MeshStandardMaterial({ color:0x17171b, metalness:0.7, roughness:0.4 });
  const matPlate = new THREE.MeshStandardMaterial({ color:0x1fa85a, metalness:0.8, roughness:0.35, emissive:0x0d5a2e, emissiveIntensity:0.15 });
  const matBar   = new THREE.MeshStandardMaterial({ color:0xffb347, metalness:0.9, roughness:0.2, emissive:0xff9933, emissiveIntensity:0.25 });
  const matCable = new THREE.LineBasicMaterial({ color:0xffb347, transparent:true, opacity:0.9 });

  /* ---------- helpers ---------- */
  function cyl(r, mat){ const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,1,12), mat); return m; }
  function place(m, from, to){                    // stretch a unit-Y cylinder between two points
    const dir=new THREE.Vector3().subVectors(to,from); const len=dir.length()||1e-4;
    m.position.copy(from).addScaledVector(dir, 0.5);
    m.scale.set(1, len, 1);
    m.quaternion.setFromUnitVectors(V(0,1,0), dir.clone().normalize());
  }

  const rig = new THREE.Group(); scene.add(rig);

  /* ---------- machine frame ---------- */
  const frame = new THREE.Group(); rig.add(frame);
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.4,0.3,1.8), matDark); base.position.set(0,-0.15,-0.4); frame.add(base);
  [-1.5,1.5].forEach(x=>{ const u=cyl(0.09,matSteel); place(u, V(x,0,-0.7), V(x,5,-0.7)); frame.add(u); });
  const beam=cyl(0.09,matSteel); place(beam, V(-1.5,4.9,-0.7), V(1.5,4.9,-0.7)); frame.add(beam);
  const pulley=new THREE.Mesh(new THREE.TorusGeometry(0.22,0.07,8,20), matSteel);
  pulley.position.set(0,4.75,-0.55); pulley.rotation.y=Math.PI/2; frame.add(pulley);
  // seat + pad
  const seat=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.2,0.8), matDark); seat.position.set(0,0.95,0.1); frame.add(seat);
  const kneePad=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.9,12), matDark); kneePad.rotation.z=Math.PI/2; kneePad.position.set(0,1.55,0.55); frame.add(kneePad);

  /* ---------- weight stack ---------- */
  const stack=new THREE.Group(); stack.position.set(1.5,0,-0.7); frame.add(stack);
  const PLATES=7;
  for(let i=0;i<PLATES;i++){ const p=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.16,0.7), matPlate); p.position.y=0.35+i*0.2; stack.add(p); }
  const stackRod=cyl(0.03,matSteel); place(stackRod, V(1.5,0.3,-0.7), V(1.5,4.6,-0.7)); frame.add(stackRod);

  /* ---------- athlete ---------- */
  const body=new THREE.Group(); rig.add(body);
  const torso=new THREE.Group(); body.add(torso);                       // pivots at hips for lean
  const hipsY=1.05;
  const torsoMesh=new THREE.Mesh(new THREE.CapsuleGeometry(0.42,0.9,4,12), matBody);
  torsoMesh.position.set(0,hipsY+0.75,0); torso.add(torsoMesh);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.28,16,16), matSkin);
  head.position.set(0,hipsY+1.75,0.02); torso.add(head);
  // thighs (seated, forward) + shins
  [-0.22,0.22].forEach(x=>{
    const th=cyl(0.16,matBody); place(th, V(x,hipsY,0.1), V(x,hipsY-0.05,0.95)); body.add(th);
    const sh=cyl(0.13,matBody); place(sh, V(x,hipsY-0.05,0.95), V(x,0.2,0.9)); body.add(sh);
  });
  // arm segments (updated every frame)
  const armMats={upper:matBody, fore:matSkin};
  const arms={ Lu:cyl(0.13,armMats.upper), Ru:cyl(0.13,armMats.upper), Lf:cyl(0.11,armMats.fore), Rf:cyl(0.11,armMats.fore) };
  Object.values(arms).forEach(m=>body.add(m));
  const handL=new THREE.Mesh(new THREE.SphereGeometry(0.11,10,10), matSkin);
  const handR=new THREE.Mesh(new THREE.SphereGeometry(0.11,10,10), matSkin);
  body.add(handL, handR);

  /* ---------- lat bar ---------- */
  const barGroup=new THREE.Group(); rig.add(barGroup);
  const bar=cyl(0.05,matBar); place(bar, V(-1.05,0,0.15), V(1.05,0,0.15)); barGroup.add(bar); // length along X
  [-1.0,1.0].forEach(x=>{ const grip=cyl(0.05,matBar); place(grip, V(x,0.0,0.15), V(x*1.25,0.32,0.15)); barGroup.add(grip); });

  /* ---------- cables (dynamic lines) ---------- */
  function line(){ const g=new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6),3)); return new THREE.Line(g,matCable); }
  const cableFront=line(), cableBack=line(); scene.add(cableFront, cableBack);
  function setLine(l,a,b){ const p=l.geometry.attributes.position; p.setXYZ(0,a.x,a.y,a.z); p.setXYZ(1,b.x,b.y,b.z); p.needsUpdate=true; }

  /* ---------- dust particles ---------- */
  const COUNT = innerWidth<768 ? 700 : 1400;
  const pos=new Float32Array(COUNT*3), col=new Float32Array(COUNT*3);
  const cS=new THREE.Color(0xff9933), cG=new THREE.Color(0x1fa85a), cW=new THREE.Color(0xf5f5f7);
  for(let i=0;i<COUNT;i++){
    pos[i*3]=(Math.random()-0.5)*30; pos[i*3+1]=(Math.random()-0.2)*20; pos[i*3+2]=(Math.random()-0.5)*26;
    const r=Math.random(), c=r<0.42?cS:r<0.72?cG:cW; col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  const pgeo=new THREE.BufferGeometry();
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(col,3));
  const points=new THREE.Points(pgeo, new THREE.PointsMaterial({ size:0.07, vertexColors:true, transparent:true, opacity:0.8, depthWrite:false, blending:THREE.AdditiveBlending }));
  scene.add(points);

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0x404048, 0.8));
  const key=new THREE.SpotLight(0xffffff, 60, 40, 0.6, 0.5); key.position.set(4,9,8); scene.add(key);
  const rimS=new THREE.PointLight(0xff9933, 30, 40); rimS.position.set(-6,4,4); scene.add(rimS);
  const rimG=new THREE.PointLight(0x1fa85a, 26, 40); rimG.position.set(6,2,-2); scene.add(rimG);

  /* ---------- pose from progress ---------- */
  const Lu=0.72, Lf=0.68;                 // upper arm / forearm lengths
  const shoulderY=hipsY+1.45, shoulderX=0.42, shoulderZ=0.05;
  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function poseRig(p){
    // p: 0 = bar up (arms extended), 1 = bar pulled to chest
    const handX = lerp(1.02, 0.86, p);
    const handY = lerp(4.15, shoulderY-0.15, p);   // bar high → upper chest
    const handZ = 0.15;

    ['L','R'].forEach(side=>{
      const s = side==='R' ? 1 : -1;
      const S = V(s*shoulderX, shoulderY, shoulderZ);
      const H = V(s*handX, handY, handZ);
      let d = clamp(S.distanceTo(H), 0.05, Lu+Lf-0.03);
      const a = Math.acos(clamp((Lu*Lu + d*d - Lf*Lf)/(2*Lu*d), -1, 1));
      const base = new THREE.Vector3().subVectors(H,S).normalize();
      const phi = -s*a;                              // bow elbow outward
      const cx=Math.cos(phi), sn=Math.sin(phi);
      const dir = V(base.x*cx - base.y*sn, base.x*sn + base.y*cx, base.z).normalize();
      const E = S.clone().addScaledVector(dir, Lu);
      place(arms[side+'u'], S, E);
      place(arms[side+'f'], E, H);
      (side==='R'?handR:handL).position.copy(H);
    });

    // bar follows hands
    barGroup.position.set(0, handY, 0);
    // torso lean back slightly while pulling
    torso.rotation.x = lerp(0.02, -0.16, p);
    // weight stack rises as bar descends (cable conservation, scaled)
    const lift = clamp((4.15 - handY)*0.85, 0, 1.35);
    stack.position.y = lift;
    // cables
    const P = V(0,4.75,-0.55);
    setLine(cableFront, P, V(0, handY+0.05, handZ));
    setLine(cableBack,  P, V(1.5, 0.45+lift+PLATES*0.2, -0.7));
  }

  /* ---------- interaction state ---------- */
  const state={ p:0, pTarget:0, mx:0, my:0, tmx:0, tmy:0 };
  addEventListener('mousemove', e=>{ state.tmx=(e.clientX/innerWidth-0.5); state.tmy=(e.clientY/innerHeight-0.5); }, {passive:true});
  addEventListener('resize', ()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });

  let running=true;
  document.addEventListener('visibilitychange', ()=>{ running=!document.hidden; if(running && !reduce) requestAnimationFrame(loop); });

  poseRig(0);
  function loop(){
    if(!running) return;
    state.p  += (state.pTarget - state.p)*0.12;
    state.mx += (state.tmx - state.mx)*0.05;
    state.my += (state.tmy - state.my)*0.05;
    poseRig(state.p);

    points.rotation.y += 0.0006;

    // cinematic camera: subtle dolly-in + orbit as the rep completes, plus mouse parallax
    const camX = lerp(0.6, -1.4, state.p) + state.mx*1.6;
    const camY = lerp(3.1, 2.6, state.p) - state.my*1.0;
    const camZ = lerp(9.0, 7.2, state.p);
    camera.position.set(camX, camY, camZ);
    camera.lookAt(0, 2.5, 0);

    renderer.render(scene, camera);
    if(!reduce) requestAnimationFrame(loop);
  }
  loop();
  if(reduce){ poseRig(0.5); renderer.render(scene, camera); }

  return {
    setPulldown(p){ state.pTarget = clamp(p, 0, 1); if(reduce){ poseRig(p); renderer.render(scene,camera); } }
  };
}
