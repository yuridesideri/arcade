import "./reset.css";
import { createWorld, sceneResizer } from "./world";
import { gameControls, testingControlsCreator } from "./controls";
import { CubeCamera, Raycaster, Vector2 } from "three";
import TWEEN from "@tweenjs/tween.js";
import { createScreenMesh, loadObjects } from "./objectLoader";
import * as THREE from "three";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera: playerCamera, renderer } = createWorld(app!);
const { renderTarget, secondaryCamera, secondaryScene } =
	createScreenMesh(scene);

	 const pacManCamera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	pacManCamera.position.set(0, 50, 25);
	pacManCamera.rotateX(-0.45);


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
}

loadObjects(scene);
sceneResizer(playerCamera, renderer);
const { cameraDebugger } = gameControls(playerCamera, renderer);
gameLoop();

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




//PAC MAN GAME

const geo = new THREE.PlaneGeometry(0.3, 0.3);
const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }, );
const cube = new THREE.Mesh(geo, mat);
const z = 0.1
secondaryScene.add(cube);
const size = 10;
const divisions = 32;
const gridHelper = new THREE.GridHelper( size, divisions )
gridHelper.rotateX(Math.PI/2);
gridHelper.position.set(0, 0, 0.001);

const texture = new THREE.TextureLoader().load( 'textures/pac-man-screen/screen-texture.png' );
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshBasicMaterial( { map: texture },  );
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.position.set(0, 0, 0);
secondaryScene.add(plane);


//mapping the texture:
const startingPoint = new THREE.Vector2(0, -0.64);
let t = startingPoint;
t = new THREE.Vector2(4.35, -4.38);

const moveTo = t;
cube.position.set(moveTo.x, moveTo.y, z);

//map

const hashmap = {};
const map = [
	[0.53, 4.32], [2.6, 4.32], [4.35, 4.32],
	[0.53, 3.15], [1.58, 3.15], [2.6, 3.15], [4.35, 3.15],
	[0.53, 2.23], [1.58, 2.23], [2.6, 2.23], [4.35, 2.23],
	[0.53, 1.25], [1.58, 1.25], [2.6, 1.25],
	[1.58, 0.35], [2.6, 0.35],
	[1.58, -0.65], [2.6, -0.65],
	[0.53, -1.55], [1.58, -1.55], [2.6, -1.55], [4.35, -1.55],
	[0.53, -2.53], [1.58, -2.53], [2.6, -2.53], [3.65, -2.53], [4.35, -2.53],
	[0.53, -3.48], [1.58, -3.48], [2.6, -3.48], [3.65, -3.48], [4.35, -3.48],
	[0.53, -4.38], [4.35, -4.38],
	//Retype everything with negative x
	[-0.53, 4.32], [-2.6, 4.32], [-4.35, 4.32],
	[-0.53, 3.15], [-1.58, 3.15], [-2.6, 3.15], [-4.35, 3.15],
	[-0.53, 2.23], [-1.58, 2.23], [-2.6, 2.23], [-4.35, 2.23],
	[-0.53, 1.25], [-1.58, 1.25], [-2.6, 1.25],
	[-1.58, 0.35], [-2.6, 0.35],
	[-1.58, -0.65], [-2.6, -0.65],
	[-0.53, -1.55], [-1.58, -1.55], [-2.6, -1.55], [-4.35, -1.55],
	[-0.53, -2.53], [-1.58, -2.53], [-2.6, -2.53], [-3.65, -2.53], [-4.35, -2.53],
	[-0.53, -3.48], [-1.58, -3.48], [-2.6, -3.48], [-3.65, -3.48], [-4.35, -3.48],
	[-0.53, -4.38], [-4.35, -4.38],
	
]

