import * as THREE from "three";
import { Vector2 } from "three";
import { createGhosts, createPacman } from "./objectLoader";
import { MapPointDirections, PacmanMap } from "./types/pacmanGame";
import pacmanMap, { pacmanStartingPoint } from "./constants/pacmanMap";

export async function pacmanGame(mainRenderer: THREE.WebGLRenderer) {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color("blue");
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.set(0, 0, 9.5);

	const { pacman, mixer: pacmanMixer } = await createPacman(
		scene,
		pacmanStartingPoint
	);
	const { ghost: redGhost, mixer: redGhostMixer } = await createGhosts(
		scene,
		"/models/ghosts/ghost-red-animated.gltf",
		new THREE.Vector2(-0.2, 0.35)
	);
	const { ghost: blueGhost, mixer: blueGhostMixer } = await createGhosts(
		scene,
		"/models/ghosts/ghost-cyan-animated.gltf",
		new THREE.Vector2(0.3, 0.35)
	);
	const { ghost: yellowGhost, mixer: yellowGhostMixer } = await createGhosts(
		scene,
		"/models/ghosts/ghost-yellow-animated.gltf",
		new THREE.Vector2(-0.7, 0.35)
	);
	const { ghost: pinkGhost, mixer: pinkGhostMixer } = await createGhosts(
		scene,
		"/models/ghosts/ghost-pink-animated.gltf",
		new THREE.Vector2(0.8, 0.35)
	);

	const pacmanControls = {
		speed: 0.01,
		direction: new THREE.Vector2(1, 0),
		rotation: 0,
	};

	const userControls = {
		direction: new THREE.Vector2(1, 0),
	};

	function mapColisionChecker(entityPosition: THREE.Vector2, map: PacmanMap) {
		const entityPositionRounded = new THREE.Vector2(
			Math.round(entityPosition.x * 100) / 100,
			Math.round(entityPosition.y * 100) / 100
		);
		const mapColisionPoint = map.find(
			(point) =>
				(<Vector2>point[0]).x === entityPositionRounded.x &&
				(<Vector2>point[0]).y === entityPositionRounded.y
		);
		return mapColisionPoint;
	}

	const ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);
	const geo = new THREE.PlaneGeometry(0.3, 0.3);
	const mat = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		side: THREE.DoubleSide,
	});
	const cube = new THREE.Mesh(geo, mat);
	const z = 0.1;
	scene.add(cube);
	const size = 10;
	const divisions = 32;
	const gridHelper = new THREE.GridHelper(size, divisions);
	gridHelper.rotateX(Math.PI / 2);
	gridHelper.position.set(0, 0, 0.001);

	const texture = new THREE.TextureLoader().load(
		"textures/pac-man-screen/screen-texture.png"
	);
	const planeGeo = new THREE.PlaneGeometry(10, 10);
	const planeMat = new THREE.MeshBasicMaterial({ map: texture });
	const plane = new THREE.Mesh(planeGeo, planeMat);
	plane.position.set(0, 0, 0);
	scene.add(plane);

	let t = pacmanStartingPoint;
	t = new THREE.Vector2(0, -0.65);

	const moveTo = t;
	pacman.position.set(moveTo.x, moveTo.y, z);

	//map
	const map: PacmanMap = pacmanMap;

	//Parse to Three.js Vector2
	const mapRounded = map.map((point) => {
		return [
			new THREE.Vector2(
				Math.round(<number>point[0] * 100) / 100,
				Math.round(<number>point[1] * 100) / 100
			),
			point[2],
		];
	});

	window.addEventListener("keydown", (e) => {
		console.log("pressed");
		if (e.key === "a") {
			userControls.direction = new THREE.Vector2(-1, 0);
		}
		if (e.key === "d") {
			userControls.direction = new THREE.Vector2(1, 0);
		}
		if (e.key === "w") {
			userControls.direction = new THREE.Vector2(0, 1);
		}
		if (e.key === "s") {
			userControls.direction = new THREE.Vector2(0, -1);
		}
		if (
			userControls.direction.x === -1 * pacmanControls.direction.x ||
			userControls.direction.y === -1 * pacmanControls.direction.y
		) {
			pacmanControls.direction.x = userControls.direction.x;
			pacmanControls.direction.y = userControls.direction.y;
			pacmanControls.rotation =
				Math.asin(pacmanControls.direction.y) ||
				Math.asin(pacmanControls.direction.x) + -Math.PI / 2;
		}
	});

	function pacmanGameLoop() {
		mainRenderer.render(scene, camera);
		pacmanMixer?.update(0.02);
		redGhostMixer?.update(0.01);
		blueGhostMixer?.update(0.01);
		yellowGhostMixer?.update(0.01);
		pinkGhostMixer?.update(0.01);

		const possibleMapColision = mapColisionChecker(
			new Vector2(pacman.position.x, pacman.position.y),
			mapRounded
		);
		if (possibleMapColision) {
			if (
				(<MapPointDirections>possibleMapColision[1]).x.includes(
					userControls.direction.x
				) ||
				(<MapPointDirections>possibleMapColision[1]).y.includes(
					userControls.direction.y
				)
			) {
				pacmanControls.direction = userControls.direction;
				pacmanControls.rotation =
					Math.asin(pacmanControls.direction.y) ||
					Math.asin(pacmanControls.direction.x) + -Math.PI / 2;
				pacmanControls.speed = 0.01;
			} else if (
				(<MapPointDirections>possibleMapColision[1]).x.includes(
					pacmanControls.direction.x
				) ||
				(<MapPointDirections>possibleMapColision[1]).y.includes(
					pacmanControls.direction.y
				)
			) {
			} else {
				pacmanControls.speed = 0;
			}
			console.log("map colision");
		}
		pacman.position.x += pacmanControls.speed * pacmanControls.direction.x;
		pacman.position.y += pacmanControls.speed * pacmanControls.direction.y;
		pacman.rotation.y = pacmanControls.rotation;
		if (pacman.position.x > 5) {
			pacman.position.x = -5;
		}
		if (pacman.position.x < -5) {
			pacman.position.x = 5;
		}
	}

	return pacmanGameLoop;
}
