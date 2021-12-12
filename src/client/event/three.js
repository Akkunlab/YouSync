/* グローバル変数 */
let scene, camera, renderer;

/* Three.js: 初期化 */
const initThree = () => {
  three.scene1();
  // three.scene2();
}

/* Three.js */
const three = {

  scene1() {
    let light, sphere, plane;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    // ライト
    light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4, 1); // (色, 強さ, 距離, 角度, ボケ具合, 減衰率)
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
  
    // 球
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x31ff2a, roughness: 0.0 });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.position.set(0, 1, 0);
    scene.add(sphere);
  
    // 平面
    const planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 5, 5);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.0 });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.set(Math.PI / 2, 0, 0); 
    scene.add(plane);

    /* Three.js: アニメーション */
    const animate = () => {
      requestAnimationFrame(animate);
  
      const t = Date.now() / 500;
      const r = 10.0;
      const lx = r * Math.cos(t);
      const lz = r * Math.sin(t);
      const ly = 6.0 + 5.0 * Math.sin(t / 3.0);
  
      light.position.set(lx, ly, lz);
      light.lookAt(new THREE.Vector3(0, 0, 0));
      renderer.render(scene, camera);
    }

    animate();
  },

  scene2() {
    let screen, controls;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // コントローラ
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.update();

    // 平面を作成
    video.play();
    const screenTexture = new THREE.VideoTexture(video);
    const screenGeometry = new THREE.PlaneBufferGeometry(5 * video.videoWidth / video.videoHeight, 5);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, side: THREE.DoubleSide });
    screen = new THREE.Mesh(screenGeometry, screenMaterial);
    scene.add(screen);

    /* Three.js: アニメーション */
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }

};

/* Three.js: リサイズ */
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

export { initThree };