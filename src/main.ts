import "./reset.css";
import { createWorld, sceneResizer } from "./world";
import { gameControls, testingControlsCreator } from "./controls";
import { Raycaster, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { loadObjects } from "./objectLoader";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);


function gameLoop() {
	renderer.render(scene, playerCamera);
	testingControls.update(1);
	TWEEN.update();
	cameraDebugger();
	window.requestAnimationFrame(gameLoop);
}

// const testRenderer = loadTest(scene);
const testingControls = testingControlsCreator(renderer);
loadObjects(scene);
sceneResizer(playerCamera, renderer);
const { cameraDebugger } = gameControls(playerCamera, renderer);
gameLoop();


window.addEventListener("click", (e) => {
	const raycaster = new Raycaster();
	const pointer = new Vector2();
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera( pointer, playerCamera );
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length > 0) {
		console.log(intersects);
		intersects.forEach((intersect) => {
			if (
				intersect.object.userData.name ===
				"pac man machine_automat_0.001"
				&& playerCamera.position.z > 26
				&& !intersect.object.userData.activeAnimation
			) {
				const tween = new TWEEN.Tween({
					z: playerCamera.position.z,
					xRotation: playerCamera.rotation.x,
				}).to({ z: playerCamera.position.z - 75, xRotation: playerCamera.rotation.x - Math.PI/11 }, 1000).onUpdate((coords) => {
					playerCamera.position.z = coords.z;
					playerCamera.rotation.x = coords.xRotation;
				}).onComplete(() => {
					intersect.object.userData.activeAnimation = false;
				}).onStart(() => {
					intersect.object.userData.activeAnimation = true;
				}) 
				tween.start()
			}
		});
	}
});
