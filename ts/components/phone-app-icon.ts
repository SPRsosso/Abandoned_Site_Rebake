import { PhoneApp } from "../models/phone/phoneapp.js";
import { phoneApps } from "../models/phone/phoneapps.js";
import { barHeight } from "../variables.js";

export class PhoneAppIcon extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        let iconPath: string = this.getAttribute("icon-path")!;
        let appName: string = this.getAttribute("app-name")!;

        let appShowName = appName;
        switch (appName) {
            case "PhoneTutorial":
                appShowName = "Tutorial";
                break;
            case "PhoneCrack":
                appShowName = "Crack";
                break;
            case "PhoneCalculator":
                appShowName = "Calculator";
                break;
            case "PhoneNotes":
                appShowName = "Notes";
                break;
            case "PhoneBank":
                appShowName = "Bank";
                break;
        }

        this.shadow.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                :host {
                }

                #icon {
                    width: 100%;
                    aspect-ratio: 1;

                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    gap: 10px;
                    padding: 5px;

                    border-radius: 10px;
                    
                    cursor: pointer;
                    transition: .2s;

                    font-size: 12px;
                }

                #icon:hover {
                    background-color: var(--accent-color-faded);
                }

                #icon img {
                    flex-grow: 1;
                }

                #icon p {
                    flex-grow: 1;
                    font-size: 12px;
                    text-align: center;
                    word-wrap: break-word;
                }
            </style>
            <div id="icon">
                <img src="${iconPath}" alt="${appName} icon" draggable="false">
                <p>${appShowName}</p>
            </div>
        `;

        const icon = this.shadow.querySelector<HTMLDivElement>("#icon");
        if (icon) {
            icon.ondblclick = () => {
                phoneApps[appName] ? phoneApps[appName].openApp() : PhoneApp.openApp()
            }
        }
    }
}

customElements.define("phone-app-icon", PhoneAppIcon);