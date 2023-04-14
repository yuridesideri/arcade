import "./buttons-screen.css";
import axios from "axios";
import { GameComponent } from "../Components";

export function LeaderboardsScreen(): HTMLElement {
	const LeaderboardsScreenElement = document.createElement("div");
	LeaderboardsScreenElement.className = "leaderboards-screen";
	let loading = true;

	function returnScreen(e?: Event) {
		e?.preventDefault();
		LeaderboardsScreenElement.parentElement?.children[0].classList.remove(
			"hidden"
		);
		LeaderboardsScreenElement.parentElement?.removeChild(
			LeaderboardsScreenElement
		);
	}

	axios
		.get(import.meta.env.VITE_API_URL + "/games/leaderboards")
		.then(({ data }) => {
			const leaderboards = data as {
				id: number;
				createdAt: Date;
				score: number;
				gameDurationSeconds: number;
				player: {
					id: number;
					profileImageId: string;
					username: string;
				};
			}[];
			const leaderboardsSection = document.createElement("div");
			leaderboardsSection.className = "leaderboards-section";
			leaderboardsSection.innerHTML = `
			<div class="leaderboards-page">
				<div class="leaderboards-header">
					<h1>Leaderboards:</h1>
				</div>
				<div class="leaderboards-list">
				</div>
			</div>
			<div class="return-arrow"> <button><ion-icon name="arrow-back-outline"></ion-icon></button> </div>
			`;
			const returnButton = leaderboardsSection.querySelector(
				".return-arrow button"
			) as HTMLButtonElement;
			returnButton.onclick = returnScreen;
			const leaderboardsList = leaderboardsSection.querySelector(
				".leaderboards-list"
			) as HTMLDivElement;
			leaderboards.forEach((leaderboard) => {
				const { createdAt, score, gameDurationSeconds, player } =
					leaderboard;
				const leaderboardComponent = GameComponent(
					player.username,
					player.profileImageId,
					score,
					gameDurationSeconds,
					createdAt
				);
				leaderboardsList.appendChild(leaderboardComponent);
			});
			LeaderboardsScreenElement.appendChild(leaderboardsSection);
		})
		.catch((err) => {
			console.log(err);
			returnScreen();
		}).finally(() => {
			loading = false;
		})

	return LeaderboardsScreenElement;
}
