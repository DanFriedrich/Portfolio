import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//Torus
const geometry = new THREE.TorusGeometry( 10, 1, 16, 100);
const material = new THREE.MeshPhongMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus)

//pointLight
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)
scene.add(pointLight)

//ambientLight
const ambLight = new THREE.AmbientLight(0xffffff)
scene.add(ambLight)

//Helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

//Stars
function addStars(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshPhongMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star)
}
Array(200).fill().forEach(addStars)

//Space
const SpaceTexture = new THREE.TextureLoader().load('img/Space.jpg');
scene.background = SpaceTexture;

//Cube
const CubeTexture = new THREE.TextureLoader().load('img/Daniel3x4.jpg');
const Cube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 4, 3),
  new THREE.MeshBasicMaterial({ map: CubeTexture})
);
scene.add(Cube)

Cube.position.z = -10;
Cube.position.setX(-10);


//Earth
const EarthTexture = new THREE.TextureLoader().load('img/Earth.jpg');
const EarthNormalTexture = new THREE.TextureLoader().load('img/EarthNormal.jpeg')
const Earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ 
    map: EarthTexture,
    normalMap: EarthNormalTexture
  })
);
scene.add(Earth)

Earth.position.z = 30;
Earth.position.setX(-10);

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;

  Earth.rotation.y += 0.02;

  Cube.rotation.y += 0.01;
  Cube.rotation.z += 0.01;

  camera.position.x = t * -0.01;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.0002;
}
document.body.onscroll = moveCamera

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.x += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate()