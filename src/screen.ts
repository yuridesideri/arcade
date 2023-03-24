import * as THREE from 'three';

export function createScreen(scene: THREE.Scene){
    const geometry = new THREE.PlaneGeometry( 20,23 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0, 39, -3);
    mesh.rotateX(-0.81);
    scene.add( mesh );

}