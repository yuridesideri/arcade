import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

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
