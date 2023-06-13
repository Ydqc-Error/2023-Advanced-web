// import * as THREE from 'three'
// import * as FBXLoader from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/FBXLoader.js'


const scene = new THREE.Scene();

const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
const VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.3, FAR = 1000;
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.position.set(0, 20, 50);
camera.lookAt(new THREE.Vector3(0, 15, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
document.body.appendChild(renderer.domElement);

// soft white light
const light = new THREE.AmbientLight(0xaaaaaa);
scene.add(light);


// ⾸先创建⼀个盒⼦⽴⽅体，⻓宽⾼设为500
const skyBoxGeometry = new THREE.BoxGeometry(500, 500, 500);
const textureLoader = new THREE.TextureLoader();
const skyBoxMaterial = [
    new THREE.MeshBasicMaterial({
        map:
            textureLoader.load('./assets/textures/skybox/px.jpg'), side: THREE.BackSide
    }), // right
    new THREE.MeshBasicMaterial({
        map:
            textureLoader.load('./assets/textures/skybox/nx.jpg'), side: THREE.BackSide
    }), // left
    new THREE.MeshBasicMaterial({
        map:
            textureLoader.load('./assets/textures/skybox/py.jpg'), side: THREE.BackSide
    }), // top
    new THREE.MeshBasicMaterial({
        map:
            textureLoader.load('./assets/textures/skybox/ny.jpg'), side: THREE.BackSide
    }), //bottom

    new THREE.MeshBasicMaterial({
        map:
            textureLoader.load('./assets/textures/skybox/pz.jpg'), side: THREE.BackSide
    }), // back
    new THREE.MeshBasicMaterial({
        map:
            textureLoader.load('./assets/textures/skybox/nz.jpg'), side: THREE.BackSide
    }) // front
];
// 创建天空盒⼦并添加到场景
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);


textureLoader.load('./assets/textures/floor/sky.jpg', function
    (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    const floorMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    const floorGeometry = new THREE.PlaneGeometry(500, 500, 5, 5);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
})
// 加载模型
var game;
document.addEventListener("DOMContentLoaded", function () { game = new Game(); });
// model
// const fbxloader = new THREE.FBXLoader();
// fbxloader.load('./assets/fbx/Doctor.fbx', function (object) {

//     mixer = new THREE.AnimationMixer(object);

//     const action = mixer.clipAction(object.animations[0]);
//     action.play();

//     object.traverse(function (child) {

//         if (child.isMesh) {

//             child.castShadow = true;
//             child.receiveShadow = true;

//         }

//     });

//     scene.add(object);

// });
// 修改fpc的构造，传⼊参数camera
const fpc = new FirstPersonControls(camera);
fpc.connect();
// 向场景添加⽤于控制相机的Object
scene.add(fpc.yawObject);


window.addEventListener("resize", onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


let clock = new THREE.Clock();
function render() {
    fpc.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();