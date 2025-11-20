import React, { useEffect, useRef } from 'react';

export const BotVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || !containerRef.current) return;

    // Load Three.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      initBot();
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initBot = () => {
    if (!containerRef.current) return;

    const THREE = (window as any).THREE;
    if (!THREE) return;

    const COLORS = {
      background: 0xF5F5F0,
      body: 0xFFFFFF,
      details: 0x333333,
      accent: 0xFF4F00
    };

    let scene: any, camera: any, renderer: any;
    let botGroup: any, headGroup: any, eyeLeft: any, eyeRight: any;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const container = containerRef.current;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.background);
    scene.fog = new THREE.Fog(COLORS.background, 10, 50);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xE5E5E5, 0.4);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Create Bot
    botGroup = new THREE.Group();
    // Rotate slightly right (+15 degrees) for subtle angle
    botGroup.rotation.y = Math.PI / 12;
    scene.add(botGroup);

    const matBody = new THREE.MeshStandardMaterial({ 
      color: COLORS.body, 
      roughness: 0.7, 
      metalness: 0.1 
    });
    const matDark = new THREE.MeshStandardMaterial({ 
      color: COLORS.details, 
      roughness: 0.9, 
      metalness: 0.0 
    });
    const matGlow = new THREE.MeshStandardMaterial({ 
      color: COLORS.accent, 
      emissive: COLORS.accent,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });

    const bodyGeo = new THREE.CylinderGeometry(1.2, 1.4, 2.5, 32);
    const body = new THREE.Mesh(bodyGeo, matBody);
    body.position.y = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    botGroup.add(body);

    headGroup = new THREE.Group();
    headGroup.position.y = 2.2;
    botGroup.add(headGroup);

    const neckGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.6, 32);
    const neck = new THREE.Mesh(neckGeo, matDark);
    neck.position.y = -0.85;
    headGroup.add(neck);

    const headGeo = new THREE.BoxGeometry(2.2, 1.6, 1.8);
    const head = new THREE.Mesh(headGeo, matBody);
    head.castShadow = true;
    head.receiveShadow = true;
    headGroup.add(head);

    const faceGeo = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const face = new THREE.Mesh(faceGeo, matDark);
    face.position.z = 0.91;
    face.position.y = 0;
    headGroup.add(face);

    const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    
    eyeLeft = new THREE.Mesh(eyeGeo, matGlow);
    eyeLeft.position.set(-0.5, 0, 1.0);
    headGroup.add(eyeLeft);

    eyeRight = new THREE.Mesh(eyeGeo, matGlow);
    eyeRight.position.set(0.5, 0, 1.0);
    headGroup.add(eyeRight);

    const antStemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
    const antStem = new THREE.Mesh(antStemGeo, matDark);
    antStem.position.y = 1.1;
    antStem.position.x = 0.6;
    headGroup.add(antStem);

    const antBulbGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const antBulb = new THREE.Mesh(antBulbGeo, matGlow);
    antBulb.position.y = 1.5;
    antBulb.position.x = 0.6;
    headGroup.add(antBulb);

    // Floor
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.1 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2.5;
    plane.receiveShadow = true;
    scene.add(plane);

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) / 2;
      mouseY = (event.clientY - windowHalfY) / 2;
    };

    const onResize = () => {
      if (!container) return;
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.002;

      if (botGroup) {
        botGroup.position.y = Math.sin(time) * 0.3;
      }

      if (headGroup) {
        const targetRotX = Math.min(Math.max(mouseY * 0.001, -0.5), 0.5);
        const targetRotY = Math.min(Math.max(mouseX * 0.001, -0.8), 0.8);
        headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.1;
        headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.1;
      }

      if (eyeLeft && eyeRight) {
        const intensity = 0.5 + Math.sin(time * 3) * 0.3;
        eyeLeft.material.emissiveIntensity = intensity;
        eyeRight.material.emissiveIntensity = intensity;
      }

      renderer.render(scene, camera);
    };

    animate();
  };

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
};
