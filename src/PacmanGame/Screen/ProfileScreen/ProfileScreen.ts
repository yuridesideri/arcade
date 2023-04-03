import "./profile-screen.css";

export function ProfileScreen(returnElement:HTMLElement): HTMLElement {
	const ProfileScreenElement = document.createElement("div");
	ProfileScreenElement.className = "profile-screen";

    function reloadComponent() {
        const parentElement = ProfileScreenElement.parentElement;
        if (parentElement) {
            parentElement.removeChild(ProfileScreenElement);
            parentElement.appendChild(ProfileScreen(returnElement));
        }
    }

	const userToken = localStorage.getItem("userToken");
	if (userToken) {
	} else {
		const loginSection = document.createElement("div");
		loginSection.className = "login-section";
		loginSection.innerHTML = `
        <div class="login-alert">
            <h1>Login to see stats!</h1>
        </div>
        <div class="profile-buttons">
            <button>Log in</button>
            <button>Sign up</button>
        </div>
        <div class="return"> <button><ion-icon name="arrow-back-outline"></ion-icon></button> </div>
        `;
        const returnButton = loginSection.querySelector(".return button") as HTMLButtonElement;
        returnButton.onclick = (e) => {
            ProfileScreenElement.classList.add("hidden");
            returnElement.classList.remove("hidden");
        }
		ProfileScreenElement.appendChild(loginSection);
	}

	return ProfileScreenElement;
}
