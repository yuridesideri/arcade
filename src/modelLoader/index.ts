import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
export function loadModel(model: GLTFLoader, path: string, scene: THREE.Scene) {
	model.load(
		path,
		function (gltf) {
			scene.add(gltf.scene);
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
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.log("An error happened: ", error);
		}
	);
}
