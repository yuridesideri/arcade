import { Vector2 } from "three";

export type PacmanMap = (number | Vector2 | MapPointDirections)[][]

export type MapPointDirections = {
    x: number[];
    y: number[];
}