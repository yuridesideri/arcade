import "./styles.css";
export function GameOptions(): HTMLElement {
	const HTMLElement = document.createElement("div");
	HTMLElement.className = "gameOptionsBody";

	const workingDiv = document.createElement("div");
	workingDiv.className = "working-div";
	HTMLElement.appendChild(workingDiv);

	const playButton = document.createElement("button");
	playButton.className = "play-button";
	playButton.innerText = "Play";
	workingDiv.appendChild(playButton);

	const profileButton = document.createElement("button");
	profileButton.className = "profiles-button";
	profileButton.innerText = "Profile";
	workingDiv.appendChild(profileButton);

	const leaderBoardsButton = document.createElement("button");
	leaderBoardsButton.className = "leaderboards-button";
	leaderBoardsButton.innerText = "Leaderboards";
	workingDiv.appendChild(leaderBoardsButton);

	return HTMLElement;
}
