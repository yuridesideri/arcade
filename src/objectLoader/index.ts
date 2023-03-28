import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { Mesh } from "three";

async function loadModel(
	loader: GLTFLoader,
	path: string,
	scene: THREE.Scene,
	traverseMeshCallback?: (node: THREE.Mesh) => void,
	scale?: number,
	position?: THREE.Vector3
) {
	const modelPromise = loader.loadAsync(path, function (xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded" + " "  + path.split("/").pop());
	});
	const model = await modelPromise;
	if (scale) model.scene.scale.set(scale, scale, scale);
	if (position)
		model.scene.position.set(position.x, position.y, position.z);
	model.scene.traverse((node) => {
		if ((<THREE.Mesh>node).isMesh && traverseMeshCallback)
			traverseMeshCallback(<THREE.Mesh>node);
	});
	//ADD TO SCENE
	scene.add(model.scene);
	return model;
}

const gltfLoader = new GLTFLoader();
export function loadArcade(
	model: GLTFLoader,
	path: string,
	scene: THREE.Scene
) {
	model.load(
		path,
		function (gltf) {
			const model = gltf.scene;
			scene.add(model);
			model.traverse((node) => {
				if ((<THREE.Mesh>node).isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
			gltf.animations;
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.log("An error happened: ", error);
		}
	);
}

export function loadLamp(
	model: GLTFLoader,
	path: string,
	scene: THREE.Scene,
	scale?: number,
	position?: THREE.Vector3
) {
	model.load(
		path,
		function (gltf) {
			const model = gltf.scene;
			if (scale) model.scale.set(scale, scale, scale);
			if (position)
				model.position.set(position.x, position.y, position.z);
			scene.add(model);
			gltf.animations;
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.log("An error happened: ", error);
		}
	);
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
	loadModel(
		gltfLoader,
		"/models/my_plane/scene.gltf",
		scene,
		scale,
		new THREE.Vector3(0, 0, 0)
	);
}

export function createScreenMesh(scene: THREE.Scene) {
	const renderTarget = new THREE.WebGLRenderTarget(512, 512);
	const geometry = new THREE.PlaneGeometry(22, 22);
	const material = new THREE.MeshPhongMaterial({
		map: renderTarget.texture,
	});
	material.shininess = 2;
	const screenMesh = new THREE.Mesh(geometry, material);
	screenMesh.position.set(0.25, 38.2, -2.05);
	screenMesh.rotateX(-0.81);
	scene.add(screenMesh);
	screenMesh.userData = { renderTarget }
	return screenMesh;
}

export async function createPacman(
	scene: THREE.Scene,
	position: THREE.Vector2
) {
	function changePacmanMaterial(node: THREE.Mesh) {
		const newMaterial = new THREE.MeshBasicMaterial({
			color: "#fcdf03",
		});
		node.material = newMaterial;
	}
	//LOAD MODEL
	const gltf = await loadModel(
		gltfLoader,
		"/models/pacman/pacman-animated.gltf",
		scene,
		changePacmanMaterial,
		0.18,
		new THREE.Vector3(position.x, position.y, 0.02)
	)
	const pacman = gltf.scene;

	//ANIMATIONS
	let mixer: THREE.AnimationMixer;
	mixer = new THREE.AnimationMixer(pacman);
	const animations = gltf.animations;
	animations.forEach((animation) => {
		const action = mixer.clipAction(animation);
		action.play();
	});

	//TRANSFORMS
	pacman.rotateX(Math.PI / 2);


	//RETURN
	return { pacman, mixer };
}

export async function createGhost(
	scene: THREE.Scene,
	path: string,
	position?: THREE.Vector2
) {
	//LOAD MODEL
	let gltf = await loadModel(
		gltfLoader,
		path,
		scene,
		undefined,
		0.2,
		position? new THREE.Vector3(position.x, position.y, 0.02) : undefined
	)
	const ghost = gltf.scene;
	//ANIMATIONS
	let mixer: THREE.AnimationMixer;
	mixer = new THREE.AnimationMixer(ghost);
	const animations = gltf.animations;
	animations.forEach((animation) => {
		const action = mixer.clipAction(animation);
		action.play();
	});

	//RETURN
	return { ghost, mixer };
}

export function loadObjects(scene: THREE.Scene) {
	loadArcade(gltfLoader, "/models/pac-man-machine-edited/scene.gltf", scene);
	loadLamp(
		gltfLoader,
		"/models/ceiling_lamp_version_01/scene.gltf",
		scene,
		0.15,
		new THREE.Vector3(0, 130, 0)
	);
	createFloor(10, scene, gltfLoader);
}
