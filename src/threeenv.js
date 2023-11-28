import './threestyle.css';
import { Color } from 'three';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
// import {TTFLoader, TtfLoader} from 'three/examples/jsm/loaders/TTFLoader';
import * as dat from 'dat.gui'
import { Mesh } from 'three';
///
console.time(); //
const scene = new THREE.Scene;

//New camera object
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1,1000)

//new render onject 
const renderer = new THREE.WebGLRenderer ({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

camera.position.setZ(30); 
renderer.render(scene,camera);
// axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper)
//const new object
const geometry = new THREE.TorusGeometry(10,3,16,100)

//comst materials
//const materials = new THREE.MeshBasicMaterial({color:0xffffff ,wireframe : true});

//mesh standard materials
const materials = new THREE.MeshStandardMaterial({color:0xffffff,wireframe : true});

//
const torus = new THREE.Mesh(geometry, materials);

//add obnject
scene.add(torus);


//add controls to the scene
const controls = new OrbitControls(camera, renderer.domElement);

///////recursive function//////////

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene,camera);
  controls.update();
}


animate();
torus.visible = false;
//Lighting
// const pointLight =new THREE.PointLight(0xffffff)
// pointLight.position.set(20,20,20)

// scene.add(pointLight)

// const lightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(lightHelper)

//debug GUI IMportant

//console.log(dat);
const gui = new dat.GUI();
const torusDetails = gui.addFolder('torusDetails');
const position = torusDetails.addFolder('position');

//tweakers
position.add(torus.position, 'y',-30,30, .01);
position.add(torus.position, 'x',-30,30, .01);
position.add(torus.position, 'z',-30,30, .01);

torusDetails.add(torus, 'visible');
torusDetails.add(materials, 'wireframe');

const controler =gui.addFolder('Orbit Controler');

controler.add(controls,'enabled')
//control the material color is bit hard
//first we need a const to manipluate

const parameterColor ={
  color: 0xffffff
}

//we will update this parameter
torusDetails.addColor(parameterColor,'color').onChange(()=>{
  //materials.color = parameterColor; //cant be done4
  materials.color.set(parameterColor.color);

}) 
//pointlightGui
// const pointLightControl =gui.addFolder('LightVisiblity');
// pointLightControl.add(pointLight, 'intensity', -10,10,1);
// pointLightControl.add(pointLight, 'visible');


const grid = new THREE.GridHelper(200,10)
scene.add(grid);

///

//add texture to cube

/* one hella tough way

const image =new Image();
const texture = new THREE.Texture(image);
image.onload =()=>{
  texture.needsUpdate = true;
}
image.src = '/static/img/ao.jpg';
image.src = '/static/img/arm.jpg';
image.src = '/static/img/bump.png';
image.src = '/static/img/diffuse.jpg';
image.src = '/static/img/metallic.jpg';
image.src = '/static/img/normal.png';
image.src = '/static/img/roughness.png';
image.src = '/static/img/specular.png';
*/

//another
const loadingManager =new THREE.LoadingManager;
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture= textureLoader.load('/static/img/ao.jpg')
const armTexture= textureLoader.load('/static/img/arm.jpg')
const bumpTexture= textureLoader.load('/static/img/bump.png')
const diffuseTexture= textureLoader.load('/static/img/diffuse.jpg')
const metallicTexture= textureLoader.load('/static/img/metallic.png')
const normalTexture= textureLoader.load('/static/img/normal.png')
const roughnessTexture= textureLoader.load('/static/img/roughness.png')
const specularTexture= textureLoader.load('/static/img/specular.png')

//new onject

const box = new THREE.BoxGeometry(10,10,10);
const boxTexture =new THREE.MeshStandardMaterial({map: colorTexture , wireframe: false});
boxTexture.aoMap=colorTexture;
boxTexture.roughnessMap = roughnessTexture;
boxTexture.metalnessMap = metallicTexture;
boxTexture.normalMap = normalTexture;
boxTexture.bumpMap = bumpTexture;
const cube =new THREE.Mesh(box, boxTexture);
cube.position.x =0;
cube.position.y =0;
cube.position.z =0;

cube.visible = false;
///
scene.add(cube);


