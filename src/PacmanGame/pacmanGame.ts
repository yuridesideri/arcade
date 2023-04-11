import * as THREE from "three";
import { createGhost, createPacman } from "../objectLoader";
import { pacmanStartingPoint } from "../constants/pacmanMap";
import { GhostLogic } from "./ghostLogic";
import {
	PacManGhostColisionChecker,
	PacManPebbleColisionChecker,
} from "./colisionCheckers";
import { PacmanGameLogic } from "./pacmanLogic";
import { createPebbleObjects } from "./Pebbles/pebbleMap";
import { PacmanType } from "../types/pacmanGame";
import { Screen } from "../main";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import axios from "axios";
import dayjs from "dayjs";
export async function pacmanGame(
	mainRenderer: THREE.WebGLRenderer,
	CSS3DObject: CSS3DObject,
	startingScore?: number,
	startingLives?: number,
	startingTime?: string
) {
	//CONTROLS
	const userControls = {
		direction: new THREE.Vector2(1, 0),
	};
	//SCENE
	const scene = new THREE.Scene();
	scene.background = new THREE.Color("black");
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.set(0, 0.5, 9.5);
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

	//RETURN FUNCTIONS
	let pacmanGameLoopReturn = pacmanGameLoop;
	let pacmanGameCleanUpReturn = pacmanGameCleanUp;

	//PACMAN
	const { pacman, mixer: pacmanMixer } = await createPacman(
		scene,
		pacmanStartingPoint
	);
	pacman.userData = {
		direction: new THREE.Vector2(1, 0),
		speed: 0.01,
		rotation: 0,
		lives: startingLives || 3,
		poweredUp: false,
		poweredUpTime: 0,
		lostLive: false,
		score: startingScore || 0,
		startingTime: startingTime || dayjs().format(),
		restarted: false,
	} as PacmanType;

	//GHOSTS
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

	let { pebbleObjects, updatePebble, cleanUpPebbles } =
		createPebbleObjects(scene);
	const { updatePacman, removeEventListener } = PacmanGameLogic(
		pacman,
		userControls
	);
	const updateBlinky = GhostLogic(redGhost, "blinky");
	const updatePinky = GhostLogic(pinkGhost, "pinky");
	const updateInky = GhostLogic(blueGhost, "inky");
	const updateClyde = GhostLogic(yellowGhost, "clyde");

	//Lives
	const lives: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] =
		[];
	for (let i = 0; i < pacman.userData.lives; i++) {
		const life = new THREE.Mesh(
			new THREE.SphereGeometry(0.1, 32, 32),
			new THREE.MeshBasicMaterial({ color: 0xffff00 })
		);
		life.position.set(-4 + i * 0.4, -5.3, 0.1);
		scene.add(life);
		lives.push(life);
	}

	function endGame() {
		Screen.gameStatus = "Options";
		console.log("game ended");
		const token = localStorage.getItem("userToken");
		console.log(token);
		if (token) {
			axios.post(
				`${import.meta.env.VITE_API_URL}/games`,
				{
					score: pacman.userData.score,
					gameDurationSeconds: dayjs().diff(
						dayjs(pacman.userData.startingTime),
						"seconds"
					),
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		}
		pacmanGameCleanUp();
		CSS3DObject.element.classList.remove("hidden");
	}
	async function restartGame() {
		pacmanGameCleanUp();
		const newGame = await pacmanGame(
			mainRenderer,
			CSS3DObject,
			pacman.userData.score
		);
		pacmanGameLoopReturn = newGame.pacmanGameLoop;
		pacmanGameCleanUpReturn = newGame.pacmanGameCleanUp;
	}

	function pacmanGameLoop() {
		if (pebbleObjects.length === 0) {
			pebbleObjects = [new THREE.Mesh()];
			pacman.userData.restarted = true;
			restartGame();
		}
		if (
			pacman.userData.restarted &&
			pacmanGameLoopReturn !== pacmanGameLoop
		) {
			pacmanGameLoopReturn();
			return;
		}
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

		if (pacman.userData.lostLive) {
			if (lives.length !== 0){
				const life = lives.pop()!;
				scene.remove(life);
				life.geometry.dispose();
				life.material.dispose();
			}
		}

		pebbleObjects.forEach((pebble, index) => {
			PacManPebbleColisionChecker(pacman, pebble, updatePebble, index);
		});
		if (pacman.userData.lives === 0) {
			pacman.userData.lives = 3; //Handles fast refresh bug
			endGame();
			mainRenderer.render(scene, camera);
		}
	}

	function pacmanGameCleanUp() {
		scene.remove(plane);
		scene.remove(pacman);
		scene.remove(redGhost);
		scene.remove(blueGhost);
		scene.remove(yellowGhost);
		scene.remove(pinkGhost);
		lives.forEach((life) => scene.remove(life));
		scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				object.geometry.dispose();
				object.material.dispose();
			}
		});
		cleanUpPebbles();
		removeEventListener();
	}

	return {
		pacmanGameLoop: pacmanGameLoopReturn,
		pacmanGameCleanUp: pacmanGameCleanUpReturn,
	};
}
