import { Camera, PerspectiveCamera, Raycaster, Renderer, Scene, Vector2 } from "three";
import { parseControlLogaritm } from "../helpers/helpers";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import TWEEN from "@tweenjs/tween.js";
import { movePacmanEvent } from "../events";

export function gameControls(camera: Camera, renderer: Renderer, scene: Scene): {active: boolean, cameraDebugger: () => void} {
	const screenWidth = renderer.domElement.width;
	const screenHeight = renderer.domElement.height;
	const screenMiddleX = screenWidth/2;
	const screenMiddleY = screenHeight/2;
	let mouseX = screenMiddleX;
	let mouseY = screenMiddleY;
	const dynamicIncrementXConst = 0.0005;
	const dynamicIncrementYConst = 0.0005;
	let dynamicIncrementX = dynamicIncrementXConst;
	let dynamicIncrementY = dynamicIncrementYConst;

	function cameraDebugger() {
		if (
			camera.rotation.x > Math.PI / 12 ||
			camera.rotation.x < -Math.PI / 6
		)
			camera.rotation.x = 0;
		if (
			camera.rotation.y > Math.PI / 12 ||
			camera.rotation.y < -Math.PI / 12
		)
			camera.rotation.y = 0;
	}

	//Looking around
	addEventListener("mousemove", (e) => {
		const deltaX = e.clientX - mouseX;
		const deltaY = e.clientY - mouseY;
		mouseX = e.clientX;
		mouseY = e.clientY;
		dynamicIncrementX = parseControlLogaritm(Math.abs(mouseX - screenMiddleX), dynamicIncrementXConst, dynamicIncrementXConst);
		dynamicIncrementY = parseControlLogaritm(Math.abs(mouseY - screenMiddleY), dynamicIncrementYConst, dynamicIncrementYConst);
		camera.rotation.y -= deltaX * dynamicIncrementX;
		camera.rotation.x -= deltaY * dynamicIncrementY;
	})

	//Aproaching machine
	addEventListener("click", (e) => {
		const raycaster = new Raycaster();
		const pointer = new Vector2();
		pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			console.log(intersects);
			intersects.forEach((intersect) => {
				if (
					intersect.object.userData.name ===
						"pac man machine_automat_0" &&
					camera.position.z > 26 &&
					!intersect.object.userData.activeAnimation
				) {
					const tween = new TWEEN.Tween({
						z: camera.position.z,
						xRotation: camera.rotation.x,
					})
						.to(
							{
								z: camera.position.z - 75,
								xRotation: camera.rotation.x - Math.PI / 11,
							},
							1000
						)
						.onUpdate((coords) => {
							camera.position.z = coords.z;
							camera.rotation.x = coords.xRotation;
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

	return {active: true, cameraDebugger}
}

export function pacmanControlsInterface(){
	const keydownEventHandler = (e:KeyboardEvent) => {
		if (e.key === "a") {
			movePacmanEvent.dynamicInfo = "left";
		}
		else if (e.key === "d") {
			movePacmanEvent.dynamicInfo = "right";
		}
		else if (e.key === "w") {
			movePacmanEvent.dynamicInfo = "up";
		}
		else if (e.key === "s") {
			movePacmanEvent.dynamicInfo = "down";
		}
		else {
			return;
		}
		dispatchEvent(movePacmanEvent);
	}
	addEventListener("keydown", keydownEventHandler)
	// addEventListener("touchstart", )
	// addEventListener("touchend", )
	function cleanUpEvents(){
		removeEventListener("keydown", keydownEventHandler)
	}
	return cleanUpEvents;
}

export function testingControlsCreator(renderer: Renderer) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    const controls = new FirstPersonControls(camera, renderer.domElement);
    return controls;
}
