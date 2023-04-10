import "./profile-screen.css";
import { LoginScreen } from "./LoginScreen";
import { SignUpScreen } from "./SignupScreen";
import axios from "axios";

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
			.get(import.meta.env.VITE_API_URL + "/user/me", {
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
                            <img
                            width="36px"
                            height="36px"
                            src="https://www.giantbomb.com/a/uploads/scale_medium/12/129563/2926205-pacman.png" 
                            alt="User image" />
                            <div class="user-info">
                                <h1>${profileInfo.username}</h1>
                            </div>
                        </div>
                        <div class="user-games">

                        </div>
                    </div>
                    <button class="logout-button">Log out</button>
                </div>
                <div class="return-arrow"> <button><ion-icon name="arrow-back-outline"></ion-icon></button> </div>
                `;
				const returnButton = profileSections.querySelector(
					".return-arrow button"
				) as HTMLButtonElement;
				returnButton.onclick = (e) => {
					ProfileScreenElement.parentElement?.children[0].classList.remove(
						"hidden"
					);
					ProfileScreenElement.parentElement?.removeChild(
						ProfileScreenElement
					);
				};
				const logoutButton = profileSections.querySelector(
					".logout-button"
				) as HTMLButtonElement;
				logoutButton.onclick = (e) => {
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
			ProfileScreenElement.parentElement?.appendChild(LoginScreen());
			ProfileScreenElement.parentElement?.removeChild(
				ProfileScreenElement
			);
		};
		const sugnUpButton = authenticationSections.querySelector(
			".signup-button"
		) as HTMLButtonElement;
		sugnUpButton.onclick = (e) => {
			ProfileScreenElement.parentElement?.appendChild(SignUpScreen());
			ProfileScreenElement.parentElement?.removeChild(
				ProfileScreenElement
			);
		};

		ProfileScreenElement.appendChild(authenticationSections);
	}

	return ProfileScreenElement;
}
