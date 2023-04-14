import { Tween } from "@tweenjs/tween.js";

export function animateMachineControl(scene: THREE.Scene) {
	const arcadeControl = scene.getObjectByName("pac_man_machine")?.children[1];
	let lastDirection: string | null;
	let rotationModule: number = 0.4;

	function animateControl(e: any) {
		const { dynamicInfo } = e;
		let moveDirection: { x: number } | { y: number } = { x: 0, y: 0 };

		switch (dynamicInfo.direction) {
			case "left":
				moveDirection = { y: -rotationModule };
				break;
			case "right":
				moveDirection = { y: rotationModule };
				break;
			case "up":
				moveDirection = { x: -rotationModule };
				break;
			case "down":
				moveDirection = { x: rotationModule };
				break;
			default:
				break;
		}
        const resetRotations = new Tween(arcadeControl!.rotation)
				.to({ x: 0, y: 0 }, 30)
		if (
			["keydown", "touchend"].includes(dynamicInfo.type!) 
			
		) {
            resetRotations.start();
			const rotateDirection = new Tween(arcadeControl!.rotation)
				.to(moveDirection, 100)
				.start();
			lastDirection = dynamicInfo.direction;
		}
		if (
			["keyup", "touchstart"].includes(
				dynamicInfo.type! 
			) && lastDirection === dynamicInfo.direction
		) {
			resetRotations.start()
		}
	}

	addEventListener("movePacmanEvent", animateControl);
}
