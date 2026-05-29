'use client';

import * as React from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * InkCosmos — "Vũ trụ" SCI-FI × TÂM LINH (techno-mysticism) cho hieu.asia.
 *
 * Không sến: hư không lạnh (void) + cyan/tím, hình học THIÊNG chính xác phát sáng (bloom).
 * ~2600 sao lạnh, ít lấp lánh (nghiêm) · tinh vân lạnh rất tiết chế (nhiều void) ·
 * CUỘN → 12 điểm tụ thành MANDALA chính xác: vành 12 cung + sao 12 cánh {12/5} (dodecagram)
 * + nan + vành đồng tâm + vành khắc-vạch xoay chậm (cơ chế vũ trụ). Như glyph trong "Arrival".
 * Camera trôi tỉnh + parallax + dolly theo cuộn.
 *
 * Three.js nạp tách rời (ssr:false). reduced-motion = khung tĩnh. Không WebGL → onUnsupported.
 * Bloom lỗi GPU → hạ về render thường. Dọn tài nguyên đầy đủ khi unmount.
 */

const BG = new THREE.Color('#03050c');
const WHITE = new THREE.Color('#cfe0ff');
const CYAN = new THREE.Color('#6fe0ef');
const VIOLET = new THREE.Color('#8f7be0');

const STAR_COUNT = 2600;
const CUNG = 12;
const RING_R = 2.4;
const SCROLL_SPAN = 2;
const WARP_DEPTH = 34;

const SNOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}`;

const NEBULA_VERT = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const NEBULA_FRAG = `
precision highp float;
uniform float uTime; uniform vec3 uBlue; uniform vec3 uTeal; uniform vec3 uViolet;
varying vec2 vUv;
${SNOISE}
float fbm(vec2 p){ float v=0.0,a=0.55; for(int i=0;i<5;i++){ v+=a*snoise(p); p*=2.02; a*=0.5;} return v; }
void main(){
  vec2 p=(vUv-0.5)*vec2(3.6,2.3);
  float t=uTime*0.016;
  vec2 q=vec2(fbm(p+vec2(0.0,t)), fbm(p+vec2(4.7,-t*0.7)));
  float n=fbm(p+1.7*q+vec2(t*0.3,0.0)); n=n*0.5+0.5;
  float clouds=smoothstep(0.5,0.97,n);
  vec3 col=mix(uBlue,uTeal,smoothstep(0.4,0.7,n));
  col=mix(col,uViolet,smoothstep(0.62,0.92,n)*0.7);
  float vig=smoothstep(1.0,0.1,length(vUv-0.5)*1.8);
  gl_FragColor=vec4(col, clouds*vig*0.28);
}`;

const STAR_VERT = `
uniform float uTime; uniform float uPR; uniform float uSize;
attribute float aScale; attribute float aPhase; attribute vec3 aColor;
varying vec3 vColor; varying float vTw;
void main(){
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mv;
  float tw=0.68+0.32*sin(uTime*1.2*aPhase+aPhase*6.2831);
  vTw=tw; vColor=aColor;
  gl_PointSize=uSize*aScale*uPR*(16.0/max(-mv.z,0.1));
}`;
const STAR_FRAG = `
precision highp float;
varying vec3 vColor; varying float vTw;
void main(){
  float d=length(gl_PointCoord-vec2(0.5));
  if(d>0.5) discard;
  float a=smoothstep(0.5,0.0,d); a=pow(a,1.8);
  gl_FragColor=vec4(vColor*(0.6+vTw*0.7), a*(0.5+0.5*vTw));
}`;

const easeInOut = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

function circlePositions(radius: number, segs: number): Float32Array {
  const arr = new Float32Array(segs * 3);
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    arr[i * 3] = radius * Math.cos(a);
    arr[i * 3 + 1] = radius * Math.sin(a);
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

export function InkCosmos(props: { onUnsupported?: () => void }): React.JSX.Element {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const { onUnsupported } = props;

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      if (!renderer.getContext()) throw new Error('no webgl');
    } catch {
      onUnsupported?.();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    let w = mount.clientWidth || window.innerWidth;
    let h = mount.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    renderer.setClearColor(BG, 1);
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, w / h, 0.1, 100);
    camera.position.set(0, 0, 6);

    let composer: EffectComposer | null = null;
    let bloom: UnrealBloomPass | null = null;
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.55, 0.16);
      composer.addPass(bloom);
    } catch {
      composer = null;
    }
    const renderScene = () => { if (composer) composer.render(); else renderer.render(scene, camera); };

    // ── Nebula lạnh, tiết chế ──
    const nebGeo = new THREE.PlaneGeometry(80, 52, 1, 1);
    const nebMat = new THREE.ShaderMaterial({
      vertexShader: NEBULA_VERT, fragmentShader: NEBULA_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uBlue: { value: new THREE.Color('#0a1b3e') },
        uTeal: { value: new THREE.Color('#114e5e') },
        uViolet: { value: new THREE.Color('#271a52') },
      },
    });
    const nebula = new THREE.Mesh(nebGeo, nebMat);
    nebula.position.set(0, 0, -16);
    scene.add(nebula);

    // ── Trường sao lạnh (~2600) ──
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starScale = new Float32Array(STAR_COUNT);
    const starPhase = new Float32Array(STAR_COUNT);
    const starColor = new Float32Array(STAR_COUNT * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 30;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 2] = -Math.random() * WARP_DEPTH + 4;
      starScale[i] = 0.4 + Math.random() * 1.5;
      starPhase[i] = 0.3 + Math.random() * 1.1;
      const r = Math.random();
      tmp.copy(r < 0.15 ? VIOLET : r < 0.45 ? CYAN : WHITE);
      tmp.multiplyScalar(0.65 + Math.random() * 0.35);
      starColor[i * 3] = tmp.r; starColor[i * 3 + 1] = tmp.g; starColor[i * 3 + 2] = tmp.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('aScale', new THREE.BufferAttribute(starScale, 1));
    starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhase, 1));
    starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColor, 3));
    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPR: { value: dpr }, uSize: { value: 1.25 } },
    });
    const stars = new THREE.Points(starGeo, starMat);
    const starAttr = starGeo.getAttribute('position') as THREE.BufferAttribute;
    scene.add(stars);

    // ── 12 điểm cung (tụ về vành) ──
    const cungScatter = new Float32Array(CUNG * 3);
    const cungTarget = new Float32Array(CUNG * 3);
    const cungPos = new Float32Array(CUNG * 3);
    const cungScale = new Float32Array(CUNG);
    const cungPhase = new Float32Array(CUNG);
    const cungColor = new Float32Array(CUNG * 3);
    for (let i = 0; i < CUNG; i++) {
      const a = ((-90 + 30 * i) * Math.PI) / 180;
      cungTarget[i * 3] = RING_R * Math.cos(a);
      cungTarget[i * 3 + 1] = -RING_R * Math.sin(a);
      cungTarget[i * 3 + 2] = 0;
      cungScatter[i * 3] = (Math.random() - 0.5) * 18;
      cungScatter[i * 3 + 1] = (Math.random() - 0.5) * 12;
      cungScatter[i * 3 + 2] = -Math.random() * 12 - 2;
      cungPos[i * 3] = cungScatter[i * 3]!;
      cungPos[i * 3 + 1] = cungScatter[i * 3 + 1]!;
      cungPos[i * 3 + 2] = cungScatter[i * 3 + 2]!;
      cungScale[i] = 3.4 + Math.random() * 1.0;
      cungPhase[i] = 0.5 + Math.random() * 0.7;
      tmp.copy(i === 0 ? WHITE : CYAN); // Mệnh = trắng sáng nhất
      cungColor[i * 3] = tmp.r; cungColor[i * 3 + 1] = tmp.g; cungColor[i * 3 + 2] = tmp.b;
    }
    const cungGeo = new THREE.BufferGeometry();
    cungGeo.setAttribute('position', new THREE.BufferAttribute(cungPos, 3));
    cungGeo.setAttribute('aScale', new THREE.BufferAttribute(cungScale, 1));
    cungGeo.setAttribute('aPhase', new THREE.BufferAttribute(cungPhase, 1));
    cungGeo.setAttribute('aColor', new THREE.BufferAttribute(cungColor, 3));
    const cungMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPR: { value: dpr }, uSize: { value: 3.0 } },
    });
    const cungStars = new THREE.Points(cungGeo, cungMat);
    const cungAttr = cungGeo.getAttribute('position') as THREE.BufferAttribute;
    scene.add(cungStars);

    // ── Mandala: vành 12 cung + nan + sao 12 cánh {12/5} (theo vị trí cung, hé dần) ──
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(CUNG * 3), 3));
    const ringMat = new THREE.LineBasicMaterial({ color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.LineLoop(ringGeo, ringMat);
    scene.add(ring);
    const ringAttr = ringGeo.getAttribute('position') as THREE.BufferAttribute;

    const spokeGeo = new THREE.BufferGeometry();
    spokeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(CUNG * 2 * 3), 3));
    const spokeMat = new THREE.LineBasicMaterial({ color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const spokes = new THREE.LineSegments(spokeGeo, spokeMat);
    scene.add(spokes);
    const spokeAttr = spokeGeo.getAttribute('position') as THREE.BufferAttribute;

    const dodecaGeo = new THREE.BufferGeometry();
    dodecaGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(CUNG * 2 * 3), 3));
    const dodecaMat = new THREE.LineBasicMaterial({ color: VIOLET.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const dodeca = new THREE.LineSegments(dodecaGeo, dodecaMat);
    scene.add(dodeca);
    const dodecaAttr = dodecaGeo.getAttribute('position') as THREE.BufferAttribute;

    // ── Vành đồng tâm chính xác (static) ──
    const radarMats: THREE.LineBasicMaterial[] = [];
    const radarGeos: THREE.BufferGeometry[] = [];
    [0.7, 1.5, 3.4].forEach((rad) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(circlePositions(rad, 120), 3));
      const m = new THREE.LineBasicMaterial({ color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      scene.add(new THREE.LineLoop(g, m));
      radarMats.push(m); radarGeos.push(g);
    });

    // ── Vành khắc-vạch xoay chậm (48 vạch) ──
    const TICKS = 48;
    const tickArr = new Float32Array(TICKS * 2 * 3);
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2;
      const r1 = i % 4 === 0 ? 2.62 : 2.7, r2 = 2.84;
      tickArr[i * 6] = r1 * Math.cos(a); tickArr[i * 6 + 1] = r1 * Math.sin(a); tickArr[i * 6 + 2] = 0;
      tickArr[i * 6 + 3] = r2 * Math.cos(a); tickArr[i * 6 + 4] = r2 * Math.sin(a); tickArr[i * 6 + 5] = 0;
    }
    const tickGeo = new THREE.BufferGeometry();
    tickGeo.setAttribute('position', new THREE.BufferAttribute(tickArr, 3));
    const tickMat = new THREE.LineBasicMaterial({ color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const tickRing = new THREE.LineSegments(tickGeo, tickMat);
    scene.add(tickRing);

    // tia quét
    const sweepGeo = new THREE.BufferGeometry();
    sweepGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 3.4, 0, 0]), 3));
    const sweepMat = new THREE.LineBasicMaterial({ color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const sweep = new THREE.Line(sweepGeo, sweepMat);
    scene.add(sweep);

    // ── state ──
    let progress = 0, smoothProg = 0;
    const mouse = { x: 0, y: 0 }, mouseTarget = { x: 0, y: 0 };
    const readScroll = () => {
      const span = window.innerHeight * SCROLL_SPAN;
      progress = span > 0 ? clamp01(window.scrollY / span) : 0;
    };
    readScroll();
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mouseTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const resize = () => {
      w = mount.clientWidth || window.innerWidth;
      h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer?.setSize(w, h);
      bloom?.setSize(w, h);
    };

    const renderFrame = (time: number, prog: number, dt: number) => {
      nebMat.uniforms.uTime!.value = time;
      starMat.uniforms.uTime!.value = time;
      cungMat.uniforms.uTime!.value = time;

      const warp = (0.45 + prog * 6.0) * dt;
      for (let i = 0; i < STAR_COUNT; i++) {
        let z = starPos[i * 3 + 2]! + warp;
        if (z > 7) z -= WARP_DEPTH;
        starPos[i * 3 + 2] = z;
      }
      starAttr.needsUpdate = true;

      const e = easeInOut(prog);
      for (let i = 0; i < CUNG; i++) {
        const x = cungScatter[i * 3]! + (cungTarget[i * 3]! - cungScatter[i * 3]!) * e;
        const y = cungScatter[i * 3 + 1]! + (cungTarget[i * 3 + 1]! - cungScatter[i * 3 + 1]!) * e;
        const z = cungScatter[i * 3 + 2]! + (cungTarget[i * 3 + 2]! - cungScatter[i * 3 + 2]!) * e;
        cungPos[i * 3] = x; cungPos[i * 3 + 1] = y; cungPos[i * 3 + 2] = z;
        ringAttr.setXYZ(i, x, y, z);
        spokeAttr.setXYZ(i * 2, x, y, z);
        spokeAttr.setXYZ(i * 2 + 1, 0, 0, 0);
      }
      // dodecagram {12/5}: nối cung i → (i+5)%12
      for (let i = 0; i < CUNG; i++) {
        const j = (i + 5) % CUNG;
        dodecaAttr.setXYZ(i * 2, cungPos[i * 3]!, cungPos[i * 3 + 1]!, cungPos[i * 3 + 2]!);
        dodecaAttr.setXYZ(i * 2 + 1, cungPos[j * 3]!, cungPos[j * 3 + 1]!, cungPos[j * 3 + 2]!);
      }
      cungAttr.needsUpdate = true; ringAttr.needsUpdate = true; spokeAttr.needsUpdate = true; dodecaAttr.needsUpdate = true;

      const lineOp = Math.pow(clamp01((prog - 0.4) / 0.55), 1.4);
      ringMat.opacity = lineOp; spokeMat.opacity = lineOp * 0.5; dodecaMat.opacity = lineOp * 0.7;
      const navOp = Math.pow(clamp01((prog - 0.6) / 0.4), 1.5);
      for (const m of radarMats) m.opacity = navOp * 0.32;
      tickMat.opacity = navOp * 0.5;
      sweepMat.opacity = navOp * 0.4;
      tickRing.rotation.z = time * 0.05; // cơ chế xoay chậm
      sweep.rotation.z = -time * 0.5;

      mouse.x += (mouseTarget.x - mouse.x) * 0.035;
      mouse.y += (mouseTarget.y - mouse.y) * 0.035;
      camera.position.x = Math.sin(time * 0.04) * 0.3 + mouse.x * 0.8;
      camera.position.y = Math.cos(time * 0.035) * 0.22 - mouse.y * 0.5;
      camera.position.z = 6 - prog * 1.3;
      camera.lookAt(0, 0, 0);

      renderScene();
    };

    let raf = 0, running = false, inView = true, visible = !document.hidden;
    const clock = new THREE.Clock();
    const loop = () => {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      smoothProg += (progress - smoothProg) * 0.06;
      renderFrame(t, smoothProg, dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (running || !inView || !visible) return; running = true; clock.getDelta(); raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

    const disposeAll = () => {
      scene.clear();
      nebGeo.dispose(); nebMat.dispose();
      starGeo.dispose(); starMat.dispose();
      cungGeo.dispose(); cungMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
      spokeGeo.dispose(); spokeMat.dispose();
      dodecaGeo.dispose(); dodecaMat.dispose();
      radarGeos.forEach((g) => g.dispose()); radarMats.forEach((m) => m.dispose());
      tickGeo.dispose(); tickMat.dispose();
      sweepGeo.dispose(); sweepMat.dispose();
      bloom?.dispose(); composer?.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };

    if (reduced) {
      renderFrame(0, 0.62, 0);
      const roR = new ResizeObserver(() => { resize(); renderFrame(0, 0.62, 0); });
      roR.observe(mount);
      return () => { roR.disconnect(); disposeAll(); };
    }

    const onScroll = () => readScroll();
    const onVis = () => { visible = !document.hidden; if (visible) start(); else stop(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(resize); ro.observe(mount);
    const io = new IntersectionObserver((es) => { inView = es[0]?.isIntersecting ?? true; if (inView) start(); else stop(); }, { threshold: 0.01 });
    io.observe(mount);
    start();

    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVis);
      ro.disconnect(); io.disconnect();
      disposeAll();
    };
  }, [onUnsupported]);

  return <div ref={mountRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}
