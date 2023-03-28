import * as THREE from "three";
import { Vector2 } from "three";
import { createPacman } from "./objectLoader";
import { MapPointDirections, PacmanMap } from "./types/pacmanMap";

export async function pacmanGame(mainRenderer: THREE.WebGLRenderer) {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color("blue");
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	camera.position.set(0, 0, 9.5);

	let animationMixer: THREE.AnimationMixer;

	const pacmanControls = {
		speed: 0.01,
		direction: new THREE.Vector2(1, 0),
		rotation: 0,
	};

	const userControls = {
		direction: new THREE.Vector2(1, 0),
	};

	function mapColisionChecker(pacmanPosition: THREE.Vector2, map: PacmanMap) {
		const pacmanPositionRounded = new THREE.Vector2(
			Math.round(pacmanPosition.x * 100) / 100,
			Math.round(pacmanPosition.y * 100) / 100
		);
		const mapColisionPoint = map.find(
			(point) =>
				(<Vector2>point[0]).x === pacmanPositionRounded.x &&
				(<Vector2>point[0]).y === pacmanPositionRounded.y
		);
		return mapColisionPoint;
	}

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

	//mapping the texture:
	const startingPoint = new THREE.Vector2(0, -0.65);
	const { pacman, mixer } = await createPacman(scene, startingPoint);
	animationMixer = mixer;

	let t = startingPoint;
	t = new THREE.Vector2(0, -0.65);

	const moveTo = t;
	pacman.position.set(moveTo.x, moveTo.y, z);

	//map

	const map = [
	[0.53, 4.32, {x:[1], y:[-1]}], [2.6, 4.32, {x:[1,-1], y:[-1]}], [4.35, 4.32, {x:[-1], y:[-1]}],
	[0.53, 3.15, {x:[1,-1], y:[1]}], [1.58, 3.15, {x:[1,-1], y:[-1]}], [2.6, 3.15, {x:[1,-1], y:[1,-1]}], [4.35, 3.15, {x:[-1], y:[1, -1]}],
	[0.53, 2.23, {x: [1], y:[-1]}], [1.58, 2.23, {x:[-1], y:[1]}], [2.6, 2.23, {x:[1], y:[1, -1]}], [4.35, 2.23, {x:[-1], y:[1]}],
	[0.53, 1.25, {x:[1, -1], y:[1]}], [1.58, 1.25, {x:[-1], y:[-1]}],
	[1.58, 0.35, {x:[1], y:[1, -1]}], [2.6, 0.35, {x:[1,-1], y:[1, -1]}],
	[1.58, -0.65, {x:[-1], y:[1,-1]}],
	[0.53, -1.55, {x:[1], y:[-1]}], [1.58, -1.55, {x:[1, -1], y:[1]}], [2.6, -1.55,{x:[1,-1], y:[1,-1]}], [4.35, -1.55, {x: [-1], y:[-1]}],
	[0.53, -2.53, {x:[1, -1], y: [1]}], [1.58, -2.53,{x:[1, -1], y: [-1]}], [2.6, -2.53, {x:[-1], y:[1, -1]}], [3.65, -2.53, {x:[1], y:[-1]}], [4.35, -2.53, {x:[-1], y:[1]}],
	[0.53, -3.48, {x: [1], y:[-1]}], [1.58, -3.48, {x:[-1], y:[1]}], [2.6, -3.48, {x:[1], y:[1]}], [3.65, -3.48, {x:[1,-1], y:[1]}], [4.35, -3.48, {x: [-1], y:[-1]}],
	[0.53, -4.38, {x:[1,-1], y:[1]}], [4.35, -4.38, {x:[-1], y:[1]}],
	//Retype everything with negative x
	[-0.53, 4.32, {x:[-1], y:[-1]}], [-2.6, 4.32, {x:[-1,1], y:[-1]}], [-4.35, 4.32, {x:[1], y:[-1]}],
	[-0.53, 3.15, {x:[-1,1], y:[1]}], [-1.58, 3.15, {x:[-1,1], y:[-1]}], [-2.6, 3.15, {x:[-1,1], y:[1,-1]}], [-4.35, 3.15, {x:[1], y:[1, -1]}],
	[-0.53, 2.23, {x: [-1], y:[-1]}], [-1.58, 2.23, {x:[1], y:[1]}], [-2.6, 2.23, {x:[-1], y:[1, -1]}], [-4.35, 2.23, {x:[1], y:[1]}],
	[-0.53, 1.25, {x:[-1, 1], y:[1]}], [-1.58, 1.25, {x:[1], y:[-1]}],
	[-1.58, 0.35, {x:[-1], y:[1, -1]}], [-2.6, 0.35, {x:[-1,1], y:[1, -1]}],
	[-1.58, -0.65, {x:[1], y:[1,-1]}],
	[-0.53, -1.55, {x:[-1], y:[-1]}], [-1.58, -1.55, {x:[-1, 1], y:[1]}], [-2.6, -1.55,{x:[-1,1], y:[1,-1]}], [-4.35, -1.55, {x: [1], y:[-1]}],
	[-0.53, -2.53, {x:[-1, 1], y: [1]}], [-1.58, -2.53,{x:[-1, 1], y: [-1]}], [-2.6, -2.53, {x:[1], y:[1, -1]}], [-3.65, -2.53, {x:[-1], y:[-1]}], [-4.35, -2.53, {x:[1], y:[1]}],
	[-0.53, -3.48, {x: [-1], y:[-1]}], [-1.58, -3.48, {x:[1], y:[1]}], [-2.6, -3.48, {x:[-1], y:[1]}], [-3.65, -3.48, {x:[-1,1], y:[1]}], [-4.35, -3.48, {x: [1], y:[-1]}],
	[-0.53, -4.38, {x:[-1,1], y:[1]}], [-4.35, -4.38, {x:[1], y:[1]}],

];
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
		animationMixer?.update(0.02);
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
	}

    return pacmanGameLoop;
    return pacmanGameLoop;

	return pacmanGameLoop;

}
