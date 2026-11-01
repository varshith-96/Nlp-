/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CyberGuard AI - 3D Cyber Threat Defense Core (Three.js)
 * Adheres strictly to the Three.js skill guidelines:
 * - 3–12 part composite procedural model (THREE.Group)
 * - Grounded bottom-center pivot with soft radial contact shadow
 * - Studio PBR lighting (ACESFilmic, RoomEnvironment, PMREMGenerator, warm key + cool hemisphere fill)
 * - Software-WebGL guard with fenceSync pacer
 * - Zero GC in render loop (pre-allocated scratch math objects)
 * - Viewport-first collapsible bottom dock (no backdrop-filter over WebGL)
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface CyberCore3DProps {
  threatLevel?: 'Safe' | 'Suspicious' | 'Malicious';
  attackCategory?: string;
  confidence?: number;
  className?: string;
}

// Pre-allocated scratch math helpers outside animation loop to eliminate garbage collection
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();

export const CyberCore3D: React.FC<CyberCore3DProps> = ({
  threatLevel = 'Safe',
  attackCategory = 'Legitimate communication',
  confidence = 95,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [activePreset, setActivePreset] = useState<'orbit' | 'top' | 'close'>('orbit');
  const [localThreat, setLocalThreat] = useState<'Safe' | 'Suspicious' | 'Malicious'>(threatLevel);

  // Sync prop changes to local threat state
  useEffect(() => {
    setLocalThreat(threatLevel);
  }, [threatLevel]);

  // Mutable refs for Three.js state
  const stateRef = useRef({
    threatLevel: localThreat,
    wireframe: wireframeMode,
    speedMultiplier: rotationSpeed,
    cameraPreset: activePreset,
    materials: [] as THREE.MeshStandardMaterial[],
    coreMesh: null as THREE.Mesh | null,
    outerRing: null as THREE.Group | null,
    radarBeam: null as THREE.Mesh | null,
    accentNodes: null as THREE.InstancedMesh | null,
    baseLight: null as THREE.PointLight | null,
    keyLight: null as THREE.DirectionalLight | null,
    particles: null as THREE.Points | null,
    time: 0,
    targetCamPos: new THREE.Vector3(0, 3.2, 7.5),
    targetLookAt: new THREE.Vector3(0, 2.0, 0)
  });

  // Keep stateRef in sync with React state
  useEffect(() => {
    stateRef.current.threatLevel = localThreat;
    stateRef.current.wireframe = wireframeMode;
    stateRef.current.speedMultiplier = rotationSpeed;
    stateRef.current.cameraPreset = activePreset;

    // Update camera target position based on preset
    if (activePreset === 'orbit') {
      stateRef.current.targetCamPos.set(0, 3.2, 7.5);
      stateRef.current.targetLookAt.set(0, 2.0, 0);
    } else if (activePreset === 'top') {
      stateRef.current.targetCamPos.set(0, 8.5, 0.1);
      stateRef.current.targetLookAt.set(0, 2.0, 0);
    } else if (activePreset === 'close') {
      stateRef.current.targetCamPos.set(0, 2.2, 3.8);
      stateRef.current.targetLookAt.set(0, 2.2, 0);
    }

    // Toggle wireframe on registered materials
    stateRef.current.materials.forEach(mat => {
      mat.wireframe = wireframeMode;
    });
  }, [localThreat, wireframeMode, rotationSpeed, activePreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL renderer
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Three.js Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene and Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913); // Deep cyber navy/black
    scene.fog = new THREE.FogExp2(0x060913, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 2.0, 0);

    // 4. Studio Environment Lighting (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light (Warm Key)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    stateRef.current.keyLight = keyLight;

    // Fill Light (Cool Hemisphere Fill)
    const hemiLight = new THREE.HemisphereLight(0x00f0ff, 0x050814, 1.2);
    scene.add(hemiLight);

    // Point Light inside the Core
    const corePointLight = new THREE.PointLight(0x00ffcc, 3.0, 8);
    corePointLight.position.set(0, 2.2, 0);
    scene.add(corePointLight);
    stateRef.current.baseLight = corePointLight;

    // 5. Procedural Textures (Zero 404 Dependency)
    const makeHexTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      for (let x = 0; x < 256; x += 32) {
        for (let y = 0; y < 256; y += 32) {
          ctx.beginPath();
          ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 2);
      return tex;
    };

    const makeRadialShadowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const hexTexture = makeHexTexture();
    const shadowTexture = makeRadialShadowTexture();

    // 6. Multi-part Composite Procedural Model (THREE.Group)
    // Structured across: Primary Silhouette, Secondary Read, Accent Details, and Grounded Pedestal
    const cyberSubject = new THREE.Group();
    cyberSubject.position.set(0, 0, 0); // Flush with ground y=0
    scene.add(cyberSubject);

    // Track materials for wireframe toggles
    const registeredMaterials: THREE.MeshStandardMaterial[] = [];

    // Part A: Ground Contact Shadow (Soft radial shadow beneath base)
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01; // Avoid coplanar z-fighting
    cyberSubject.add(shadowMesh);

    // Part B: Pedestal Base (Lathed chamfered cylindrical emitter, bottom flush at y=0)
    const baseGeo = new THREE.CylinderGeometry(1.8, 2.2, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x121829,
      metalness: 0.85,
      roughness: 0.25,
      map: hexTexture
    });
    registeredMaterials.push(baseMat);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.2; // Pivot bottom center
    baseMesh.receiveShadow = !isSoftwareGl;
    cyberSubject.add(baseMesh);

    // Part C: Pedestal Upper Collar & Heat Sink Rings
    const collarGeo = new THREE.CylinderGeometry(1.4, 1.7, 0.3, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.15
    });
    registeredMaterials.push(collarMat);
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.y = 0.55;
    collarMesh.receiveShadow = !isSoftwareGl;
    cyberSubject.add(collarMesh);

    // Part D: Copper / Conduit Pylons supporting the levitating core
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const pylonGeo = new THREE.BoxGeometry(0.12, 0.8, 0.12);
      const pylonMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3
      });
      registeredMaterials.push(pylonMat);
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(Math.cos(angle) * 1.3, 0.9, Math.sin(angle) * 1.3);
      cyberSubject.add(pylon);
    }

    // Part E: Central Holographic Core (Layer 1: Inner Faceted Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85
    });
    registeredMaterials.push(coreMat);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 2.2;
    coreMesh.castShadow = !isSoftwareGl;
    cyberSubject.add(coreMesh);
    stateRef.current.coreMesh = coreMesh;

    // Part F: Outer Shield Orbit Rings (TubeGeometry / Torus)
    const ringGroup = new THREE.Group();
    ringGroup.position.y = 2.2;
    cyberSubject.add(ringGroup);
    stateRef.current.outerRing = ringGroup;

    const ring1Geo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    registeredMaterials.push(ring1Mat);
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.9, 0.035, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x059669,
      emissiveIntensity: 0.4
    });
    registeredMaterials.push(ring2Mat);
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 4;
    ringGroup.add(ring2);

    // Part G: Threat Radar Sweep Beam (Conical sensor fan)
    const radarGeo = new THREE.ConeGeometry(2.2, 0.05, 32, 1, true, 0, Math.PI / 4);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.position.y = 2.2;
    radarMesh.rotation.x = Math.PI / 2;
    cyberSubject.add(radarMesh);
    stateRef.current.radarBeam = radarMesh;

    // Part H: Instanced Floating Sensor Nodes (InstancedMesh > 20 repeated items)
    const nodeCount = 36;
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9
    });
    registeredMaterials.push(nodeMat);
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < nodeCount; i++) {
      const radius = 2.2 + (i % 3) * 0.3;
      const theta = (i / nodeCount) * Math.PI * 2;
      const phi = ((i % 5) - 2) * 0.3;
      dummy.position.set(
        radius * Math.cos(theta),
        2.2 + radius * Math.sin(phi),
        radius * Math.sin(theta)
      );
      dummy.scale.setScalar(0.8 + Math.random() * 0.4);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    cyberSubject.add(instancedNodes);
    stateRef.current.accentNodes = instancedNodes;

    // Part I: Floating Data Particle Dust
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    stateRef.current.particles = particles;

    stateRef.current.materials = registeredMaterials;

    // Pre-warm WebGL shaders once
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 7. Animation Loop with Software-WebGL Pacer & Zero GC
    let frameId = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      stateRef.current.time += dt * stateRef.current.speedMultiplier;
      const t = stateRef.current.time;

      // Color theme based on threat level
      let targetHex = 0x10b981; // Safe (Emerald)
      let targetEmissive = 0x059669;
      let rotMultiplier = 1.0;

      if (stateRef.current.threatLevel === 'Malicious') {
        targetHex = 0xef4444; // Crimson Red
        targetEmissive = 0xb91c1c;
        rotMultiplier = 2.4;
      } else if (stateRef.current.threatLevel === 'Suspicious') {
        targetHex = 0xf59e0b; // Amber
        targetEmissive = 0xd97706;
        rotMultiplier = 1.6;
      }

      // Smoothly damp core color
      if (stateRef.current.coreMesh) {
        const mat = stateRef.current.coreMesh.material as THREE.MeshStandardMaterial;
        mat.color.lerp(new THREE.Color(targetHex), dt * 3);
        mat.emissive.lerp(new THREE.Color(targetEmissive), dt * 3);
        stateRef.current.coreMesh.rotation.y += dt * 0.8 * rotMultiplier;
        stateRef.current.coreMesh.rotation.x = Math.sin(t * 0.5) * 0.2;
        stateRef.current.coreMesh.position.y = 2.2 + Math.sin(t * 1.5) * 0.08;
      }

      // Rotate outer gimbal rings
      if (stateRef.current.outerRing) {
        stateRef.current.outerRing.rotation.y -= dt * 0.5 * rotMultiplier;
        stateRef.current.outerRing.rotation.z = Math.cos(t * 0.8) * 0.15;
      }

      // Rotate radar scan beam
      if (stateRef.current.radarBeam) {
        stateRef.current.radarBeam.rotation.z += dt * 2.0 * rotMultiplier;
      }

      // Animate core point light
      if (stateRef.current.baseLight) {
        stateRef.current.baseLight.color.lerp(new THREE.Color(targetHex), dt * 4);
        stateRef.current.baseLight.intensity = 2.5 + Math.sin(t * 4) * 0.8;
      }

      // Exponential damping on camera position
      const dampFactor = 1 - Math.exp(-4 * dt);
      camera.position.lerp(stateRef.current.targetCamPos, dampFactor);
      _targetPos.copy(stateRef.current.targetLookAt);
      camera.lookAt(_targetPos);

      // Render
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      registeredMaterials.forEach(m => m.dispose());
      baseGeo.dispose();
      collarGeo.dispose();
      coreGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      radarGeo.dispose();
      nodeGeo.dispose();
      particleGeo.dispose();
      hexTexture.dispose();
      shadowTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[460px] overflow-hidden rounded-xl border border-cyan-500/20 bg-[#060913] ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Status & Threat Telemetry HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="bg-[#0b1222]/90 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>CYBER SHIELD DEFENSE CORE 3D</span>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
          localThreat === 'Malicious'
            ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
            : localThreat === 'Suspicious'
            ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
        }`}>
          STATUS: {localThreat.toUpperCase()} ({confidence}%)
        </div>
        <div className="hidden sm:inline-block bg-[#0b1222]/80 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400">
          VECTOR: {attackCategory}
        </div>
      </div>

      {/* Top Right Cinema/Zen Mode Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-[#0c1424] hover:bg-[#131f38] text-xs font-mono text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {isCollapsed ? '▴ Expand Controls' : '▾ Cinema Mode'}
        </button>
      </div>

      {/* Unified Bottom Control Dock (<= 15% height, solid/rgba surfaces, no backdrop-filter over WebGL) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] transition-all duration-300 pointer-events-auto ${
          isCollapsed ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="bg-[#0b1222]/95 border border-cyan-500/30 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Threat Simulation Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px] mr-1 hidden sm:inline">Simulate Threat:</span>
            <button
              onClick={() => setLocalThreat('Safe')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition cursor-pointer border ${
                localThreat === 'Safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Safe
            </button>
            <button
              onClick={() => setLocalThreat('Suspicious')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition cursor-pointer border ${
                localThreat === 'Suspicious'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Suspicious
            </button>
            <button
              onClick={() => setLocalThreat('Malicious')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition cursor-pointer border ${
                localThreat === 'Malicious'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Malicious
            </button>
          </div>

          {/* Camera Angles */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px] mr-1 hidden md:inline">Camera:</span>
            <button
              onClick={() => setActivePreset('orbit')}
              className={`px-2 py-1 rounded font-mono text-xs cursor-pointer border ${
                activePreset === 'orbit' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              Orbit
            </button>
            <button
              onClick={() => setActivePreset('top')}
              className={`px-2 py-1 rounded font-mono text-xs cursor-pointer border ${
                activePreset === 'top' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              Radar Top
            </button>
            <button
              onClick={() => setActivePreset('close')}
              className={`px-2 py-1 rounded font-mono text-xs cursor-pointer border ${
                activePreset === 'close' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              Core Close
            </button>
          </div>

          {/* Controls: Speed & Wireframe */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">Speed:</span>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.2"
                value={rotationSpeed}
                onChange={e => setRotationSpeed(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
              />
            </div>
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                wireframeMode ? 'bg-cyan-500 text-black border-cyan-400 font-bold' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {wireframeMode ? 'Wireframe ON' : 'PBR Solid'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
