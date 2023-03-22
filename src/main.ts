import "./reset.css";
import { createWorld } from "./world";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera, renderer } = createWorld(app!);

const keyLight = new THREE.AmbientLight(0xffffff);
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(keyLight);
keyLight.position.set(40, 100, 50);

const gltfLoader = new GLTFLoader();
loadModel(gltfLoader, "/models/pacman_arcade__animation/scene.gltf", scene);
camera.position.set(0, 100, 100);
camera.rotateY(Math.PI);

renderer.setClearColor("gray", 1);
function animate() {
	controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();


function loadModel(model: GLTFLoader, path: string, scene: THREE.Scene){
	model.load(
		path,
		function (gltf) {
			scene.add(gltf.scene);
			gltf.animations;
			Array<THREE.AnimationClip>;
			gltf.scene;
			THREE.Group;
			gltf.scenes;
			Array<THREE.Group>;
			gltf.cameras;
			Array<THREE.Camera>;
			gltf.asset;
			Object;
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.log("An error happened: ", error);
		}
	);
}