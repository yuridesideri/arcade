import dayjs from "dayjs";
import { identicon } from "minidenticons";

export function returnArrow(): HTMLElement {
	const returnArrow = document.createElement("button");
	returnArrow.className = "return-arrow";
	returnArrow.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
	returnArrow.onclick = (e) => {
		const parentElement = returnArrow.parentElement;
		if (parentElement) {
			parentElement.parentElement?.children[0].classList.remove("hidden");
			parentElement.parentElement?.removeChild(parentElement);
		}
	};
	return returnArrow;
}

export function GameComponent(
	username: string,
	profileImage: string | null,
	score: number,
	gameDurationSeconds: number,
	createdAt: Date
): HTMLElement {
	const GameComponentElement = document.createElement("div");
	GameComponentElement.className = "game-component";
	GameComponentElement.innerHTML = `
            <div class="left-game-info">
                <div class="user-profile-icon">
                ${profileImage ? "" : identicon(username)}
                </div>
                <div class="game-info-header-left">                    
                    <div class="game-info-header-left-top">
                        <h1>${username}</h1>
                    </div>
                    <div class="game-info-header-left-bottom">
                        <h2>${dayjs(createdAt).format('DD/MM/YYYY')}</h2>
                    </div>
                </div>
            </div>
            <div class="game-info-body">
                <div class="game-info-body-left">
                    <h1>Score: ${score}</h1>
                </div>  
                <div class="game-info-body-right">
                    <h1>Time: ${gameDurationSeconds}s</h1>
                </div>
            </div>
`;
	return GameComponentElement;
}
