import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";

export function createWorld(parentElement: HTMLElement): {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
} {
	//SCENE
	const scene = new THREE.Scene();

	//CAMERA
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(0, 50, 100);
	camera.rotateX(-Math.PI / 24);


	//RENDERER
	const renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(/* "#353535" */"black");
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = "absolute";
	renderer.domElement.style.top = "0";
	renderer.domElement.style.zIndex = "-1";
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.outputEncoding = THREE.sRGBEncoding;

	//LIGHTS
	const spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.angle = Math.PI / 6;
	spotLight.castShadow = true; // default false
	spotLight.position.set(20, 150, 0);
	spotLight.penumbra = 0.5;
	scene.add(spotLight);
	const spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
	spotLight2.angle = Math.PI / 6;
	spotLight2.position.set(-20, 150, 30);
	spotLight2.decay = 0.5
	spotLight2.penumbra = 0.5
	scene.add(spotLight2);
	// const helper = new THREE.CameraHelper(spotLight.shadow.camera);
	// scene.add(helper);


	//PAC-MAN GAME

	parentElement.appendChild(renderer.domElement);
	return { scene, camera, renderer };
}



export function sceneResizer(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, css3DRenderer: CSS3DRenderer) {
	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		css3DRenderer.setSize(window.innerWidth, window.innerHeight);
	};
	window.addEventListener('resize', onWindowResize, false);

}