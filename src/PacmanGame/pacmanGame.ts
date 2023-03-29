import * as THREE from "three";
import { createGhost, createPacman } from "../objectLoader";
import { pacmanStartingPoint } from "../constants/pacmanMap";
import { GhostLogic } from "./ghostLogic";
import { PacManGhostColisionChecker } from "./colisionCheckers";
import { PacmanGameLogic } from "./pacmanLogic";
import { createPebbleMap } from "./Pebbles/pebbleMap";


export async function pacmanGame(mainRenderer: THREE.WebGLRenderer) {
	//SCENE
	const scene = new THREE.Scene();
	createPebbleMap(scene);
	scene.background = new THREE.Color("black");
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.set(0, 0, 9.5);
	const ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);
	const texture = new THREE.TextureLoader().load(
		"textures/pac-man-screen/screen-texture.png"
		);
		const planeGeo = new THREE.PlaneGeometry(10, 10);
		const planeMat = new THREE.MeshBasicMaterial({ map: texture });
		const plane = new THREE.Mesh(planeGeo, planeMat);
	plane.position.set(0, 0, 0);
	scene.add(plane);

	//TESTS
	const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	cube.position.set(1.58, -0.65, 0.5);
	// scene.add(cube);

	//PACMAN
	const { pacman, mixer: pacmanMixer } = await createPacman(
		scene,
		pacmanStartingPoint
	);
	pacman.userData.direction = new THREE.Vector2(1, 0);
	pacman.userData.speed = 0.01;
	pacman.userData.rotation = 0;
	pacman.userData.lives = 3;
	pacman.userData.poweredUp = false;
	pacman.userData.poweredUpTime = 0;
	pacman.userData.lostLive = false;
	const { ghost: redGhost, mixer: redGhostMixer } = await createGhost(
		scene,
		"/models/ghosts/ghost-red-animated.gltf",
		new THREE.Vector2(-0.2, 0.35)
	);
	const { ghost: blueGhost, mixer: blueGhostMixer } = await createGhost(
		scene,
		"/models/ghosts/ghost-cyan-animated.gltf",
		new THREE.Vector2(0.3, 0.35)
	);
	const { ghost: yellowGhost, mixer: yellowGhostMixer } = await createGhost(
		scene,
		"/models/ghosts/ghost-yellow-animated.gltf",
		new THREE.Vector2(-0.7, 0.35)
	);
	const { ghost: pinkGhost, mixer: pinkGhostMixer } = await createGhost(
		scene,
		"/models/ghosts/ghost-pink-animated.gltf",
		new THREE.Vector2(0.8, 0.35)
	);

	const userControls = {
		direction: new THREE.Vector2(1, 0),
	};

	const updatePacman = PacmanGameLogic(pacman, userControls);
	const updateBlinky = GhostLogic(redGhost, 'blinky');
	const updatePinky = GhostLogic(pinkGhost, 'pinky');
	const updateInky = GhostLogic(blueGhost, 'inky');
	const updateClyde = GhostLogic(yellowGhost, 'clyde');

	function pacmanGameLoop() {
		mainRenderer.render(scene, camera);
		pacmanMixer?.update(0.02);
		redGhostMixer?.update(0.01);
		blueGhostMixer?.update(0.01);
		yellowGhostMixer?.update(0.01);
		pinkGhostMixer?.update(0.01);

		updatePacman();
		updateBlinky();
		updatePinky();
		updateInky();
		updateClyde();

		PacManGhostColisionChecker(pacman, redGhost);
		PacManGhostColisionChecker(pacman, blueGhost);
		PacManGhostColisionChecker(pacman, yellowGhost);
		PacManGhostColisionChecker(pacman, pinkGhost);
	}

	return pacmanGameLoop;
}

