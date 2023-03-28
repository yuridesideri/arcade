import * as THREE from 'three';

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

export const pacmanStartingPoint = new THREE.Vector2(0, -0.65);

export default map;