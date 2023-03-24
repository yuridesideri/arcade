import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
export function loadArcade(model: GLTFLoader, path: string, scene: THREE.Scene) {
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
			gltf.animations

		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.log("An error happened: ", error);
		}
	);
}

export function loadLamp(model: GLTFLoader, path: string, scene: THREE.Scene, scale?: number, position?: THREE.Vector3) {
	model.load(
		path,
		function (gltf) {
			const model = gltf.scene;
			if (scale) model.scale.set(scale, scale, scale);
			if (position) model.position.set(position.x, position.y, position.z);
			scene.add(model);
			gltf.animations

		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.log("An error happened: ", error);
		}
	);
}