//gui for cube

const cubeControl =gui.addFolder('cubeDetails');
const cubePosition =cubeControl.addFolder('cubePosition');
cubePosition.add(cube.position, 'x');
cubePosition.add(cube.position, 'y');
cubePosition.add(cube.position, 'z');

cubeControl.add(cube,'visible');
cubeControl.add(boxTexture, 'wireframe');

/*not required due to external materials
const colorParam={
  color:0xffffff,
}

cubeControl.addColor(colorParam, 'color').onChange(()=>{
  texture.color.set(colorParam.color);
})
*/

////
  
// text geometry
const fontLoader = new FontLoader();
fontLoader.load('/static/helvetiker_regular.typeface.json',
(font)=>{
  console.log('font loaded');
  const textGeom = new TextGeometry('Hello world',{
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5
  })
const matTexture = textureLoader.load('/textures/matcaps/7.png')
const textMat = new THREE.MeshMatcapMaterial({matcap:matTexture});
const text = new THREE.Mesh(textGeom, textMat)
textGeom.center()
text.visible = false;

const textControl = gui.addFolder('textControl')
textControl.add(text,'visible')
scene.add(text);

// textGeom.computeBoundingBox()
// textGeom.translate(
//   - (textGeom.boundingBox.max.x-0.02)*0.5,
//   - (textGeom.boundingBox.max.y-0.0330071449279785) *0.5,
//   - (textGeom.boundingBox.max.z -0.0299999937415)*0.5 
// )
// console.time('donuts')
// const donutGeom = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
// const donutMat= new THREE.MeshMatcapMaterial({matcap: matTexture})

//  //loop
//  for(let i=0; i<100; i++) {
//   // const donutMesh = new THREE.Mesh(donutGeom, donutMat)
//   // donutMesh.visible = false;

//   donutMesh.position.x = (Math.random()-0.5) * 10
//   donutMesh.position.y = (Math.random()-0.5 )* 10
//   donutMesh.position.z = (Math.random()-0.5)*10
//   donutMesh.rotation.x = Math.random()* Math.PI
//   const scale = Math.random()
//   donutMesh.scale.set(scale, scale,scale)
//   scene.add(donutMesh)
//   // const donutControl = gui.addFolder('Donut Control')
//   // donutControl.add(donutMesh,'visible')
// }


// console.timeEnd('donuts')

const donutGeom = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMat = new THREE.MeshMatcapMaterial({ matcap: matTexture });

const donuts = []; // Array to store donut meshes

// loop
for (let i = 0; i < 100; i++) {
  const donutMesh = new THREE.Mesh(donutGeom, donutMat);
  donutMesh.visible = false;

  donutMesh.position.x = (Math.random() - 0.5) * 10;
  donutMesh.position.y = (Math.random() - 0.5) * 10;
  donutMesh.position.z = (Math.random() - 0.5) * 10;
  donutMesh.rotation.x = Math.random() * Math.PI;
  const scale = Math.random();
  donutMesh.scale.set(scale, scale, scale);

  donuts.push(donutMesh); // Add the donut mesh to the array

  scene.add(donutMesh);
}

// GUI for all donuts visibility
const donutControl = gui.addFolder('Donuts Visibility');
donutControl.add({ showAll: false }, 'showAll').name('Show All').onChange((value) => {
  for (const donut of donuts) {
    donut.visible = value;
  }
});

}
)
// const textControl = new gui.addFolder('textControl');
// const textPosition = new gui.addFolder('textPosition')
// textPosition.add(text.position, 'x')
// textPosition.add(text.position, 'y')
// textPosition.add(text.position, 'z')
// textControl.add(text,'visible')
// textControl.add(textMat, 'wireframe')

///add donuts

//plane

const planeGeom = new  THREE.PlaneGeometry(25,25,25)
const planematTexture = textureLoader.load('/textures/matcaps/3.png')
const planeMat = new THREE.MeshMatcapMaterial({matcap: planematTexture})
const planeMat1 = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.2})

const planeMesh = new THREE.Mesh(planeGeom, planeMat1)

planeMesh.rotation.x= -Math.PI*0.5
planeMesh.position.y= 0;
scene.add(planeMesh)
planeMesh.receiveShadow = true;

