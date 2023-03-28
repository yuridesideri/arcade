import { Vector2 } from "three";

export type PacmanMap = (number | Vector2 | MapPointDirections)[][]

export type MapPointDirections = {
    x: number[];
    y: number[];
}

export type userControls = {
    direction: THREE.Vector2;
}

export type GhostNames = "blinky" | "pinky" | "inky" | "clyde";