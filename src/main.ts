import "./reset.css";
import { createFloor, createWorld } from "./world";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gameControls, testingControlsCreator } from "./controls";
import { loadArcade, loadLamp } from "./modelLoader";
import { Vector3 } from "three";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);

// const testRenderer = loadTest(scene);
const testingControls = testingControlsCreator(renderer);
const gltfLoader = new GLTFLoader();
loadArcade(gltfLoader, "/models/pac-man-machine-edited/scene.gltf", scene);
loadLamp(
	gltfLoader,
	"/models/ceiling_lamp_version_01/scene.gltf",
	scene,
	0.15,
	new Vector3(0, 140, 0)
);
// loadArcade(gltfLoader, "/models/my_plane/scene.gltf", scene, 10);
createFloor(10, scene, gltfLoader);
gameControls(playerCamera, renderer);
function animate() {
	renderer.render(scene, testingControls.object);
	testingControls.update(1);
	requestAnimationFrame(animate);
	//TODO: abstract playerCamera rotation reset
	if (
		playerCamera.rotation.x > Math.PI / 12 ||
		playerCamera.rotation.x < -Math.PI / 12
	)
		playerCamera.rotation.x = 0;
	if (
		playerCamera.rotation.y > Math.PI / 12 ||
		playerCamera.rotation.y < -Math.PI / 12
	)
		playerCamera.rotation.y = 0;
}

animate();
