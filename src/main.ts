import "./reset.css";
import { createWorld } from "./world";
import * as THREE from "three";

const app = document.querySelector<HTMLDivElement>("#app");

const p = document.createElement("p");
p.innerHTML = "Hello, World!";
app!.appendChild(p);

const { scene, camera, renderer } = createWorld(app!);

const mesh = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(mesh, material);
scene.add(cube);
camera.position.z = 6;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();