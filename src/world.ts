import * as THREE from "three";

// const mesh = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(mesh, material);
// scene.add(cube);
export function createWorld(parentElement: HTMLElement): {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
} {
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(0, 50, 100);
	camera.rotateX(-Math.PI / 24);

	const renderer = new THREE.WebGLRenderer();
	renderer.setClearColor("#353535");

	const keyLight = new THREE.AmbientLight(0xffffff);
	scene.add(keyLight);
	keyLight.position.set(40, 100, 50);

	const gridHelper = new THREE.GridHelper(1000, 10);
	scene.add(gridHelper);

	renderer.setSize(window.innerWidth, window.innerHeight);
	parentElement.appendChild(renderer.domElement);
	return { scene, camera, renderer };
}
