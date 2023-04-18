import "./buttons-screen.css";
import { LoginScreen } from "./LoginScreen";
import { SignUpScreen } from "./SignupScreen";
import axios from "axios";
import { GameComponent } from "../Components";
import { identicon } from "minidenticons";

export function ProfileScreen(): HTMLElement {
	const ProfileScreenElement = document.createElement("div");
	ProfileScreenElement.className = "profile-screen";

	function reloadComponent() {
		const parentElement = ProfileScreenElement.parentElement;
		if (parentElement) {
			parentElement.removeChild(ProfileScreenElement);
			parentElement.appendChild(ProfileScreen());
		}
	}

	const userToken = localStorage.getItem("userToken");
	if (userToken && userToken !== "undefined") {
		axios
			.get(import.meta.env.VITE_API_URL + "/players/me", {
				headers: { authorization: "Bearer " + userToken },
			})
			.then(({ data }) => {
				const profileInfo = data as {
					id: number;
					createdAt: Date;
					profileImageId: string;
					email: string;
					username: string;
					games: [];
				};
				const profileSections = document.createElement("div");
				profileSections.className = "profile-section";
				profileSections.innerHTML = `
                <div class="profile-section">
                    <div class="user-header">
                        <div class="user-image">
							<div class="image-box"> 
								${profileInfo.profileImageId ? "" : identicon(profileInfo.username)}
							</div>
                            <div class="user-info">
                                <h1>${profileInfo.username}</h1>
                            </div>
                        </div>
					</div>
					<div class="games-title">  
						<h2>Games:</h2>	
					</div>
					<div class="user-games">
					</div>
                    <button class="logout-button">Log out</button>
                </div>
                <div class="return-arrow"> <button><ion-icon name="arrow-back-outline"></ion-icon></button> </div>
                `;
				const returnButton = profileSections.querySelector(
					".return-arrow button"
				) as HTMLButtonElement;
				returnButton.onclick = (e) => {
					e.preventDefault();
					ProfileScreenElement.parentElement?.children[0].classList.remove(
						"hidden"
					);
					ProfileScreenElement.parentElement?.removeChild(
						ProfileScreenElement
					);
				};
				const userGames = profileSections.querySelector(
					".user-games"
				) as HTMLDivElement;
				profileInfo.games.forEach((game: any) => {
					const { score, gameDurationSeconds, createdAt } = game;
					const username = profileInfo.username;
					const profileImage = profileInfo.profileImageId
					userGames.appendChild(GameComponent(username, profileImage, score, gameDurationSeconds, createdAt))
				});
				const logoutButton = profileSections.querySelector(
					".logout-button"
				) as HTMLButtonElement;
				logoutButton.onclick = (e) => {
					e.preventDefault();
					localStorage.removeItem("userToken");
					reloadComponent();
				};
				ProfileScreenElement.appendChild(profileSections);
			})
			.catch((err) => {
				console.log(err);
				localStorage.removeItem("userToken");
				reloadComponent();
			});
	} else {
		const authenticationSections = document.createElement("div");
		authenticationSections.className = "login-section";
		authenticationSections.innerHTML = `
        <div class="login-alert">
            <h1>Login to see stats!</h1>
        </div>
        <div class="profile-buttons">
            <button class="login-button">Log in</button>
            <button class="signup-button">Sign up</button>
        </div>
        <div class="return-arrow"> <button><ion-icon name="arrow-back-outline"></ion-icon></button> </div>
        `;
		const returnButton = authenticationSections.querySelector(
			".return-arrow button"
		) as HTMLButtonElement;
		returnButton.onclick = (e) => {
			e.preventDefault();
			ProfileScreenElement.parentElement?.children[0].classList.remove(
				"hidden"
			);
			ProfileScreenElement.parentElement?.removeChild(
				ProfileScreenElement
			);
		};
		const loginButton = authenticationSections.querySelector(
			".login-button"
		) as HTMLButtonElement;
		loginButton.onclick = (e) => {
			e.preventDefault();
			ProfileScreenElement.parentElement?.appendChild(LoginScreen());
			ProfileScreenElement.parentElement?.removeChild(
				ProfileScreenElement
			);
		};
		const sugnUpButton = authenticationSections.querySelector(
			".signup-button"
		) as HTMLButtonElement;
		sugnUpButton.onclick = (e) => {
			e.preventDefault();
			ProfileScreenElement.parentElement?.appendChild(SignUpScreen());
			ProfileScreenElement.parentElement?.removeChild(
				ProfileScreenElement
			);
		};

		ProfileScreenElement.appendChild(authenticationSections);
	}

	return ProfileScreenElement;
}
