import * as THREE from "three";
import { Vector2 } from "three";
import { createGhost, createPacman } from "./objectLoader";
import { GhostNames, MapPointDirections, PacmanMap, userControls } from "./types/pacmanGame";
import pacmanMap, { pacmanStartingPoint } from "./constants/pacmanMap";
import { Tween } from "@tweenjs/tween.js";

export async function pacmanGame(mainRenderer: THREE.WebGLRenderer) {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color("black");
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.set(0, 0, 9.5);

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

	const ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);
	const geo = new THREE.PlaneGeometry(0.3, 0.3);
	const mat = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		side: THREE.DoubleSide,
	});
	const cube = new THREE.Mesh(geo, mat);
	scene.add(cube);

	const texture = new THREE.TextureLoader().load(
		"textures/pac-man-screen/screen-texture.png"
	);
	const planeGeo = new THREE.PlaneGeometry(10, 10);
	const planeMat = new THREE.MeshBasicMaterial({ map: texture });
	const plane = new THREE.Mesh(planeGeo, planeMat);
	plane.position.set(0, 0, 0);
	scene.add(plane);

	const updatePacman = PacmanGameLogic(pacman, userControls);
	const updateBlinky = GhostLogic(redGhost, 'blinky');
	const updatePinky = GhostLogic(pinkGhost, 'pinky');
	const updateInky = GhostLogic(blueGhost, 'inky');
	const updateClyde = GhostLogic(yellowGhost, 'clyde');

	setInterval(() => console.log(pacman.userData), 1000)

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

function PacmanGameLogic(pacman: THREE.Group, userControls: userControls) {

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
			userControls.direction.x === -1 * pacman.userData.direction.x ||
			userControls.direction.y === -1 * pacman.userData.direction.y
		) {
			pacman.userData.direction.x = userControls.direction.x;
			pacman.userData.direction.y = userControls.direction.y;
			pacman.userData.rotation =
				Math.asin(pacman.userData.direction.y) ||
				Math.asin(pacman.userData.direction.x) + -Math.PI / 2;
		}
	});

	function resetPacman(){
		pacman.position.x = pacmanStartingPoint.x;
		pacman.position.y = pacmanStartingPoint.y;
		pacman.userData.direction = new THREE.Vector2(1, 0);
		pacman.userData.rotation = 0;
		pacman.userData.speed = 0.01;
		setTimeout(() => pacman.userData.speed = 0.01, 10) 
		pacman.userData.lostLive = false;
	}

	function updatePacman() {
		const possibleMapColision = mapColisionChecker(
			new Vector2(pacman.position.x, pacman.position.y),
			pacmanMap
		);
			if (pacman.userData.lostLive){
				resetPacman();
				userControls.direction = new THREE.Vector2(1, 0);
				pacman.userData.lives -= 1;
			}

		if (possibleMapColision) {
			if (
				(<MapPointDirections>possibleMapColision[1]).x.includes(
					userControls.direction.x
				) ||
				(<MapPointDirections>possibleMapColision[1]).y.includes(
					userControls.direction.y
				)
			) {
				pacman.userData.direction = userControls.direction;
				pacman.userData.rotation =
					Math.asin(pacman.userData.direction.y) ||
					Math.asin(pacman.userData.direction.x) + -Math.PI / 2;
				pacman.userData.speed = 0.01;
			} else if (
				(<MapPointDirections>possibleMapColision[1]).x.includes(
					pacman.userData.direction.x
				) ||
				(<MapPointDirections>possibleMapColision[1]).y.includes(
					pacman.userData.direction.y
				)
			) {
			} else {
				pacman.userData.speed = 0;
			}
			console.log("map colision");
		}
		pacman.position.x += pacman.userData.speed * pacman.userData.direction.x;
		pacman.position.y += pacman.userData.speed * pacman.userData.direction.y;
		pacman.rotation.y = pacman.userData.rotation;
		if (pacman.position.x > 5) {
			pacman.position.x = -5;
		}
		if (pacman.position.x < -5) {
			pacman.position.x = 5;
		}
	}

	return updatePacman;
}

