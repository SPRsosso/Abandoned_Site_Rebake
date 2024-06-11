class BiosComponent extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        

        this.shadowRoot.innerHTML = /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <link rel="stylesheet" href="./components/bios-component.css">

            <div id="bios">
                <p class="choose">Choose Operating System (OS)</p>
                <div class="choose-options">

                </div>
            </div>
        `;
        
        const chooseOptions = this.shadowRoot.querySelector(".choose-options");
        const chooseEl = this.shadowRoot.querySelector(".choose");
        Object.keys(OS).forEach(system => {
            const button = document.createElement("button");
            button.innerHTML = `
                ${system}
                <img class="small-system-icon" src="./icons/${system}.png">
            `;

            button.addEventListener("click", () => {
                chooseEl.innerHTML = `Choose ${system} Version`;
                chooseOptions.innerHTML = "";
                Object.keys(OS[system]).forEach(version => {
                    const versionBtn = document.createElement("button");
                    versionBtn.innerHTML = version;

                    versionBtn.addEventListener("click", () => {
                        chooseEl.innerHTML = "Downloading...";
                        chooseOptions.innerHTML = "<div class='downloading-bar'><div class='downloading-bar-inside'></div></div>";
                        
                        PC.downloadOS(system, version);
                    });

                    chooseOptions.append(versionBtn);
                });
            });

            chooseOptions.append(button);
        });
    }
}

customElements.define("bios-component", BiosComponent);