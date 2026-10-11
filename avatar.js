/* 3D landing avatar — stylized bust from portrait likeness; eyes track pointer */
(function () {
  const canvas = document.getElementById("avatar-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.15, 3.4);

  scene.add(new THREE.AmbientLight(0xb8c4a8, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(2.2, 3.2, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc3fa08, 0.55);
  rim.position.set(-3, 1.5, -2);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x88a0ff, 0.25);
  fill.position.set(-2, 0.5, 3);
  scene.add(fill);

  const skin = new THREE.MeshStandardMaterial({
    color: 0xc68642,
    roughness: 0.55,
    metalness: 0.05,
  });
  const skinDeep = new THREE.MeshStandardMaterial({
    color: 0xa86a35,
    roughness: 0.6,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1a120e,
    roughness: 0.85,
  });
  const beardMat = new THREE.MeshStandardMaterial({
    color: 0x3a281c,
    roughness: 0.9,
  });
  const suitMat = new THREE.MeshStandardMaterial({
    color: 0x152038,
    roughness: 0.45,
    metalness: 0.15,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0xc5d2e0,
    roughness: 0.7,
  });
  const tieMat = new THREE.MeshStandardMaterial({
    color: 0x2b4f9b,
    roughness: 0.5,
  });
  const whiteEye = new THREE.MeshStandardMaterial({
    color: 0xf4f7ef,
    roughness: 0.35,
  });
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x3b2a1f,
    roughness: 0.4,
  });
  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c09,
    roughness: 0.3,
  });
  const browMat = hairMat;

  const root = new THREE.Group();
  scene.add(root);
  const body = new THREE.Group();
  root.add(body);
  const head = new THREE.Group();
  head.position.y = 0.55;
  body.add(head);

  // Head
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 32), skin);
  skull.scale.set(0.92, 1.05, 0.9);
  head.add(skull);

  // Ears
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), skinDeep);
    ear.scale.set(0.45, 1, 0.7);
    ear.position.set(side * 0.4, 0.02, 0);
    head.add(ear);
  });

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), skinDeep);
  nose.scale.set(0.7, 1.1, 1.1);
  nose.position.set(0, -0.02, 0.38);
  head.add(nose);

  // Hair base + quiff (from portrait)
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52),
    hairMat,
  );
  hairCap.position.y = 0.06;
  hairCap.scale.set(0.98, 1.05, 0.95);
  head.add(hairCap);

  for (let i = 0; i < 7; i++) {
    const tuft = new THREE.Mesh(
      new THREE.SphereGeometry(0.14 - i * 0.008, 16, 12),
      hairMat,
    );
    tuft.position.set(-0.08 + i * 0.035, 0.38 + (i % 3) * 0.02, 0.12 - i * 0.02);
    tuft.scale.set(1.1, 1.4, 0.9);
    head.add(tuft);
  }

  // Beard / jaw shadow
  const beard = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 32, 20, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.4),
    beardMat,
  );
  beard.position.set(0, -0.18, 0.08);
  beard.scale.set(0.95, 0.85, 0.9);
  head.add(beard);

  // Brows
  [-1, 1].forEach((side) => {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.04), browMat);
    brow.position.set(side * 0.14, 0.14, 0.34);
    brow.rotation.z = side * -0.12;
    head.add(brow);
  });

  // Eyes (track pointer)
  const gazeTarget = new THREE.Object3D();
  scene.add(gazeTarget);

  function makeEye(x) {
    const eye = new THREE.Group();
    eye.position.set(x, 0.06, 0.33);

    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 18), whiteEye);
    sclera.scale.set(1, 1.05, 0.75);
    eye.add(sclera);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 16), irisMat);
    iris.position.z = 0.045;
    eye.add(iris);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), pupilMat);
    pupil.position.z = 0.06;
    eye.add(pupil);

    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    shine.position.set(0.012, 0.012, 0.075);
    eye.add(shine);

    // lids for blink
    const lidMat = skin;
    const upper = new THREE.Mesh(new THREE.SphereGeometry(0.078, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), lidMat);
    upper.rotation.x = Math.PI;
    upper.position.y = 0.01;
    upper.scale.set(1.05, 0.55, 0.85);
    upper.visible = false;
    eye.add(upper);
    eye.userData.lid = upper;
    eye.userData.iris = iris;
    eye.userData.pupil = pupil;

    head.add(eye);
    return eye;
  }

  const leftEye = makeEye(-0.135);
  const rightEye = makeEye(0.135);

  // Smile suggestion
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.012, 8, 24, Math.PI),
    skinDeep,
  );
  smile.position.set(0, -0.16, 0.34);
  smile.rotation.set(0.3, 0, Math.PI);
  smile.scale.set(1.1, 0.7, 1);
  head.add(smile);

  // Torso / suit
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.5, 0.95, 32), suitMat);
  torso.position.y = -0.35;
  body.add(torso);

  const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.35, 16), shirtMat);
  shirt.position.set(0, -0.05, 0.28);
  body.add(shirt);

  const collars = [-1, 1].map((side) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.04), shirtMat);
    c.position.set(side * 0.1, 0.12, 0.34);
    c.rotation.z = side * 0.4;
    body.add(c);
    return c;
  });

  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.04), tieMat);
  tie.position.set(0, -0.12, 0.36);
  body.add(tie);
  const knot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.05), tieMat);
  knot.position.set(0, 0.1, 0.37);
  body.add(knot);

  // Shoulders
  [-1, 1].forEach((side) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), suitMat);
    s.position.set(side * 0.42, -0.05, 0);
    s.scale.set(1.1, 0.85, 1);
    body.add(s);
  });

  // Load likeness texture as soft hologram card behind character (optional depth)
  const loader = new THREE.TextureLoader();
  loader.load(
    "assets/avatar-3d.jpg",
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const card = new THREE.Mesh(
        new THREE.PlaneGeometry(1.35, 1.35),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.14,
          depthWrite: false,
        }),
      );
      card.position.set(0.15, 0.2, -0.85);
      root.add(card);
    },
    undefined,
    () => {},
  );

  const pointer = new THREE.Vector2(0, 0);
  const lookPoint = new THREE.Vector3(0, 0.2, 2);

  function onPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    pointer.set(x, y);
  }

  window.addEventListener(
    "pointermove",
    (e) => onPointer(e.clientX, e.clientY),
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    },
    { passive: true },
  );

  function resize() {
    const w = stage.clientWidth || 320;
    const h = stage.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let blinkT = 0;
  let nextBlink = 2.5 + Math.random() * 3;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // Map pointer into world look target in front of face
    lookPoint.set(pointer.x * 1.8, 0.35 + pointer.y * 1.1, 2.2);
    gazeTarget.position.lerp(lookPoint, reduce ? 1 : 0.12);

    if (!reduce) {
      body.position.y = Math.sin(t * 1.4) * 0.03;
      head.rotation.y = THREE.MathUtils.lerp(
        head.rotation.y,
        pointer.x * 0.35,
        0.08,
      );
      head.rotation.x = THREE.MathUtils.lerp(
        head.rotation.x,
        -pointer.y * 0.2,
        0.08,
      );
      root.rotation.y = Math.sin(t * 0.5) * 0.06;
    }

    // Pupils slide on sclera toward pointer target
    [leftEye, rightEye].forEach((eye) => {
      const origin = new THREE.Vector3();
      eye.getWorldPosition(origin);
      const dir = new THREE.Vector3()
        .subVectors(gazeTarget.position, origin)
        .normalize();
      const aim = origin.clone().add(dir.multiplyScalar(0.4));
      const local = eye.worldToLocal(aim);
      const lx = THREE.MathUtils.clamp(local.x, -0.04, 0.04);
      const ly = THREE.MathUtils.clamp(local.y, -0.028, 0.028);
      eye.userData.iris.position.set(lx, ly, 0.045);
      eye.userData.pupil.position.set(lx, ly, 0.062);
    });

    // Blink
    if (!reduce) {
      blinkT += dt;
      if (blinkT > nextBlink) {
        leftEye.userData.lid.visible = true;
        rightEye.userData.lid.visible = true;
        if (blinkT > nextBlink + 0.12) {
          leftEye.userData.lid.visible = false;
          rightEye.userData.lid.visible = false;
          blinkT = 0;
          nextBlink = 2.2 + Math.random() * 4;
        }
      }
    }

    renderer.render(scene, camera);
  }
  animate();
})();