/// GUI Plane///
const planeControl =gui.addFolder('planeDetails');
const planePosition =planeControl.addFolder('planePosition');
const planeRotation =planeControl.addFolder('planeRoatation');
planePosition.add(planeMesh.position, 'x');
planePosition.add(planeMesh.position, 'y');
planePosition.add(planeMesh.position, 'z');


//
const rotationParams = {
  rotationX: planeMesh.rotation.x,
  rotationY: planeMesh.rotation.y,
  rotationZ: planeMesh.rotation.z,
};
planeRotation.add(rotationParams, 'rotationX', -Math.PI, Math.PI).onChange(() => {
  planeMesh.rotation.x = rotationParams.rotationX;
});
planeRotation.add(rotationParams, 'rotationY', -Math.PI, Math.PI).onChange(() => {
  planeMesh.rotation.y = rotationParams.rotationY;
});
planeRotation.add(rotationParams, 'rotationZ', -Math.PI, Math.PI).onChange(() => {
  planeMesh.rotation.z = rotationParams.rotationZ;
});
//

planeControl.add(planeMesh, 'visible');
// cubeControl.add(planeMat, 'wireframe');


//
const sphereGeom = new THREE.SphereGeometry(2, 100, 10)
const sphereMat = new THREE.MeshStandardMaterial({color:0xffffff,wireframe: false,roughness:0.2})
const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat)
scene.add(sphereMesh);
sphereMesh.visible = true;
sphereMesh.position.y = 3;

sphereMesh.castShadow = true;

const sphereControl = gui.addFolder('sphereControl')
const spherePosition = sphereControl.addFolder('spherePosition')
spherePosition.add(sphereMesh.position, 'x').min(-15).max(15).step(0.1);
spherePosition.add(sphereMesh.position, 'y');
spherePosition.add(sphereMesh.position, 'z');
sphereControl.add(sphereMesh, 'visible').name('Visible')






///
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
const Ambient = gui.addFolder('AmbientLight')
Ambient.add(ambientLight, 'intensity').min(0).max(10).step(0.1);

//directoional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.x = 4;
directionalLight.position.y = 10;
scene.add(directionalLight);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width =1024;
directionalLight.shadow.mapSize.height =1024;
//near and far parameters
directionalLight.shadow.camera.near=1;
directionalLight.shadow.camera.far=20;
//size
directionalLight.shadow.camera.top=12;
directionalLight.shadow.camera.bottom=-12;
directionalLight.shadow.camera.left=-12;
directionalLight.shadow.camera.right=12;
//shadow camera
const dHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
dHelper.visible = false;
scene.add(dHelper);

//gui directional light
const directionalControl = gui.addFolder('directionalControl')
directionalControl.add(directionalLight, 'intensity').min(0).max(10).step(0.1);
const directLightColor={ color:0x00fffc }
directionalControl.addColor(directLightColor,'color').onChange(()=>{
  directionalLight.color.set(directLightColor.color);});
  directionalControl.add(dHelper,'visible').name('light helper')
//////////
//enabling the shadow maps in renderer
renderer.shadowMap.enabled=true;
//////
//spotlight
const spotLight =new THREE.SpotLight(0x00fffc, 10,10,Math.PI*0.3)
spotLight.castShadow= true;
spotLight.shadow.mapSize.width=1024
spotLight.shadow.mapSize.height=1024
spotLight.position.set(3,10,3)

spotLight.shadow.camera.far =10;
spotLight.shadow.camera.near =1;
spotLight.shadow.camera.fov =30

const SpotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera, spotLight)
spotLight.visible= false;
SpotLightHelper.visible = false;
scene.add(spotLight,SpotLightHelper,spotLight.target);

//gui spotlights
const spotLightControl = gui.addFolder('spotLight Control')
spotLightControl.add(spotLight.position, 'x')
spotLightControl.add(spotLight.position, 'y')
spotLightControl.add(spotLight.position, 'z')

spotLightControl.add(SpotLightHelper,'visible').name('spotLightHelper')
spotLightControl.add(spotLight, 'visible')

console.timeEnd();