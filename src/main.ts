import "./reset.css";
import { createWorld, sceneResizer } from "./world";
import { gameControls } from "./controls";
import { Raycaster, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { createScreenMesh, loadObjects } from "./objectLoader";
import * as THREE from "three";
import { pacmanGame } from "./PacmanGame/pacmanGame";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);
const { userData:screenData } = createScreenMesh(scene);

const pacManDevCamera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
pacManDevCamera.position.set(0, 50, 25);
pacManDevCamera.rotateX(-0.45);

loadObjects(scene);
sceneResizer(playerCamera, renderer);
const { cameraDebugger } = gameControls(playerCamera, renderer);

window.addEventListener("click", (e) => {
	const raycaster = new Raycaster();
	const pointer = new Vector2();
	pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(pointer, playerCamera);
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length > 0) {
		console.log(intersects);
		intersects.forEach((intersect) => {
			if (
				intersect.object.userData.name ===
					"pac man machine_automat_0.001" &&
				playerCamera.position.z > 26 &&
				!intersect.object.userData.activeAnimation
			) {
				const tween = new TWEEN.Tween({
					z: playerCamera.position.z,
					xRotation: playerCamera.rotation.x,
				})
					.to(
						{
							z: playerCamera.position.z - 75,
							xRotation: playerCamera.rotation.x - Math.PI / 11,
						},
						1000
					)
					.onUpdate((coords) => {
						playerCamera.position.z = coords.z;
						playerCamera.rotation.x = coords.xRotation;
					})
					.onComplete(() => {
						intersect.object.userData.activeAnimation = false;
					})
					.onStart(() => {
						intersect.object.userData.activeAnimation = true;
					});
				tween.start();
			}
		});
	}
});

const pacmanGameLoop = await pacmanGame(renderer);
//gameLoop
function gameLoop() {
	//PRIMARY
	renderer.render(scene, pacManDevCamera);
	TWEEN.update();
	cameraDebugger();
	
	//PACMAN GAME	
	renderer.setRenderTarget(screenData.renderTarget);
	pacmanGameLoop();
	renderer.setRenderTarget(null);

	requestAnimationFrame(gameLoop);
}
gameLoop();
