import { GhostNames, MapPointDirections } from "../types/pacmanGame";
import * as THREE from "three";
import { Vector2 } from "three";
import { Tween } from "@tweenjs/tween.js";
import { mapColisionChecker } from "./colisionCheckers";
import pacmanMap from "../constants/pacmanMap";


export function GhostLogic(ghost: THREE.Group, type: GhostNames){
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