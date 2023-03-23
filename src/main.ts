import "./reset.css";
import { createWorld } from "./world";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gameControls, testingControlsCreator } from "./controls";
import { loadModel } from "./modelLoader";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera:playerCamera, renderer } = createWorld(app!);

const testingControls = testingControlsCreator(renderer);


const gltfLoader = new GLTFLoader();
loadModel(gltfLoader, "/models/pacman_arcade__animation/scene.gltf", scene);



function animate() {
	renderer.render(scene, testingControls.object);
	testingControls.update(1);
	requestAnimationFrame(animate);
	//TODO: abstract playerCamera rotation reset
	if (playerCamera.rotation.x > Math.PI / 12 || playerCamera.rotation.x < -Math.PI / 12) playerCamera.rotation.x = 0;
	if (playerCamera.rotation.y > Math.PI / 12 || playerCamera.rotation.y < -Math.PI / 12) playerCamera.rotation.y = 0;
}
gameControls(playerCamera, renderer);
animate();

function createFloor(scale:number, scene: THREE.Scene) {
	loadModel(gltfLoader, "/models/my_plane/scene.gltf", scene, scale);
	//TODO: generate floor
}