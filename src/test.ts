import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
export function loadTest(scene: THREE.Scene) {
	const renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	//Create a SpotLight and turn on shadows for the light
	const light = new THREE.SpotLight(0xffffff);
	light.castShadow = true; // default false
	light.rotateX(Math.PI / 4);
	scene.add(light);

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 512; // default
	light.shadow.mapSize.height = 512; // default
	light.shadow.camera.near = 0.5; // default
	light.shadow.camera.far = 500; // default
	light.shadow.focus = 1; // default

	//Create a sphere that cast shadows (but does not receive them)
	const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
	const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.z = -90;
	sphere.castShadow = true; //default is false
	sphere.receiveShadow = false; //default
	scene.add(sphere);

	//Create a plane that receives shadows (but does not cast them)
	const planeGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
	const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.position.z = -100;
	plane.receiveShadow = true;
	scene.add(plane);

	//Create a helper for the shadow camera (optional)
	const helper = new THREE.CameraHelper(light.shadow.camera);
	scene.add(helper);

    const controls = new FirstPersonControls(camera, renderer.domElement);

    function animate() {
        renderer.render(scene, controls.object);
        controls.update(1);
        requestAnimationFrame(animate);
    }
    animate();

}
