import { Camera, PerspectiveCamera, Renderer } from "three";
import { parseControlLogaritm } from "../helpers/helpers";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

export function gameControls(camera: Camera, renderer: Renderer): {active: boolean} {
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
	return {active: true}
}


export function testingControlsCreator(renderer: Renderer) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    const controls = new FirstPersonControls(camera, renderer.domElement);
    return controls;
}
