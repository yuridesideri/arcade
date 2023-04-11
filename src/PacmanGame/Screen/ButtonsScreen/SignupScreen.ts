import { ProfileScreen } from "./ProfileScreen";
import "./buttons-screen.css";
import axios from "axios";

export function SignUpScreen(): HTMLElement {
	const SignUpScreenElement = document.createElement("div");
	SignUpScreenElement.className = "login-screen";

    function returnFunction(e?: Event){
        const parentElement = SignUpScreenElement.parentElement;
        if (parentElement) {
            parentElement.appendChild(ProfileScreen());
            parentElement.removeChild(SignUpScreenElement);
        }
    }

	SignUpScreenElement.innerHTML = `
    <div class="login-section">
        <form class="login-form">
            <input type="email" name="email" placeholder="Email" />
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <input type="password" name="confirm-password" placeholder="Confirm Password" />
            <button class="login-button">Sign Up</button>
        </form>
    </div>
    `;

	const returnArrow = document.createElement("button");
	returnArrow.className = "return-arrow";
	returnArrow.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
	returnArrow.onclick = returnFunction;

	const formElement = SignUpScreenElement.querySelector(
		"form"
	) as HTMLFormElement;
	formElement.onsubmit = (e) => {
		e.preventDefault();
		const email = formElement.email.value;
		const username = formElement.username.value;
		const password = formElement.password.value;
		const confirmPassword = formElement["confirm-password"].value;
		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}
		axios.post(import.meta.env.VITE_API_URL + "/auth/register", {
			username,
			password,
			email,
		}).then((res) => {
                returnFunction();
        }).catch((err) => {
            alert("Something went wrong!");
        }
        );
	};
	SignUpScreenElement.appendChild(returnArrow);

	return SignUpScreenElement;
}
