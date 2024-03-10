class StickyNote extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.width = 200;
        this.shadow.innerHTML =  `
            <style>
                ${styles}

                #sticky-note {
                    width: ${this.width}px;
                    aspect-ratio: 1;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background-color: yellow;
                    color: black;

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
        const redBtn = this.shadow.querySelector("#red");
        redBtn.addEventListener("click", () => {
            this.shadow.host.remove();
        });

        const stickyInterval = setInterval(() => {
            if (!this.shadow.host) {
                clearInterval(stickyInterval);
                return; 
            }
            const main = document.querySelector("main");
            this.shadow.host.style.left = main.offsetLeft + 20 - this.width / 2 + "px";
            this.shadow.host.style.top = ( main.offsetTop + main.offsetHeight - this.width / 2 - 20 ) + "px";
            this.shadow.host.style.display = "block";
        }, 0);
    }
}

customElements.define("sticky-note", StickyNote);