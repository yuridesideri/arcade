import { MapPointDirections, userControls } from "../types/pacmanGame";
import * as THREE from "three";
import { pacmanStartingPoint } from "../constants/pacmanMap";
import { mapColisionChecker } from "./colisionCheckers";
import { Vector2 } from "three";
import { pacmanMap } from "../constants/pacmanMap";
import { pacmanControlsInterface } from "../controls";

export function PacmanGameLogic(
	pacman: THREE.Group,
	userControls: userControls
) {
	// const keydownEventHandler = (e:KeyboardEvent) => {
	// 	if (e.key === "a") {
	// 		userControls.direction = new THREE.Vector2(-1, 0);
	// 	}
	// 	if (e.key === "d") {
	// 		userControls.direction = new THREE.Vector2(1, 0);
	// 	}
	// 	if (e.key === "w") {
	// 		userControls.direction = new THREE.Vector2(0, 1);
	// 	}
	// 	if (e.key === "s") {
	// 		userControls.direction = new THREE.Vector2(0, -1);
	// 	}
	// 	if (
	// 		userControls.direction.x === -1 * pacman.userData.direction.x ||
	// 		userControls.direction.y === -1 * pacman.userData.direction.y
	// 	) {
	// 		pacman.userData.direction.x = userControls.direction.x;
	// 		pacman.userData.direction.y = userControls.direction.y;
	// 		pacman.userData.rotation =
	// 			Math.asin(pacman.userData.direction.y) ||
	// 			Math.asin(pacman.userData.direction.x) + -Math.PI / 2;
	// 	}
	// }
	const changePacmanDirectionEventHandler = (e:any) => {
		if (e.dynamicInfo === "left") {
			userControls.direction = new THREE.Vector2(-1, 0);
		}
		if (e.dynamicInfo === "right") {
			userControls.direction = new THREE.Vector2(1, 0);
		}
		if (e.dynamicInfo === "up") {
			userControls.direction = new THREE.Vector2(0, 1);
		}
		if (e.dynamicInfo === "down") {
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
	}

	window.addEventListener("movePacmanEvent", changePacmanDirectionEventHandler);
	const cleanUpControlsEvents = pacmanControlsInterface();

	function removeEventListener() {
		window.removeEventListener("keydown", changePacmanDirectionEventHandler);
		cleanUpControlsEvents();
	}

	function resetPacman() {
		pacman.position.x = pacmanStartingPoint.x;
		pacman.position.y = pacmanStartingPoint.y;
		pacman.userData.direction = new THREE.Vector2(1, 0);
		pacman.userData.rotation = 0;
		pacman.userData.speed = 0.01;
		setTimeout(() => (pacman.userData.speed = 0.01), 10);
		pacman.userData.lostLive = false;
	}

	function updatePacman() {
		const possibleMapColision = mapColisionChecker(
			new Vector2(pacman.position.x, pacman.position.y),
			pacmanMap
		);
		if (pacman.userData.lostLive) {
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
		}
		pacman.position.x +=
			pacman.userData.speed * pacman.userData.direction.x;
		pacman.position.y +=
			pacman.userData.speed * pacman.userData.direction.y;
		pacman.rotation.y = pacman.userData.rotation;
		if (pacman.position.x > 5) {
			pacman.position.x = -5;
		}
		if (pacman.position.x < -5) {
			pacman.position.x = 5;
		}
	}

	return {updatePacman, removeEventListener};
}
