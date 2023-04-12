import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { Mesh } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

async function loadModel(
	loader: GLTFLoader,
	path: string,
	scene: THREE.Scene,
	traverseMeshCallback?: (node: THREE.Mesh) => void,
	scale?: number,
	position?: THREE.Vector3
) {
	const modelPromise = loader.loadAsync(path, function (xhr) {
		const pathName = path.split("/");
		const folder = pathName[pathName.length - 2];
		const fileName = pathName[pathName.length - 1];
		console.log(
			(xhr.loaded / xhr.total) * 100 +
				"% loaded" +
				" " +
				folder +
				" " +
				fileName
		);
	});
	const model = await modelPromise;
	if (scale) model.scene.scale.set(scale, scale, scale);
	if (position) model.scene.position.set(position.x, position.y, position.z);
	model.scene.traverse((node) => {
		if ((<THREE.Mesh>node).isMesh && traverseMeshCallback)
			traverseMeshCallback(<THREE.Mesh>node);
	});
	//ADD TO SCENE
	scene.add(model.scene);
	return model;
}

const gltfLoader = new GLTFLoader();
export async function loadArcade(scene: THREE.Scene) {
	function traverseFunction(node: THREE.Mesh) {
		node.castShadow = true;
		node.receiveShadow = true;
	}

	const arcade = await loadModel(
		gltfLoader,
		"/models/pacman-machine-with-controller/scene.gltf",
		scene,
		traverseFunction,
		1,
		new THREE.Vector3(0, 0, 0)
	);

	return arcade;
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
	screenMesh.userData = { renderTarget };
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
	);
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
		position ? new THREE.Vector3(position.x, position.y, 0.02) : undefined
	);
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

export function createPebbles(scene: THREE.Scene, pebbleMap: number[][]) {
	const pebbles = [];
}

export async function createScoreboard(scene: THREE.Scene) {
	const ttfLoader = new TTFLoader();
	const scoreFontJson = await ttfLoader.loadAsync("/fonts/VT323-Regular.ttf");
	const usableFont = new FontLoader().parse(scoreFontJson);
	let textGeometry: TextGeometry;
	const textMaterial = new THREE.MeshPhongMaterial({
		color: "#fcdf03",
	});
	let scoreboard: THREE.Mesh<TextGeometry, THREE.MeshPhongMaterial>
	let lastScore: number;
	function updateScoreboard(score: number) {
		if (score === lastScore) return;
		lastScore = score;
		scene.remove(scoreboard);
		textGeometry?.dispose();
		scoreboard?.geometry.dispose();

		textGeometry = new TextGeometry("SCORE: " + score, {
			font: usableFont,
			size: 0.6,
			height: 0.1,
		});
		scoreboard = new THREE.Mesh(textGeometry, textMaterial);
		scoreboard.position.set(0, 5.5, 0.1);
		let textSize = new THREE.Vector3();
		const scoreboardBoundingBox = new THREE.Box3().setFromObject(scoreboard);
		scoreboardBoundingBox.getSize(textSize)
		scoreboard.position.add(new THREE.Vector3(-textSize.x/2, 0, 0));
		scene.add(scoreboard);
		return scoreboard;
	}

	return {updateScoreboard};

}

export function loadObjects(scene: THREE.Scene) {
	loadLamp(
		gltfLoader,
		"/models/ceiling_lamp_version_01/scene.gltf",
		scene,
		0.15,
		new THREE.Vector3(0, 130, 0)
	);
	createFloor(10, scene, gltfLoader);
}
