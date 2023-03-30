import * as THREE from "three";
import { Vector2 } from "three";
import { PacmanMap } from "../types/pacmanGame";

export function mapColisionChecker(
	entityPosition: THREE.Vector2,
	map: PacmanMap
) {
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

export function normalColisionChecker(
	entityPosition1: THREE.Vector2,
	entitiyPosition2: THREE.Vector2,
	radius: number
) {
	const entityPosition1Rounded = new THREE.Vector2(
		Math.round(entityPosition1.x * 100) / 100,
		Math.round(entityPosition1.y * 100) / 100
	);
	const entityPosition2Rounded = new THREE.Vector2(
		Math.round(entitiyPosition2.x * 100) / 100,
		Math.round(entitiyPosition2.y * 100) / 100
	);
	const distance = entityPosition1Rounded.distanceTo(entityPosition2Rounded);
	if (distance < radius) {
		return true;
	}
	return false;
}

export function PacManGhostColisionChecker(
	pacman: THREE.Group,
	ghost: THREE.Group
) {
	const radius = 0.34;
	const pacmanPosition = new THREE.Vector2(
		pacman.position.x,
		pacman.position.y
	);
	const ghostPosition = new THREE.Vector2(ghost.position.x, ghost.position.y);
	if (normalColisionChecker(pacmanPosition, ghostPosition, radius)) {
		pacman.userData.lostLive = true;
	}
}

export function PacManPebbleColisionChecker(
	pacman: THREE.Group,
	pebble: THREE.Mesh,
	updatePebble: (
		pebble: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>,
		pebbleIndex: number
	) => void,
	pebbleIndex: number
) {
	const radius = 0.14;
	const pacmanPosition = new THREE.Vector2(
		pacman.position.x,
		pacman.position.y
	);
	const pebblePosition = new THREE.Vector2(
		pebble.position.x,
		pebble.position.y
	);
	if (normalColisionChecker(pacmanPosition, pebblePosition, radius)) {
		pacman.userData.score += 10;
		console.log(pacman.userData.score)
		updatePebble(pebble, pebbleIndex);
	}
}
