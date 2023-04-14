import axios from "axios";
import { ProfileScreen } from "./ProfileScreen";
import "./buttons-screen.css";

export function LoginScreen(): HTMLElement {
	const LoginScreenElement = document.createElement("div");
	LoginScreenElement.className = "login-screen";
    

    function returnFunction(e?: Event){
        const parentElement = LoginScreenElement.parentElement;
        if (parentElement) {
            parentElement.appendChild(ProfileScreen());
            parentElement.removeChild(LoginScreenElement);
        }
    }

	LoginScreenElement.innerHTML = `
    <div class="login-section">
        <form class="login-form">
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button class="login-button">Log in</button>
        </form>
    </div>
    `;

    const returnArrow = document.createElement("button");
    returnArrow.className = "return-arrow";
    returnArrow.innerHTML = `<ion-icon name="arrow-back-outline"></ion-icon>`;
    returnArrow.onclick = (e?) => {
        const parentElement = LoginScreenElement.parentElement;
        if (parentElement) {
            parentElement.appendChild(ProfileScreen());
            parentElement.removeChild(LoginScreenElement);
        }
    }
    const formElement = LoginScreenElement.querySelector(
		"form"
	) as HTMLFormElement;
	formElement.onsubmit = (e) => {
		e.preventDefault();
		const email = formElement.email.value;
		const password = formElement.password.value;
		
		axios.post(import.meta.env.VITE_API_URL + "/auth/login", {
			password,
			email,
		}).then((res) => {

                localStorage.setItem("userToken", res.data);
                returnFunction();
        }).catch((err) => {
            alert("Something went wrong!");
        }
        );
	};
    LoginScreenElement.appendChild(returnArrow);

	return LoginScreenElement;
}