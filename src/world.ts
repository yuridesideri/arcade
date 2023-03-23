import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
	renderer.setClearColor(/* "#353535" */"black");
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.outputEncoding = THREE.sRGBEncoding;

	const keyLight = new THREE.AmbientLight(0xffffff);

	const fillLight = new THREE.PointLight(0xffffff, 0.5);
	fillLight.position.set(0, 100, 0);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(40, 100, -30);
	directionalLight.castShadow = true; // default false
	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight,
		5
	);

	const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight2.position.set(-40, 200, -30);
	directionalLight2.castShadow = true; // default false
	const directionalLight2Helper = new THREE.DirectionalLightHelper(
		directionalLight2,
		10
	);
	const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight3.position.set(-40, 200, 30);
	directionalLight3.castShadow = true; // default false
	const directionalLight3Helper = new THREE.DirectionalLightHelper(
		directionalLight3,
		10
	);

	const spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.angle = Math.PI / 6;
	spotLight.castShadow = true; // default false
	spotLight.position.set(20, 150, 0);
	spotLight.penumbra = 0.5;
	scene.add(spotLight);
	const spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
	spotLight2.angle = Math.PI / 6;
	spotLight2.position.set(-20, 150, 30);
	spotLight2.decay = 0.5
	spotLight2.penumbra = 0.5
	scene.add(spotLight2);


	const helper = new THREE.CameraHelper(spotLight.shadow.camera);
	scene.add(helper);


	parentElement.appendChild(renderer.domElement);
	return { scene, camera, renderer };
}

export function createFloor(
	scale: number,
	scene: THREE.Scene,
	gltfLoader: GLTFLoader
) {
	function loadModel(
		model: GLTFLoader,
		path: string,
		scene: THREE.Scene,
		scale?: number,
		position?: THREE.Vector3
	) {
		model.load(
			path,
			function (gltf) {
				if (scale) gltf.scene.scale.set(scale, scale, scale);
				if (position)
					gltf.scene.position.set(position.x, position.y, position.z);
				scene.add(gltf.scene);
				gltf.scene.traverse((node) => {
					if ((<THREE.Mesh>node).isMesh) {
						node.receiveShadow = true;
					}
				});
				gltf.animations;
				Array<THREE.AnimationClip>;
				gltf.scene;
				THREE.Group;
				gltf.scenes;
				Array<THREE.Group>;
				gltf.cameras;
				Array<THREE.Camera>;
				gltf.asset;
				Object;
				console.log("loaded model: ");
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (error) {
				console.log("An error happened: ", error);
			}
		);
	}
	const values = [0, -250, 250];
	for (let i = 0; i < values.length; i++) {
		for (let j = 0; j < values.length; j++) {
			loadModel(
				gltfLoader,
				"/models/my_plane/scene.gltf",
				scene,
				scale,
				new THREE.Vector3(values[i], 0, values[j])
			);
		}
	}
}
