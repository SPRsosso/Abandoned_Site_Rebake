import { PhoneApp } from "../phoneapp.js";
import { openedPhoneApps } from "../phoneapps.js";
export class PhoneBank extends PhoneApp {
    constructor(window) {
        super(window);
    }
    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                .main {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    padding: 20px;
                }

                img {
                    width: 30;
                    height: 30px;
                }

                #coins {
                    font-size: 20px;
                }
            </style>
            <span slot="name">Bank</span>
            <div class="main">
                <img src="./icons/DigiCoin.png">
                <p id="coins">0</p>
            </div>
        `;
        this.screen.prepend(appComponent);
        const bank = new PhoneBank(appComponent);
        openedPhoneApps.push(bank);
    }
}
