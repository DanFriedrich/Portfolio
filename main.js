import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Daniel from './Daniel3x4.jpg';
import EarthTex from './Earth.jpg';
import EarthNormal from './EarthNormal.jpeg';
import Space from './Space.jpg';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

//Star
const shape = new THREE.Shape();
        const outerRadius = 2;
        const innerRadius = 1;
        const PI2 = Math.PI*2;
        const inc = PI2/10;

        shape.moveTo(outerRadius, 0);
        let inner = true;

        for(let theta = inc; theta<PI2; theta+=inc){
            const radius = (inner) ? innerRadius : outerRadius;
            shape.lineTo(Math.cos(theta)*radius, Math.sin(theta)*radius);
            inner = !inner;
        }

        const extrudeSettings = {
            steps: 1,
            depth: 1,
            bevelEnabled: false
        }

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        const material = new THREE.MeshStandardMaterial( { color: 0x0E1b68 });

        const star = new THREE.Mesh( geometry, material );

        star.position.z = -8;
        star.position.y = 4;
        scene.add(star);

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
const SpaceTexture = new THREE.TextureLoader().load(Space);
scene.background = SpaceTexture;

//Cube
const CubeTexture = new THREE.TextureLoader().load(Daniel);
const Cube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 4, 3),
  new THREE.MeshBasicMaterial({ map: CubeTexture})
);
scene.add(Cube)

Cube.position.z = -10;
Cube.position.setZ(-10);


//Earth
const EarthTexture = new THREE.TextureLoader().load(EarthTex);
const EarthNormalTexture = new THREE.TextureLoader().load(EarthNormal);
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

  Cube.rotation.y += 0.03;
  //Cube.rotation.z += 0.01;

  camera.position.x = t * -0.01;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.0002;
}
document.body.onscroll = moveCamera

function animate(){
  requestAnimationFrame(animate);

  star.rotation.z += 0.01;
  star.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate()