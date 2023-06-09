import "./styles.css";
import { ProfileScreen } from "../ButtonsScreen/ProfileScreen";
import { LeaderboardsScreen } from "../ButtonsScreen/LeaderboardsScreen";
export function GameOptions(startGame: () => Promise<void>): HTMLElement {
	const HTMLElement = document.createElement("div");
	
	const workingDiv = document.createElement("div");
	workingDiv.className = "working-div";
	HTMLElement.appendChild(workingDiv);

	const optionsScreeen = document.createElement("div");
	optionsScreeen.className = "options-screen";
	workingDiv.appendChild(optionsScreeen);

	
	//OPTIONS SCREEN ELEMENTS
	const buttonsContainer = document.createElement("div");
	buttonsContainer.className = "buttons-container";
	optionsScreeen.appendChild(buttonsContainer);

	const logo = document.createElement("div");
	logo.className = "logo";
	optionsScreeen.appendChild(logo);
	const image = document.createElement("img");
	image.src = "./pacman-logo.png";
	image.style.width = "100%";
	logo.appendChild(image);

	const playButton = document.createElement("button");
	playButton.className = "play-button";
	playButton.innerText = "Play";
	playButton.onclick = async (e) => {
		HTMLElement.classList.add("hidden");
		await startGame();
	};
	buttonsContainer.appendChild(playButton);

	const profileButton = document.createElement("button");
	profileButton.className = "profiles-button";
	profileButton.innerText = "Profile";
	profileButton.onclick = (e) => {
		optionsScreeen.classList.add("hidden");
		workingDiv.appendChild(ProfileScreen());
	};
	buttonsContainer.appendChild(profileButton);

	const leaderBoardsButton = document.createElement("button");
	leaderBoardsButton.className = "leaderboards-button";
	leaderBoardsButton.innerText = "Leaderboards";
	leaderBoardsButton.onclick = (e) => {
		optionsScreeen.classList.add("hidden");
		workingDiv.appendChild(LeaderboardsScreen());
	};
	buttonsContainer.appendChild(leaderBoardsButton);


	

	return HTMLElement;
}
