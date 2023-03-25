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

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geo, mat);
cube.position.set(0, 0, 0);
secondaryScene.add(cube);
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions )
gridHelper.rotateX(Math.PI/2);
secondaryScene.add( gridHelper );

const planeGeo = new THREE.PlaneGeometry(6 * 2, 6 * 2, 16 * 1, 16 * 1);
const planeMat = new THREE.MeshBasicMaterial({ color: 0x000 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.position.set(0, 0, 0);
secondaryScene.add(plane);
