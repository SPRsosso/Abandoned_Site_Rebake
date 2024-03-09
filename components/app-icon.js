class AppIcon extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        let iconPath = this.getAttribute("icon-path");
        let appName = this.getAttribute("app-name");
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
            </style>
            <div id="icon" ondblclick="apps['${appName}'] ? apps['${appName}'].openApp() : App.openApp()">
                <div id="inside-icon">
                    <img src="${iconPath}" alt="${appName} icon" draggable="false">
                </div>
            </div>
        `;

        this.shadow.host.addEventListener("mouseover", () => {
            if (appName == "CMD")
                appName = "Console";
            
            App.showName(this.shadow.host, appName);
        });
    }

}

customElements.define("app-icon", AppIcon);