function mapColisionChecker(entityPosition: THREE.Vector2, map: PacmanMap) {
	const mapRounded = map.map((point) => {
		return [
			new THREE.Vector2(
				Math.round(<number>point[0] * 100) / 100,
				Math.round(<number>point[1] * 100) / 100
			),
			point[2],
		];
	});

	const entityPositionRounded = new THREE.Vector2(
		Math.round(entityPosition.x * 100) / 100,
		Math.round(entityPosition.y * 100) / 100
	);
	const mapColisionPoint = mapRounded.find(
		(point) =>
			(<Vector2>point[0]).x === entityPositionRounded.x &&
			(<Vector2>point[0]).y === entityPositionRounded.y
	);
	return mapColisionPoint;
}

function normalColisionChecker(entityPosition1: THREE.Vector2, entitiyPosition2: THREE.Vector2, radius: number){
	const entityPosition1Rounded = new THREE.Vector2(
		Math.round(entityPosition1.x * 100) / 100,
		Math.round(entityPosition1.y * 100) / 100
	);
	const entityPosition2Rounded = new THREE.Vector2(
		Math.round(entitiyPosition2.x * 100) / 100,
		Math.round(entitiyPosition2.y * 100) / 100
	);
	const distance = entityPosition1Rounded.distanceTo(entityPosition2Rounded);
	if (distance < radius){
		return true;
	}
	return false;
}

function PacManGhostColisionChecker(pacman: THREE.Group, ghost: THREE.Group){
	const radius = 0.34;
	const pacmanPosition = new THREE.Vector2(pacman.position.x, pacman.position.y);
	const ghostPosition = new THREE.Vector2(ghost.position.x, ghost.position.y);
	if (normalColisionChecker(pacmanPosition, ghostPosition, radius)){
		pacman.userData.lostLive = true;
	}
}

function GhostLogic(ghost: THREE.Group, type: GhostNames){
	let ghostFree = false;
	let ghostDirection = new THREE.Vector2(1, 0);
	let ghostSpeed = 0.01;
	let timeInterval : number;
	if (type === "blinky"){
		timeInterval = 5 * 1000;
	} else if (type === "pinky"){
		timeInterval = 20 * 1000;
	}
	else if (type === "inky"){
		timeInterval = 40 * 1000;
	}
	else if (type === "clyde"){
		timeInterval = 60 * 1000;
	}
	const moveGhostToCenter = new Tween(ghost.position).to({x: 0, y: 0.35}, 2000).delay(timeInterval!)
	const moveGhostToTheBoard = new Tween(ghost.position).to({x: 0, y: 1.25}, 2000).onComplete(() => ghostFree = true);
	moveGhostToCenter.chain(moveGhostToTheBoard).start();
	
	function updateGhost(){
		if (ghostFree){
			const possibleMapColision = mapColisionChecker(new Vector2(ghost.position.x, ghost.position.y), pacmanMap);
			if (possibleMapColision){
				const chooseXorY = Math.floor(Math.random() * 2);
				const possibleDirections = <MapPointDirections>possibleMapColision[1];
				if (chooseXorY === 0){
					const possibleValues = Math.floor(possibleDirections.x.length * Math.random())
					ghostDirection = new THREE.Vector2(possibleDirections.x[possibleValues], 0);
				}
				else if (chooseXorY === 1){
					const possibleValues = Math.floor(possibleDirections.y.length * Math.random())
					ghostDirection = new THREE.Vector2(0, possibleDirections.y[possibleValues]);
				}

			}
			ghost.position.x += ghostDirection.x * ghostSpeed;
			ghost.position.y += ghostDirection.y * ghostSpeed;
			if (ghost.position.x > 5){
				ghost.position.x = -5;
			}
			if (ghost.position.x < -5){
				ghost.position.x = 5;
			}
		}

	}
	return updateGhost;
}