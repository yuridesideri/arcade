import { pacmanMap } from "../../constants/pacmanMap";
import * as THREE from "three";

export function createPebbleMap(scene: THREE.Scene) {
	const pacmanMapCopy = [...pacmanMap];

    //ADDED MANUAL PEBBLES
	pacmanMapCopy.push([4.68, 0.35, { x: [-1], y: [-1] }]);
	pacmanMapCopy.push([-4.68, 0.35, { x: [1], y: [-1] }]);
    
    //SORTING FUNCTIONS
	const crescentY = pacmanMapCopy.sort((first, second) => {
		const mathY = Math.round(first[1] - second[1]);
		const mathX = Math.round(first[0] - second[0]);
		if (mathY === 0) {
			return mathX;
		}
		return -mathY;
	});

	const crescentX = [...pacmanMap].sort((first, second) => {
		const mathX = Math.round(first[0] - second[0]);
		const mathY = Math.round(first[1] - second[1]);
		if (mathX === 0) {
			return mathY;
		}
		return -mathX;
	});

	const pebbleDelta = 0.35;

	const pebbleMap: [number, number][] = [];
	//ADD PEBBLES IN X AXIS
	let pauseNextPebbleAdd = true;
	for (let i = 0; i < crescentY.length; i++) {
		const point = crescentY[i];

		if (!pauseNextPebbleAdd) {
			const deltaX =
				Math.round(crescentY[i][0] * 100 - crescentY[i - 1][0] * 100) /
				100;
			const pebbleQuantitiy = Math.round(deltaX / pebbleDelta);
			for (let j = 0; j < pebbleQuantitiy - 1; j++) {
				pebbleMap.push([point[0] - pebbleDelta * (j + 1), point[1]]);
			}
		}
		if (point[2].x.includes(1)) {
			if (point[0] === 2.6 && point[1] === 0.35) {
				console.log(point);
				console.log(pauseNextPebbleAdd);
				console.log("falso ainda");
			}
			pauseNextPebbleAdd = false;
		} else {
			pauseNextPebbleAdd = true;
		}
		pebbleMap.push([point[0], point[1]]);
	}
	//ADD PEBBLES IN Y AXIS
	for (let i = 0; i < crescentX.length; i++) {
		const point = crescentX[i];
		if (!pauseNextPebbleAdd) {
			const deltaX =
				Math.round(crescentX[i][1] * 100 - crescentX[i - 1][1] * 100) /
				100;
			const pebbleQuantitiy = Math.round(deltaX / pebbleDelta);
			for (let j = 0; j < pebbleQuantitiy - 1; j++) {
				pebbleMap.push([point[0], point[1] - pebbleDelta * (j + 1)]);
			}
		}
		if (point[2].y.includes(1)) {
			pauseNextPebbleAdd = false;
		} else {
			pauseNextPebbleAdd = true;
		}
	}
    
	for (let i = 0; i < pebbleMap.length; i++) {
		const material = new THREE.MeshBasicMaterial({ color: "orange" });
		const pebbleGeometry = new THREE.CircleGeometry(0.05, 32, 32);
		const pebble = new THREE.Mesh(pebbleGeometry, material);
		pebble.position.set(pebbleMap[i][0], pebbleMap[i][1], 0.001);
		scene.add(pebble);
	}
}
