import { ScreenTypes } from "../../types/pacmanGame";
import "./styles.css";
export function GameOptions(): HTMLElement {
	const HTMLElement = document.createElement("div");
	HTMLElement.className = "gameOptionsBody";

	const workingDiv = document.createElement("div");
	workingDiv.className = "working-div";
	HTMLElement.appendChild(workingDiv);

	const optionsScreeen = document.createElement("div");
	optionsScreeen.className = "options-screen";
	workingDiv.appendChild(optionsScreeen);

	const buttonsContainer = document.createElement("div");
	buttonsContainer.className = "buttons-container";
	optionsScreeen.appendChild(buttonsContainer);

	//OPTIONS SCREEN ELEMENTS
	const playButton = document.createElement("button");
	playButton.className = "play-button";
	playButton.innerText = "Play";
	buttonsContainer.appendChild(playButton);

	const profileButton = document.createElement("button");
	profileButton.className = "profiles-button";
	profileButton.innerText = "Profile";
	buttonsContainer.appendChild(profileButton);

	const leaderBoardsButton = document.createElement("button");
	leaderBoardsButton.className = "leaderboards-button";
	leaderBoardsButton.innerText = "Leaderboards";
	buttonsContainer.appendChild(leaderBoardsButton);

	

	return HTMLElement;
}
