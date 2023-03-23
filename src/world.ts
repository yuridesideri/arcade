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

	const fillLight = new THREE.PointLight(0xffffff, 0.5);
	fillLight.position.set(0, 100, 0);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(40, 100, -30);
	directionalLight.castShadow = true; // default false
	const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
	
	const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight2.position.set(-40, 200, -30);
	directionalLight2.castShadow = true; // default false
	const directionalLight2Helper = new THREE.DirectionalLightHelper(directionalLight2, 10);

	const sphereSize = 1;
	const pointLightHelper = new THREE.PointLightHelper(fillLight, sphereSize);
	

	const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
	hemiLight.position.set(0, 300, 0);
	scene.add(hemiLight);
	scene.add(pointLightHelper, directionalLightHelper, directionalLight2Helper);
	scene.add(pointLightHelper, directionalLight, directionalLight2);
	const gridHelper = new THREE.GridHelper(1000, 10);
	scene.add(gridHelper);

	renderer.setSize(window.innerWidth, window.innerHeight);
	parentElement.appendChild(renderer.domElement);
	return { scene, camera, renderer };
}
