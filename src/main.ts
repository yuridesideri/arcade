import "./reset.css";
import { createWorld } from "./world";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gameControls } from "./controls";
import { loadModel } from "./modelLoader";

const app = document.querySelector<HTMLDivElement>("#app");

const { scene, camera, renderer } = createWorld(app!);


const gltfLoader = new GLTFLoader();
loadModel(gltfLoader, "/models/pacman_arcade__animation/scene.gltf", scene);


function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	//TODO: abstract camera rotation reset
	if (camera.rotation.x > Math.PI / 12 || camera.rotation.x < -Math.PI / 12) camera.rotation.x = 0;
	if (camera.rotation.y > Math.PI / 12 || camera.rotation.y < -Math.PI / 12) camera.rotation.y = 0;
}
gameControls(camera, renderer);
animate();

