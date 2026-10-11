/* 3D landing avatar — stylized bust from portrait likeness; eyes track pointer */
(function () {
  const canvas = document.getElementById("avatar-canvas");
  const stage = canvas && canvas.parentElement;
  const fallback = document.getElementById("avatar-fallback");

  function fail(reason) {
    if (stage) stage.classList.add("avatar-failed");
    if (fallback) fallback.hidden = false;
    if (reason && typeof console !== "undefined") console.warn("[avatar]", reason);
  }

  if (!canvas || !stage) return;
  if (typeof THREE === "undefined") {
    fail("THREE.js failed to load");
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    fail(e && e.message ? e.message : "WebGL unavailable");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.35, 3.6);

  scene.add(new THREE.AmbientLight(0xc5d0b8, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(2.4, 3.4, 4.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc3fa08, 0.65);
  rim.position.set(-3.2, 1.8, -2.2);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x9eb6ff, 0.28);
  fill.position.set(-2.2, 0.4, 3.2);
  scene.add(fill);

  const skin = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.52, metalness: 0.04 });
  const skinDeep = new THREE.MeshStandardMaterial({ color: 0xa86a35, roughness: 0.58 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x16100c, roughness: 0.82 });
  const beardMat = new THREE.MeshStandardMaterial({ color: 0x3a281c, roughness: 0.88 });
  const suitMat = new THREE.MeshStandardMaterial({ color: 0x152038, roughness: 0.42, metalness: 0.12 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xc5d2e0, roughness: 0.68 });
  const tieMat = new THREE.MeshStandardMaterial({ color: 0x2b4f9b, roughness: 0.48 });
  const whiteEye = new THREE.MeshStandardMaterial({ color: 0xf4f7ef, roughness: 0.32 });
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x3b2a1f, roughness: 0.38 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0a0c09, roughness: 0.28 });

  const root = new THREE.Group();
  root.position.y = -0.15;
  scene.add(root);
  const body = new THREE.Group();
  root.add(body);
  const head = new THREE.Group();
  head.position.y = 0.72;
  body.add(head);

  // Head
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.4, 48, 36), skin);
  skull.scale.set(0.93, 1.08, 0.9);
  head.add(skull);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), skinDeep);
    ear.scale.set(0.42, 1.05, 0.7);
    ear.position.set(side * 0.385, 0.0, -0.02);
    head.add(ear);
  });

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), skinDeep);
  nose.scale.set(0.65, 1.15, 1.15);
  nose.position.set(0, -0.04, 0.36);
  head.add(nose);

  // Hair — soft cap + forward quiff (not a hat)
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.415, 36, 28), hairMat);
  hairCap.scale.set(1.02, 0.72, 1.0);
  hairCap.position.set(0, 0.2, -0.02);
  head.add(hairCap);

  const quiff = new THREE.Group();
  quiff.position.set(-0.02, 0.34, 0.18);
  for (let i = 0; i < 6; i++) {
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), hairMat);
    tuft.position.set(i * 0.03 - 0.04, i * 0.015, -i * 0.015);
    tuft.scale.set(1.15 - i * 0.05, 1.55 - i * 0.08, 0.95);
    quiff.add(tuft);
  }
  head.add(quiff);

  // Beard
  const beard = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24), beardMat);
  beard.scale.set(1.05, 0.7, 0.85);
  beard.position.set(0, -0.22, 0.1);
  head.add(beard);

  [-1, 1].forEach((side) => {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.025, 0.035), hairMat);
    brow.position.set(side * 0.13, 0.12, 0.33);
    brow.rotation.z = side * -0.1;
    head.add(brow);
  });

  function makeEye(x) {
    const eye = new THREE.Group();
    eye.position.set(x, 0.04, 0.325);

    const socket = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 16), skinDeep);
    socket.scale.set(1.15, 1.0, 0.55);
    socket.position.z = -0.01;
    eye.add(socket);

    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.062, 24, 18), whiteEye);
    sclera.scale.set(1, 1.05, 0.7);
    eye.add(sclera);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.032, 20, 16), irisMat);
    iris.position.z = 0.038;
    eye.add(iris);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), pupilMat);
    pupil.position.z = 0.052;
    eye.add(pupil);

    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    shine.position.set(0.01, 0.01, 0.06);
    eye.add(shine);

    const lid = new THREE.Mesh(
      new THREE.SphereGeometry(0.066, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      skin,
    );
    lid.rotation.x = Math.PI;
    lid.position.y = 0.01;
    lid.scale.set(1.05, 0.5, 0.85);
    lid.visible = false;
    eye.add(lid);

    eye.userData = { iris, pupil, lid, shine };
    head.add(eye);
    return eye;
  }

  const leftEye = makeEye(-0.125);
  const rightEye = makeEye(0.125);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.01, 8, 20, Math.PI * 0.9),
    skinDeep,
  );
  smile.position.set(0, -0.15, 0.33);
  smile.rotation.set(0.4, 0, Math.PI);
  smile.scale.set(1.05, 0.65, 1);
  head.add(smile);

  // Suit
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.52, 1.0, 36), suitMat);
  torso.position.y = -0.28;
  body.add(torso);

  const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.38, 18), shirtMat);
  shirt.position.set(0, 0.02, 0.27);
  body.add(shirt);

  [-1, 1].forEach((side) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.11, 0.035), shirtMat);
    c.position.set(side * 0.09, 0.18, 0.33);
    c.rotation.z = side * 0.45;
    body.add(c);
  });

  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.4, 0.035), tieMat);
  tie.position.set(0, -0.08, 0.35);
  body.add(tie);
  const knot = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), tieMat);
  knot.position.set(0, 0.14, 0.36);
  body.add(knot);

  [-1, 1].forEach((side) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), suitMat);
    s.position.set(side * 0.4, 0.02, 0);
    s.scale.set(1.15, 0.85, 1);
    body.add(s);
  });

  // Soft likeness plate behind (does not replace the 3D figure)
  new THREE.TextureLoader().load(
    "assets/avatar-3d.jpg",
    (tex) => {
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      const card = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        }),
      );
      card.position.set(0.2, 0.35, -1.0);
      root.add(card);
    },
    undefined,
    () => {},
  );

  const pointer = { x: 0, y: 0 };

  function onPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
  }

  window.addEventListener("pointermove", (e) => onPointer(e.clientX, e.clientY), {
    passive: true,
  });
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    },
    { passive: true },
  );

  function resize() {
    const w = Math.max(stage.clientWidth || 320, 1);
    const h = Math.max(stage.clientHeight || 360, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(resize).observe(stage);
  }

  let nextBlink = 2.4 + Math.random() * 2.5;
  let blinkUntil = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const lookX = THREE.MathUtils.clamp(pointer.x, -1, 1);
    const lookY = THREE.MathUtils.clamp(pointer.y, -1, 1);

    if (!reduce) {
      body.position.y = Math.sin(t * 1.35) * 0.025;
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, lookX * 0.4, 0.1);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -lookY * 0.22, 0.1);
      root.rotation.y = Math.sin(t * 0.45) * 0.05;
    } else {
      head.rotation.y = lookX * 0.25;
      head.rotation.x = -lookY * 0.15;
    }

    // Simple, stable eye tracking (local offsets only)
    const px = lookX * 0.028;
    const py = lookY * 0.02;
    [leftEye, rightEye].forEach((eye) => {
      eye.userData.iris.position.set(px, py, 0.038);
      eye.userData.pupil.position.set(px, py, 0.052);
      eye.userData.shine.position.set(0.01 + px * 0.3, 0.01 + py * 0.3, 0.06);
    });

    if (!reduce) {
      if (t > nextBlink && t < nextBlink + 0.11) {
        leftEye.userData.lid.visible = true;
        rightEye.userData.lid.visible = true;
        blinkUntil = nextBlink + 0.11;
      } else if (t >= blinkUntil && leftEye.userData.lid.visible) {
        leftEye.userData.lid.visible = false;
        rightEye.userData.lid.visible = false;
        nextBlink = t + 2.0 + Math.random() * 3.5;
      }
    }

    renderer.render(scene, camera);
  }
  animate();
})();
