import "./reset.css";
import { createWorld, sceneResizer } from "./world";
import { gameControls, testingControlsCreator } from "./controls";
import { CubeCamera, Raycaster, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { createPacman, createScreenMesh, loadObjects } from "./objectLoader";
import * as THREE from "three";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);
const { renderTarget, secondaryCamera, secondaryScene } =
	createScreenMesh(scene);
let animationMixer: THREE.AnimationMixer;

const pacManCamera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
pacManCamera.position.set(0, 50, 25);
pacManCamera.rotateX(-0.45);

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

const pacmanControls = {
	speed: 0.001,
	direction: new THREE.Vector2(1, 0),
};

const userControls = {
	up: false,
	down: false,
	left: false,
	right: false,
};

function mapColisionChecker(pacmanPosition: THREE.Vector2, map: Vector2[]) {
	const pacmanPositionRounded = new THREE.Vector2(
		Math.round(pacmanPosition.x * 100) / 100,
		Math.round(pacmanPosition.y * 100) / 100
	);

	return map.some(
		(vector2) =>
			vector2.x === pacmanPositionRounded.x &&
			vector2.y === pacmanPositionRounded.y
	);
}

//PAC MAN GAME

const geo = new THREE.PlaneGeometry(0.3, 0.3);
const mat = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(geo, mat);
const z = 0.1;
secondaryScene.add(cube);
const size = 10;
const divisions = 32;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.rotateX(Math.PI / 2);
gridHelper.position.set(0, 0, 0.001);

const texture = new THREE.TextureLoader().load(
	"textures/pac-man-screen/screen-texture.png"
);
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshBasicMaterial({ map: texture });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.position.set(0, 0, 0);
secondaryScene.add(plane);

//mapping the texture:
const startingPoint = new THREE.Vector2(0, -0.65);
const { pacman, mixer } = await createPacman(secondaryScene, startingPoint);
animationMixer = mixer;

let t = startingPoint;
t = new THREE.Vector2(0, -0.65);

const moveTo = t;
pacman.position.set(moveTo.x, moveTo.y, z);

//map

const map = [
	[0.53, 4.32, {x:[1], y:[-1]}], [2.6, 4.32, {x:[1,-1], y:[-1]}], [4.35, 4.32, {x:[-1], y:[-1]}],
	[0.53, 3.15, {x:[1,-1], y:[1]}], [1.58, 3.15, {x:[1,-1], y:[-1]}], [2.6, 3.15, {x:[1,-1], y:[1,-1]}], [4.35, 3.15, {x:[-1], y:[1, -1]}],
	[0.53, 2.23, {x: [1], y:[-1]}], [1.58, 2.23, {x:[-1], y:[1]}], [2.6, 2.23, {x:[1], y:[1, -1]}], [4.35, 2.23, {x:[-1], y:[1]}],
	[0.53, 1.25, {x:[1, -1], y:[1]}], [1.58, 1.25, {x:[-1], y:[-1]}],
	[1.58, 0.35, {x:[1], y:[1, -1]}], [2.6, 0.35, {x:[1,-1], y:[1, -1]}],
	[1.58, -0.65, {x:[-1], y:[1,-1]}],
	[0.53, -1.55, {x:[1], y:[-1]}], [1.58, -1.55, {x:[1, -1], y:[1]}], [2.6, -1.55,{x:[1,-1], y:[1,-1]}], [4.35, -1.55, {x: [-1], y:[-1]}],
	[0.53, -2.53, {x:[1, -1], y: [1]}], [1.58, -2.53,{x:[1, -1], y: [-1]}], [2.6, -2.53, {x:[-1], y:[1, -1]}], [3.65, -2.53, {x:[1], y:[-1]}], [4.35, -2.53, {x:[-1], y:[1]}],
	[0.53, -3.48, {x: [1], y:[-1]}], [1.58, -3.48, {x:[-1], y:[1]}], [2.6, -3.48, {x:[1], y:[1]}], [3.65, -3.48, {x:[1,-1], y:[1]}], [4.35, -3.48, {x: [-1], y:[-1]}],
	[0.53, -4.38, {x:[1,-1], y:[1]}], [4.35, -4.38, {x:[-1], y:[1]}],
	//Retype everything with negative x
	[-0.53, 4.32, {x:[-1], y:[-1]}], [-2.6, 4.32, {x:[-1,1], y:[-1]}], [-4.35, 4.32, {x:[1], y:[-1]}],
	[-0.53, 3.15, {x:[-1,1], y:[1]}], [-1.58, 3.15, {x:[-1,1], y:[-1]}], [-2.6, 3.15, {x:[-1,1], y:[1,-1]}], [-4.35, 3.15, {x:[1], y:[1, -1]}],
	[-0.53, 2.23, {x: [-1], y:[-1]}], [-1.58, 2.23, {x:[1], y:[1]}], [-2.6, 2.23, {x:[-1], y:[1, -1]}], [-4.35, 2.23, {x:[1], y:[1]}],
	[-0.53, 1.25, {x:[-1, 1], y:[1]}], [-1.58, 1.25, {x:[1], y:[-1]}],
	[-1.58, 0.35, {x:[-1], y:[1, -1]}], [-2.6, 0.35, {x:[-1,1], y:[1, -1]}],
	[-1.58, -0.65, {x:[1], y:[1,-1]}],
	[-0.53, -1.55, {x:[-1], y:[-1]}], [-1.58, -1.55, {x:[-1, 1], y:[1]}], [-2.6, -1.55,{x:[-1,1], y:[1,-1]}], [-4.35, -1.55, {x: [1], y:[-1]}],
	[-0.53, -2.53, {x:[-1, 1], y: [1]}], [-1.58, -2.53,{x:[-1, 1], y: [-1]}], [-2.6, -2.53, {x:[1], y:[1, -1]}], [-3.65, -2.53, {x:[-1], y:[-1]}], [-4.35, -2.53, {x:[1], y:[1]}],
	[-0.53, -3.48, {x: [-1], y:[-1]}], [-1.58, -3.48, {x:[1], y:[1]}], [-2.6, -3.48, {x:[-1], y:[1]}], [-3.65, -3.48, {x:[-1,1], y:[1]}], [-4.35, -3.48, {x: [1], y:[-1]}],
	[-0.53, -4.38, {x:[-1,1], y:[1]}], [-4.35, -4.38, {x:[1], y:[1]}],

];

const mapRounded = map.map((point) => {
	return new THREE.Vector2(
		Math.round(point[0] * 100) / 100,
		Math.round(point[1] * 100) / 100
	);
});
//
pacmanControls.speed = 0.01;
pacmanControls.speed = 0;

//gameLoop
function gameLoop() {
	//PACMAN
	renderer.setRenderTarget(renderTarget);
	renderer.render(secondaryScene, secondaryCamera);
	renderer.setRenderTarget(null);

	//PRIMARY
	renderer.render(scene, pacManCamera);
	TWEEN.update();
	cameraDebugger();
	window.requestAnimationFrame(gameLoop);

	//ANIMATION CONFIG
	animationMixer?.update(0.02);

	//PACMAN MOVEMENT
	if (
		mapColisionChecker(
			new Vector2(pacman.position.x, pacman.position.y),
			mapRounded
		)
	) {
		pacmanControls.direction = new THREE.Vector2(0, 1);
		pacmanControls.speed = 0;
		console.log("map colision");
	}
	pacman.position.x += pacmanControls.speed * pacmanControls.direction.x;
	pacman.position.y += pacmanControls.speed * pacmanControls.direction.y;
	if (pacman.position.x > 5){
		pacman.position.x = -5;
	}
}
gameLoop();
