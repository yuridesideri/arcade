import {Scene, PerspectiveCamera, WebGLRenderer} from "three";

export function createWorld(parentElement: HTMLElement): {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
} {
	const scene = new Scene();

	const camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	const renderer = new WebGLRenderer();

	renderer.setSize(window.innerWidth, window.innerHeight);
	parentElement.appendChild(renderer.domElement);
	return { scene, camera, renderer };
}
