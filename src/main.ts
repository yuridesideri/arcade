import "./reset.css";
import { createWorld, sceneResizer } from "./world";
import { gameControls } from "./controls";
import { Raycaster, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { createScreenMesh, loadArcade, loadObjects } from "./objectLoader";
import * as THREE from "three";
import { pacmanGame } from "./PacmanGame/pacmanGame";
import {
	CSS3DObject,
	CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { GameOptions } from "./PacmanGame/Screen/PacManOptions/pacmanOptions";
import { ScreenTypes } from "./types/pacmanGame";
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);
const screenMesh = createScreenMesh(scene);
const screenData = screenMesh.userData;
export const Screen: ScreenTypes = { gameStatus: "Options" };

//USER
// const score = localStorage.getItem("score") || localStorage.setItem("score", "0");

//3d css renderer
const css3DRenderer = new CSS3DRenderer({element: app!});
css3DRenderer.setSize(window.innerWidth, window.innerHeight);
css3DRenderer.domElement.style.position = "absolute";
css3DRenderer.domElement.style.top = "0";
css3DRenderer.domElement.style.pointerEvents = "none";
const HTMLObject = new CSS3DObject(GameOptions(startGame));
HTMLObject.scale.set(0.1, 0.1, 0.1);
screenMesh.add(HTMLObject);

//Testing

//
const pacManDevCamera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
pacManDevCamera.position.set(0, 50, 25);
pacManDevCamera.rotateX(-0.45);
loadObjects(scene);
const arcade = await loadArcade(scene);
sceneResizer(playerCamera, renderer, css3DRenderer);
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

let pacmanGameLoop: () => void, pacmanGameCleanUp: () => void;

async function startGame() {
	Screen.gameStatus = "Game";
	console.log(Screen.gameStatus)
	pacmanGameCleanUp && pacmanGameCleanUp();
	const newGame = await pacmanGame(renderer, HTMLObject);
	pacmanGameLoop = newGame.pacmanGameLoop;
	pacmanGameCleanUp = newGame.pacmanGameCleanUp;
}

//gameLoop
function gameLoop() {
	//PRIMARY
	renderer.render(scene, pacManDevCamera);
	TWEEN.update();
	cameraDebugger();

	//PACMAN GAME
	renderer.setRenderTarget(screenData.renderTarget);
	if (Screen.gameStatus === "Game" && pacmanGameLoop) {
		pacmanGameLoop();
	}
	renderer.setRenderTarget(null);
	//CSS RENDERER
	css3DRenderer.render(scene, pacManDevCamera);

	requestAnimationFrame(gameLoop);
}
gameLoop();
