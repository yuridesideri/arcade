import { Camera, PerspectiveCamera, Raycaster, Renderer, Scene, Vector2 } from "three";
import { parseControlLogaritm } from "../helpers/helpers";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import TWEEN from "@tweenjs/tween.js";
import { movePacmanEvent } from "../events";

export function gameControls(camera: Camera, renderer: Renderer, scene: Scene): {active: boolean} {
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

	addEventListener("mouseout", (e: MouseEvent) => {
		if (e.relatedTarget === null && !camera.userData.animation) {
			camera.userData.animation = true;
			const centerCamera = new TWEEN.Tween(camera.rotation);
			centerCamera
				.to({x: camera.userData.pacmanScreen ? - Math.PI / 7 : -Math.PI/24, y: 0}, 500)
				.easing(TWEEN.Easing.Quadratic.Out)
				.start().onComplete(() => {
					camera.userData.animation = false;
				})
		}
	})

	//Looking around
	addEventListener("mousemove", (e) => {
		const deltaX = e.movementX;
		const deltaY = e.movementY;
		console.log(e);
		if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) return;
		mouseX = e.clientX;
		mouseY = e.clientY;
		dynamicIncrementX = parseControlLogaritm(Math.abs(mouseX - screenMiddleX), dynamicIncrementXConst, dynamicIncrementXConst);
		dynamicIncrementY = parseControlLogaritm(Math.abs(mouseY - screenMiddleY), dynamicIncrementYConst, dynamicIncrementYConst);
		camera.rotation.y -= deltaX * dynamicIncrementX;
		camera.rotation.x -= deltaY * dynamicIncrementY;
		cameraDebugger();
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
							camera.userData.pacmanScreen = true;
						});
					tween.start();
				}
			});
		}
	});

	return {active: true}
}

export function pacmanControlsInterface(){
	//Functions
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
	
	//EventListeners
	addEventListener("keydown", keydownEventHandler)
	const clearMobileEvent = mobilePacmanControls();

	function cleanUpEvents(){
		removeEventListener("keydown", keydownEventHandler)
		clearMobileEvent();
	}
	return cleanUpEvents;
}

function mobilePacmanControls(){
document.addEventListener('touchstart', onTouchStart, false);
document.addEventListener('touchend', onTouchEnd, false);

let touchStartX = 0;
let touchStartY = 0;

const TOUCH_THRESHOLD = 30;

function onTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY; 
}

function onTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX; 
  const touchEndY = event.changedTouches[0].clientY; 

  const swipeDistanceX = touchEndX - touchStartX;
  const swipeDistanceY = touchEndY - touchStartY;

  
  if (!(Math.abs(swipeDistanceX) > TOUCH_THRESHOLD || Math.abs(swipeDistanceY) > TOUCH_THRESHOLD)) return;
  
  if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)){
	  if (swipeDistanceX > 0) {
		  movePacmanEvent.dynamicInfo = "right";
		} else {
			movePacmanEvent.dynamicInfo = "left";
		}
	} else {
		if (swipeDistanceY > 0) {
			movePacmanEvent.dynamicInfo = "down";
		} else {
			movePacmanEvent.dynamicInfo = "up";
		}
	}
	
	 dispatchEvent(movePacmanEvent);
}

 function clearEvents (){
	document.removeEventListener('touchstart', onTouchStart, false);
	document.removeEventListener('touchend', onTouchEnd, false);
 }

 return clearEvents;

}

export function testingControlsCreator(renderer: Renderer) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    const controls = new FirstPersonControls(camera, renderer.domElement);
    return controls;
}
