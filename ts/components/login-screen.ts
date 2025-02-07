import { App } from "../models/app.js";
import { shared } from "../shared.js";

export class LoginScreen extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    
        this.shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #login-screen {
                    width: 100%;
                    height: 100%;

                    background-color: var(--bg-color);

                    position: absolute;
                    top: 0;
                    left: 0;

                    z-index: 2;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }

                #login-screen img {
                    width: 64px;
                    height: 64px;
                }

                #login-screen input {
                    background-color: var(--bg-color);
                    border: 1px solid var(--accent-color);
                    color: var(--accent-color);

                    padding: 5px;
                }

                #login-screen input:focus {
                    outline: none;
                }

                #login-screen button {
                    background-color: var(--bg-color);
                    color: var(--accent-color);
                    border: 1px solid var(--accent-color);
                    padding: 5px;

                    cursor: pointer;
                }

                #login-screen button:hover {
                    background-color: var(--accent-color-faded);
                }

                #login-screen #error {
                    color: red;
                    font-style: italic;
                }
            </style>
            <div id="login-screen">
                <img src="./icons/UserImage.png" alt="user image">
                <p id="name">${shared.activeApartment.pc.user.fullName}</p>
                <div class="splitter">
                    <input type="password" id="password" placeholder="Password...">
                    <button id="submit">></button>
                </div>
                <p id="error"></p>
            </div>
        `;

        this.shadow.querySelector("#submit")?.addEventListener("click", () => {
            this.submitPassword();
        });
        
        this.shadow.querySelector("#password")?.addEventListener("keydown", ( event: KeyboardEventInit ) => {
            if (event.keyCode != 13)
                return;

            this.submitPassword();
        })

        if (shared.activeApartment.pc.password === "") {
            this.submitPassword();
        }
    }

    submitPassword() {
        const password = this.shadow.querySelector("#password") as HTMLInputElement;
        const error = this.shadow.querySelector("#error") as HTMLElement;

        if (shared.activeApartment.pc.password === password.value) {
            this.openComputer();
        } else {
            error.innerHTML = "Wrong password!";
        }

        password.value = "";
    }

    openComputer() {
        shared.activeApartment.pc.loggedIn = true;
        App.screen.innerHTML = `
            <main-bar slot="bar">
                
            </main-bar>
        `;
        App.getAppIcons();

        if(isInteracted) {
            const audio = new Audio("./sounds/Login.mp3");
            audio.volume = 0.3;
            audio.play();
        }
        
        this.shadow.host.remove();
        
        isGameStarted = true;
    }
}

customElements.define("login-screen", LoginScreen);