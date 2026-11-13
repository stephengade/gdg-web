/**
 * SceneManager — Three.js 3D WebGL Firing Range Environment
 *
 * Implements:
 *   - 1 unit = 1 meter coordinate space
 *   - Eye height camera at (0, 1.6, 0)
 *   - Desert terrain ground plane, earth berms, distance markers (25m - 200m)
 *   - Firing line bench, sandbag supports, lane dividers
 *   - Dynamic lighting + Muzzle flash point light
 *   - Night-Ops mode for Mission 5 (low visibility + green phosphor ambient)
 */
import * as THREE from 'three';

export class SceneManager {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8cb0d0); // Desert sky blue
    this.fog = new THREE.FogExp2(0xd6be9e, 0.004);     // Warm desert haze
    this.scene.fog = this.fog;

    // Camera (standing eye height 1.6m at firing line)
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.05,
      600
    );
    this.camera.position.set(0, 1.6, 0);

    // Muzzle flash light
    this.muzzleLight = new THREE.PointLight(0xffaa33, 0, 7);
    this.muzzleLightTimer = 0;
    this.scene.add(this.muzzleLight);

    // Lights
    this.ambientLight = new THREE.AmbientLight(0x758076, 1.2);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffae8, 2.0);
    this.sunLight.position.set(40, 60, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 250;
    this.sunLight.shadow.camera.left = -60;
    this.sunLight.shadow.camera.right = 60;
    this.sunLight.shadow.camera.top = 60;
    this.sunLight.shadow.camera.bottom = -60;
    this.scene.add(this.sunLight);

    // Build the 3D Range
    this._buildRange();

    // Window resize handler
    window.addEventListener('resize', this._onResize.bind(this));
  }

  /* ── Range Construction ────────────────── */

  _buildRange() {
    // 1. Desert Ground Plane
    const groundGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xc8b28f, // Sandy desert earth
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Clear Downrange Shooting Field & Terminal Backstop Berm (z = -230m)
    // NOTE: Intermediate berms are NOT placed in front of targets so all 25m-200m targets are 100% visible!
    const backstopGeo = new THREE.CylinderGeometry(2.5, 12.0, 9.0, 16);
    const backstopMat = new THREE.MeshStandardMaterial({ color: 0x8a7050, roughness: 1.0 });
    const backstop = new THREE.Mesh(backstopGeo, backstopMat);
    backstop.rotation.z = Math.PI / 2;
    backstop.scale.set(1, 60, 1);
    backstop.position.set(0, 4.0, -230);
    backstop.receiveShadow = true;
    this.scene.add(backstop);

    // Left and Right Containment Berms flanking the entire range
    const sideBermGeo = new THREE.BoxGeometry(4.0, 3.5, 240);
    const sideBermMat = new THREE.MeshStandardMaterial({ color: 0x967c5d, roughness: 1.0 });
    const leftBerm = new THREE.Mesh(sideBermGeo, sideBermMat);
    leftBerm.position.set(-18, 1.2, -115);
    leftBerm.receiveShadow = true;
    this.scene.add(leftBerm);

    const rightBerm = new THREE.Mesh(sideBermGeo, sideBermMat);
    rightBerm.position.set(18, 1.2, -115);
    rightBerm.receiveShadow = true;
    this.scene.add(rightBerm);

    // Lane Distance Indicators & Illuminated Signposts at 25m, 50m, 100m, 150m, 200m
    const distances = [25, 50, 100, 150, 200];
    for (const dist of distances) {
      const z = -dist;

      // Low ground threshold stripe (flat on ground, never obstructs vision)
      const stripeGeo = new THREE.BoxGeometry(26, 0.04, 0.4);
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0x5a4a35, roughness: 0.95 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0, 0.02, z);
      stripe.receiveShadow = true;
      this.scene.add(stripe);

      // Distance Signposts (Left and Right of lanes)
      this._createSignpost(-14, z, `${dist}M`);
      this._createSignpost(14, z, `${dist}M`);
    }

    // 3. Firing Line Shooting Bench & Sandbags
    this._buildFiringLine();
  }

  _createSignpost(x, z, text) {
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x3d3224 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(x, 0.9, z);
    post.castShadow = true;
    this.scene.add(post);

    // Signboard
    const boardGeo = new THREE.BoxGeometry(0.9, 0.45, 0.05);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x1a211c, roughness: 0.6 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(x, 1.6, z);

    // Canvas texture for the text
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#121619';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#00FF66';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 244, 116);
    ctx.fillStyle = '#00FF66';
    ctx.font = 'bold 54px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const textMat = new THREE.MeshBasicMaterial({ map: texture });
    const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.4), textMat);
    textPlane.position.set(x, 1.6, z + 0.03);
    this.scene.add(board);
    this.scene.add(textPlane);
  }

  _buildFiringLine() {
    // Shooting bench (wood & concrete top) positioned below firing line
    const benchGeo = new THREE.BoxGeometry(4.0, 0.10, 1.2);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x2e352d, roughness: 0.8 });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(0, 0.82, -0.75);
    bench.castShadow = true;
    bench.receiveShadow = true;
    this.scene.add(bench);

    // Bench support legs
    const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.82, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1f1b });
    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(-1.8, 0.41, -0.75);
    const leg2 = new THREE.Mesh(legGeo, legMat);
    leg2.position.set(1.8, 0.41, -0.75);
    this.scene.add(leg1);
    this.scene.add(leg2);

    // Right-side Sandbag rifle rest (leaves center firing line completely open)
    const sandbagGeo = new THREE.BoxGeometry(0.45, 0.16, 0.3);
    const sandbagMat = new THREE.MeshStandardMaterial({ color: 0x9c8a6b, roughness: 0.9 });
    const sandbag = new THREE.Mesh(sandbagGeo, sandbagMat);
    sandbag.position.set(0.70, 0.95, -0.75);
    sandbag.castShadow = true;
    this.scene.add(sandbag);
  }

  /* ── Night Ops Environment (Mission 5) ─── */

  setNightMode(isNight) {
    if (isNight) {
      this.scene.background = new THREE.Color(0x040806);
      this.fog.color = new THREE.Color(0x060f0a);
      this.fog.density = 0.012;
      this.ambientLight.color = new THREE.Color(0x1a3320); // faint phosphor moonlight
      this.ambientLight.intensity = 0.6;
      this.sunLight.intensity = 0.2;
      this.sunLight.color = new THREE.Color(0x224433);
    } else {
      this.scene.background = new THREE.Color(0x8cb0d0);
      this.fog.color = new THREE.Color(0xd6be9e);
      this.fog.density = 0.004;
      this.ambientLight.color = new THREE.Color(0x758076);
      this.ambientLight.intensity = 1.2;
      this.sunLight.intensity = 2.0;
      this.sunLight.color = new THREE.Color(0xfffae8);
    }
  }

  /* ── Muzzle Flash Lighting ─────────────── */

  triggerMuzzleLight(pos) {
    this.muzzleLight.position.copy(pos);
    this.muzzleLight.intensity = 5.0;
    this.muzzleLightTimer = 0.045; // 45ms flash
  }

  update(dt) {
    if (this.muzzleLightTimer > 0) {
      this.muzzleLightTimer -= dt;
      if (this.muzzleLightTimer <= 0) {
        this.muzzleLight.intensity = 0;
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
}

