import { shared } from "../../../shared.js";
import { usb } from "../../usb.js";
import { Wifi } from "../../wifi.js";
import { PhoneApp } from "../phoneapp.js";
import { openedPhoneApps } from "../phoneapps.js";
export class PhoneCrack extends PhoneApp {
    constructor(window) {
        super(window);
    }
    static openApp() {
        const appComponent = document.createElement("phone-app-component");
        appComponent.innerHTML = /*html*/ `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #crack {
                    padding: 10px;

                    text-align: center;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
            <span slot="name">Crack</span>
            <div id="crack">
                
            </div>
        `;
        this.crackUi(appComponent);
        this.screen.prepend(appComponent);
        openedPhoneApps.push(new PhoneCrack(appComponent));
    }
    static wait(waitTime) {
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }
    static crackUi(appComponent) {
        const crack = appComponent.querySelector("#crack");
        if (!crack)
            return;
        crack.innerHTML = "";
        if (usb.inserted) {
            const button = document.createElement("button");
            button.innerHTML = "Crack PC";
            button.addEventListener("click", async () => {
                let tmpString = "";
                let string = "";
                for (let i = 0; i < shared.activeApartment.pc.password.length; i++) {
                    for (let j = 0; j < 25; j++) {
                        const char = Wifi.possibleChars[Math.floor(Math.random() * Wifi.possibleChars.length)];
                        string = tmpString;
                        string += char;
                        crack.innerHTML = "---Password---<br>" + string;
                        await this.wait(50);
                    }
                    tmpString += shared.activeApartment.pc.password[i];
                    crack.innerHTML = "---Password---<br>" + tmpString;
                }
            });
            crack.append(button);
        }
        else {
            crack.innerHTML = `
                <p>No Pendrive connected</p>
            `;
        }
    }
}
