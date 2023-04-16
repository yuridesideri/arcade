import "./reset.css";
import { createWorld, sceneResizer } from "./world";
import { gameControls, pacmanControlsInterface } from "./controls";
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
import { animateMachineControl } from "./animations/animations";
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

const app = document.querySelector<HTMLDivElement>("#app");

export const Screen: ScreenTypes = { gameStatus: "Options" };

async function main(){

const { scene, camera: playerCamera, renderer } = createWorld(app!);
const screenMesh = createScreenMesh(scene);
const screenData = screenMesh.userData;


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
await loadArcade(scene);


sceneResizer(playerCamera, renderer, css3DRenderer);
gameControls(playerCamera, renderer, scene);
pacmanControlsInterface();
animateMachineControl(scene);

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
	renderer.render(scene, playerCamera);
	TWEEN.update();

	//PACMAN GAME
	renderer.setRenderTarget(screenData.renderTarget);
	if (Screen.gameStatus === "Game" && pacmanGameLoop) {
		pacmanGameLoop();
	}
	renderer.setRenderTarget(null);
	//CSS RENDERER
	css3DRenderer.render(scene, playerCamera);

	requestAnimationFrame(gameLoop);
}
gameLoop();

}
main();