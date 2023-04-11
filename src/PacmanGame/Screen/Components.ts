import dayjs from "dayjs";

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
	profileImage: string,
	score: number,
	gameDurationSeconds: number,
	createdAt: Date
): HTMLElement {
	const GameComponentElement = document.createElement("div");
	GameComponentElement.className = "game-component";
	GameComponentElement.innerHTML = `
            <div class="left-game-info">
                <div class="user-profile-icon">
                    <img src="data:image/jpeg;base64,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" alt="User image" />
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
