class PhoneAppIcon extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        let iconPath = this.getAttribute("icon-path");
        let appName = this.getAttribute("app-name");

        let appShowName = appName;
        switch (appName) {
            case "PhoneTutorial":
                appShowName = "Tutorial";
                break;
            case "PhoneCrack":
                appShowName = "Crack";
                break;
        }

        this.shadow.innerHTML = `
            <style>
                ${styles}

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

                #icon #name {
                    font-size: 12px;
                }
            </style>
            <div id="icon" ondblclick="phoneApps['${appName}'] ? phoneApps['${appName}'].openApp() : PhoneApp.openApp()">
                <div id="inside-icon">
                    <img src="${iconPath}" alt="${appName} icon" draggable="false">
                    <p id="name">${appShowName}</p>
                </div>
            </div>
        `;
    }
}

customElements.define("phone-app-icon", PhoneAppIcon);