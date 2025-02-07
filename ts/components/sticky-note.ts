export class StickyNote extends HTMLElement {
    shadow: ShadowRoot;
    width: number;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.width = 200;

        this.shadow.innerHTML =  /*html*/`
            <link rel="stylesheet" href="./styles/style.css">
            <style>
                #sticky-note {
                    width: ${this.width}px;
                    aspect-ratio: 1;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background-color: yellow;
                    font-weight: bolder;
                    font-size: 1.2rem;

                    transform: rotateZ(20deg);
                }

                button {
                    width: 20px;
                    aspect-ratio: 1;

                    border: none;

                    cursor: pointer;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }

                #red {
                    background-color: red;
                }
            </style>
            <div id="sticky-note">
                <button id="red"></button>
                <slot></slot>
            </div>
        `;
    }

    connectedCallback() {
        const redBtn = this.shadow.querySelector("#red") as HTMLElement;
        redBtn.addEventListener("click", () => {
            if (confirm("Do you really want to remove sticky note? (It can't be put back on)"))
                this.shadow.host.remove();
        });

        const stickyInterval = setInterval(() => {
            if (!this.shadow.host) {
                clearInterval(stickyInterval);
                return; 
            }
            const main = document.querySelector("main") as HTMLElement;
            const shadowHost = this.shadow.host as StickyNote;

            shadowHost.style.left = main.offsetLeft + 20 - this.width / 2 + "px";
            shadowHost.style.top = ( main.offsetTop + main.offsetHeight - this.width / 2 - 20 ) + "px";
            shadowHost.style.display = "block";
        }, 0);
    }
}

customElements.define("sticky-note", StickyNote);