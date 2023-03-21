import "./style.css";
import * as THREE from "three";

//canvas
const canvas = document.querySelector("#webgl");

//シーン
const scene = new THREE.Scene();

// canvasのサイズを指定
const width = window.innerWidth; //ブラウザの横の長さ
const height = window.innerHeight; //ブラウザの縦の長さ


// 背景用のテクスチャ
// const textureLoader = new THREE.TextureLoader();
// const baTexture = textureLoader.load("bg/bg3.jpeg");
// scene.background = baTexture;

//サイズ
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

// ライトを作る
const light = new THREE.AmbientLight(0xFFFFFF, 1.0); //環境光源（色、光の強さ）
light.position.set(0, 0, 0);
scene.add(light);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// オブジェクトを作成
const x_size = window.innerWidth;
const y_size = window.innerHeight;
const length = 600;
const plane_scale = 3;
const plane_scale02 = 10;
const plane = [];

for (let i = 0; i < length; i++) {
  let geometry = new THREE.PlaneGeometry(plane_scale, plane_scale02);
  var material = new THREE.MeshBasicMaterial({
    color: '0xffffff',
    opacity: 0.4,
    transparent: true,
    side: THREE.DoubleSide
  });
  plane[i] = new THREE.Mesh(geometry, material);

  plane[i].position.x = x_size * (Math.random() - 0.5) * -3;
  plane[i].position.y = y_size * (Math.random() - 0.5) * -3;
  plane[i].position.z = x_size * (Math.random() - 0.5) * 3 + 100;
  scene.add(plane[i]);
}

function random(min, max) {
  let rand = Math.floor((min + (max - min + 1) * Math.random()));
  return rand;
}

// box
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial({color: '0xffffff'});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
box1.position.set(-20, 20.5, -18);
box1.rotation.set(1, 1, 0);

const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
box2.position.set(20, 20.5, -18);
box2.rotation.set(1, 1, 0);

const box3 = new THREE.Mesh(boxGeometry, boxMaterial);
box3.position.set(-20, -19.5, -18);
box3.rotation.set(1, 1, 0);

const box4 = new THREE.Mesh(boxGeometry, boxMaterial);
box4.position.set(20, -19.5, -18);
box4.rotation.set(1, 1, 0);

for (let i = 0; i < 200; i++) {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);

  //位置をランダムに決める
  
  let x_position = 80 * (2.0 * Math.random() - 1.0);
  let y_position = 80 * (2.0 * Math.random() - 1.0);
  let z_position = 80 * (2.0 * Math.random() - 1.0);
  
  if (x_position <= 15 && x_position >= 0){
    x_position += 15;
  } else if (x_position >= -15 && x_position < 0){
    x_position -= 15;
  } else if (y_position <= 15 && y_position >= 0){
    y_position += 15;
  } else if (y_position >= -15 && y_position < 0){
    y_position -= 15;
  } else if (z_position <= 15 && z_position >= 0){
    z_position += 15;
  } else if (z_position >= -15 && z_position < 0){
    z_position -= 15;
  };

  mesh.position.x = x_position
  mesh.position.y = y_position
  mesh.position.z = z_position

  //回転度合をランダムに決める
  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;
  mesh.rotation.z = Math.random() * Math.PI;
  mesh.matrixAutoUpdate = false; //自動で行列計算されるのを制御する
  mesh.updateMatrix(); //手動で行列更新する。

  scene.add(mesh);
}


// torus
const torusGeometry = new THREE.TorusGeometry(8, 1, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial({color: '0xffffff'});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

const torusGeometry2 = new THREE.TorusGeometry(16, 1, 8, 6);
const torusMaterial2 = new THREE.MeshNormalMaterial();
const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
torus2.position.set(0, 0.5, 2);

scene.add(box, torus, box1, box2, box3, box4, torus2);

// 線型補完で滑らかに移動させる
// xからyに
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}
// スタートからエンドまでの一を示す関数
function scalePercent(start, end) {
  return ((scrollPercent - start) / (end - start))
}

// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40))
    torus.position.z = lerp(10, -25, scalePercent(0, 40))

    torus.rotation.x = lerp(0, Math.PI, scalePercent(0, 40))
    torus2.rotation.x = lerp(0, 0, scalePercent(0, 40))
    box.rotation.x += 0.05;
  }
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60))
    box1.position.x = lerp(-20, 0, scalePercent(40, 60))
    box1.position.y = lerp(20.5, 0.5, scalePercent(40, 60))
    box1.position.z = lerp(-18, 2, scalePercent(40, 60))

    box2.position.x = lerp(20, 0, scalePercent(45, 60))
    box2.position.y = lerp(20.5, 0.5, scalePercent(45, 60))
    box2.position.z = lerp(-18, 2, scalePercent(45, 60))

    box3.position.x = lerp(-20, 0, scalePercent(50, 60))
    box3.position.y = lerp(-19.5, 0.5, scalePercent(50, 60))
    box3.position.z = lerp(-18, 2, scalePercent(50, 60))

    box4.position.x = lerp(20, 0, scalePercent(55, 60))
    box4.position.y = lerp(-19.5, 0.5, scalePercent(55, 60))
    box4.position.z = lerp(-18, 2, scalePercent(55, 60))

    torus.rotation.x += 0.05;

  }
});


animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box1.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 25, scalePercent(60, 80));

    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    box1.rotation.x += 0.02;
    box1.rotation.y += 0.02;
    box2.rotation.z += 0.03;
    box2.rotation.y += 0.03;
    box3.rotation.x += 0.04;
    box3.rotation.z += 0.04;
    box4.rotation.x += 0.05;
    box4.rotation.y += 0.05;

    // torus.scale.set(5,5,5);
    torus.position.x = lerp(0, 0, scalePercent(60, 80))
    torus.position.y = lerp(1, 0.5, scalePercent(60, 80))
    torus.position.z = lerp(-25, 2, scalePercent(60, 80))

    torus.rotation.x += 0.05;
    torus2.rotation.x = lerp(0, -Math.PI * 0.5, scalePercent(60, 80))

  }
});

animationScripts.push({
  start: 80,
  end: 110,
  function() {
    camera.lookAt(box1.position);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    box1.rotation.x += 0.02;
    box1.rotation.y += 0.02;
    box2.rotation.z += 0.03;
    box2.rotation.y += 0.03;
    box3.rotation.x += 0.04;
    box3.rotation.z += 0.04;
    box4.rotation.x += 0.05;
    box4.rotation.y += 0.05;

    torus.rotation.x += 0.05;

    torus2.rotation.x -= 0.03;
  }
});

// アニメーションを開始
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent < animation.end) {
      animation.function();
    }
  });
}

//ブラウザのスクロール率を取得
let scrollPercent = 0;
document.body.onscroll = () => {
  // scrollPercent = (document.documentElement.scrollTop /
  //   (document.documentElement.scrollHeight -
  //     document.documentElement.clientHeight)) * 100
  scrollPercent = 0
  console.log(scrollPercent);
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();

  for (let i = 0; i < length; i++) {
    plane[i].position.x += (random(-5, 5) * 0);
    plane[i].position.y += 5.5;
    if (plane[i].position.y > height) {
      plane[i].position.x = x_size * (Math.random() - 0.5);
      plane[i].position.y = 0;
    }
  }

  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});