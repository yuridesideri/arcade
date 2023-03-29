import pacmanMap from "../../constants/pacmanMap";

export function createPebbleMap() {
    const crescentY = pacmanMap.sort((first, second) => {
        if ((<number>first[1]) > (<number>second[1])) return 1;
        else return -1;
    })

    const crescentX = pacmanMap.sort((first, second) => {
        if ((<number>first[0]) > (<number>second[0])) return 1;
        else return -1;
    })
    
    const pebbleDelta = 0.3;

    const pebbleMap: [number, number][] = [];

    for (let i = 0; i < crescentY.length; i++) {
        const element = crescentY[i];
        if (element[1] % pebbleDelta === 0) {
            pebbleMap.push([element[0], element[1]]);
        }
    }

    
}