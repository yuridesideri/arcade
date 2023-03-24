import { Camera, PerspectiveCamera, Renderer } from "three";
import { parseControlLogaritm } from "../helpers/helpers";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

export function gameControls(camera: Camera, renderer: Renderer): {active: boolean, cameraDebugger: () => void} {
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
	return {active: true, cameraDebugger}
}


export function testingControlsCreator(renderer: Renderer) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    const controls = new FirstPersonControls(camera, renderer.domElement);
    return controls;
}
