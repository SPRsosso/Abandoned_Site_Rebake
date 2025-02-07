import { App } from "../models/app.js";
import { barHeight } from "../variables.js";
import { AppComponent } from "./app-component.js";

export class AppIcon extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        let iconPath = this.getAttribute("icon-path");
        let appName = this.getAttribute("app-name");
        this.shadow.innerHTML = `
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #icon {
                    width: ${barHeight - 10}px;
                    aspect-ratio: 1;

                    display: grid;
                    place-items: center;
                    text-align: center;

                    border-radius: 10px;
                    
                    cursor: pointer;
                    transition: .2s;

                    font-size: 12px;
                }

                #icon:hover {
                    background-color: var(--accent-color-faded);
                }

                #icon img {
                    width: 90%;
                    height: 90%;
                }

                #inside-icon {
                    width: ${barHeight - 10}px;
                    padding: 5px;
                    overflow-wrap: break-word;
                }
            </style>
            <div id="icon" ondblclick="apps['${appName}'] ? apps['${appName}'].openApp() : App.openApp()">
                <div id="inside-icon">
                    <img src="${iconPath}" alt="${appName} icon" draggable="false">
                </div>
            </div>
        `;

        this.shadow.host.addEventListener("mouseover", () => {
            switch (appName) {
                case "CMD":
                    appName = "Console";
                    break;
                case "HashMap":
                    appName = "# Map";
                    break;
                case "HomeDefence":
                    appName = "Home Defence";
                    break;
                case "FileExplorer":
                    appName = "File Explorer";
                    break;
            }
            
            App.showName(this.shadow.host as AppComponent, appName as string);
        });
    }
}

customElements.define("app-icon", AppIcon);