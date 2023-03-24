import "./reset.css";
import { createFloor, createWorld, sceneResizer } from "./world";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gameControls, testingControlsCreator } from "./controls";
import { loadArcade, loadLamp } from "./modelLoader";
import { Raycaster, Vector2, Vector3 } from "three";
import { createScreen } from "./screen";
import TWEEN from "@tweenjs/tween.js";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);

// const userControlInterface: UserControlInterface = updateUserControlInterface();

// type UserControlInterface = {
// 	clickMouse: Vector2;
// 	moveMouse: Vector2;
// };

// const useControlsInterface = () => {
// 	const setClickMouse = new Vector2();
// 	const setMoveMouse = new Vector2();

// 	const mouseDown = (e: MouseEvent) => {
// 		setClickMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
// 		setClickMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
// 		const intersects = raycaster.intersectObjects(scene.children);
// 		if (intersects.length > 0) {
// 			console.log(intersects[0].object);
// 		}
// 	};
// 	const mouseMove = (e: MouseEvent) => {
// 		setMoveMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
// 		setMoveMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
// 	};
// 	//event listeners options
// 	window.addEventListener("mousedown", mouseDown);
// 	window.addEventListener("mousemove", mouseMove);

// 	return { updateControlInterface, controlInterface };
// };

function gameLoop() {
	renderer.render(scene, playerCamera);
	testingControls.update(1);
	TWEEN.update();
	cameraDebugger();
	window.requestAnimationFrame(gameLoop);
}

// const testRenderer = loadTest(scene);
const testingControls = testingControlsCreator(renderer);
const gltfLoader = new GLTFLoader();
loadArcade(gltfLoader, "/models/pac-man-machine-edited/scene.gltf", scene);
loadLamp(
	gltfLoader,
	"/models/ceiling_lamp_version_01/scene.gltf",
	scene,
	0.15,
	new Vector3(0, 130, 0)
);
createScreen(scene);
createFloor(10, scene, gltfLoader);
sceneResizer(playerCamera, renderer);
const { cameraDebugger } = gameControls(playerCamera, renderer);
gameLoop();

const raycaster = new Raycaster();
//raycaster may be about point relative to camera

window.addEventListener("click", (e) => {
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length > 0) {
		console.log(intersects);
		//BUG: Machine is being clicked anywhere on the screen
		intersects.forEach((intersect) => {
			if (
				intersect.object.userData.name ===
				"pac man machine_automat_0.001"
			) {
				const tween = new TWEEN.Tween({
					z: playerCamera.position.z,
					xRotation: playerCamera.rotation.x,
				}).to({ z: playerCamera.position.z - 75, xRotation: playerCamera.rotation.x - Math.PI/12 }, 1000).onUpdate((coords) => {
					playerCamera.position.z = coords.z;
					playerCamera.rotation.x = coords.xRotation;
				})
				tween.start()
			}
		});
	}
});
